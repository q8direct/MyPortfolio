import React from 'react';
import { X } from 'lucide-react';
import { Asset } from '../../types/asset';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  asset: Asset | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ isOpen, asset, onClose, onConfirm }: DeleteConfirmModalProps) {
  if (!isOpen || !asset) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4">Delete Asset</h2>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete {asset.symbol}? This action cannot be undone.
        </p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}