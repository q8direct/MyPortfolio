import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase/client';
import { Exchange } from '../types/exchange';
import { useAuth } from '../contexts/AuthContext';
import { handleSupabaseError } from '../lib/supabase/errors';

export function useExchanges() {
  const { user } = useAuth();
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExchanges = useCallback(async () => {
    if (!user) return;

    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('exchanges')
        .select('*')
        .eq('user_id', user.id)
        .execute();

      if (fetchError) throw fetchError;

      setExchanges(data?.map(exchange => ({
        id: exchange.exchange_id,
        name: exchange.name,
        connected: true,
        connectedAt: exchange.created_at
      })) || []);
    } catch (err) {
      const supabaseError = handleSupabaseError(err);
      console.error('Error fetching exchanges:', supabaseError);
      setError(supabaseError.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const connectExchange = async (exchange: Exchange, apiKey: string, apiSecret: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error: insertError } = await supabase
        .from('exchanges')
        .insert({
          user_id: user.id,
          exchange_id: exchange.id,
          name: exchange.name,
          api_key: apiKey,
          api_secret: apiSecret
        })
        .execute();

      if (insertError) throw insertError;

      await fetchExchanges();
      return true;
    } catch (err) {
      const supabaseError = handleSupabaseError(err);
      console.error('Error connecting exchange:', supabaseError);
      throw supabaseError;
    }
  };

  const disconnectExchange = async (exchangeId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error: deleteError } = await supabase
        .from('exchanges')
        .delete()
        .eq('user_id', user.id)
        .eq('exchange_id', exchangeId)
        .execute();

      if (deleteError) throw deleteError;

      await fetchExchanges();
      return true;
    } catch (err) {
      const supabaseError = handleSupabaseError(err);
      console.error('Error disconnecting exchange:', supabaseError);
      throw supabaseError;
    }
  };

  useEffect(() => {
    if (user) {
      fetchExchanges();
    }
  }, [user, fetchExchanges]);

  return {
    exchanges,
    loading,
    error,
    connectExchange,
    disconnectExchange
  };
}