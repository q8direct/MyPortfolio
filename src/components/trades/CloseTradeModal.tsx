import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatCurrency } from '../../utils/formatters';

interface CloseTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trade: {
    id: string;
    symbol: string;
    entry_price: number;
    units: number;
  };
  onTradeUpdated: () => void;
}

export default function CloseTradeModal({ isOpen, onClose, trade, onTradeUpdated }: CloseTradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [exitPrice, setExitPrice] = useState('');

  if (!isOpen) return null;

  const calculateProfit = () => {
    const exit = parseFloat(exitPrice);
    if (!exit) return 0;
    return (exit - trade.entry_price) * trade.units;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const exit = parseFloat(exitPrice);
    const profit = calculateProfit();

    try {
      const { error } = await supabase
        .from('manual_trades')
        .update({
          exit_price: exit,
          status: 'closed',
          profit_loss: profit,
          closed_at: new Date().toISOString(),
        })
        .eq('id', trade.id);

      if (error) throw error;

      onTradeUpdated();
      onClose();
    } catch (error) {
      console.error('Error closing trade:', error);
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

        <h2 className="text-2xl font-bold mb-6">Close Trade: {trade.symbol}</h2>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Entry Price</p>
              <p className="font-medium">{formatCurrency(trade.entry_price)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Units</p>
              <p className="font-medium">{trade.units}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exit Price
            </label>
            <input
              type="number"
              step="0.00000001"
              value={exitPrice}
              onChange={(e) => setExitPrice(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              required
            />
          </div>

          {exitPrice && (
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
            {loading ? 'Closing...' : 'Close Trade'}
          </button>
        </form>
      </div>
    </div>
  );
}