import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Users, Loader2 } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

// Enhanced loading spinner with approval context
export const ApprovalSpinner = ({ 
  size = 'md', 
  text = 'Processing approval...', 
  showProgress = false,
  progress = 0,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
        {showProgress && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-blue-600">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
      
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-600 text-center`}>
          {text}
        </p>
      )}
      
      {showProgress && (
        <div className="w-32 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};

// Loading skeleton for approval queue
export const ApprovalQueueSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border border-gray-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Avatar skeleton */}
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
              
              <div className="space-y-2">
                {/* Name skeleton */}
                <div className="h-5 bg-gray-200 rounded animate-pulse w-32" />
                {/* Email skeleton */}
                <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
                {/* Details skeleton */}
                <div className="flex space-x-4">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                </div>
              </div>
            </div>
            
            {/* Action buttons skeleton */}
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
              <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Loading state for approval actions
export const ApprovalActionLoading = ({ action = 'processing', profileName = 'profile' }) => {
  const actionText = {
    approving: `Approving ${profileName}...`,
    rejecting: `Rejecting ${profileName}...`,
    processing: `Processing ${profileName}...`,
    fetching: 'Loading profiles...',
    updating: 'Updating status...'
  };

  const actionIcon = {
    approving: CheckCircle,
    rejecting: XCircle,
    processing: Clock,
    fetching: Users,
    updating: Loader2
  };

  const Icon = actionIcon[action] || Loader2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center p-8"
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="relative">
          <Icon className="w-8 h-8 text-blue-600 animate-pulse" />
          <div className="absolute inset-0 animate-ping">
            <Icon className="w-8 h-8 text-blue-600 opacity-20" />
          </div>
        </div>
        <p className="text-gray-600 font-medium">
          {actionText[action]}
        </p>
      </div>
    </motion.div>
  );
};

// Statistics cards loading skeleton
export const ApprovalStatsLoading = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
              <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Progress indicator for bulk operations
export const BulkOperationProgress = ({ 
  total, 
  completed, 
  failed = 0, 
  operation = 'processing' 
}) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const remaining = total - completed - failed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-l-blue-500"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Bulk {operation.charAt(0).toUpperCase() + operation.slice(1)} Progress
        </h3>
        <span className="text-2xl font-bold text-blue-600">
          {percentage}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div 
          className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Progress details */}
      <div className="grid grid-cols-4 gap-4 text-center text-sm">
        <div>
          <p className="font-medium text-gray-900">{total}</p>
          <p className="text-gray-500">Total</p>
        </div>
        <div>
          <p className="font-medium text-green-600">{completed}</p>
          <p className="text-gray-500">Completed</p>
        </div>
        <div>
          <p className="font-medium text-red-600">{failed}</p>
          <p className="text-gray-500">Failed</p>
        </div>
        <div>
          <p className="font-medium text-yellow-600">{remaining}</p>
          <p className="text-gray-500">Remaining</p>
        </div>
      </div>

      {completed < total && (
        <div className="mt-4 flex items-center justify-center">
          <ApprovalSpinner 
            size="sm" 
            text={`${operation} ${remaining} profiles...`}
          />
        </div>
      )}
    </motion.div>
  );
};

// Retry indicator
export const RetryIndicator = ({ retryCount, maxRetries = 3, onRetry, className = '' }) => {
  const canRetry = retryCount < maxRetries;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}
    >
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
          <Clock className="w-4 h-4 text-yellow-600" />
        </div>
        <div>
          <p className="font-medium text-yellow-800">
            {canRetry ? 'Operation failed' : 'Max retries reached'}
          </p>
          <p className="text-sm text-yellow-700">
            Retry attempt: {retryCount} of {maxRetries}
          </p>
        </div>
      </div>
      
      {canRetry && onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
        >
          Retry
        </button>
      )}
    </motion.div>
  );
};

export default {
  ApprovalSpinner,
  ApprovalQueueSkeleton,
  ApprovalActionLoading,
  ApprovalStatsLoading,
  BulkOperationProgress,
  RetryIndicator
};
