import { COINGECKO_API_URL } from '../config';
import { rateLimiter } from '../utils/rateLimit';
import { NetworkError, RateLimitError } from './errors';

class CoinGeckoClient {
  private baseUrl: string;
  private proxyUrls = [
    'https://api.coingecko.com/api/v3',
    'https://pro-api.coingecko.com/api/v3'
  ];
  private currentProxyIndex = 0;

  constructor(baseUrl: string = COINGECKO_API_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetchWithProxy<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.proxyUrls[this.currentProxyIndex]}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      if (response.status === 429) {
        throw new RateLimitError();
      }

      if (!response.ok) {
        throw new NetworkError(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      // Switch to next proxy URL on failure
      this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxyUrls.length;
      throw error;
    }
  }

  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    await rateLimiter.throttle();

    try {
      return await this.fetchWithProxy<T>(endpoint, options);
    } catch (error) {
      if (error instanceof RateLimitError) {
        // Wait longer on rate limit
        await new Promise(resolve => setTimeout(resolve, 5000));
        return this.fetchWithProxy<T>(endpoint, options);
      }
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'GET' });
  }
}

export const coinGeckoClient = new CoinGeckoClient();