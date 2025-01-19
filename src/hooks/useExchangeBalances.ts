import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { fetchBinanceBalance } from '../services/exchanges/binance';

export function useExchangeBalances() {
  const { user } = useAuth();
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = useCallback(async () => {
    if (!user) return;

    try {
      setError(null);
      setLoading(true);
      
      const { data: exchanges, error: fetchError } = await supabase
        .from('exchanges')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      if (!exchanges || exchanges.length === 0) {
        setTotalBalance(0);
        return;
      }

      const balances = await Promise.all(
        exchanges.map(async exchange => {
          try {
            if (exchange.exchange_id === 'binance') {
              return await fetchBinanceBalance(exchange.api_key, exchange.api_secret);
            }
            return 0;
          } catch (error) {
            console.error(`Error fetching balance for ${exchange.name}:`, error);
            setError(`Failed to fetch balance from ${exchange.name}`);
            return 0;
          }
        })
      );

      const total = balances.reduce((sum, balance) => sum + balance, 0);
      setTotalBalance(total);
    } catch (err) {
      console.error('Error fetching balances:', err);
      setError(err instanceof Error ? err.message : 'Failed to load balances');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return { 
    totalBalance, 
    loading, 
    error,
    refresh: fetchBalances
  };
}