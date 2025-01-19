import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useProfileManagement() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProfile = async (email: string, name: string) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(-8),
        options: {
          data: { name }
        }
      });

      if (signUpError) throw signUpError;
      
      return true;
    } catch (err) {
      console.error('Error creating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to create profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProfile,
    loading,
    error
  };
}