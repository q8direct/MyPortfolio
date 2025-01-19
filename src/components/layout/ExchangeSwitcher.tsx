import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus } from 'lucide-react';

interface ExchangeSwitcherProps {
  selectedExchangeId: string | null;
  onExchangeChange: (exchangeId: string | null) => void;
}

export default function ExchangeSwitcher({ 
  selectedExchangeId, 
  onExchangeChange 
}: ExchangeSwitcherProps) {
  const [exchanges, setExchanges] = useState<Array<{ id: string; name: string }>>([]);
  const [isAddingExchange, setIsAddingExchange] = useState(false);
  const [newExchangeName, setNewExchangeName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load exchanges from localStorage
    const savedExchanges = localStorage.getItem('exchanges');
    if (savedExchanges) {
      setExchanges(JSON.parse(savedExchanges));
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddExchange = () => {
    if (!newExchangeName.trim()) return;

    const newExchange = {
      id: crypto.randomUUID(),
      name: newExchangeName.trim()
    };

    const updatedExchanges = [...exchanges, newExchange];
    setExchanges(updatedExchanges);
    localStorage.setItem('exchanges', JSON.stringify(updatedExchanges));
    setNewExchangeName('');
    setIsAddingExchange(false);
  };

  const selectedExchange = exchanges.find(e => e.id === selectedExchangeId);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 min-w-[200px] px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="flex-1 text-left truncate">
          {selectedExchange?.name || 'All Exchanges'}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="py-1">
            <button
              onClick={() => {
                onExchangeChange(null);
                setIsDropdownOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${!selectedExchangeId ? 'bg-blue-50 text-blue-600' : ''}`}
            >
              All Exchanges
            </button>
            {exchanges.map(exchange => (
              <button
                key={exchange.id}
                onClick={() => {
                  onExchangeChange(exchange.id);
                  setIsDropdownOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                  exchange.id === selectedExchangeId ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                {exchange.name}
              </button>
            ))}
          </div>
          <div className="border-t border-gray-200 p-2">
            {isAddingExchange ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newExchangeName}
                  onChange={(e) => setNewExchangeName(e.target.value)}
                  placeholder="Exchange name"
                  className="flex-1 px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleAddExchange}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingExchange(false);
                    setNewExchangeName('');
                  }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingExchange(true)}
                className="flex items-center gap-2 w-full px-4 py-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Plus className="h-4 w-4" />
                <span>Add Exchange</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}