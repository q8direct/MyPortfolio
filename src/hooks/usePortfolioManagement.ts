import { useState } from 'react';
import { supabase } from '../lib/supabase/client';
import { Portfolio } from '../types/portfolio';

interface UsePortfolioManagementProps {
  onSuccess?: () => void;
}

export function usePortfolioManagement({ onSuccess }: UsePortfolioManagementProps = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renamePortfolio = async (portfolioId: string, newName: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('portfolios')
        .update({ name: newName.trim() })
        .eq('id', portfolioId);

      if (updateError) throw updateError;
      onSuccess?.();
    } catch (err) {
      console.error('Error renaming portfolio:', err);
      setError('Failed to rename portfolio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePortfolio = async (portfolioId: string) => {
    try {
      setLoading(true);
      setError(null);

      // First, check if portfolio has any assets
      const { data: assets, error: checkError } = await supabase
        .from('assets')
        .select('id')
        .eq('portfolio_id', portfolioId);

      if (checkError) throw checkError;

      // If there are assets, move them to null portfolio first
      if (assets && assets.length > 0) {
        const { error: updateError } = await supabase
          .from('assets')
          .update({ portfolio_id: null })
          .eq('portfolio_id', portfolioId);

        if (updateError) throw updateError;
      }

      // Now we can safely delete the portfolio
      const { error: deleteError } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', portfolioId);

      if (deleteError) throw deleteError;
      onSuccess?.();
    } catch (err) {
      console.error('Error deleting portfolio:', err);
      setError('Failed to delete portfolio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    renamePortfolio,
    deletePortfolio,
    loading,
    error
  };
}