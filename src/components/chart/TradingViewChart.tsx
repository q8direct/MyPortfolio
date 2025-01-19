import React from 'react';
import { useTradingViewScript } from '../../hooks/useTradingViewScript';
import ChartError from './ChartError';
import ChartLoader from './ChartLoader';

interface TradingViewChartProps {
  theme?: 'light' | 'dark';
}

export default function TradingViewChart({ theme = 'dark' }: TradingViewChartProps) {
  const { containerRef, error, loading } = useTradingViewScript({
    containerId: 'tradingview-container',
    config: {
      autosize: true,
      symbol: 'BINANCE:BTCUSDT',
      interval: 'D',
      timezone: 'Etc/UTC',
      theme,
      style: '1',
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      studies: ['MASimple@tv-basicstudies', 'RSI@tv-basicstudies'],
      support_host: 'https://www.tradingview.com'
    }
  });

  return (
    <div className="relative w-full h-[600px] bg-white rounded-lg">
      {loading && <ChartLoader />}
      {error ? (
        <ChartError message={error} />
      ) : (
        <div ref={containerRef} id="tradingview-container" className="w-full h-full" />
      )}
    </div>
  );
}