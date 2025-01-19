import React from 'react';
import { formatCurrency } from '../../utils/formatters';

interface AddAssetFormProps {
  formData: {
    symbol: string;
    units: string;
    entryPrice: string;
    currentPrice: string;
  };
  onChange: (field: string, value: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AddAssetForm({ formData, onChange, loading, onSubmit }: AddAssetFormProps) {
  const calculatePL = () => {
    const entry = parseFloat(formData.entryPrice);
    const current = parseFloat(formData.currentPrice);
    const units = parseFloat(formData.units);
    
    if (!entry || !current || !units) return null;
    
    const pl = (current - entry) * units;
    return pl;
  };

  const pl = calculatePL();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Asset Symbol
        </label>
        <input
          type="text"
          value={formData.symbol}
          onChange={(e) => onChange('symbol', e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., BTC"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Entry Price Per Unit
        </label>
        <input
          type="number"
          step="0.00000001"
          value={formData.entryPrice}
          onChange={(e) => onChange('entryPrice', e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current Market Price
        </label>
        <input
          type="number"
          step="0.00000001"
          value={formData.currentPrice}
          onChange={(e) => onChange('currentPrice', e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantity (Units)
        </label>
        <input
          type="number"
          step="0.00000001"
          value={formData.units}
          onChange={(e) => onChange('units', e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {pl !== null && (
        <div className="p-4 rounded-lg bg-gray-50">
          <p className="text-sm text-gray-600">Estimated Profit/Loss</p>
          <p className={`text-lg font-bold ${pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(pl)}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Asset'}
      </button>
    </form>
  );
}