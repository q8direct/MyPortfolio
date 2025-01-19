export const BINANCE_CONFIG = {
  API_URL: 'https://api.binance.com',
  WEBSOCKET_URL: 'wss://stream.binance.com:9443',
  ENDPOINTS: {
    ACCOUNT: '/api/v3/account',
    TICKER: '/api/v3/ticker/price',
    SYSTEM_STATUS: '/sapi/v1/system/status'
  },
  REQUEST: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    TIMEOUT: 30000,
    RECV_WINDOW: 60000
  },
  RATE_LIMIT: {
    MAX_REQUESTS: 10,
    TIME_WINDOW: 1000
  }
} as const;

// Updated list of reliable CORS proxies
export const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://proxy.cors.sh/',
  'https://cors.bridged.cc/'
] as const;