import React, { useState, useEffect } from 'react';
import { X, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import CoinSearch from '../coins/CoinSearch';
import { CoinSearchResult } from '../../services/coingecko/types';
import { fetchPrice } from '../../services/coingecko/price';
import { formatCurrency } from '../../utils/formatters';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetAdded: () => void;
  portfolioId: string;
}

export default function AddAssetModal({
  isOpen,
  onClose,
  onAssetAdded,
  portfolioId
}: AddAssetModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<CoinSearchResult | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [priceMode, setPriceMode] = useState<'current' | 'manual'>('current');
  const [formData, setFormData] = useState({
    entryPrice: '',
    units: '',
  });

  const resetForm = () => {
    setSelectedCoin(null);
    setCurrentPrice(null);
    setFormData({
      entryPrice: '',
      units: '',
    });
    setError(null);
    setPriceMode('current');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const fetchCurrentPrice = async () => {
    if (!selectedCoin) return;
    
    setLoadingPrice(true);
    try {
      const price = await fetchPrice(selectedCoin.symbol);
      if (price) {
        setCurrentPrice(price);
        if (priceMode === 'current') {
          setFormData(prev => ({ ...prev, entryPrice: price.toString() }));
        }
      }
    } catch (err) {
      console.error('Error fetching price:', err);
    } finally {
      setLoadingPrice(false);
    }
  };

  useEffect(() => {
    if (selectedCoin) {
      fetchCurrentPrice();
    }
  }, [selectedCoin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to add assets');
      return;
    }

    if (!selectedCoin) {
      setError('Please select a coin first');
      return;
    }

    if (!portfolioId) {
      setError('Please select a portfolio first');
      return;
    }

    const entryPrice = parseFloat(formData.entryPrice);
    const units = parseFloat(formData.units);

    if (isNaN(entryPrice) || entryPrice <= 0) {
      setError('Please enter a valid entry price');
      return;
    }

    if (isNaN(units) || units <= 0) {
      setError('Please enter a valid number of units');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from('assets').insert({
        user_id: user.id,
        portfolio_id: portfolioId,
        symbol: selectedCoin.symbol.toUpperCase(),
        name: selectedCoin.name,
        entry_price: entryPrice,
        current_price: currentPrice,
        units: units,
        status: 'open'
      });

      if (insertError) throw insertError;

      onAssetAdded();
      handleClose();
    } catch (err) {
      console.error('Error adding asset:', err);
      setError(err instanceof Error ? err.message : 'Failed to add asset');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Add New Asset</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6">
          {!selectedCoin ? (
            <CoinSearch onSelect={setSelectedCoin} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <img
                  src={selectedCoin.thumb}
                  alt={selectedCoin.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="font-medium">{selectedCoin.name}</div>
                  <div className="text-sm text-gray-500">
                    {selectedCoin.symbol.toUpperCase()}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCoin(null)}
                  className="ml-auto text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setPriceMode('current')}
                  className={`flex-1 px-4 py-2 text-sm font-medium ${
                    priceMode === 'current'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Current Price
                </button>
                <button
                  type="button"
                  onClick={() => setPriceMode('manual')}
                  className={`flex-1 px-4 py-2 text-sm font-medium ${
                    priceMode === 'manual'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Manual Entry
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entry Price (USD)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.00000001"
                    value={formData.entryPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, entryPrice: e.target.value }))}
                    className="w-full p-2 pr-24 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    required
                    min="0"
                  />
                  {priceMode === 'current' && currentPrice && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, entryPrice: currentPrice.toString() }))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-1"
                    >
                      {loadingPrice ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        formatCurrency(currentPrice)
                      )}
                    </button>
                  )}
                </div>
                {priceMode === 'current' && currentPrice && (
                  <p className="mt-1 text-sm text-gray-500">
                    Click the button to use current market price
                  </p>
                )}
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
                  min="0"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Asset'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}