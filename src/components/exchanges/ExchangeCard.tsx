import React, { useState } from 'react';
import { Link2, Link2Off, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Exchange } from '../../types/exchange';
import { ConnectionStatus } from '../../types/connection';

interface ExchangeCardProps {
  exchange: Exchange;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  apiKey?: string;
  apiSecret?: string;
}

export default function ExchangeCard({ 
  exchange, 
  isConnected, 
  onConnect, 
  onDisconnect,
  apiKey,
  apiSecret
}: ExchangeCardProps) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState(false);

  const renderConnectionStatus = () => {
    if (!isConnected) return null;

    return (
      <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
        Connected
      </span>
    );
  };

  const renderCredentials = () => {
    if (!isConnected || !apiKey || !apiSecret) return null;

    const maskValue = (value: string) => 
      showSecrets ? value : `${value.slice(0, 4)}...${value.slice(-4)}`;

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Credentials</span>
          <button
            onClick={() => setShowSecrets(!showSecrets)}
            className="text-gray-500 hover:text-gray-700"
            title={showSecrets ? 'Hide credentials' : 'Show credentials'}
          >
            {showSecrets ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-gray-500">API Key: </span>
            <span className="font-mono">{maskValue(apiKey)}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">API Secret: </span>
            <span className="font-mono">{maskValue(apiSecret)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img 
            src={exchange.logo} 
            alt={exchange.name} 
            className="h-8 w-8 rounded-full"
          />
          <h3 className="ml-3 text-lg font-semibold text-gray-900">
            {exchange.name}
          </h3>
        </div>
        {renderConnectionStatus()}
      </div>

      <p className="text-gray-600 text-sm mb-6">
        {exchange.description}
      </p>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        onClick={isConnected ? onDisconnect : onConnect}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
          isConnected
            ? 'bg-red-50 text-red-600 hover:bg-red-100'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isConnected ? (
          <>
            <Link2Off className="h-4 w-4" />
            Disconnect
          </>
        ) : (
          <>
            <Link2 className="h-4 w-4" />
            Connect
          </>
        )}
      </button>

      {renderCredentials()}
    </div>
  );
}