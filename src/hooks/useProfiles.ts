import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useProfiles() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    if (!user) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, email, name, is_admin')
        .order('email');

      if (fetchError) throw fetchError;
      setProfiles(data || []);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfiles();
    }
  }, [user]);

  return {
    profiles,
    loading,
    error,
    refresh: fetchProfiles
  };
}