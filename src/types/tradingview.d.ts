interface TradingViewWidget {
  widget(config: {
    autosize: boolean;
    symbol: string;
    interval: string;
    timezone: string;
    theme: string;
    style: string;
    locale: string;
    enable_publishing: boolean;
    allow_symbol_change: boolean;
    save_image: boolean;
    hide_top_toolbar: boolean;
    hide_legend: boolean;
    hide_volume: boolean;
    calendar: boolean;
    studies: string[];
    support_host: string;
  }): void;
}

declare global {
  interface Window {
    TradingView: TradingViewWidget;
  }
}

export {};