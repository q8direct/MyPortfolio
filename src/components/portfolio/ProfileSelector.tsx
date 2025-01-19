import React from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface Profile {
  id: string;
  name: string;
  email: string;
}

interface ProfileSelectorProps {
  profiles: Profile[];
  selectedProfileId: string | null;
  onSelect: (profileId: string) => void;
}

export default function ProfileSelector({
  profiles,
  selectedProfileId,
  onSelect
}: ProfileSelectorProps) {
  const { user } = useAuth();

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-gray-500" />
        <select
          value={selectedProfileId || user?.id || ''}
          onChange={(e) => onSelect(e.target.value)}
          className="pl-2 pr-8 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value={user?.id}>My Portfolio</option>
          {profiles.map(profile => (
            <option key={profile.id} value={profile.id}>
              {profile.name || profile.email}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}