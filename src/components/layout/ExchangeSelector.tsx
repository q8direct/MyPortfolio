import React from 'react';
import { Plus } from 'lucide-react';
import { Exchange } from '../../types/exchange';

interface ExchangeSelectorProps {
  exchanges: Exchange[];
  selectedExchangeId: string | null;
  onExchangeSelect: (exchangeId: string | null) => void;
  onAddExchange: () => void;
}

export default function ExchangeSelector({
  exchanges,
  selectedExchangeId,
  onExchangeSelect,
  onAddExchange
}: ExchangeSelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex space-x-2">
        <button
          onClick={() => onExchangeSelect(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedExchangeId === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Exchanges
        </button>
        {exchanges.map((exchange) => (
          <button
            key={exchange.id}
            onClick={() => onExchangeSelect(exchange.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedExchangeId === exchange.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {exchange.name}
          </button>
        ))}
      </div>
      <button
        onClick={onAddExchange}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
      >
        <Plus className="h-4 w-4" />
        <span>Add Exchange</span>
      </button>
    </div>
  );
}