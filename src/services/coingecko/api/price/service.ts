import { coinGeckoClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { PriceResult, PriceUpdate } from './types';
import { priceCache } from './cache';
import { getFallbackPrice } from './fallback';
import { withRetry } from '../retryStrategy';

export async function fetchPrice(symbol: string): Promise<PriceResult> {
  try {
    const upperSymbol = symbol.toUpperCase();
    
    // Check cache first
    const cachedPrice = priceCache.get(upperSymbol);
    if (cachedPrice !== null) {
      return { 
        success: true, 
        price: cachedPrice,
        source: 'cache'
      };
    }

    // Try API with retry
    const response = await withRetry(() => 
      coinGeckoClient.get(ENDPOINTS.SIMPLE_PRICE(symbol))
    );

    if (response && response[symbol.toLowerCase()]?.usd) {
      const price = response[symbol.toLowerCase()].usd;
      priceCache.set(upperSymbol, price);
      return { 
        success: true, 
        price,
        source: 'api'
      };
    }

    // Try fallback price
    const fallbackPrice = getFallbackPrice(upperSymbol);
    if (fallbackPrice !== null) {
      priceCache.set(upperSymbol, fallbackPrice);
      return { 
        success: true, 
        price: fallbackPrice,
        source: 'fallback'
      };
    }

    return {
      success: false,
      price: null,
      error: `No price data available for ${symbol}`
    };
  } catch (error) {
    console.warn(`Error fetching price for ${symbol}:`, error);
    
    // Try fallback on error
    const fallbackPrice = getFallbackPrice(symbol);
    if (fallbackPrice !== null) {
      return { 
        success: true, 
        price: fallbackPrice,
        source: 'fallback'
      };
    }

    return {
      success: false,
      price: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function updateAssetPrices(assets: { symbol: string; id: string }[]): Promise<PriceUpdate[]> {
  const updates: PriceUpdate[] = [];
  
  for (const asset of assets) {
    try {
      const result = await fetchPrice(asset.symbol);
      
      if (result.success && result.price !== null) {
        updates.push({
          symbol: asset.symbol,
          price: result.price,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.warn(`Error updating price for ${asset.symbol}:`, error);
    }
  }

  return updates;
}