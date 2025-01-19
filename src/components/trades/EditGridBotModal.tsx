import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface GridBot {
  id: string;
  coin_pair: string;
  type: 'long' | 'short' | 'neutral';
  grid_count: number;
  initial_amount: number;
  status: 'active' | 'inactive';
}

interface EditGridBotModalProps {
  isOpen: boolean;
  bot: GridBot | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditGridBotModal({ isOpen, bot, onClose, onUpdate }: EditGridBotModalProps) {
  const [formData, setFormData] = useState({
    coin_pair: bot?.coin_pair || '',
    type: bot?.type || 'neutral',
    grid_count: bot?.grid_count.toString() || '',
    initial_amount: bot?.initial_amount.toString() || '',
    status: bot?.status || 'active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !bot) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('grid_bots')
        .update({
          coin_pair: formData.coin_pair.toUpperCase(),
          type: formData.type,
          grid_count: parseInt(formData.grid_count),
          initial_amount: parseFloat(formData.initial_amount),
          status: formData.status
        })
        .eq('id', bot.id);

      if (updateError) throw updateError;
      
      onUpdate();
      onClose();
    } catch (err) {
      console.error('Error updating grid bot:', err);
      setError(err instanceof Error ? err.message : 'Failed to update grid bot');
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

        <h2 className="text-2xl font-bold mb-6">Edit Grid Bot</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trading Pair
            </label>
            <input
              type="text"
              value={formData.coin_pair}
              onChange={(e) => setFormData(prev => ({ ...prev, coin_pair: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., BTC/USDT"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grid Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'long' | 'short' | 'neutral' }))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="neutral">Neutral</option>
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Grids
            </label>
            <input
              type="number"
              value={formData.grid_count}
              onChange={(e) => setFormData(prev => ({ ...prev, grid_count: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial Amount (USDT)
            </label>
            <input
              type="number"
              value={formData.initial_amount}
              onChange={(e) => setFormData(prev => ({ ...prev, initial_amount: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Grid Bot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}