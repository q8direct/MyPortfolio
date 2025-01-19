import React from 'react';
import { Plus } from 'lucide-react';
import { Portfolio } from '../../types/portfolio';

interface PortfolioSelectorProps {
  portfolios: Portfolio[];
  selectedPortfolio: Portfolio | null;
  onSelect: (portfolio: Portfolio) => void;
  onCreateNew: () => void;
}

export default function PortfolioSelector({
  portfolios,
  selectedPortfolio,
  onSelect,
  onCreateNew
}: PortfolioSelectorProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="flex-1">
        <select
          value={selectedPortfolio?.id || ''}
          onChange={(e) => {
            const portfolio = portfolios.find(p => p.id === e.target.value);
            if (portfolio) onSelect(portfolio);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {portfolios.map(portfolio => (
            <option key={portfolio.id} value={portfolio.id}>
              {portfolio.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={onCreateNew}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Plus className="h-4 w-4" />
        New Portfolio
      </button>
    </div>
  );
}