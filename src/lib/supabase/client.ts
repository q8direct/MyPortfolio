import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config';
import { handleSupabaseError } from './errors';
import { withRetry } from './retry';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export async function supabaseQuery<T>(
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await withRetry(operation);
  } catch (error) {
    throw handleSupabaseError(error);
  }
}