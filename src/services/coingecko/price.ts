// Cache prices to avoid excessive API calls
const priceCache = new Map<string, { price: number; timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 1 minute

export async function fetchPrice(symbol: string): Promise<number | null> {
  const upperSymbol = symbol.toUpperCase();
  
  // Check cache first
  const cached = priceCache.get(upperSymbol);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.price;
  }

  try {
    let coinId = getCoinGeckoId(upperSymbol);
    
    // If no mapping exists, try to find it
    if (!coinId) {
      coinId = await findCoinId(upperSymbol);
      if (!coinId) {
        console.warn(`No coin ID found for symbol: ${upperSymbol}`);
        return null;
      }
    }

    await rateLimiter.throttle();
    
    const response = await fetch(
      `${COINGECKO_API_URL}/simple/price?ids=${coinId}&vs_currencies=usd`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const price = data[coinId]?.usd;
    
    if (typeof price === 'number') {
      // Update cache
      priceCache.set(upperSymbol, { price, timestamp: Date.now() });
      return price;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching price for ${upperSymbol}:`, error);
    return null;
  }
}

export async function fetchPrices(symbols: string[]): Promise<Record<string, number>> {
  const prices: Record<string, number> = {};
  const uniqueSymbols = [...new Set(symbols.map(s => s.toUpperCase()))];

  // Process in smaller batches to avoid rate limits
  const BATCH_SIZE = 3;
  for (let i = 0; i < uniqueSymbols.length; i += BATCH_SIZE) {
    const batch = uniqueSymbols.slice(i, i + BATCH_SIZE);
    
    // Process each symbol in the batch
    await Promise.all(batch.map(async (symbol) => {
      try {
        const price = await fetchPrice(symbol);
        if (price !== null) {
          prices[symbol] = price;
        }
      } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error);
      }
    }));

    // Add delay between batches
    if (i + BATCH_SIZE < uniqueSymbols.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return prices;
}

// Clear price cache
export function clearPriceCache(): void {
  priceCache.clear();
}