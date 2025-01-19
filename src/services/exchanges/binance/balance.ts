import { BINANCE_CONFIG } from './config';
import { makeSignedRequest } from './request';
import { BinanceBalance, BinanceResponse, BinanceTickerPrice } from './types';

const STABLECOINS = ['USDT', 'BUSD', 'USDC'];

export async function fetchBinanceBalance(apiKey: string, apiSecret: string): Promise<number> {
  try {
    const { balances } = await makeSignedRequest<BinanceResponse>(
      BINANCE_CONFIG.ENDPOINTS.ACCOUNT,
      apiKey,
      apiSecret
    );

    let totalUsd = 0;
    const nonZeroBalances = balances.filter(b => 
      parseFloat(b.free) > 0 || parseFloat(b.locked) > 0
    );

    for (const balance of nonZeroBalances) {
      const amount = parseFloat(balance.free) + parseFloat(balance.locked);

      if (STABLECOINS.includes(balance.asset)) {
        totalUsd += amount;
        continue;
      }

      try {
        const symbol = `${balance.asset}USDT`;
        const tickerData = await makeSignedRequest<BinanceTickerPrice>(
          BINANCE_CONFIG.ENDPOINTS.TICKER,
          apiKey,
          apiSecret,
          { symbol }
        );
        
        if (tickerData?.price) {
          totalUsd += amount * parseFloat(tickerData.price);
        }
      } catch (error) {
        console.warn(`Could not fetch price for ${balance.asset}:`, error);
      }

      // Add delay between requests to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return totalUsd;
  } catch (error) {
    console.error('Error fetching Binance balance:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch balance');
  }
}