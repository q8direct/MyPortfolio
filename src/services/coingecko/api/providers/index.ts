import { PriceProvider } from '../types';
import { CoinGeckoProvider } from './coingeckoProvider';
import { BinanceProvider } from './binanceProvider';
import { KucoinProvider } from './kucoinProvider';

// Order providers by reliability
export const getPriceProviders = (): PriceProvider[] => [
  new BinanceProvider(), // Try Binance first for better reliability
  new CoinGeckoProvider(),
  new KucoinProvider()
];