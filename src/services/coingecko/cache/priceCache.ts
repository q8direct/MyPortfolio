interface CachedPrice {
  price: number;
  timestamp: number;
}

export class PriceCache {
  private cache = new Map<string, CachedPrice>();
  private readonly duration: number;

  constructor(duration: number = 30 * 1000) { // 30 seconds default
    this.duration = duration;
  }

  get(symbol: string): number | null {
    const upperSymbol = symbol.toUpperCase();
    const cached = this.cache.get(upperSymbol);
    
    if (cached && Date.now() - cached.timestamp < this.duration) {
      return cached.price;
    }
    
    // Clean up expired cache entry
    if (cached) {
      this.cache.delete(upperSymbol);
    }
    
    return null;
  }

  set(symbol: string, price: number): void {
    const upperSymbol = symbol.toUpperCase();
    this.cache.set(upperSymbol, {
      price,
      timestamp: Date.now()
    });
  }

  clear(): void {
    this.cache.clear();
  }

  getAll(): Record<string, number> {
    const prices: Record<string, number> = {};
    const now = Date.now();

    for (const [symbol, cached] of this.cache.entries()) {
      if (now - cached.timestamp < this.duration) {
        prices[symbol] = cached.price;
      }
    }

    return prices;
  }
}

export const priceCache = new PriceCache();