let scriptPromise: Promise<void> | null = null;

export function loadTradingViewScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    if (window.TradingView) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'tradingview-widget-script';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    
    script.onload = () => {
      // Add a small delay to ensure TradingView is fully initialized
      setTimeout(() => {
        if (window.TradingView) {
          resolve();
        } else {
          reject(new Error('TradingView not initialized after script load'));
        }
      }, 100);
    };

    script.onerror = () => {
      scriptPromise = null;
      reject(new Error('Failed to load TradingView script'));
    };

    document.head.appendChild(script);
  });

  return scriptPromise;
}