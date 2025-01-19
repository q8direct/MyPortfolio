import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface GridBot {
  id: string;
  exchange_id: string;
  coin_pair: string;
  type: 'long' | 'short' | 'neutral';
  grid_count: number;
  initial_amount: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export function useGridBots(exchangeId: string | null = null) {
  const { user } = useAuth();
  const [bots, setBots] = useState<GridBot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBots = async () => {
    if (!user) return;

    try {
      setError(null);
      let query = supabase
        .from('grid_bots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Only filter by exchange_id if one is selected
      if (exchangeId) {
        query = query.eq('exchange_id', exchangeId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setBots(data || []);
    } catch (err) {
      console.error('Error fetching grid bots:', err);
      setError('Failed to load grid bots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBots();
    }
  }, [user, exchangeId]);

  return {
    bots,
    loading,
    error,
    refresh: fetchBots
  };
}