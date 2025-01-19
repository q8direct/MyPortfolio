import React from 'react';
import { useAssets } from '../hooks/useAssets';
import { AlertCircle } from 'lucide-react';
import PurchasedAssetsList from '../components/myAssets/PurchasedAssetsList';

export default function MyAssetsPage() {
  const { assets, loading, error } = useAssets(null);
  const openAssets = assets.filter(asset => asset.status === 'open');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Purchased Coins</h1>
        <p className="mt-2 text-gray-600">Real-time market data for your holdings</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <PurchasedAssetsList assets={openAssets} loading={loading} />
    </div>
  );
}