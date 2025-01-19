import React, { useState, useEffect } from 'react';
import { Trash2, Pencil, Check, X } from 'lucide-react';
import { Asset } from '../../types/asset';
import { formatCurrency, formatPercentage, formatDate } from '../../utils/formatters';
import { calculateMetrics } from '../../utils/assetCalculations';
import CoinGeckoLink from '../common/CoinGeckoLink';
import { usePortfolios } from '../../hooks/usePortfolios';
import { supabase } from '../../lib/supabase';

interface TableRowProps {
  asset: Asset;
  onDelete: (asset: Asset) => void;
  onEdit: (asset: Asset) => void;
  onClose: (asset: Asset) => void;
  onUpdate: (id: string, updates: Partial<Asset>) => void;
  showActions?: boolean;
  showDeleteHistory?: boolean;
}

export default function TableRow({ 
  asset, 
  onDelete, 
  onEdit, 
  onClose, 
  onUpdate,
  showActions = true,
  showDeleteHistory = false
}: TableRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    symbol: asset.symbol,
    entry_price: asset.entry_price.toString(),
    current_price: (asset.current_price || '').toString(),
    units: asset.units.toString(),
  });
  const [localAsset, setLocalAsset] = useState(asset);
  const { portfolios } = usePortfolios();

  useEffect(() => {
    setEditData({
      symbol: asset.symbol,
      entry_price: asset.entry_price.toString(),
      current_price: (asset.current_price || '').toString(),
      units: asset.units.toString(),
    });
    setLocalAsset(asset);
  }, [asset]);

  const metrics = calculateMetrics(localAsset);
  const portfolio = portfolios.find(p => p.id === asset.portfolio_id);

  const handleSave = async () => {
    const updates = {
      symbol: editData.symbol.toUpperCase(),
      entry_price: parseFloat(editData.entry_price),
      current_price: editData.current_price ? parseFloat(editData.current_price) : null,
      units: parseFloat(editData.units),
    };

    try {
      const { data, error } = await supabase
        .from('assets')
        .update(updates)
        .eq('id', asset.id)
        .select()
        .single();

      if (error) throw error;

      // Update local state immediately
      setLocalAsset(data);
      onUpdate(asset.id, updates);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating asset:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      symbol: localAsset.symbol,
      entry_price: localAsset.entry_price.toString(),
      current_price: (localAsset.current_price || '').toString(),
      units: localAsset.units.toString(),
    });
    setIsEditing(false);
  };

  const renderActions = () => {
    if (!showActions && !showDeleteHistory) return null;

    if (isEditing) {
      return (
        <div className="flex justify-center gap-2">
          <button
            onClick={handleSave}
            className="p-1 text-green-600 hover:text-green-900"
            title="Save"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-gray-600 hover:text-gray-900"
            title="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    }

    if (showDeleteHistory) {
      return (
        <button
          onClick={() => onDelete(localAsset)}
          className="p-1 text-red-600 hover:text-red-900"
          title="Delete history entry"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      );
    }

    if (showActions && localAsset.status === 'open') {
      return (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => onClose(localAsset)}
            className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600"
          >
            Close
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-blue-600 hover:text-blue-900"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(localAsset)}
            className="p-1 text-red-600 hover:text-red-900"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editData.symbol}
                onChange={(e) => setEditData(prev => ({ ...prev, symbol: e.target.value }))}
                className="w-full p-1 border rounded focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="font-medium text-gray-900">
                <CoinGeckoLink symbol={localAsset.symbol} />
              </div>
            )}
            <div className="text-sm text-gray-500">
              {formatDate(localAsset.created_at)}
              {localAsset.status === 'closed' && localAsset.closed_at && (
                <span className="ml-2">→ {formatDate(localAsset.closed_at)}</span>
              )}
            </div>
          </div>
        </div>
      </td>
      {showDeleteHistory && (
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {portfolio?.name || 'Default Portfolio'}
          </div>
        </td>
      )}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        {isEditing ? (
          <input
            type="number"
            step="0.00000001"
            value={editData.entry_price}
            onChange={(e) => setEditData(prev => ({ ...prev, entry_price: e.target.value }))}
            className="w-full p-1 border rounded text-right focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <span className="text-sm text-gray-900">{formatCurrency(localAsset.entry_price)}</span>
        )}
      </td>
      {showActions && (
        <td className="px-6 py-4 whitespace-nowrap text-right">
          {isEditing ? (
            <input
              type="number"
              step="0.00000001"
              value={editData.current_price}
              onChange={(e) => setEditData(prev => ({ ...prev, current_price: e.target.value }))}
              className="w-full p-1 border rounded text-right focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <span className="text-sm text-gray-900">
              {localAsset.current_price ? formatCurrency(localAsset.current_price) : '-'}
            </span>
          )}
        </td>
      )}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
        {localAsset.close_price ? formatCurrency(localAsset.close_price) : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        {isEditing ? (
          <input
            type="number"
            step="0.00000001"
            value={editData.units}
            onChange={(e) => setEditData(prev => ({ ...prev, units: e.target.value }))}
            className="w-full p-1 border rounded text-right focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <span className="text-sm text-gray-900">{localAsset.units}</span>
        )}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${metrics.pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {formatCurrency(metrics.pl)}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${metrics.plPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {formatPercentage(metrics.plPercentage)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
        {formatCurrency(metrics.invested)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          localAsset.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {localAsset.status}
        </span>
      </td>
      {(showActions || showDeleteHistory) && (
        <td className="px-6 py-4 whitespace-nowrap text-center">
          {renderActions()}
        </td>
      )}
    </tr>
  );
}