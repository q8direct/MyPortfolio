import { supabase } from '../../lib/supabase';
import { Asset } from '../../types/asset';
import { fetchPrice } from '../coingecko/api/price/service';

export async function updateAssetPrices(assets: Asset[]): Promise<Asset[]> {
  const openAssets = assets.filter(asset => asset.status === 'open');
  const updatedAssets: Asset[] = [];

  for (const asset of openAssets) {
    try {
      const result = await fetchPrice(asset.symbol);
      
      if (result.success && result.price !== null) {
        const { data, error } = await supabase
          .from('assets')
          .update({
            current_price: result.price,
            updated_at: new Date().toISOString()
          })
          .eq('id', asset.id)
          .eq('user_id', asset.user_id) // Add this line
          .select('*')
          .single();

        if (!error && data) {
          updatedAssets.push(data);
        } else {
          console.error(`Error updating asset ${asset.id}:`, error);
        }
      }
    } catch (error) {
      console.error(`Error updating price for ${asset.symbol}:`, error);
    }
  }

  return updatedAssets;
}