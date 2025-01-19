export interface PriceProvider {
  getPrice(symbol: string): Promise<number | null>;
}

export interface CoinPrice {
  usd: number;
}

export interface PriceResponse {
  [coinId: string]: CoinPrice;
}

export interface CoinInfo {
  id: string;
  symbol: string;
  name: string;
}

export type FetchPriceResult = {
  success: boolean;
  price: number | null;
  error?: string;
};