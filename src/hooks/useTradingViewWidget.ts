import { useEffect, useRef, useState } from 'react';

interface UseTradingViewWidgetProps {
  symbol: string;
  interval: string;
  theme: 'light' | 'dark';
}

export function useTradingViewWidget({ symbol, interval, theme }: UseTradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

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

    const copyright = document.createElement('div');
    copyright.className = 'tradingview-widget-copyright';
    copyright.innerHTML = '<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a>';

    widgetContainer.appendChild(widgetDiv);
    widgetContainer.appendChild(copyright);
    container.appendChild(widgetContainer);

    // Create and append script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval,
      timezone: "Etc/UTC",
      theme,
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com"
    });

    script.onload = () => {
      if (isMounted) {
        setLoading(false);
      }
    };

    script.onerror = () => {
      if (isMounted) {
        setError('Failed to load TradingView chart. Please refresh the page.');
        setLoading(false);
      }
    };

    container.appendChild(script);
    scriptRef.current = script;

    return () => {
      isMounted = false;
      if (container && scriptRef.current) {
        container.innerHTML = '';
        scriptRef.current.remove();
      }
    };
  }, [symbol, interval, theme]);

  return { containerRef, error, loading };
}