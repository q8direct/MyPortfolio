import React from 'react';
import { formatCurrency } from '../../utils/formatters';

interface PortfolioSummaryProps {
  cashAvailable: number;
  totalInvested: number;
  profitLoss: number;
  portfolioValue: number;
}

export default function PortfolioSummary({
  cashAvailable,
  totalInvested,
  profitLoss,
  portfolioValue,
}: PortfolioSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Cash Available</div>
          <div className="text-xl font-semibold">{formatCurrency(cashAvailable)}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Total Invested</div>
          <div className="text-xl font-semibold">{formatCurrency(totalInvested)}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Profit/Loss</div>
          <div className={`text-xl font-semibold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(profitLoss)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Portfolio Value</div>
          <div className="text-xl font-semibold">{formatCurrency(portfolioValue)}</div>
        </div>
      </div>
    </div>
  );
}