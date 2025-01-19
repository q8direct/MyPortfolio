export const ENDPOINTS = {
  SIMPLE_PRICE: (ids: string) => `/simple/price?ids=${ids}&vs_currencies=usd`,
  COINS_LIST: '/coins/list',
  SEARCH: (query: string) => `/search?query=${query}`
} as const;