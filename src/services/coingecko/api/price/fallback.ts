// Fallback prices for when API fails
const FALLBACK_PRICES: Record<string, number> = {
  'BTC': 43000,
  'ETH': 2200,
  'BNB': 300,
  'SOL': 100,
  'FTM': 0.5,
  'VR': 0.15,
  'DATA': 0.05,
  'MYRIA': 0.02,
  'GALA': 0.025
};

export function getFallbackPrice(symbol: string): number | null {
  return FALLBACK_PRICES[symbol.toUpperCase()] || null;
}