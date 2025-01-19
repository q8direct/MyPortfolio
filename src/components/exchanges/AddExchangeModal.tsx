import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Exchange } from '../../types/exchange';

interface AddExchangeModalProps {
  isOpen: boolean;
  exchange: Exchange | null;
  onClose: () => void;
  onExchangeAdded: (exchange: Exchange, apiKey: string, apiSecret: string) => void;
}

export default function AddExchangeModal({
  isOpen,
  exchange,
  onClose,
  onExchangeAdded
}: AddExchangeModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !exchange) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onExchangeAdded(exchange, apiKey, apiSecret);
      setApiKey('');
      setApiSecret('');
    } catch (err) {
      setError('Failed to connect exchange. Please check your credentials and try again.');
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

        <div className="flex items-center mb-6">
          <img 
            src={exchange.logo} 
            alt={exchange.name} 
            className="h-10 w-10 rounded-full"
          />
          <h2 className="ml-3 text-2xl font-bold">
            Connect {exchange.name}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Secret
            </label>
            <input
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="text-sm text-gray-500">
            <p className="mb-2">To get your API credentials:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Log in to your {exchange.name} account</li>
              <li>Go to API Management or API Settings</li>
              <li>Create a new API key with read-only permissions</li>
              <li>Copy and paste your API key and secret here</li>
            </ol>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Connecting...' : 'Connect Exchange'}
          </button>
        </form>
      </div>
    </div>
  );
}