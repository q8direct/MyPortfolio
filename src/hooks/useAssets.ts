import { useState, useEffect } from 'react';
import { supabase, supabaseQuery } from '../lib/supabase/client';
import { Asset } from '../types/asset';
import { useAuth } from '../contexts/AuthContext';

export function useAssets(portfolioId: string | null) {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setError(null);
      const query = supabase
        .from('assets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (portfolioId) {
        query.eq('portfolio_id', portfolioId);
      }

      const { data, error: fetchError } = await supabaseQuery(() => query);

      if (fetchError) throw fetchError;
      setAssets(data || []);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError('Unable to load assets. Please check your connection and try again.');
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    if (user) {
      fetchAssets().then(() => {
        if (!mounted) return;
      });
    }

    return () => {
      mounted = false;
    };
  }, [user, portfolioId]);

  return {
    assets,
    loading,
    error,
    refetch: fetchAssets
  };
}