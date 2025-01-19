import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import CreateProfileModal from './CreateProfileModal';

export default function AddProfileButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <UserPlus className="h-5 w-5" />
        Add Profile
      </button>

      <CreateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProfileCreated={() => setIsModalOpen(false)}
      />
    </>
  );
}