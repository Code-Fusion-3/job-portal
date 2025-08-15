/**
 * Loading Spinner Component
 * Provides consistent loading states throughout the application
 */

import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'red', 
  text = 'Loading...',
  className = '',
  showText = true
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    red: 'border-red-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    gray: 'border-gray-500',
    white: 'border-white'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
        aria-label="Loading"
      />
      {showText && text && (
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};

// Skeleton loading component
export const SkeletonLoader = ({ 
  lines = 3, 
  className = '',
  height = 'h-4'
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse bg-gray-200 rounded ${height} ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

// Card skeleton loader
export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="animate-pulse bg-gray-200 rounded-full w-12 h-12" />
        <div className="flex-1">
          <div className="animate-pulse bg-gray-200 rounded h-4 w-3/4 mb-2" />
          <div className="animate-pulse bg-gray-200 rounded h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="animate-pulse bg-gray-200 rounded h-3 w-full" />
        <div className="animate-pulse bg-gray-200 rounded h-3 w-5/6" />
        <div className="animate-pulse bg-gray-200 rounded h-3 w-4/6" />
      </div>
    </div>
  );
};

// Table skeleton loader
export const TableSkeleton = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gray-50 px-6 py-3 border-b">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-200 rounded h-4 flex-1"
            />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="animate-pulse bg-gray-200 rounded h-3 flex-1"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner; 