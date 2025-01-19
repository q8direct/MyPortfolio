import { Asset } from '../types/asset';

export function groupAssetsBySymbol(assets: Asset[]): Record<string, Asset[]> {
  return assets.reduce((groups, asset) => {
    const symbol = asset.symbol;
    if (!groups[symbol]) {
      groups[symbol] = [];
    }
    groups[symbol].push(asset);
    return groups;
  }, {} as Record<string, Asset[]>);
}

export function calculateAverageEntryPrice(assets: Asset[], statusFilter: 'open' | 'closed' | 'all' = 'all'): number {
  const filteredAssets = statusFilter === 'all' 
    ? assets 
    : assets.filter(asset => asset.status === statusFilter);
  
  if (filteredAssets.length === 0) return 0;
  
  const totalValue = filteredAssets.reduce((sum, asset) => sum + (asset.entry_price * asset.units), 0);
  const totalUnits = filteredAssets.reduce((sum, asset) => sum + asset.units, 0);
  
  return totalValue / totalUnits;
}