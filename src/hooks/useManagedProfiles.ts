import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ManagedProfile {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

export function useManagedProfiles() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ManagedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchManagedProfiles = async () => {
    if (!user) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('managed_profiles')
        .select(`
          profile_id,
          profiles:profile_id (
            id,
            email,
            name,
            created_at
          )
        `)
        .eq('manager_id', user.id);

      if (fetchError) throw fetchError;

      const managedProfiles = data
        ?.map(item => item.profiles)
        .filter(Boolean) as ManagedProfile[];

      setProfiles(managedProfiles || []);
    } catch (err) {
      console.error('Error fetching managed profiles:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const addManagedProfile = async (profileId: string) => {
    if (!user) return;

    try {
      const { error: insertError } = await supabase
        .from('managed_profiles')
        .insert({
          manager_id: user.id,
          profile_id: profileId
        });

      if (insertError) throw insertError;
      await fetchManagedProfiles();
    } catch (err) {
      console.error('Error adding managed profile:', err);
      throw err;
    }
  };

  const removeManagedProfile = async (profileId: string) => {
    if (!user) return;

    try {
      const { error: deleteError } = await supabase
        .from('managed_profiles')
        .delete()
        .eq('manager_id', user.id)
        .eq('profile_id', profileId);

      if (deleteError) throw deleteError;
      await fetchManagedProfiles();
    } catch (err) {
      console.error('Error removing managed profile:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchManagedProfiles();
    }
  }, [user]);

  return {
    profiles,
    loading,
    error,
    addManagedProfile,
    removeManagedProfile,
    refresh: fetchManagedProfiles
  };
}