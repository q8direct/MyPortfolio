import { COINGECKO_API_URL } from './config';
import { CoinMarketData } from '../../types/coingecko';

export async function fetchCoinMarketData(symbols: string[]): Promise<CoinMarketData[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&sparkline=false&locale=en`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch market data');
    }

    const data = await response.json();
    const upperSymbols = symbols.map(s => s.toUpperCase());
    
    return data.filter(coin => 
      upperSymbols.includes(coin.symbol.toUpperCase())
    );
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
}