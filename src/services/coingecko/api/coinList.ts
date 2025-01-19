import { coinGeckoClient } from './client';
import { ENDPOINTS } from './endpoints';
import { CoinInfo } from './types';

let coinList: CoinInfo[] = [];
let lastUpdate = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function getCoinList(): Promise<CoinInfo[]> {
  const now = Date.now();
  if (coinList.length > 0 && now - lastUpdate < CACHE_DURATION) {
    return coinList;
  }

  try {
    coinList = await coinGeckoClient.get<CoinInfo[]>(ENDPOINTS.COINS_LIST);
    lastUpdate = now;
    return coinList;
  } catch (error) {
    console.error('Error fetching coin list:', error);
    return coinList; // Return cached list if available
  }
}

export async function findCoinId(symbol: string): Promise<string | null> {
  const list = await getCoinList();
  const coin = list.find(c => c.symbol.toLowerCase() === symbol.toLowerCase());
  return coin?.id || null;
}