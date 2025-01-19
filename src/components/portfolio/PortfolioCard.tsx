import React from 'react';
import { Portfolio } from '../../types/portfolio';
import PortfolioActions from './PortfolioActions';
import { formatDate } from '../../utils/formatters';

interface PortfolioCardProps {
  portfolio: Portfolio;
  isSelected: boolean;
  onSelect: (portfolio: Portfolio) => void;
  onUpdate: () => void;
}

export default function PortfolioCard({ 
  portfolio, 
  isSelected, 
  onSelect,
  onUpdate 
}: PortfolioCardProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 cursor-pointer border-2 ${
        isSelected ? 'border-blue-500' : 'border-transparent'
      }`}
      onClick={() => onSelect(portfolio)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{portfolio.name}</h3>
          <p className="text-sm text-gray-500">Created {formatDate(portfolio.created_at)}</p>
        </div>
        <div onClick={e => e.stopPropagation()}>
          <PortfolioActions portfolio={portfolio} onUpdate={onUpdate} />
        </div>
      </div>
      {portfolio.description && (
        <p className="text-sm text-gray-600">{portfolio.description}</p>
      )}
      {portfolio.is_default && (
        <span className="mt-2 inline-block px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded">
          Default Portfolio
        </span>
      )}
    </div>
  );
}