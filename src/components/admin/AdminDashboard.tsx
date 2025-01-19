import React from 'react';
import { useUsers } from '../../hooks/useUsers';
import UsersList from './UsersList';
import UserAssets from './UserAssets';

export default function AdminDashboard() {
  const { users, loading, error } = useUsers();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h2>
        <UsersList users={users} />
      </div>
      <UserAssets />
    </div>
  );
}