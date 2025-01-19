import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import TradingViewWidget from '../components/chart/TradingViewWidget';

export default function ChartPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Market Chart</h1>
            <p className="mt-2 text-gray-600">
              Professional charting powered by TradingView
            </p>
          </div>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-lg hover:bg-gray-100"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <TradingViewWidget theme={theme} />
        </div>
      </div>
    </div>
  );
}