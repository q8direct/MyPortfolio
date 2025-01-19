import { Asset } from '../types/asset';

interface AssetMetrics {
  pl: number;
  plPercentage: number;
  invested: number;
  currentValue: number;
}

export function calculateMetrics(asset: Asset): AssetMetrics {
  const invested = asset.entry_price * asset.units;

  if (asset.status === 'closed' && asset.close_price) {
    const pl = (asset.close_price - asset.entry_price) * asset.units;
    const plPercentage = (pl / invested) * 100;
    return { 
      pl, 
      plPercentage, 
      invested,
      currentValue: asset.close_price * asset.units
    };
  }

  const currentPrice = asset.current_price || asset.entry_price;
  const currentValue = currentPrice * asset.units;
  const pl = currentValue - invested;
  const plPercentage = (pl / invested) * 100;
  
  return { 
    pl, 
    plPercentage, 
    invested,
    currentValue
  };
}

export function calculateUnrealizedPL(assets: Asset[]): number {
  return assets
    .filter(asset => asset.status === 'open')
    .reduce((total, asset) => {
      const { pl } = calculateMetrics(asset);
      return total + pl;
    }, 0);
}

export function calculateRealizedPL(assets: Asset[]): number {
  return assets
    .filter(asset => asset.status === 'closed' && asset.close_price)
    .reduce((total, asset) => {
      const { pl } = calculateMetrics(asset);
      return total + pl;
    }, 0);
}