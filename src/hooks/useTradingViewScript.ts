import { useEffect, useRef, useState } from 'react';

interface TradingViewConfig {
  autosize: boolean;
  symbol: string;
  interval: string;
  timezone: string;
  theme: string;
  style: string;
  locale: string;
  enable_publishing: boolean;
  allow_symbol_change: boolean;
  calendar: boolean;
  hide_top_toolbar: boolean;
  hide_legend: boolean;
  save_image: boolean;
  studies: string[];
  support_host: string;
}

interface UseTradingViewScriptProps {
  containerId: string;
  config: TradingViewConfig;
}

export function useTradingViewScript({ containerId, config }: UseTradingViewScriptProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    // Clear previous content
    container.innerHTML = '';

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = 'calc(100% - 32px)';
    widgetDiv.style.width = '100%';

    widgetContainer.appendChild(widgetDiv);
    container.appendChild(widgetContainer);

    // Load TradingView script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (!isMounted) return;

      try {
        if (typeof TradingView !== 'undefined') {
          new TradingView.widget({
            ...config,
            container_id: containerId,
          });
          setLoading(false);
        } else {
          throw new Error('TradingView not initialized');
        }
      } catch (err) {
        setError('Failed to initialize chart. Please refresh the page.');
        setLoading(false);
      }
    };

    script.onerror = () => {
      if (isMounted) {
        setError('Failed to load chart. Please check your internet connection.');
        setLoading(false);
      }
    };

    document.head.appendChild(script);

    return () => {
      isMounted = false;
      if (container) {
        container.innerHTML = '';
      }
      script.remove();
    };
  }, [containerId, config]);

  return { containerRef, error, loading };
}