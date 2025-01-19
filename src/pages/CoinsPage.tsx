import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { fetchMarketData } from '../services/coingecko';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import AddTradeButton from '../components/coins/AddTradeButton';
import AddAssetModal from '../components/assets/AddAssetModal';

const ITEMS_PER_PAGE = 100;

export default function CoinsPage() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchCoins = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMarketData(page);
        if (mounted) {
          setCoins(data);
          setHasMore(data.length === ITEMS_PER_PAGE);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load coins');
          setHasMore(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCoins();
    return () => { mounted = false; };
  }, [page]);

  const handleAddTrade = (symbol: string) => {
    setSelectedSymbol(symbol);
    setIsAddModalOpen(true);
  };

  const filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Cryptocurrency Market</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search coins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coin
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  24h Change
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Market Cap
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volume (24h)
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trade
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCoins.map((coin, index) => (
                  <tr key={coin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {((page - 1) * ITEMS_PER_PAGE) + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img src={coin.image} alt={coin.name} className="h-6 w-6 rounded-full" />
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{coin.name}</div>
                          <div className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatCurrency(coin.current_price)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${
                      coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(coin.price_change_percentage_24h)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatCurrency(coin.market_cap)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatCurrency(coin.total_volume)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <AddTradeButton
                        symbol={coin.symbol}
                        onAddTrade={handleAddTrade}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {page}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!hasMore || loading}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedSymbol('');
        }}
        onAssetAdded={() => {
          setIsAddModalOpen(false);
          setSelectedSymbol('');
        }}
        prefilledSymbol={selectedSymbol}
      />
    </div>
  );
}