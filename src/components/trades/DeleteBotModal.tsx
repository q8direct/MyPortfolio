import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DeleteBotModalProps {
  isOpen: boolean;
  botId: string | null;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteBotModal({ isOpen, botId, onClose, onDelete }: DeleteBotModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!isOpen || !botId) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('grid_bots')
        .delete()
        .eq('id', botId);

      if (deleteError) throw deleteError;
      
      onDelete();
      onClose();
    } catch (err) {
      console.error('Error deleting grid bot:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete grid bot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Delete Grid Bot</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this grid bot? This action cannot be undone.
        </p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete Bot'}
          </button>
        </div>
      </div>
    </div>
  );
}