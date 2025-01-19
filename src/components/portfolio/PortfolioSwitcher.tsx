import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { usePortfolios } from '../../hooks/usePortfolios';
import { Portfolio } from '../../types/portfolio';
import CreatePortfolioModal from './CreatePortfolioModal';
import PortfolioActions from './PortfolioActions';

interface PortfolioSwitcherProps {
  selectedPortfolioId: string | null;
  onPortfolioChange: (portfolio: Portfolio | null) => void;
  exchangeId: string | null;
}

export default function PortfolioSwitcher({ 
  selectedPortfolioId, 
  onPortfolioChange,
  exchangeId
}: PortfolioSwitcherProps) {
  const { portfolios, loading, createPortfolio, renamePortfolio, deletePortfolio } = usePortfolios(exchangeId);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedPortfolio = portfolios.find(p => p.id === selectedPortfolioId);

  if (loading) {
    return (
      <div className="h-10 w-48 animate-pulse bg-gray-200 rounded-lg"></div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 min-w-[200px] px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="flex-1 text-left truncate">
          {selectedPortfolio?.name || 'All Portfolios'}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="py-1">
            <button
              onClick={() => {
                onPortfolioChange(null);
                setIsDropdownOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${!selectedPortfolioId ? 'bg-blue-50 text-blue-600' : ''}`}
            >
              All Portfolios
            </button>
            {portfolios.map(portfolio => (
              <div key={portfolio.id} className="group relative">
                <button
                  onClick={() => {
                    onPortfolioChange(portfolio);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                    portfolio.id === selectedPortfolioId ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  {portfolio.name}
                </button>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
                  <PortfolioActions
                    portfolioId={portfolio.id}
                    currentName={portfolio.name}
                    onRename={renamePortfolio}
                    onDelete={deletePortfolio}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200">
            <button
              onClick={() => {
                setIsCreateModalOpen(true);
                setIsDropdownOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-blue-600 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4" />
              <span>New Portfolio</span>
            </button>
          </div>
        </div>
      )}

      <CreatePortfolioModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={async (portfolio) => {
          try {
            const newPortfolio = await createPortfolio(portfolio);
            onPortfolioChange(newPortfolio);
            setIsCreateModalOpen(false);
          } catch (error) {
            console.error('Error creating portfolio:', error);
          }
        }}
      />
    </div>
  );
}