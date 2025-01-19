import React, { useState } from 'react';
import { Pencil, Trash2, X, Check } from 'lucide-react';

interface PortfolioActionsProps {
  portfolioId: string;
  currentName: string;
  onRename: (id: string, newName: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function PortfolioActions({ 
  portfolioId, 
  currentName,
  onRename, 
  onDelete 
}: PortfolioActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(currentName);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRename = async () => {
    if (loading || !newName.trim()) return;
    setLoading(true);
    
    try {
      await onRename(portfolioId, newName);
      setIsEditing(false);
    } catch (error) {
      console.error('Error renaming portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      await onDelete(portfolioId);
    } catch (error) {
      console.error('Error deleting portfolio:', error);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (showDeleteConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Delete portfolio?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          onClick={() => setShowDeleteConfirm(false)}
          disabled={loading}
          className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="px-2 py-1 border rounded text-sm"
          autoFocus
        />
        <button
          onClick={handleRename}
          disabled={loading || !newName.trim()}
          className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            setNewName(currentName);
            setIsEditing(false);
          }}
          disabled={loading}
          className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setIsEditing(true)}
        className="p-1 text-blue-600 hover:text-blue-800"
        title="Rename portfolio"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        onClick={() => setShowDeleteConfirm(true)}
        className="p-1 text-red-600 hover:text-red-800"
        title="Delete portfolio"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}