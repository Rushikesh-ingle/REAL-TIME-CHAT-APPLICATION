import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  return (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
      isConnected 
        ? 'bg-green-100 text-green-700' 
        : 'bg-red-100 text-red-700'
    }`}>
      {isConnected ? (
        <Wifi size={14} />
      ) : (
        <WifiOff size={14} />
      )}
      <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
    </div>
  );
};