export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  market_cap_change_percentage_24h: number;
  last_updated: string;
}

export interface CoinGeckoError {
  status: {
    error_code: number;
    error_message: string;
  };
}