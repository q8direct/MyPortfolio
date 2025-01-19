import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Asset } from '../../types/asset';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { calculateMetrics, calculateUnrealizedPL, calculateRealizedPL } from '../../utils/assetCalculations';

interface PortfolioSummaryProps {
  assets: Asset[];
}

export default function PortfolioSummary({ assets }: PortfolioSummaryProps) {
  const openAssets = assets.filter(asset => asset.status === 'open');
  const closedAssets = assets.filter(asset => asset.status === 'closed');

  const totalInvested = assets.reduce((sum, asset) => {
    const { invested } = calculateMetrics(asset);
    return sum + invested;
  }, 0);

  const unrealizedPL = calculateUnrealizedPL(assets);
  const realizedPL = calculateRealizedPL(assets);

  const portfolioValue = openAssets.reduce((sum, asset) => {
    const { currentValue } = calculateMetrics(asset);
    return sum + currentValue;
  }, 0);

  const unrealizedPLPercentage = totalInvested > 0 ? (unrealizedPL / totalInvested) * 100 : 0;
  const realizedPLPercentage = closedAssets.length > 0 
    ? (realizedPL / closedAssets.reduce((sum, asset) => sum + (asset.entry_price * asset.units), 0)) * 100 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Total Invested</h3>
        <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvested)}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Unrealized P/L</h3>
        <div className="flex items-center gap-2">
          <p className={`text-2xl font-bold ${unrealizedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(unrealizedPL)}
          </p>
          {unrealizedPL !== 0 && (
            unrealizedPL > 0 ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )
          )}
        </div>
        <p className={`text-sm mt-1 ${unrealizedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatPercentage(unrealizedPLPercentage)}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Realized P/L</h3>
        <div className="flex items-center gap-2">
          <p className={`text-2xl font-bold ${realizedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(realizedPL)}
          </p>
          {realizedPL !== 0 && (
            realizedPL > 0 ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )
          )}
        </div>
        <p className={`text-sm mt-1 ${realizedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatPercentage(realizedPLPercentage)}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Portfolio Value</h3>
        <p className="text-2xl font-bold text-gray-900">{formatCurrency(portfolioValue)}</p>
        <p className="text-sm text-gray-500 mt-1">
          {openAssets.length} open position{openAssets.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}