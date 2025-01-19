import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Portfolio } from '../../types/portfolio';

interface CreatePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (portfolio: Portfolio) => void;
}

export default function CreatePortfolioModal({
  isOpen,
  onClose,
  onSubmit
}: CreatePortfolioModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Portfolio name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        id: '',
        name: name.trim(),
        description: description.trim(),
        user_id: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_default: false
      });
      
      setName('');
      setDescription('');
      onClose();
    } catch (err) {
      console.error('Error creating portfolio:', err);
      setError('Failed to create portfolio. Please try again.');
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

        <h2 className="text-2xl font-bold mb-6">Create New Portfolio</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="My Portfolio"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Portfolio description..."
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Portfolio'}
          </button>
        </form>
      </div>
    </div>
  );
}