// TradingView widget configuration
export const defaultConfig = {
  width: "100%",
  height: "100%",
  autosize: true,
  symbol: "BINANCE:BTCUSDT",
  interval: "D",
  timezone: "Etc/UTC",
  theme: "dark",
  style: "1",
  locale: "en",
  enable_publishing: false,
  allow_symbol_change: true,
  calendar: false,
  support_host: "https://www.tradingview.com"
} as const;

export function getWidgetConfig(theme: 'light' | 'dark') {
  return {
    ...defaultConfig,
    theme
  };
}