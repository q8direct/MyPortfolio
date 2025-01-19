export interface PriceResult {
  success: boolean;
  price: number | null;
  error?: string;
  source?: 'api' | 'fallback' | 'cache';
}

export interface PriceUpdate {
  symbol: string;
  price: number;
  timestamp: number;
}