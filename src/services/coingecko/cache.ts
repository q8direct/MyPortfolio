import { CoinMarketData } from './types';

class MarketDataCache {
  private data: CoinMarketData[] = [];
  private lastUpdate: number = 0;
  private readonly duration: number;

  constructor(cacheDuration: number) {
    this.duration = cacheDuration;
  }

  set(data: CoinMarketData[]) {
    this.data = data;
    this.lastUpdate = Date.now();
  }

  get(): CoinMarketData[] {
    return this.data;
  }

  isValid(): boolean {
    return this.data.length > 0 && (Date.now() - this.lastUpdate) < this.duration;
  }

  clear() {
    this.data = [];
    this.lastUpdate = 0;
  }
}

export const marketCache = new MarketDataCache(5 * 60 * 1000); // 5 minutes