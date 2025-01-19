import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { getAuthErrorMessage } from '../lib/auth';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      return { success: true, data };
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async ({ email, password }: { email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      return { success: true, data };
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;

      window.location.href = '/login';
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    loading,
    error,
  };
}