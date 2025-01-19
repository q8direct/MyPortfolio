import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePortfolios } from '../../hooks/usePortfolios';
import PortfolioList from './PortfolioList';
import CreatePortfolioModal from './CreatePortfolioModal';

export default function PortfolioManager() {
  const { portfolios, loading, error, refresh } = usePortfolios();
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Portfolios</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Portfolio
        </button>
      </div>

      <PortfolioList
        portfolios={portfolios}
        selectedPortfolioId={selectedPortfolioId}
        onSelect={(portfolio) => setSelectedPortfolioId(portfolio.id)}
        onUpdate={refresh}
      />

      <CreatePortfolioModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={async (name, description) => {
          await refresh();
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
}