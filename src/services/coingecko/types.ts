export interface CoinSearchResult {
  id: string;
  symbol: string;
  name: string;
  thumb: string;
  market_cap_rank: number;
}

export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
  market_cap_rank: number;
}

export interface CoinGeckoPrice {
  [key: string]: {
    usd: number;
  };
}

export interface CoinGeckoError {
  status: {
    error_code: number;
    error_message: string;
  };
}