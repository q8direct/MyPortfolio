import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Portfolio } from '../types/portfolio';
import { useAuth } from '../contexts/AuthContext';

export function usePortfolios(exchangeId: string | null = null) {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolios = async () => {
    if (!user) {
      setPortfolios([]);
      setLoading(false);
      return;
    }
    
    try {
      setError(null);
      let query = supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (exchangeId) {
        query = query.eq('exchange_id', exchangeId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setPortfolios(data || []);
    } catch (err) {
      console.error('Error fetching portfolios:', err);
      setError('Unable to load portfolios. Please check your connection and try again.');
      setPortfolios([]);
    } finally {
      setLoading(false);
    }
  };

  const createPortfolio = async (portfolio: Partial<Portfolio>) => {
    if (!user) throw new Error('User must be logged in to create a portfolio');
    if (!portfolio.name?.trim()) throw new Error('Portfolio name is required');

    try {
      const { data, error: insertError } = await supabase
        .from('portfolios')
        .insert({
          name: portfolio.name.trim(),
          description: portfolio.description?.trim(),
          user_id: user.id,
          exchange_id: exchangeId,
          is_default: portfolios.length === 0
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setPortfolios(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating portfolio:', error);
      throw error;
    }
  };

  const renamePortfolio = async (id: string, newName: string) => {
    if (!user) throw new Error('User must be logged in to rename a portfolio');
    if (!newName.trim()) throw new Error('Portfolio name is required');

    try {
      const { data, error: updateError } = await supabase
        .from('portfolios')
        .update({ name: newName.trim() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setPortfolios(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (error) {
      console.error('Error renaming portfolio:', error);
      throw error;
    }
  };

  const deletePortfolio = async (id: string) => {
    if (!user) throw new Error('User must be logged in to delete a portfolio');

    try {
      const { error: deleteError } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setPortfolios(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      throw error;
    }
  };

  useEffect(() => {
    let mounted = true;

    if (user) {
      fetchPortfolios().then(() => {
        if (!mounted) return;
      });
    }

    return () => { mounted = false; };
  }, [user, exchangeId]);

  return {
    portfolios,
    loading,
    error,
    createPortfolio,
    renamePortfolio,
    deletePortfolio,
    refresh: fetchPortfolios
  };
}