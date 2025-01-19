import { COINGECKO_API_URL } from './config';
import { rateLimiter } from './rateLimit';
import { CoinSearchResult } from './types';
import { addDynamicMapping } from './symbolMapping';

// Cache search results
const searchCache = new Map<string, { results: CoinSearchResult[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function searchCoins(query: string): Promise<CoinSearchResult[]> {
  const cacheKey = query.toLowerCase();
  
  // Check cache first
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.results;
  }

  try {
    await rateLimiter.throttle();
    
    const response = await fetch(
      `${COINGECKO_API_URL}/search?query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const coins = data.coins || [];

    // Sort by market cap rank (null ranks at the end)
    const sortedCoins = coins.sort((a: CoinSearchResult, b: CoinSearchResult) => {
      if (!a.market_cap_rank) return 1;
      if (!b.market_cap_rank) return -1;
      return a.market_cap_rank - b.market_cap_rank;
    });

    // Add dynamic mappings for found coins
    sortedCoins.forEach((coin: CoinSearchResult) => {
      addDynamicMapping(coin.symbol, coin.id);
    });

    // Cache results
    searchCache.set(cacheKey, {
      results: sortedCoins,
      timestamp: Date.now()
    });

    return sortedCoins;
  } catch (error) {
    console.error('Error searching coins:', error);
    throw error;
  }
}

export async function findCoinId(symbol: string): Promise<string | null> {
  try {
    const results = await searchCoins(symbol);
    
    // Find exact symbol match with highest market cap rank
    const exactMatch = results
      .filter(coin => coin.symbol.toLowerCase() === symbol.toLowerCase())
      [0];

    if (exactMatch) {
      addDynamicMapping(symbol, exactMatch.id);
      return exactMatch.id;
    }

    return null;
  } catch (error) {
    console.error(`Error finding coin ID for ${symbol}:`, error);
    return null;
  }
}