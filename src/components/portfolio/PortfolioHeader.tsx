import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePortfolios } from '../../hooks/usePortfolios';
import CreatePortfolioModal from './CreatePortfolioModal';
import { Portfolio } from '../../types/portfolio';

export default function PortfolioHeader() {
  const { portfolios, loading, createPortfolio } = usePortfolios();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">My Portfolios</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Portfolio
        </button>
      </div>

      <div className="flex items-center gap-4">
        <select
          value={selectedPortfolio?.id || ''}
          onChange={(e) => {
            const portfolio = portfolios.find(p => p.id === e.target.value);
            setSelectedPortfolio(portfolio || null);
          }}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Portfolio</option>
          {portfolios.map(portfolio => (
            <option key={portfolio.id} value={portfolio.id}>
              {portfolio.name}
            </option>
          ))}
        </select>
      </div>

      <CreatePortfolioModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={async (name, description) => {
          await createPortfolio(name, description);
        }}
      />
    </div>
  );
}