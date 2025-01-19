import { AuthError } from '@supabase/supabase-js';
import { supabase } from './supabase';

export async function checkUserExists(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      }
    });
    
    // If we get an error about invalid credentials, the user exists
    return !error || error.message.includes('Invalid credentials');
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
}

export function getAuthErrorMessage(error: AuthError | Error | unknown): string {
  if (!error) return 'An unknown error occurred';

  const message = error instanceof Error ? error.message : 'An unknown error occurred';

  if (message.includes('Invalid login credentials')) {
    return 'Incorrect password';
  }

  if (message.includes('Email not confirmed')) {
    return 'Please verify your email address';
  }

  if (message.includes('not found')) {
    return 'Email not registered. Please sign up first.';
  }

  return message;
}