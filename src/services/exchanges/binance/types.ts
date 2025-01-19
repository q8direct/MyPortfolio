export interface BinanceBalance {
  asset: string;
  free: string;
  locked: string;
}

export interface BinanceResponse {
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  updateTime: number;
  accountType: string;
  balances: BinanceBalance[];
  permissions: string[];
}

export interface BinanceTickerPrice {
  symbol: string;
  price: string;
}

export interface BinanceError {
  code: number;
  msg: string;
}