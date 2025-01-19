import React from 'react';
import { Asset } from '../../types/asset';
import { useMarketData } from '../../hooks/useMarketData';
import AssetRow from './AssetRow';

interface PurchasedAssetsListProps {
  assets: Asset[];
  loading: boolean;
}

export default function PurchasedAssetsList({ assets, loading }: PurchasedAssetsListProps) {
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

  if (assets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No purchased coins yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coin</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Holdings</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assets.map((asset) => {
              const marketInfo = marketData[asset.symbol.toLowerCase()];
              if (!marketInfo) return null;
              return <AssetRow key={asset.id} asset={asset} marketInfo={marketInfo} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}