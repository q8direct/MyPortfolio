import { Exchange } from '../types/exchange';

export const SUPPORTED_EXCHANGES: Exchange[] = [
  {
    id: 'binance',
    name: 'Binance',
    description: 'Connect your Binance account to automatically track your assets.',
    logo: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png',
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    description: 'Import your Coinbase portfolio and transaction history.',
    logo: 'https://cryptologos.cc/logos/coinbase-coin-coin-logo.png',
  },
  {
    id: 'kraken',
    name: 'Kraken',
    description: 'Sync your Kraken account for real-time portfolio tracking.',
    logo: 'https://cryptologos.cc/logos/kraken-krak-logo.png',
  }
];