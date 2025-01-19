class PriceCache {
  private cache = new Map<string, { price: number; timestamp: number }>();
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
}

export const priceCache = new PriceCache();