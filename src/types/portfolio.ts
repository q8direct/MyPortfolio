export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_default: boolean;
}

export interface Asset {
  id: string;
  portfolio_id: string;
  symbol: string;
  name: string;
  icon: string;
  price: number;
  priceChange: number;
  units: number;
  avgOpen: number;
  pl: number;
  plPercentage: number;
  invested: number;
}