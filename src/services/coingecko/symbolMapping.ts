// Common cryptocurrency symbols mapping
const SYMBOL_TO_ID_MAPPING: Record<string, string> = {
  // Major cryptocurrencies
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'SOL': 'solana',
  'ADA': 'cardano',
  'DOT': 'polkadot',
  'AVAX': 'avalanche-2',
  'MATIC': 'matic-network',
  'DOGE': 'dogecoin',
  'XRP': 'ripple',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'ATOM': 'cosmos',
  'LTC': 'litecoin',
  'ALGO': 'algorand',
  'XLM': 'stellar',
  'VET': 'vechain',
  'HBAR': 'hedera-hashgraph',
  'ICP': 'internet-computer',
  'FIL': 'filecoin',
  'THETA': 'theta-token',
  
  // Solana Ecosystem
  'BONK': 'bonk',
  'JUP': 'jupiter',
  'PYTH': 'pyth-network',
  'RAY': 'raydium',
  'RNDR': 'render-token',
  'WIF': 'wif-token',
  'JTO': 'jito',
  'MYRIA': 'myria',
  'SHDW': 'genesysgo-shadow',
  'GALA': 'gala',
  'VR': 'victoria-vr',
  
  // New and trending
  'SEI': 'sei-network',
  'DYM': 'dymension',
  'ZETA': 'zeta',
  'STRK': 'starknet',
  'IMX': 'immutable-x',
  'MANTA': 'manta-network',
  'TIA': 'celestia',
  'PIXEL': 'pixels',
  'BLUR': 'blur',
  'ARB': 'arbitrum'
};

// Cache for dynamic mappings
let dynamicMapping: Record<string, string> = {};

export function getCoinGeckoId(symbol: string): string | null {
  const upperSymbol = symbol.toUpperCase();
  return SYMBOL_TO_ID_MAPPING[upperSymbol] || dynamicMapping[upperSymbol] || null;
}

export function addDynamicMapping(symbol: string, id: string): void {
  const upperSymbol = symbol.toUpperCase();
  dynamicMapping[upperSymbol] = id;
}

export function isSymbolSupported(symbol: string): boolean {
  return !!getCoinGeckoId(symbol);
}

export function clearDynamicMapping(): void {
  dynamicMapping = {};
}