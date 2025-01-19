export interface ExchangeCredentials {
  apiKey: string;
  apiSecret: string;
}

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

export interface ExchangeBalance {
  total: number;
  available: number;
  locked: number;
  updatedAt: string;
}

export interface ExchangeError {
  code: string;
  message: string;
  status?: number;
}