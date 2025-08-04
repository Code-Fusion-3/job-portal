import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Clock, RefreshCw } from 'lucide-react';

const LiveStatusIndicator = ({ 
  isConnected, 
  lastUpdate, 
  onRefresh,
  showLastUpdate = true,
  className = ''
}) => {
  const formatTime = (date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (seconds < 60) {
      return `${seconds}s ago`;
    } else if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      {/* Connection Status */}
      <div className="flex items-center space-x-1">
        <motion.div
          animate={{ 
            scale: isConnected ? [1, 1.2, 1] : 1,
            opacity: isConnected ? 1 : 0.5
          }}
          transition={{ 
            duration: 2, 
            repeat: isConnected ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {isConnected ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}
        </motion.div>
        
        <span className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          {isConnected ? 'Live' : 'Offline'}
        </span>
      </div>

      {/* Last Update */}
      {showLastUpdate && (
        <div className="flex items-center space-x-1 text-gray-500">
          <Clock className="w-3 h-3" />
          <span className="text-xs">
            {formatTime(lastUpdate)}
          </span>
        </div>
      )}

      {/* Refresh Button */}
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          title="Refresh data"
        >
          <RefreshCw className="w-3 h-3 text-gray-500" />
        </button>
      )}
    </div>
  );
};

export default LiveStatusIndicator; 