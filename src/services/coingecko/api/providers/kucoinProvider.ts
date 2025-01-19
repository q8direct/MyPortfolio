import { PriceProvider } from '../types';

export class KucoinProvider implements PriceProvider {
  private readonly baseUrl = 'https://api.kucoin.com/api/v1';

  async getPrice(symbol: string): Promise<number | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/market/orderbook/level1?symbol=${symbol}-USDT`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      return data.data?.price ? parseFloat(data.data.price) : null;
    } catch {
      return null;
    }
  }
}