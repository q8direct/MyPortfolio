import React from 'react';
import { DollarSign, RefreshCw } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useExchangeBalances } from '../../hooks/useExchangeBalances';

export default function ExchangeBalance() {
  const { totalBalance, loading, error, refresh } = useExchangeBalances();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="animate-pulse flex items-center gap-3">
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="text-red-600 flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          <span>Failed to load balance information</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <DollarSign className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
          </div>
        </div>
        <button
          onClick={refresh}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          title="Refresh balance"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}