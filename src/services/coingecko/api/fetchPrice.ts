import { COINGECKO_API_URL } from '../config';
import { rateLimiter } from '../utils/rateLimit';
import { priceCache } from '../cache/priceCache';
import { SYMBOL_MAPPINGS } from '../config/symbols';
import { findCoinId } from './search';

export async function fetchPrice(symbol: string): Promise<number | null> {
  const upperSymbol = symbol.toUpperCase();
  
  // Check cache first
  const cachedPrice = priceCache.get(upperSymbol);
  if (cachedPrice !== null) {
    return cachedPrice;
  }

  try {
    // Get coin ID from mapping or search
    let coinId = SYMBOL_MAPPINGS[upperSymbol];
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
      priceCache.set(upperSymbol, price);
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

  // Get cached prices first
  const cachedPrices = priceCache.getAll();
  for (const symbol of uniqueSymbols) {
    if (symbol in cachedPrices) {
      prices[symbol] = cachedPrices[symbol];
    }
  }

  // Get remaining symbols that need fetching
  const remainingSymbols = uniqueSymbols.filter(symbol => !(symbol in prices));

  // Process in smaller batches
  const BATCH_SIZE = 3;
  for (let i = 0; i < remainingSymbols.length; i += BATCH_SIZE) {
    const batch = remainingSymbols.slice(i, i + BATCH_SIZE);
    
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
    if (i + BATCH_SIZE < remainingSymbols.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return prices;
}