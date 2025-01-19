import { fetchBinanceBalance } from './binance';

export async function fetchExchangeBalances(
  exchangeId: string,
  apiKey: string,
  apiSecret: string
): Promise<number> {
  try {
    switch (exchangeId) {
      case 'binance':
        return await fetchBinanceBalance(apiKey, apiSecret);
      case 'coinbase':
        // TODO: Implement Coinbase integration
        return 0;
      case 'kraken':
        // TODO: Implement Kraken integration
        return 0;
      default:
        throw new Error(`Unsupported exchange: ${exchangeId}`);
    }
  } catch (error) {
    console.error(`Error fetching balances from ${exchangeId}:`, error);
    throw error;
  }
}