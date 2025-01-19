import React from 'react';
import { Plus } from 'lucide-react';
import { Asset } from '../../types/asset';
import { formatCurrency } from '../../utils/formatters';
import AssetEntry from './AssetEntry';
import { calculateAverageEntryPrice } from '../../utils/assetUtils';

interface AssetGroupProps {
  symbol: string;
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
  onAddTrade: (symbol: string) => void;
}

export default function AssetGroup({ symbol, assets, onEdit, onDelete, onAddTrade }: AssetGroupProps) {
  const avgEntryPrice = calculateAverageEntryPrice(assets, 'open');
  const openPositions = assets.filter(asset => asset.status === 'open').length;
  const closedPositions = assets.filter(asset => asset.status === 'closed').length;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="border-b pb-2 mb-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{symbol}</h3>
            <p className="text-sm text-gray-500">
              {openPositions} open, {closedPositions} closed positions
            </p>
          </div>
          <button
            onClick={() => onAddTrade(symbol)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add Trade</span>
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {assets.map((asset) => (
          <AssetEntry 
            key={asset.id} 
            asset={asset}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {openPositions > 0 && (
        <div className="pt-3 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-600">Average Entry Price (Open Positions):</span>
            <span className="font-bold text-gray-800">{formatCurrency(avgEntryPrice)}</span>
          </div>
        </div>
      )}
    </div>
  );
}