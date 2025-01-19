import { BINANCE_CONFIG } from './config';
import { hmacSha256 } from '../../../utils/crypto/hmac';
import { BinanceError } from './types';

async function fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < BINANCE_CONFIG.REQUEST.MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Origin': window.location.origin
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt < BINANCE_CONFIG.REQUEST.MAX_RETRIES - 1) {
        await new Promise(resolve => 
          setTimeout(resolve, BINANCE_CONFIG.REQUEST.RETRY_DELAY * Math.pow(2, attempt))
        );
        continue;
      }
      throw lastError;
    }
  }

  throw lastError || new Error('Failed to fetch');
}

export async function makeSignedRequest<T>(
  endpoint: string,
  apiKey: string,
  apiSecret: string,
  params: Record<string, string> = {}
): Promise<T> {
  const timestamp = Date.now().toString();
  const queryParams = new URLSearchParams({
    ...params,
    timestamp,
    recvWindow: BINANCE_CONFIG.REQUEST.RECV_WINDOW.toString()
  });

  const signature = await hmacSha256(queryParams.toString(), apiSecret);
  queryParams.append('signature', signature);

  const url = `${BINANCE_CONFIG.API_URL}${endpoint}?${queryParams}`;

  try {
    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers: {
        'X-MBX-APIKEY': apiKey,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if ('code' in data && 'msg' in data) {
      const error = data as BinanceError;
      throw new Error(`Binance API error: ${error.msg} (code: ${error.code})`);
    }

    return data as T;
  } catch (error) {
    console.error('Binance request failed:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
}