import React from 'react';
import { Asset } from '../../types/portfolio';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface PortfolioTableProps {
  assets: Asset[];
}

export default function PortfolioTable({ assets }: PortfolioTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Open</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">P/L</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">P/L(%)</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Invested</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {assets.map((asset) => (
            <tr key={asset.symbol} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img src={asset.icon} alt={asset.name} className="h-8 w-8 rounded-full" />
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">{asset.symbol}</div>
                    <div className="text-sm text-gray-500">{asset.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="text-sm font-medium text-gray-900">{formatCurrency(asset.price)}</div>
                <div className={`text-xs ${asset.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(asset.priceChange)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="text-sm text-gray-900">{asset.units}</div>
                <div className="text-xs text-gray-500">Long</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                {formatCurrency(asset.avgOpen)}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${asset.pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(asset.pl)}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${asset.plPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(asset.plPercentage)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                {formatCurrency(asset.invested)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex justify-center gap-2">
                  <button className="px-4 py-1 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600">
                    Close
                  </button>
                  <button className="px-4 py-1 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600">
                    Trade
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}