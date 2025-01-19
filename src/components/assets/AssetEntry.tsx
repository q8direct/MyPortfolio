import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Asset } from '../../types/asset';
import { formatCurrency } from '../../utils/formatters';
import CoinGeckoLink from '../common/CoinGeckoLink';

interface AssetEntryProps {
  asset: Asset;
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
}

export default function AssetEntry({ asset, onEdit, onDelete }: AssetEntryProps) {
  const currentPrice = asset.status === 'closed' ? asset.close_price : asset.current_price;
  
  return (
    <div className="flex justify-between items-center py-2 border-b last:border-b-0">
      <div>
        <div className="flex items-center gap-2">
          <CoinGeckoLink symbol={asset.symbol} />
          <span className={`px-1.5 py-0.5 rounded text-xs ${
            asset.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {asset.status}
          </span>
        </div>
        <span className="text-gray-600 text-sm">
          {new Date(asset.created_at).toLocaleDateString()}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="font-medium">{formatCurrency(asset.entry_price)}</div>
          {currentPrice && currentPrice !== asset.entry_price && (
            <div className={`text-xs ${currentPrice > asset.entry_price ? 'text-green-600' : 'text-red-600'}`}>
              → {formatCurrency(currentPrice)}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(asset)}
            className="p-1 text-blue-600 hover:text-blue-900"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(asset)}
            className="p-1 text-red-600 hover:text-red-900"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}