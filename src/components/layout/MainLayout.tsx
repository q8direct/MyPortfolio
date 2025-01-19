import React, { useState } from 'react';
import UserMenu from './UserMenu';
import Navigation from './Navigation';
import ExchangeSwitcher from './ExchangeSwitcher';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [selectedExchangeId, setSelectedExchangeId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-4 right-4 z-10">
        <UserMenu />
      </div>
      <Navigation />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <ExchangeSwitcher
            selectedExchangeId={selectedExchangeId}
            onExchangeChange={setSelectedExchangeId}
          />
          {React.cloneElement(children as React.ReactElement, { exchangeId: selectedExchangeId })}
        </div>
      </div>
    </div>
  );
}