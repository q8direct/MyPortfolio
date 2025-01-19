import React, { createContext, useContext, useState } from 'react';
import { Portfolio } from '../../types/portfolio';

interface PortfolioContextType {
  selectedProfileId: string | null;
  selectedPortfolio: Portfolio | null;
  setSelectedProfileId: (id: string | null) => void;
  setSelectedPortfolio: (portfolio: Portfolio | null) => void;
}

const PortfolioContext = createContext<PortfolioContextType>({
  selectedProfileId: null,
  selectedPortfolio: null,
  setSelectedProfileId: () => {},
  setSelectedPortfolio: () => {}
});

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);

  return (
    <PortfolioContext.Provider
      value={{
        selectedProfileId,
        selectedPortfolio,
        setSelectedProfileId,
        setSelectedPortfolio
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export const usePortfolioContext = () => useContext(PortfolioContext);