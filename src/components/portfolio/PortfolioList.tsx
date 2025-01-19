import React from 'react';
import { Portfolio } from '../../types/portfolio';
import PortfolioCard from './PortfolioCard';

interface PortfolioListProps {
  portfolios: Portfolio[];
  selectedPortfolioId: string | null;
  onSelect: (portfolio: Portfolio) => void;
  onUpdate: () => void;
}

export default function PortfolioList({
  portfolios,
  selectedPortfolioId,
  onSelect,
  onUpdate
}: PortfolioListProps) {
  if (portfolios.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">No portfolios yet. Create your first portfolio to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {portfolios.map(portfolio => (
        <PortfolioCard
          key={portfolio.id}
          portfolio={portfolio}
          isSelected={portfolio.id === selectedPortfolioId}
          onSelect={onSelect}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}