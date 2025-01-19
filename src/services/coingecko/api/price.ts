import { coinGeckoClient } from './client';
import { ENDPOINTS } from './endpoints';
import { SYMBOL_MAPPINGS } from '../config/symbols';
import { findCoinId } from './coinList';
import { priceCache } from '../cache/priceCache';
import { PriceResponse, FetchPriceResult } from './types';
import { getFallbackPrice, getBackupPrice } from './fallback';
import { withRetry } from './retryStrategy';
import { handleApiError } from './errors';
import { withTimeout } from '../utils/async';
import { processPriceBatches } from './batchProcessor';

const PRICE_FETCH_TIMEOUT = 10000; // 10 seconds

export async function fetchSinglePrice(symbol: string): Promise<FetchPriceResult> {
  try {
    const upperSymbol = symbol.toUpperCase();
    
    // Check cache first
    const cachedPrice = priceCache.get(upperSymbol);
    if (cachedPrice !== null) {
      return { success: true, price: cachedPrice };
    }

    // Get coin ID with retry and timeout
    let coinId = SYMBOL_MAPPINGS[upperSymbol];
    if (!coinId) {
      coinId = await withTimeout(
        withRetry(() => findCoinId(upperSymbol)),
        PRICE_FETCH_TIMEOUT
      );
      
      if (!coinId) {
        return handleFallback(upperSymbol);
      }
    }

    // Fetch price with retry and timeout
    const data = await withTimeout(
      withRetry<PriceResponse>(() => 
        coinGeckoClient.get(ENDPOINTS.SIMPLE_PRICE(coinId!))
      ),
      PRICE_FETCH_TIMEOUT
    );

    const price = data[coinId]?.usd;
    if (typeof price !== 'number') {
      return handleFallback(upperSymbol);
    }

    priceCache.set(upperSymbol, price);
    return { success: true, price };
  } catch (error) {
    const apiError = handleApiError(error);
    console.warn(`Price fetch failed for ${symbol}:`, apiError.message);
    return handleFallback(symbol);
  }
}

async function handleFallback(symbol: string): Promise<FetchPriceResult> {
  // Try backup APIs first
  const backupPrice = await getBackupPrice(symbol);
  if (backupPrice !== null) {
    priceCache.set(symbol, backupPrice);
    return { success: true, price: backupPrice };
  }

  // Fall back to static prices
  const fallbackPrice = getFallbackPrice(symbol);
  if (fallbackPrice !== null) {
    priceCache.set(symbol, fallbackPrice);
    return { success: true, price: fallbackPrice };
  }

  return { 
    success: false, 
    price: null, 
    error: `No price data available for ${symbol}` 
  };
}

// Rest of the file remains the same...