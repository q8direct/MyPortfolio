import React, { useState } from 'react';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Asset } from '../../types/asset';
import { useAssetPriceRefresh } from '../../hooks/useAssetPriceRefresh';

interface RefreshPricesButtonProps {
  assets: Asset[];
  onRefreshComplete: () => void;
}

export default function RefreshPricesButton({ assets, onRefreshComplete }: RefreshPricesButtonProps) {
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string | null;
  }>({ type: null, message: null });

  const { refresh, isRefreshing } = useAssetPriceRefresh({
    assets,
    onRefreshComplete,
  });

  const handleRefresh = async () => {
    try {
      setStatus({ type: null, message: null });

      const openAssets = assets.filter(asset => asset.status === 'open');
      if (openAssets.length === 0) {
        setStatus({
          type: 'error',
          message: 'No open positions to update'
        });
        return;
      }

      await refresh();
      
      setStatus({
        type: 'success',
        message: `Successfully updated ${openAssets.length} asset${openAssets.length === 1 ? '' : 's'}`
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatus({ type: null, message: null });
      }, 3000);

    } catch (error) {
      console.error('Error updating prices:', error);
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update prices'
      });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        <span>{isRefreshing ? 'Updating...' : 'Refresh Prices'}</span>
      </button>
      
      {status.message && (
        <div className={`absolute top-full mt-2 p-2 rounded-lg flex items-center gap-2 text-sm whitespace-nowrap ${
          status.type === 'error' 
            ? 'bg-red-50 border border-red-200 text-red-600' 
            : 'bg-green-50 border border-green-200 text-green-600'
        }`}>
          {status.type === 'error' ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <span>{status.message}</span>
        </div>
      )}
    </div>
  );
}