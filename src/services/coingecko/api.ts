import { COINGECKO_API_URL } from './config';
import { CoinMarketData } from '../../types/coingecko';

const CACHE_DURATION = 30 * 1000; // 30 seconds
let marketDataCache: { data: CoinMarketData[]; timestamp: number } | null = null;

export async function fetchMarketData(symbols: string[]): Promise<CoinMarketData[]> {
  try {
    // Check cache first
    if (marketDataCache && Date.now() - marketDataCache.timestamp < CACHE_DURATION) {
      return marketDataCache.data.filter(coin => 
        symbols.includes(coin.symbol.toUpperCase())
      );
    }

    const response = await fetch(
      `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&sparkline=false&locale=en`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch market data');
    }

    const data: CoinMarketData[] = await response.json();
    
    // Update cache
    marketDataCache = {
      data,
      timestamp: Date.now()
    };

    return data.filter(coin => 
      symbols.includes(coin.symbol.toUpperCase())
    );
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
}

export async function updateAssetPrices(assets: { id: string; symbol: string }[]) {
  try {
    const symbols = assets.map(asset => asset.symbol.toUpperCase());
    const marketData = await fetchMarketData(symbols);
    
    const updates = marketData.map(coin => {
      const asset = assets.find(a => 
        a.symbol.toUpperCase() === coin.symbol.toUpperCase()
      );
      
      if (!asset) return null;

      return {
        id: asset.id,
        current_price: coin.current_price,
        updated_at: new Date().toISOString()
      };
    }).filter(Boolean);

    return updates;
  } catch (error) {
    console.error('Error updating prices:', error);
    throw error;
  }
}