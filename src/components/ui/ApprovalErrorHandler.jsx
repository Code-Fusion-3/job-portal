import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  XCircle, 
  CheckCircle, 
  RefreshCw, 
  Info,
  X,
  AlertCircle
} from 'lucide-react';
import Button from './Button';

const ApprovalErrorHandler = ({
  error = null,
  onRetry = null,
  onDismiss = null,
  onManualRefresh = null,
  showDetails = false,
  className = '',
  ...props
}) => {
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  if (!error) return null;

  // Parse error to determine type and severity
  const parseError = (errorMessage) => {
    const message = errorMessage?.toLowerCase() || '';
    
    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return { type: 'network', severity: 'warning', icon: AlertTriangle };
    }
    
    if (message.includes('unauthorized') || message.includes('forbidden') || message.includes('permission')) {
      return { type: 'permission', severity: 'error', icon: XCircle };
    }
    
    if (message.includes('validation') || message.includes('invalid')) {
      return { type: 'validation', severity: 'warning', icon: Info };
    }
    
    if (message.includes('server') || message.includes('internal')) {
      return { type: 'server', severity: 'error', icon: AlertCircle };
    }
    
    return { type: 'general', severity: 'error', icon: XCircle };
  };

  const errorInfo = parseError(error);
  const IconComponent = errorInfo.icon;

  const getErrorTitle = () => {
    const titles = {
      network: 'Connection Issue',
      permission: 'Access Denied',
      validation: 'Validation Error',
      server: 'Server Error',
      general: 'Operation Failed'
    };
    return titles[errorInfo.type] || 'Error Occurred';
  };

  const getErrorDescription = () => {
    const descriptions = {
      network: 'Unable to connect to the server. Please check your internet connection.',
      permission: 'You don\'t have permission to perform this action.',
      validation: 'The provided data is invalid. Please check your input.',
      server: 'A server error occurred. Please try again later.',
      general: 'An unexpected error occurred while processing your request.'
    };
    return descriptions[errorInfo.type] || 'Something went wrong. Please try again.';
  };

  const getRecoveryActions = () => {
    const actions = [];
    
    if (errorInfo.type === 'network' || errorInfo.type === 'server') {
      if (onRetry) {
        actions.push({
          label: 'Retry',
          action: 'retry',
          variant: 'primary',
          icon: RefreshCw
        });
      }
      if (onManualRefresh) {
        actions.push({
          label: 'Refresh Page',
          action: 'refresh',
          variant: 'outline',
          icon: RefreshCw
        });
      }
    }
    
    if (errorInfo.type === 'validation') {
      actions.push({
        label: 'Review Input',
        action: 'review',
        variant: 'outline',
        icon: Info
      });
    }
    
    actions.push({
      label: 'Dismiss',
      action: 'dismiss',
      variant: 'ghost',
      icon: X
    });
    
    return actions;
  };

  const handleAction = async (action) => {
    switch (action) {
      case 'retry':
        if (onRetry) {
          setIsRetrying(true);
          try {
            await onRetry();
          } finally {
            setIsRetrying(false);
          }
        }
        break;
      case 'refresh':
        if (onManualRefresh) {
          onManualRefresh();
        } else {
          window.location.reload();
        }
        break;
      case 'review':
        setShowFullDetails(!showFullDetails);
        break;
      case 'dismiss':
        if (onDismiss) {
          onDismiss();
        }
        break;
      default:
        break;
    }
  };

  const recoveryActions = getRecoveryActions();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`bg-white border rounded-lg shadow-lg overflow-hidden ${className}`}
        {...props}
      >
        {/* Header */}
        <div className={`px-4 py-3 border-b ${
          errorInfo.severity === 'error' ? 'border-red-200 bg-red-50' :
          errorInfo.severity === 'warning' ? 'border-yellow-200 bg-yellow-50' :
          'border-blue-200 bg-blue-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                errorInfo.severity === 'error' ? 'bg-red-100' :
                errorInfo.severity === 'warning' ? 'bg-yellow-100' :
                'bg-blue-100'
              }`}>
                <IconComponent className={`w-4 h-4 ${
                  errorInfo.severity === 'error' ? 'text-red-600' :
                  errorInfo.severity === 'warning' ? 'text-yellow-600' :
                  'text-blue-600'
                }`} />
              </div>
              <div>
                <h3 className={`font-semibold ${
                  errorInfo.severity === 'error' ? 'text-red-800' :
                  errorInfo.severity === 'warning' ? 'text-yellow-800' :
                  'text-blue-800'
                }`}>
                  {getErrorTitle()}
                </h3>
                <p className={`text-sm ${
                  errorInfo.severity === 'error' ? 'text-red-600' :
                  errorInfo.severity === 'warning' ? 'text-yellow-600' :
                  'text-blue-600'
                }`}>
                  {getErrorDescription()}
                </p>
              </div>
            </div>
            
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAction('dismiss')}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Error Message */}
          <div className="mb-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              {error}
            </p>
          </div>

          {/* Recovery Actions */}
          <div className="flex flex-wrap gap-2">
            {recoveryActions.map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <Button
                  key={index}
                  variant={action.variant}
                  size="sm"
                  onClick={() => handleAction(action.action)}
                  disabled={action.action === 'retry' && isRetrying}
                  className="flex items-center gap-2"
                >
                  {action.action === 'retry' && isRetrying ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <ActionIcon className="w-4 h-4" />
                  )}
                  {action.action === 'retry' && isRetrying ? 'Retrying...' : action.label}
                </Button>
              );
            })}
          </div>

          {/* Detailed Error Information */}
          {showDetails && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowFullDetails(!showFullDetails)}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <Info className="w-4 h-4" />
                {showFullDetails ? 'Hide' : 'Show'} Technical Details
              </button>
              
              {showFullDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-xs text-gray-600 space-y-2">
                    <div>
                      <strong>Error Type:</strong> {errorInfo.type}
                    </div>
                    <div>
                      <strong>Severity:</strong> {errorInfo.severity}
                    </div>
                    <div>
                      <strong>Timestamp:</strong> {new Date().toLocaleString()}
                    </div>
                    {error.stack && (
                      <div>
                        <strong>Stack Trace:</strong>
                        <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ApprovalErrorHandler;
