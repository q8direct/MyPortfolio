declare module '@tradingview/charting_library' {
  export interface ChartingLibraryWidgetOptions {
    symbol: string;
    interval: string;
    datafeed: any;
    library_path: string;
    container: string;
    locale: string;
    disabled_features?: string[];
    enabled_features?: string[];
    charts_storage_url?: string;
    client_id?: string;
    user_id?: string;
    fullscreen?: boolean;
    autosize?: boolean;
    studies_overrides?: any;
    theme?: string;
  }

  export class widget {
    constructor(options: ChartingLibraryWidgetOptions);
    onChartReady(callback: () => void): void;
    setSymbol(symbol: string, interval: string, callback: () => void): void;
    remove(): void;
  }
}

export as namespace TradingView;