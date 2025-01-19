import React, { useState } from 'react';
import { Portfolio } from '../../types/portfolio';
import { Asset } from '../../types/asset';
import PortfolioSwitcher from '../portfolio/PortfolioSwitcher';
import RefreshPricesButton from '../assets/RefreshPricesButton';
import { calculatePortfolioMetrics } from '../../utils/portfolioCalculations';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface PortfolioLayoutProps {
  selectedPortfolio: Portfolio | null;
  onPortfolioChange: (portfolio: Portfolio | null) => void;
  onRefresh: () => void;
  assets: Asset[];
  exchangeId: string | null;
  children: React.ReactNode;
}

export default function PortfolioLayout({
  selectedPortfolio,
  onPortfolioChange,
  onRefresh,
  assets,
  exchangeId,
  children
}: PortfolioLayoutProps) {
  const metrics = calculatePortfolioMetrics(assets);
  const openAssets = assets.filter(asset => asset.status === 'open');

  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedPortfolio?.name || 'All Portfolios'}
            </h1>
            <PortfolioSwitcher
              selectedPortfolioId={selectedPortfolio?.id || null}
              onPortfolioChange={onPortfolioChange}
              exchangeId={exchangeId}
            />
          </div>
          <RefreshPricesButton 
            assets={openAssets}
            onRefreshComplete={onRefresh}
          />
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Current Balance</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(metrics.portfolioValue)}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-1">24h Portfolio Change</div>
            <div className={`text-2xl font-bold ${metrics.unrealizedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(metrics.unrealizedPL)}
              <span className="text-sm ml-1">
                ({formatPercentage(metrics.unrealizedPLPercentage)})
              </span>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Total Profit / Loss</div>
            <div className={`text-2xl font-bold ${metrics.realizedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(metrics.realizedPL)}
              <span className="text-sm ml-1">
                ({formatPercentage(metrics.realizedPLPercentage)})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div>{children}</div>
    </div>
  );
}