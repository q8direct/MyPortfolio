import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types/user';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .single();

        if (!profile?.is_admin) {
          throw new Error('Unauthorized');
        }

        const { data, error: fetchError } = await supabase
          .from('auth.users')
          .select('*');

        if (fetchError) throw fetchError;
        setUsers(data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
}