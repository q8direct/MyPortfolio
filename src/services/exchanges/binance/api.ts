import { BinanceResponse, BinanceTickerPrice } from './types';
import { makeSignedRequest } from './request';

export async function fetchAccountInfo(apiKey: string, apiSecret: string): Promise<BinanceResponse> {
  return makeSignedRequest<BinanceResponse>('/api/v3/account', apiKey, apiSecret);
}

export async function fetchTickerPrice(symbol: string, apiKey: string, apiSecret: string): Promise<BinanceTickerPrice> {
  return makeSignedRequest<BinanceTickerPrice>(
    '/api/v3/ticker/price',
    apiKey,
    apiSecret,
    { symbol }
  );
}