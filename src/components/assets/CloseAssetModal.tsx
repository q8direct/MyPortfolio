import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Asset } from '../../types/asset';
import { formatCurrency } from '../../utils/formatters';

interface CloseAssetModalProps {
  isOpen: boolean;
  asset: Asset | null;
  onClose: () => void;
  onAssetClosed: () => void;
}

export default function CloseAssetModal({ isOpen, asset, onClose, onAssetClosed }: CloseAssetModalProps) {
  const [loading, setLoading] = useState(false);
  const [closePrice, setClosePrice] = useState('');

  if (!isOpen || !asset) return null;

  const calculateProfit = () => {
    const exit = parseFloat(closePrice);
    if (!exit) return 0;
    return (exit - asset.entry_price) * asset.units;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('assets')
        .update({
          close_price: parseFloat(closePrice),
          status: 'closed',
          closed_at: new Date().toISOString(),
        })
        .eq('id', asset.id);

      if (error) throw error;

      onAssetClosed();
      onClose();
    } catch (error) {
      console.error('Error closing asset:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Close Position: {asset.symbol}</h2>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Entry Price</p>
              <p className="font-medium">{formatCurrency(asset.entry_price)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Units</p>
              <p className="font-medium">{asset.units}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Close Price
            </label>
            <input
              type="number"
              step="0.00000001"
              value={closePrice}
              onChange={(e) => setClosePrice(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {closePrice && (
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">Estimated Profit/Loss</p>
              <p className={`text-lg font-bold ${calculateProfit() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(calculateProfit())}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Closing...' : 'Close Position'}
          </button>
        </form>
      </div>
    </div>
  );
}