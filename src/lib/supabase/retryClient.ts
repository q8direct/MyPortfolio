import { createClient } from '@supabase/supabase-js';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function withRetry<T>(operation: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return withRetry(operation, retries - 1);
    }
    throw error;
  }
}

export const createRetryClient = (url: string, key: string) => {
  const client = createClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });

  return {
    ...client,
    from: (table: string) => ({
      ...client.from(table),
      select: async (query?: string) => 
        withRetry(() => client.from(table).select(query)),
      insert: async (values: any) => 
        withRetry(() => client.from(table).insert(values)),
      update: async (values: any) => 
        withRetry(() => client.from(table).update(values)),
      delete: async () => 
        withRetry(() => client.from(table).delete()),
    })
  };
};