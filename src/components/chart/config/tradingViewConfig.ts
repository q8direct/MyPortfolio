export const TRADINGVIEW_CONFIG = {
  scriptUrl: 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js',
  defaultSymbol: 'BINANCE:BTCUSDT',
  defaultInterval: 'D',
  defaultTimezone: 'Etc/UTC',
} as const;

export function getWidgetConfig(theme: 'light' | 'dark') {
  return {
    width: "100%",
    height: "100%",
    autosize: true,
    symbol: TRADINGVIEW_CONFIG.defaultSymbol,
    interval: TRADINGVIEW_CONFIG.defaultInterval,
    timezone: TRADINGVIEW_CONFIG.defaultTimezone,
    theme,
    style: "1",
    locale: "en",
    enable_publishing: false,
    allow_symbol_change: true,
    calendar: false,
    support_host: "https://www.tradingview.com"
  };
}