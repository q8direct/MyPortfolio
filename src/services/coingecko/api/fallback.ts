// Fallback prices for major cryptocurrencies when API fails
export const FALLBACK_PRICES: Record<string, number> = {
  'BTC': 43000,
  'ETH': 2200,
  'BNB': 300,
  'SOL': 100,
  'FTM': 0.5,
  'VR': 0.15,
  'DATA': 0.05,
  'MYRIA': 0.02,
  'GALA': 0.025,
  'AVAX': 35,
  'MATIC': 0.8,
  'DOT': 7,
  'LINK': 15,
  'ADA': 0.5,
  'XRP': 0.6,
  'DOGE': 0.08,
};

// Backup API endpoints for price data
export const BACKUP_APIS = [
  'https://api.binance.com/api/v3/ticker/price',
  'https://api.kucoin.com/api/v1/market/orderbook/level1'
];

export function getFallbackPrice(symbol: string): number | null {
  const upperSymbol = symbol.toUpperCase();
  return FALLBACK_PRICES[upperSymbol] || null;
}

export async function getBackupPrice(symbol: string): Promise<number | null> {
  for (const api of BACKUP_APIS) {
    try {
      const response = await fetch(`${api}?symbol=${symbol}USDT`);
      if (!response.ok) continue;
      
      const data = await response.json();
      const price = data.price || data.data?.price;
      
      if (typeof price === 'string') {
        const numPrice = parseFloat(price);
        if (!isNaN(numPrice)) {
          return numPrice;
        }
      }
    } catch (error) {
      console.warn(`Backup API failed for ${symbol}:`, error);
      continue;
    }
  }
  return null;
}