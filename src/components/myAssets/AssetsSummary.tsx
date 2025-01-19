import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Briefcase } from 'lucide-react';
import { Asset } from '../../types/asset';
import { useMarketData } from '../../hooks/useMarketData';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface AssetsSummaryProps {
  assets: Asset[];
}

export default function AssetsSummary({ assets }: AssetsSummaryProps) {
  const { marketData } = useMarketData(assets.map(asset => asset.symbol));

  const summary = assets.reduce((acc, asset) => {
    const marketInfo = marketData[asset.symbol.toLowerCase()];
    const currentPrice = marketInfo?.current_price || asset.entry_price;
    const value = currentPrice * asset.units;
    const invested = asset.entry_price * asset.units;
    const pl = value - invested;

    return {
      totalValue: acc.totalValue + value,
      totalInvested: acc.totalInvested + invested,
      totalPL: acc.totalPL + pl,
    };
  }, {
    totalValue: 0,
    totalInvested: 0,
    totalPL: 0,
  });

  const plPercentage = summary.totalInvested > 0
    ? (summary.totalPL / summary.totalInvested) * 100
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Briefcase className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Portfolio Value</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalValue)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-full">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Invested</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalInvested)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${summary.totalPL >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
            {summary.totalPL >= 0 ? (
              <TrendingUp className={`h-6 w-6 ${summary.totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            ) : (
              <TrendingDown className={`h-6 w-6 ${summary.totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total P/L</h3>
            <p className={`text-2xl font-bold ${summary.totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(summary.totalPL)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${plPercentage >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
            {plPercentage >= 0 ? (
              <TrendingUp className={`h-6 w-6 ${plPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            ) : (
              <TrendingDown className={`h-6 w-6 ${plPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total P/L %</h3>
            <p className={`text-2xl font-bold ${plPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(plPercentage)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}