import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface NewTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTradeCreated: () => void;
}

export default function NewTradeModal({ isOpen, onClose, onTradeCreated }: NewTradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    entryPrice: '',
    units: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to create a trade');
      }

      const { error } = await supabase.from('manual_trades').insert({
        symbol: formData.symbol.toUpperCase(),
        entry_price: parseFloat(formData.entryPrice),
        units: parseFloat(formData.units),
        user_id: user.id // Add the user_id
      });

      if (error) throw error;

      onTradeCreated();
      onClose();
    } catch (error) {
      console.error('Error creating trade:', error);
      alert(error instanceof Error ? error.message : 'An error occurred while creating the trade');
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

        <h2 className="text-2xl font-bold mb-6">New Manual Trade</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Symbol
            </label>
            <input
              type="text"
              value={formData.symbol}
              onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., BTC"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entry Price
            </label>
            <input
              type="number"
              step="0.00000001"
              value={formData.entryPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, entryPrice: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Units
            </label>
            <input
              type="number"
              step="0.00000001"
              value={formData.units}
              onChange={(e) => setFormData(prev => ({ ...prev, units: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Trade'}
          </button>
        </form>
      </div>
    </div>
  );
}