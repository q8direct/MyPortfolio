export interface Asset {
  id: string;
  user_id: string;
  symbol: string;
  name: string;
  units: number;
  entry_price: number;
  current_price?: number;
  close_price?: number;
  status: 'open' | 'closed';
  created_at: string;
  closed_at?: string;
}