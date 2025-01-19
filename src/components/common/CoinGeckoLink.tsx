import React from 'react';
import { ExternalLink } from 'lucide-react';
import { getCoinGeckoId } from '../../services/coingecko/symbolMapping';

interface CoinGeckoLinkProps {
  symbol: string;
  className?: string;
  showIcon?: boolean;
}

export default function CoinGeckoLink({ symbol, className = '', showIcon = true }: CoinGeckoLinkProps) {
  const coinId = getCoinGeckoId(symbol.toUpperCase());
  const url = coinId 
    ? `https://www.coingecko.com/en/coins/${coinId}`
    : `https://www.coingecko.com/en/search?q=${symbol}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 hover:text-blue-600 ${className}`}
    >
      {symbol.toUpperCase()}
      {showIcon && <ExternalLink className="h-3 w-3" />}
    </a>
  );
}