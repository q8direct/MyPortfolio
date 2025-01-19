import React from 'react';
import { Asset } from '../../types/asset';
import TableRow from './TableRow';
import { supabase } from '../../lib/supabase';

interface TableViewProps {
  assets: Asset[];
  onDelete: (asset: Asset) => void;
  onEdit: (asset: Asset) => void;
  onClose: (asset: Asset) => void;
  showActions?: boolean;
  showDeleteHistory?: boolean;
}

export default function TableView({ 
  assets, 
  onDelete, 
  onEdit, 
  onClose,
  showActions = true,
  showDeleteHistory = false
}: TableViewProps) {
  const handleUpdate = async (id: string, updates: Partial<Asset>) => {
    try {
      const { error } = await supabase
        .from('assets')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating asset:', error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
            {showDeleteHistory && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Portfolio</th>
            )}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Price</th>
            {showActions && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
            )}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Close Price</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">P/L</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">P/L(%)</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Invested</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            {(showActions || showDeleteHistory) && (
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {assets.map((asset) => (
            <TableRow
              key={asset.id}
              asset={asset}
              onDelete={onDelete}
              onEdit={onEdit}
              onClose={onClose}
              onUpdate={handleUpdate}
              showActions={showActions}
              showDeleteHistory={showDeleteHistory}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}