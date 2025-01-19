import { useEffect, useState } from 'react';
import { TRADINGVIEW_CONFIG } from '../config/tradingViewConfig';

export function useTradingViewScript() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scriptId = 'tradingview-widget-script';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = TRADINGVIEW_CONFIG.scriptUrl;
    script.type = 'text/javascript';
    script.async = true;

    script.onerror = () => {
      setError('Failed to load TradingView chart. Please refresh the page or check your internet connection.');
    };

    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return { error };
}