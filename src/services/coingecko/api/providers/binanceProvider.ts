import { PriceProvider } from '../types';
import { sleep } from '../../utils/async';

export class BinanceProvider implements PriceProvider {
  private readonly baseUrl = 'https://api.binance.com/api/v3';
  private readonly alternativeSymbols: Record<string, string> = {
    'BNB': 'BNBUSDT',
    'BTC': 'BTCUSDT',
    'ETH': 'ETHUSDT'
  };

  async getPrice(symbol: string): Promise<number | null> {
    const upperSymbol = symbol.toUpperCase();
    const pairSymbol = this.alternativeSymbols[upperSymbol] || `${upperSymbol}USDT`;

    try {
      // Add small delay to avoid rate limits
      await sleep(100);

      const response = await fetch(
        `${this.baseUrl}/ticker/price?symbol=${pairSymbol}`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0' // Add user agent to avoid some blocks
          }
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited - wait longer and retry once
          await sleep(2000);
          return this.getPrice(symbol);
        }
        return null;
      }

      const data = await response.json();
      const price = parseFloat(data.price);
      return isNaN(price) ? null : price;
    } catch (error) {
      console.warn(`Binance provider failed for ${symbol}:`, error);
      return null;
    }
  }
}