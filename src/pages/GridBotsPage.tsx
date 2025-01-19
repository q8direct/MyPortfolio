import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, Pencil, Trash2, Check, X } from 'lucide-react';
import { useGridBots } from '../hooks/useGridBots';
import { formatCurrency } from '../utils/formatters';
import { supabase } from '../lib/supabase';
import AddGridBotModal from '../components/trades/AddGridBotModal';
import DeleteBotModal from '../components/trades/DeleteBotModal';

interface GridBot {
  id: string;
  exchange_id: string;
  coin_pair: string;
  type: 'long' | 'short' | 'neutral';
  grid_count: number;
  initial_amount: number;
  status: 'active' | 'inactive';
}

interface Exchange {
  id: string;
  name: string;
}

interface GridBotsPageProps {
  exchangeId: string | null;
}

interface EditingBot {
  id: string;
  field: keyof GridBot;
  value: string;
}

export default function GridBotsPage({ exchangeId }: GridBotsPageProps) {
  const { bots, loading, error, refresh } = useGridBots(exchangeId);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteBotId, setDeleteBotId] = useState<string | null>(null);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [editingBot, setEditingBot] = useState<EditingBot | null>(null);

  useEffect(() => {
    const savedExchanges = localStorage.getItem('exchanges');
    if (savedExchanges) {
      setExchanges(JSON.parse(savedExchanges));
    }
  }, []);

  const getExchangeName = (exchangeId: string) => {
    const exchange = exchanges.find(e => e.id === exchangeId);
    return exchange?.name || exchangeId;
  };

  const handleEdit = (bot: GridBot, field: keyof GridBot) => {
    setEditingBot({
      id: bot.id,
      field,
      value: bot[field].toString()
    });
  };

  const handleSave = async () => {
    if (!editingBot) return;

    try {
      const updates: Partial<GridBot> = {
        [editingBot.field]: editingBot.field === 'grid_count' 
          ? parseInt(editingBot.value)
          : editingBot.field === 'initial_amount'
          ? parseFloat(editingBot.value)
          : editingBot.value
      };

      const { error: updateError } = await supabase
        .from('grid_bots')
        .update(updates)
        .eq('id', editingBot.id);

      if (updateError) throw updateError;
      
      await refresh();
    } catch (err) {
      console.error('Error updating bot:', err);
    } finally {
      setEditingBot(null);
    }
  };

  const renderEditableCell = (bot: GridBot, field: keyof GridBot) => {
    const isEditing = editingBot?.id === bot.id && editingBot?.field === field;

    if (isEditing) {
      return (
        <div className="flex items-center gap-1">
          {field === 'type' ? (
            <select
              value={editingBot.value}
              onChange={(e) => setEditingBot(prev => prev ? { ...prev, value: e.target.value } : null)}
              className="w-24 p-1 text-sm border rounded"
            >
              <option value="neutral">Neutral</option>
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          ) : field === 'status' ? (
            <select
              value={editingBot.value}
              onChange={(e) => setEditingBot(prev => prev ? { ...prev, value: e.target.value } : null)}
              className="w-24 p-1 text-sm border rounded"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          ) : (
            <input
              type={field === 'grid_count' || field === 'initial_amount' ? 'number' : 'text'}
              value={editingBot.value}
              onChange={(e) => setEditingBot(prev => prev ? { ...prev, value: e.target.value } : null)}
              className="w-24 p-1 text-sm border rounded text-right"
              step={field === 'initial_amount' ? '0.01' : '1'}
            />
          )}
          <button
            onClick={handleSave}
            className="p-1 text-green-600 hover:text-green-900"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={() => setEditingBot(null)}
            className="p-1 text-gray-600 hover:text-gray-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    }

    return (
      <div 
        className="flex items-center justify-between group cursor-pointer"
        onClick={() => handleEdit(bot, field)}
      >
        <span>
          {field === 'initial_amount' 
            ? formatCurrency(bot[field] as number)
            : bot[field]}
        </span>
        <Pencil className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grid Bots</h1>
          <p className="mt-2 text-gray-600">
            Manage your automated grid trading bots
          </p>
        </div>
        {exchangeId && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>New Bot</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : bots.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">
            {exchangeId 
              ? 'No grid bots yet. Create your first one to get started.'
              : 'No grid bots found across any exchange.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {!exchangeId && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exchange
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trading Pair</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Grids</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Initial Amount</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bots.map((bot) => (
                  <tr key={bot.id} className="hover:bg-gray-50">
                    {!exchangeId && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {getExchangeName(bot.exchange_id)}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderEditableCell(bot, 'coin_pair')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {renderEditableCell(bot, 'type')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {renderEditableCell(bot, 'grid_count')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {renderEditableCell(bot, 'initial_amount')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {renderEditableCell(bot, 'status')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => setDeleteBotId(bot.id)}
                          className="p-1 text-red-600 hover:text-red-900"
                          title="Delete bot"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isAddModalOpen && exchangeId && (
        <AddGridBotModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={refresh}
          exchangeId={exchangeId}
        />
      )}

      <DeleteBotModal
        isOpen={!!deleteBotId}
        botId={deleteBotId}
        onClose={() => setDeleteBotId(null)}
        onDelete={refresh}
      />
    </div>
  );
}