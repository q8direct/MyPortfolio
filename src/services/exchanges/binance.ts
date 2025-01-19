import { rateLimiter } from './rateLimit';
import { BinanceBalance, BinanceResponse } from './types';
import { hmacSha256 } from '../../utils/crypto';

const BINANCE_API_URL = 'https://api.binance.com';
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

async function makeSignedRequest<T>(
  endpoint: string,
  apiKey: string,
  apiSecret: string,
  params: Record<string, string> = {}
): Promise<T> {
  await rateLimiter.throttle();

  const timestamp = Date.now().toString();
  const queryString = Object.entries({ ...params, timestamp })
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  const signature = await hmacSha256(queryString, apiSecret);
  const url = `${BINANCE_API_URL}${endpoint}?${queryString}&signature=${signature}`;

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'X-MBX-APIKEY': apiKey
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error occurred');
      
      if (attempt < RETRY_ATTEMPTS - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError || new Error('Failed to make signed request');
}

export async function fetchBinanceBalance(apiKey: string, apiSecret: string): Promise<number> {
  try {
    const data = await makeSignedRequest<BinanceResponse>('/api/v3/account', apiKey, apiSecret);
    const balances: BinanceBalance[] = data.balances;

    let totalUsd = 0;
    const stablecoins = ['USDT', 'BUSD', 'USDC'];

    for (const balance of balances) {
      const amount = parseFloat(balance.free) + parseFloat(balance.locked);
      if (amount <= 0) continue;

      if (stablecoins.includes(balance.asset)) {
        totalUsd += amount;
        continue;
      }

      try {
        const priceData = await makeSignedRequest<{ price: string }>(
          '/api/v3/ticker/price',
          apiKey,
          apiSecret,
          { symbol: `${balance.asset}USDT` }
        );
        
        totalUsd += amount * parseFloat(priceData.price);
      } catch (error) {
        console.warn(`Could not fetch price for ${balance.asset}:`, error);
      }
    }

    return totalUsd;
  } catch (error) {
    console.error('Error fetching Binance balance:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch Binance balance');
  }
}