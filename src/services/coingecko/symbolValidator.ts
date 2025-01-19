import { COINGECKO_API_URL } from './config';
import { rateLimiter } from './rateLimit';

// Cache for validated symbols
const validatedSymbols = new Map<string, boolean>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CoinList {
  id: string;
  symbol: string;
  name: string;
}

let coinList: CoinList[] = [];
let lastCoinListUpdate = 0;

async function fetchCoinList(): Promise<CoinList[]> {
  if (coinList.length > 0 && Date.now() - lastCoinListUpdate < CACHE_DURATION) {
    return coinList;
  }

  await rateLimiter.throttle();
  
  const response = await fetch(`${COINGECKO_API_URL}/coins/list`);
  if (!response.ok) {
    throw new Error(`Failed to fetch coin list: ${response.status}`);
  }

  coinList = await response.json();
  lastCoinListUpdate = Date.now();
  return coinList;
}

export async function validateSymbol(symbol: string): Promise<boolean> {
  const upperSymbol = symbol.toUpperCase();
  
  // Check cache first
  if (validatedSymbols.has(upperSymbol)) {
    return validatedSymbols.get(upperSymbol)!;
  }

  try {
    const coins = await fetchCoinList();
    const isValid = coins.some(coin => coin.symbol.toUpperCase() === upperSymbol);
    
    // Cache the result
    validatedSymbols.set(upperSymbol, isValid);
    
    return isValid;
  } catch (error) {
    console.error('Error validating symbol:', error);
    return false;
  }
}

export async function getSymbolId(symbol: string): Promise<string | null> {
  const upperSymbol = symbol.toUpperCase();
  
  try {
    const coins = await fetchCoinList();
    const coin = coins.find(c => c.symbol.toUpperCase() === upperSymbol);
    return coin?.id || null;
  } catch (error) {
    console.error('Error getting symbol ID:', error);
    return null;
  }
}