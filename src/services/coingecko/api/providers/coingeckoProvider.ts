import { coinGeckoClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { PriceProvider } from '../types';
import { findCoinId } from '../coinList';
import { withTimeout } from '../../utils/async';
import { withRetry } from '../retryStrategy';
import { SYMBOL_MAPPINGS } from '../../config/symbols';

export class CoinGeckoProvider implements PriceProvider {
  private readonly timeout = 10000;
  private readonly maxRetries = 2;

  async getPrice(symbol: string): Promise<number | null> {
    try {
      // Check static mapping first
      let coinId = SYMBOL_MAPPINGS[symbol];
      
      if (!coinId) {
        coinId = await withTimeout(
          withRetry(
            () => findCoinId(symbol),
            { maxAttempts: this.maxRetries }
          ),
          this.timeout
        );
      }

      if (!coinId) return null;

      const data = await withTimeout(
        withRetry(
          () => coinGeckoClient.get(ENDPOINTS.SIMPLE_PRICE(coinId!)),
          { maxAttempts: this.maxRetries }
        ),
        this.timeout
      );

      return data[coinId]?.usd || null;
    } catch (error) {
      console.warn(`CoinGecko provider failed for ${symbol}:`, error);
      return null;
    }
  }
}