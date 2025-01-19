import { useState, useEffect } from 'react';
import { fetchCoinMarketData } from '../services/coingecko/marketData';
import { CoinMarketData } from '../types/coingecko';

export function useMarketData(symbols: string[]) {
  const [marketData, setMarketData] = useState<Record<string, CoinMarketData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (symbols.length === 0) {
        setMarketData({});
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchCoinMarketData(symbols);
        
        if (!mounted) return;

        const marketDataMap = data.reduce((acc, coin) => {
          acc[coin.symbol.toLowerCase()] = coin;
          return acc;
        }, {} as Record<string, CoinMarketData>);

        setMarketData(marketDataMap);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        console.error('Error fetching market data:', err);
        setError('Failed to fetch market data');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [symbols.join(',')]);

  return { marketData, loading, error };
}