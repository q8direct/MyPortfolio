import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Asset } from '../types/asset';
import { useAuth } from '../contexts/AuthContext';

export function useAllAssets() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = async () => {
    if (!user) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('assets')
        .select(`
          *,
          portfolios:portfolio_id (
            name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setAssets(data || []);
    } catch (err) {
      console.error('Error fetching all assets:', err);
      setError(err instanceof Error ? err.message : 'Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAssets();
    }
  }, [user]);

  return {
    assets,
    loading,
    error,
    refresh: fetchAssets
  };
}