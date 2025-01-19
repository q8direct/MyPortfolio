import { supabase } from '../lib/supabase';
import { Asset } from '../types/asset';
import { fetchMarketData } from './coingecko/api';

export async function refreshAssetPrices(assets: Asset[]) {
  try {
    const openAssets = assets.filter(asset => asset.status === 'open');
    
    if (openAssets.length === 0) {
      throw new Error('No open positions to update');
    }

    const symbols = openAssets.map(asset => asset.symbol);
    const marketData = await fetchMarketData(symbols);
    
    // Update assets one by one to maintain RLS compliance
    const updates = await Promise.all(
      openAssets.map(async (asset) => {
        const coinData = marketData.find(
          coin => coin.symbol.toLowerCase() === asset.symbol.toLowerCase()
        );

        if (!coinData) return null;

        const { error } = await supabase
          .from('assets')
          .update({
            current_price: coinData.current_price,
            updated_at: new Date().toISOString()
          })
          .eq('id', asset.id)
          .eq('user_id', asset.user_id);

        if (error) {
          console.error(`Error updating asset ${asset.id}:`, error);
          return null;
        }

        return {
          id: asset.id,
          current_price: coinData.current_price
        };
      })
    );

    const successfulUpdates = updates.filter(Boolean);
    if (successfulUpdates.length === 0) {
      throw new Error('No prices were updated');
    }

    return successfulUpdates;
  } catch (error) {
    console.error('Error refreshing prices:', error);
    throw error;
  }
}