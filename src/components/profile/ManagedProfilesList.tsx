import React from 'react';
import { Trash2, UserPlus } from 'lucide-react';
import { useManagedProfiles } from '../../hooks/useManagedProfiles';

export default function ManagedProfilesList() {
  const { profiles, loading, removeManagedProfile } = useManagedProfiles();

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Managed Profiles</h2>
      </div>

      {profiles.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <UserPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium mb-2">No Managed Profiles</p>
          <p className="text-sm">Add profiles to manage multiple portfolios</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {profiles.map((profile) => (
            <li key={profile.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">{profile.name || 'Unnamed Profile'}</p>
                <p className="text-sm text-gray-500">{profile.email}</p>
              </div>
              <button
                onClick={() => removeManagedProfile(profile.id)}
                className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                title="Remove profile"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}