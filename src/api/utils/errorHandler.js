/**
 * Error Handler Utilities
 * Comprehensive error handling for API requests
 */

import API_CONFIG from '../config/apiConfig.js';

// Error types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  AUTHENTICATION: 'AUTH_ERROR',
  AUTHORIZATION: 'FORBIDDEN_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  SERVER: 'SERVER_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  UPLOAD: 'UPLOAD_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// Error message templates
const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: {
    title: 'Connection Error',
    message: 'Unable to connect to the server. Please check your internet connection and try again.',
    severity: ERROR_SEVERITY.HIGH,
  },
  [ERROR_TYPES.AUTHENTICATION]: {
    title: 'Authentication Error',
    message: 'Your session has expired. Please log in again.',
    severity: ERROR_SEVERITY.MEDIUM,
  },
  [ERROR_TYPES.AUTHORIZATION]: {
    title: 'Access Denied',
    message: 'You do not have permission to perform this action.',
    severity: ERROR_SEVERITY.MEDIUM,
  },
  [ERROR_TYPES.VALIDATION]: {
    title: 'Invalid Data',
    message: 'Please check your input and try again.',
    severity: ERROR_SEVERITY.LOW,
  },
  [ERROR_TYPES.NOT_FOUND]: {
    title: 'Not Found',
    message: 'The requested resource was not found.',
    severity: ERROR_SEVERITY.LOW,
  },
  [ERROR_TYPES.SERVER]: {
    title: 'Server Error',
    message: 'Something went wrong on our end. Please try again later.',
    severity: ERROR_SEVERITY.HIGH,
  },
  [ERROR_TYPES.RATE_LIMIT]: {
    title: 'Too Many Requests',
    message: 'You are making too many requests. Please wait a moment and try again.',
    severity: ERROR_SEVERITY.MEDIUM,
  },
  [ERROR_TYPES.TIMEOUT]: {
    title: 'Request Timeout',
    message: 'The request took too long to complete. Please try again.',
    severity: ERROR_SEVERITY.MEDIUM,
  },
  [ERROR_TYPES.UPLOAD]: {
    title: 'Upload Error',
    message: 'Failed to upload file. Please check the file size and format.',
    severity: ERROR_SEVERITY.MEDIUM,
  },
  [ERROR_TYPES.UNKNOWN]: {
    title: 'Unexpected Error',
    message: 'An unexpected error occurred. Please try again.',
    severity: ERROR_SEVERITY.HIGH,
  },
};

// Custom error class
export class APIError extends Error {
  constructor(type, message, status, data = null, originalError = null) {
    super(message);
    this.name = 'APIError';
    this.type = type;
    this.status = status;
    this.data = data;
    this.originalError = originalError;
    this.timestamp = new Date();
    this.severity = ERROR_MESSAGES[type]?.severity || ERROR_SEVERITY.MEDIUM;
  }

  get userMessage() {
    return ERROR_MESSAGES[this.type]?.message || this.message;
  }

  get userTitle() {
    return ERROR_MESSAGES[this.type]?.title || 'Error';
  }

  toJSON() {
    return {
      type: this.type,
      message: this.message,
      userMessage: this.userMessage,
      userTitle: this.userTitle,
      status: this.status,
      severity: this.severity,
      timestamp: this.timestamp,
      data: this.data,
    };
  }
}

// Error classifier
export const classifyError = (error) => {
  // Network errors
  if (!error.response) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return new APIError(ERROR_TYPES.TIMEOUT, 'Request timeout', null, null, error);
    }
    return new APIError(ERROR_TYPES.NETWORK, 'Network error', null, null, error);
  }

  const { status, data } = error.response;

  // HTTP status code classification
  switch (status) {
    case 400:
      return new APIError(
        ERROR_TYPES.VALIDATION,
        data?.message || 'Bad request',
        status,
        data,
        error
      );
    case 401:
      return new APIError(
        ERROR_TYPES.AUTHENTICATION,
        data?.message || 'Unauthorized',
        status,
        data,
        error
      );
    case 403:
      return new APIError(
        ERROR_TYPES.AUTHORIZATION,
        data?.message || 'Forbidden',
        status,
        data,
        error
      );
    case 404:
      return new APIError(
        ERROR_TYPES.NOT_FOUND,
        data?.message || 'Not found',
        status,
        data,
        error
      );
    case 429:
      return new APIError(
        ERROR_TYPES.RATE_LIMIT,
        data?.message || 'Too many requests',
        status,
        data,
        error
      );
    case 500:
    case 502:
    case 503:
    case 504:
      return new APIError(
        ERROR_TYPES.SERVER,
        data?.message || 'Server error',
        status,
        data,
        error
      );
    default:
      return new APIError(
        ERROR_TYPES.UNKNOWN,
        data?.message || 'Unknown error',
        status,
        data,
        error
      );
  }
};

// Error logger
export const logError = (error, context = {}) => {
  const errorInfo = {
    type: error.type || ERROR_TYPES.UNKNOWN,
    message: error.message,
    status: error.status,
    url: context.url,
    method: context.method,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    ...context,
  };

  // Log to console in development
  if (API_CONFIG.DEBUG) {
    console.error('🚨 API Error:', errorInfo);
    if (error.originalError) {
      console.error('Original error:', error.originalError);
    }
  }

  // TODO: Send to error tracking service in production
  // if (API_CONFIG.PROD) {
  //   // Send to Sentry, LogRocket, etc.
  // }

  return errorInfo;
};

// Error handler
export const handleError = (error, context = {}) => {
  const apiError = error instanceof APIError ? error : classifyError(error);
  
  // Log the error
  logError(apiError, context);

  // Handle specific error types
  switch (apiError.type) {
    case ERROR_TYPES.AUTHENTICATION:
      // Clear tokens and redirect to login
      localStorage.removeItem(API_CONFIG.AUTH_CONFIG.tokenKey);
      localStorage.removeItem(API_CONFIG.AUTH_CONFIG.refreshTokenKey);
      localStorage.removeItem(API_CONFIG.AUTH_CONFIG.tokenExpiryKey);
      
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      break;

    case ERROR_TYPES.RATE_LIMIT:
      // Show rate limit message
      console.warn('Rate limit exceeded, retrying in 5 seconds...');
      break;

    case ERROR_TYPES.NETWORK:
      // Show offline indicator
      console.warn('Network error detected');
      break;
  }

  return apiError;
};

// Retry mechanism
export const retryRequest = async (requestFn, maxRetries = API_CONFIG.MAX_RETRIES, delay = API_CONFIG.RETRY_DELAY) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry certain errors
      if (error.type === ERROR_TYPES.AUTHENTICATION || 
          error.type === ERROR_TYPES.AUTHORIZATION || 
          error.type === ERROR_TYPES.VALIDATION) {
        throw error;
      }

      // Wait before retrying
      if (attempt < maxRetries) {
        const waitTime = delay * Math.pow(2, attempt - 1); // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
};

// Error boundary hook
export const useErrorHandler = () => {
  const handleApiError = (error, context = {}) => {
    return handleError(error, context);
  };

  const isNetworkError = (error) => {
    return error.type === ERROR_TYPES.NETWORK;
  };

  const isAuthError = (error) => {
    return error.type === ERROR_TYPES.AUTHENTICATION;
  };

  const isValidationError = (error) => {
    return error.type === ERROR_TYPES.VALIDATION;
  };

  return {
    handleApiError,
    isNetworkError,
    isAuthError,
    isValidationError,
  };
};

// Export error types and utilities
export default {
  ERROR_TYPES,
  ERROR_SEVERITY,
  APIError,
  classifyError,
  logError,
  handleError,
  retryRequest,
  useErrorHandler,
}; 