import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Asset } from '../../types/asset';
import { useMarketData } from '../../hooks/useMarketData';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface AssetsListProps {
  assets: Asset[];
  loading: boolean;
}

export default function AssetsList({ assets, loading }: AssetsListProps) {
  const { marketData, loading: marketLoading } = useMarketData(
    assets.map(asset => asset.symbol)
  );

  if (loading || marketLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Holdings</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">P/L</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assets.map((asset) => {
              const marketInfo = marketData[asset.symbol.toLowerCase()];
              const currentPrice = marketInfo?.current_price || 0;
              const priceChange = marketInfo?.price_change_percentage_24h || 0;
              const marketCap = marketInfo?.market_cap || 0;
              const value = currentPrice * asset.units;
              const pl = value - (asset.entry_price * asset.units);
              const plPercentage = ((currentPrice - asset.entry_price) / asset.entry_price) * 100;

              return (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {marketInfo?.image && (
                        <img src={marketInfo.image} alt={asset.symbol} className="h-8 w-8 rounded-full mr-3" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{asset.symbol}</div>
                        <div className="text-sm text-gray-500">{marketInfo?.name || asset.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {formatCurrency(currentPrice)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm flex items-center justify-end gap-1 ${
                    priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {priceChange >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {formatPercentage(priceChange)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {formatCurrency(marketCap)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {asset.units}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {formatCurrency(value)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${
                    pl >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <div>{formatCurrency(pl)}</div>
                    <div className="text-xs">{formatPercentage(plPercentage)}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}