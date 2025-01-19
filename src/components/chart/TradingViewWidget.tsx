import React, { useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { getWidgetConfig } from './config/widgetConfig';

interface TradingViewWidgetProps {
  theme?: 'light' | 'dark';
}

export default function TradingViewWidget({ theme = 'dark' }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => {
      if (container.current) {
        const config = getWidgetConfig(theme);
        const widgetHtml = `
          <div class="tradingview-widget-container">
            <div class="tradingview-widget-container__widget"></div>
            <script type="text/javascript">
              new TradingView.widget(${JSON.stringify(config)});
            </script>
          </div>
        `;
        container.current.innerHTML = widgetHtml;
      }
    };

    document.head.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
      script.remove();
    };
  }, [theme]);

  return (
    <div 
      ref={container} 
      className="w-full h-[600px] bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );
}