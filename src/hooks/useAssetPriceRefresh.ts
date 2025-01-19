import { useCallback, useRef, useState } from 'react';
import { Asset } from '../types/asset';
import { refreshAssetPrices } from '../services/priceService';

interface UseAssetPriceRefreshProps {
  assets: Asset[];
  onRefreshComplete: () => void;
}

export function useAssetPriceRefresh({ 
  assets, 
  onRefreshComplete 
}: UseAssetPriceRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshingRef = useRef(false);

  const refresh = useCallback(async () => {
    if (refreshingRef.current) return;
    
    refreshingRef.current = true;
    setIsRefreshing(true);

    try {
      await refreshAssetPrices(assets);
      onRefreshComplete();
    } catch (error) {
      console.error('Error refreshing prices:', error);
      throw error;
    } finally {
      setIsRefreshing(false);
      refreshingRef.current = false;
    }
  }, [assets, onRefreshComplete]);

  return { refresh, isRefreshing };
}