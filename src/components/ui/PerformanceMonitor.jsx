import React, { useState, useEffect } from 'react';
import { Clock, Zap, Database, AlertCircle } from 'lucide-react';

const PerformanceMonitor = ({ 
  loadingTime, 
  apiCalls, 
  cacheHits, 
  errors,
  showDetails = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show monitor after 2 seconds if there are performance issues
    const timer = setTimeout(() => {
      if (loadingTime > 2000 || errors.length > 0) {
        setIsVisible(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [loadingTime, errors.length]);

  if (!isVisible) return null;

  const getPerformanceStatus = () => {
    if (loadingTime < 1000) return { status: 'excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (loadingTime < 2000) return { status: 'good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (loadingTime < 5000) return { status: 'fair', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { status: 'poor', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const performance = getPerformanceStatus();

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${performance.bg} border rounded-lg shadow-lg p-4 max-w-sm transition-all duration-300`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className={`font-semibold ${performance.color}`}>Performance Monitor</h4>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span>Load Time: <span className={performance.color}>{loadingTime}ms</span></span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-gray-500" />
          <span>API Calls: {apiCalls}</span>
        </div>
        
        {cacheHits > 0 && (
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-green-500" />
            <span>Cache Hits: {cacheHits}</span>
          </div>
        )}
        
        {errors.length > 0 && (
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>Errors: {errors.length}</span>
          </div>
        )}
      </div>

      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-600">
            <div>Status: <span className={performance.color}>{performance.status}</span></div>
            <div>Performance: {loadingTime < 1000 ? '🚀' : loadingTime < 2000 ? '⚡' : loadingTime < 5000 ? '🐌' : '🐌🐌'}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
