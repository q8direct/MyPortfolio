import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Asset } from '../types/portfolio';
import { useAuth } from '../contexts/AuthContext';

export function usePortfolioAssets(portfolioId: string | null) {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = async () => {
    if (!user || !portfolioId) {
      setAssets([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('assets')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setAssets(data || []);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError(err instanceof Error ? err.message : 'Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [user, portfolioId]);

  return {
    assets,
    loading,
    error,
    refresh: fetchAssets
  };
}