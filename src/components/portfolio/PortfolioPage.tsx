import React from 'react';
import PortfolioHeader from './PortfolioHeader';
import PortfolioTable from './PortfolioTable';
import PortfolioSummary from './PortfolioSummary';
import ManualTradesTable from '../trades/ManualTradesTable';
import { portfolioData } from '../../data/portfolioData';

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <PortfolioHeader />
        <PortfolioTable assets={portfolioData} />
        <div className="mt-6">
          <ManualTradesTable />
        </div>
        <div className="mt-6">
          <PortfolioSummary 
            cashAvailable={-7.33}
            totalInvested={3563.16}
            profitLoss={-804.01}
            portfolioValue={2749.82}
          />
        </div>
      </div>
    </div>
  );
}