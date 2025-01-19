import React, { useState } from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [showEmail, setShowEmail] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const email = user?.email || 'User';
  const username = email.split('@')[0];

  return (
    <div className="flex items-center gap-4">
      <div 
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow cursor-pointer"
        onMouseEnter={() => setShowEmail(true)}
        onMouseLeave={() => setShowEmail(false)}
      >
        <User className="h-4 w-4 text-gray-500" />
        <span className="text-gray-700 font-medium">
          {showEmail ? email : username}
        </span>
      </div>
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <LogOut className="h-4 w-4" />
        <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
      </button>
    </div>
  );
}