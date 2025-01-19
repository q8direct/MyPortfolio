import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import ExchangeCard from '../components/exchanges/ExchangeCard';
import ExchangeBalance from '../components/exchanges/ExchangeBalance';
import AddExchangeModal from '../components/exchanges/AddExchangeModal';
import { Exchange } from '../types/exchange';
import { useExchanges } from '../hooks/useExchanges';
import { supabase } from '../lib/supabase';
import { SUPPORTED_EXCHANGES } from '../config/exchanges';

export default function ExchangesPage() {
  const { exchanges, loading, error, connectExchange, disconnectExchange } = useExchanges();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(null);
  const [credentials, setCredentials] = useState<Record<string, { apiKey: string; apiSecret: string }>>({});

  useEffect(() => {
    const fetchCredentials = async () => {
      if (!exchanges.length) return;

      const { data, error } = await supabase
        .from('exchanges')
        .select('exchange_id, api_key, api_secret');

      if (!error && data) {
        const creds = data.reduce((acc, { exchange_id, api_key, api_secret }) => ({
          ...acc,
          [exchange_id]: { apiKey: api_key, apiSecret: api_secret }
        }), {});
        setCredentials(creds);
      }
    };

    fetchCredentials();
  }, [exchanges]);

  const handleConnect = (exchange: Exchange) => {
    setSelectedExchange(exchange);
    setIsAddModalOpen(true);
  };

  const handleDisconnect = async (exchangeId: string) => {
    try {
      await disconnectExchange(exchangeId);
    } catch (error) {
      console.error('Failed to disconnect exchange:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Connected Exchanges</h1>
        <p className="mt-2 text-gray-600">
          Connect your cryptocurrency exchange accounts to automatically sync your portfolio.
        </p>
      </div>

      <ExchangeBalance />

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUPPORTED_EXCHANGES.map(exchange => {
          const isConnected = exchanges.some(e => e.id === exchange.id);
          const creds = credentials[exchange.id];

          return (
            <ExchangeCard
              key={exchange.id}
              exchange={exchange}
              isConnected={isConnected}
              onConnect={() => handleConnect(exchange)}
              onDisconnect={() => handleDisconnect(exchange.id)}
              apiKey={creds?.apiKey}
              apiSecret={creds?.apiSecret}
            />
          );
        })}
      </div>

      <AddExchangeModal
        isOpen={isAddModalOpen}
        exchange={selectedExchange}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedExchange(null);
        }}
        onExchangeAdded={async (exchange, apiKey, apiSecret) => {
          try {
            await connectExchange(exchange, apiKey, apiSecret);
            setIsAddModalOpen(false);
            setSelectedExchange(null);
          } catch (error) {
            console.error('Failed to connect exchange:', error);
          }
        }}
      />
    </div>
  );
}