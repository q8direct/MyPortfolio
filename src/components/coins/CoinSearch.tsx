import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { searchCoins } from '../../services/coingecko/search';
import { CoinSearchResult } from '../../services/coingecko/types';

interface CoinSearchProps {
  onSelect: (coin: CoinSearchResult) => void;
}

export default function CoinSearch({ onSelect }: CoinSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CoinSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const searchResults = await searchCoins(query);
        setResults(searchResults);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search coins');
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a coin..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {results.map((coin) => (
            <button
              key={coin.id}
              onClick={() => onSelect(coin)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 border-b last:border-b-0"
            >
              <img
                src={coin.thumb}
                alt={coin.name}
                className="w-6 h-6 rounded-full"
              />
              <div className="flex-1 text-left">
                <div className="font-medium">{coin.name}</div>
                <div className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</div>
              </div>
              {coin.market_cap_rank && (
                <div className="text-sm text-gray-500">
                  Rank #{coin.market_cap_rank}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}