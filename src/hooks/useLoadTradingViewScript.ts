import { useState, useEffect } from 'react';

export function useLoadTradingViewScript() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scriptId = 'tradingview-widget-script';
    
    // Check if script is already loaded
    if (document.getElementById(scriptId)) {
      setLoading(false);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://s3.tradingview.com/tv.js';

    script.onload = () => {
      setLoading(false);
    };

    script.onerror = () => {
      setError('Failed to load TradingView chart. Please check your internet connection.');
      setLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return { loading, error };
}