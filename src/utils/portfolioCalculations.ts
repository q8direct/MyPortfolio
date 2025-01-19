import { Asset } from '../types/asset';

interface PortfolioMetrics {
  totalInvested: number;
  unrealizedPL: number;
  unrealizedPLPercentage: number;
  realizedPL: number;
  realizedPLPercentage: number;
  portfolioValue: number;
  openPositions: number;
}

export function calculatePortfolioMetrics(assets: Asset[]): PortfolioMetrics {
  const metrics = assets.reduce((acc, asset) => {
    const invested = asset.entry_price * asset.units;

    if (asset.status === 'open') {
      const currentValue = (asset.current_price || asset.entry_price) * asset.units;
      const unrealizedPL = currentValue - invested;

      return {
        totalInvested: acc.totalInvested + invested,
        unrealizedPL: acc.unrealizedPL + unrealizedPL,
        realizedPL: acc.realizedPL,
        portfolioValue: acc.portfolioValue + currentValue,
        openPositions: acc.openPositions + 1,
        investedInClosed: acc.investedInClosed
      };
    } else if (asset.status === 'closed' && asset.close_price) {
      const realizedPL = (asset.close_price - asset.entry_price) * asset.units;

      return {
        totalInvested: acc.totalInvested + invested,
        unrealizedPL: acc.unrealizedPL,
        realizedPL: acc.realizedPL + realizedPL,
        portfolioValue: acc.portfolioValue,
        openPositions: acc.openPositions,
        investedInClosed: acc.investedInClosed + invested
      };
    }

    return acc;
  }, {
    totalInvested: 0,
    unrealizedPL: 0,
    realizedPL: 0,
    portfolioValue: 0,
    openPositions: 0,
    investedInClosed: 0
  });

  // Calculate percentages
  const unrealizedPLPercentage = metrics.totalInvested > 0 
    ? (metrics.unrealizedPL / (metrics.totalInvested - metrics.investedInClosed)) * 100 
    : 0;

  const realizedPLPercentage = metrics.investedInClosed > 0
    ? (metrics.realizedPL / metrics.investedInClosed) * 100
    : 0;

  return {
    totalInvested: metrics.totalInvested,
    unrealizedPL: metrics.unrealizedPL,
    unrealizedPLPercentage,
    realizedPL: metrics.realizedPL,
    realizedPLPercentage,
    portfolioValue: metrics.portfolioValue,
    openPositions: metrics.openPositions
  };
}