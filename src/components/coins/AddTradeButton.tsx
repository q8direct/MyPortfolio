import React from 'react';
import { Plus } from 'lucide-react';

interface AddTradeButtonProps {
  symbol: string;
  onAddTrade: (symbol: string) => void;
}

export default function AddTradeButton({ symbol, onAddTrade }: AddTradeButtonProps) {
  return (
    <button
      onClick={() => onAddTrade(symbol)}
      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
    >
      <Plus className="h-4 w-4" />
      <span>Add Trade</span>
    </button>
  );
}