import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Asset } from '../../types/asset';
import { CoinMarketData } from '../../types/coingecko';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface AssetRowProps {
  asset: Asset;
  marketInfo: CoinMarketData;
}

export default function AssetRow({ asset, marketInfo }: AssetRowProps) {
  const value = marketInfo.current_price * asset.units;
  const pl = value - (asset.entry_price * asset.units);
  const plPercentage = ((marketInfo.current_price - asset.entry_price) / asset.entry_price) * 100;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img 
            src={marketInfo.image} 
            alt={marketInfo.name} 
            className="h-8 w-8 rounded-full mr-3"
          />
          <div>
            <div className="font-medium text-gray-900">{marketInfo.name}</div>
            <div className="text-sm text-gray-500">{asset.symbol}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
        {formatCurrency(marketInfo.current_price)}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm flex items-center justify-end gap-1 ${
        marketInfo.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
      }`}>
        {marketInfo.price_change_percentage_24h >= 0 ? (
          <TrendingUp className="h-4 w-4" />
        ) : (
          <TrendingDown className="h-4 w-4" />
        )}
        {formatPercentage(marketInfo.price_change_percentage_24h)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
        {formatCurrency(marketInfo.market_cap)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
        {formatCurrency(marketInfo.total_volume)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="text-sm font-medium text-gray-900">
          {asset.units} {asset.symbol}
        </div>
        <div className={`text-sm ${pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(value)} ({formatPercentage(plPercentage)})
        </div>
      </td>
    </tr>
  );
}