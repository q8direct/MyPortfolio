import { Asset } from '../types/asset';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const PER_PAGE = 100;

export interface CoinGeckoPrice {
  [key: string]: {
    usd: number;
  };
}

interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
  market_cap_rank: number;
}

// Cache market data to avoid unnecessary API calls
let marketDataCache: CoinMarketData[] = [];
let lastCacheUpdate = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchMarketData(page: number = 1): Promise<CoinMarketData[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${PER_PAGE}&page=${page}&sparkline=false&locale=en`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch market data');
    }

    const data = await response.json();
    
    // Update cache if this is page 1
    if (page === 1) {
      marketDataCache = data;
      lastCacheUpdate = Date.now();
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw new Error('Failed to fetch market data. Please try again later.');
  }
}

export async function fetchCoinPrices(symbols: string[]): Promise<CoinGeckoPrice> {
  try {
    const ids = await getCoinsIds(symbols);
    if (ids.length === 0) return {};

    const response = await fetch(
      `${COINGECKO_API_URL}/simple/price?ids=${ids.join(',')}&vs_currencies=usd`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch coin prices');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching coin prices:', error);
    throw new Error('Failed to fetch coin prices. Please try again later.');
  }
}

export async function isCoinSupported(symbol: string): Promise<boolean> {
  try {
    // Check cache first
    if (marketDataCache.length > 0 && Date.now() - lastCacheUpdate < CACHE_DURATION) {
      return marketDataCache.some(coin => 
        coin.symbol.toLowerCase() === symbol.toLowerCase()
      );
    }

    // If cache is empty or expired, fetch first page
    const data = await fetchMarketData(1);
    return data.some(coin => 
      coin.symbol.toLowerCase() === symbol.toLowerCase()
    );
  } catch (error) {
    console.error('Error checking coin support:', error);
    return false;
  }
}

async function getCoinsIds(symbols: string[]): Promise<string[]> {
  try {
    // Check cache first
    if (marketDataCache.length > 0 && Date.now() - lastCacheUpdate < CACHE_DURATION) {
      return symbols
        .map(symbol => {
          const coin = marketDataCache.find(c => 
            c.symbol.toLowerCase() === symbol.toLowerCase()
          );
          return coin?.id;
        })
        .filter((id): id is string => id !== undefined);
    }

    // If cache is empty or expired, fetch first page
    const data = await fetchMarketData(1);
    return symbols
      .map(symbol => {
        const coin = data.find(c => 
          c.symbol.toLowerCase() === symbol.toLowerCase()
        );
        return coin?.id;
      })
      .filter((id): id is string => id !== undefined);
  } catch (error) {
    console.error('Error getting coin IDs:', error);
    return [];
  }
}