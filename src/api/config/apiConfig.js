/**
 * API Configuration
 * Centralized configuration for all API requests
 */

// Environment-based API configuration
const API_CONFIG = {
  // Base URLs - Updated to use the correct environment variable
  BASE_URL: import.meta.env.VITE_DEV_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000',
  
  // Timeouts (in milliseconds)
  TIMEOUT: 30000, // 30 seconds
  UPLOAD_TIMEOUT: 60000, // 60 seconds for file uploads
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  
  // Rate limiting
  RATE_LIMIT_DELAY: 1000, // 1 second between requests
  
  // Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // File upload configuration
  UPLOAD_CONFIG: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 1,
  },
  
  // Authentication
  AUTH_CONFIG: {
    tokenKey: 'job_portal_token',
    refreshTokenKey: 'job_portal_refresh_token',
    tokenExpiryKey: 'job_portal_token_expiry',
  },
  
  // Development settings
  DEBUG: import.meta.env.DEV,
  LOG_REQUESTS: import.meta.env.DEV,
  LOG_RESPONSES: import.meta.env.DEV,
};

// Environment-specific overrides
if (import.meta.env.DEV) {
  // Use VITE_DEV_API_URL as the primary source for development
  API_CONFIG.BASE_URL = import.meta.env.VITE_DEV_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000';
  API_CONFIG.TIMEOUT = 10000; // Shorter timeout for development
  API_CONFIG.LOG_REQUESTS = true;
  API_CONFIG.LOG_RESPONSES = true;
}

export default API_CONFIG;

// Helper functions
export const getAuthToken = () => {
  return localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey);
};

export const getRefreshToken = () => {
  return localStorage.getItem(API_CONFIG.AUTH_CONFIG.refreshTokenKey);
};

export const getTokenExpiry = () => {
  const expiry = localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenExpiryKey);
  return expiry ? new Date(expiry) : null;
};

export const setAuthTokens = (token, refreshToken, expiry) => {
  if (token) {
    localStorage.setItem(API_CONFIG.AUTH_CONFIG.tokenKey, token);
  }
  if (refreshToken) {
    localStorage.setItem(API_CONFIG.AUTH_CONFIG.refreshTokenKey, refreshToken);
  }
  if (expiry) {
    localStorage.setItem(API_CONFIG.AUTH_CONFIG.tokenExpiryKey, expiry);
  }
};

export const clearAuthTokens = () => {
  localStorage.removeItem(API_CONFIG.AUTH_CONFIG.tokenKey);
  localStorage.removeItem(API_CONFIG.AUTH_CONFIG.refreshTokenKey);
  localStorage.removeItem(API_CONFIG.AUTH_CONFIG.tokenExpiryKey);
};

export const isTokenExpired = () => {
  const expiry = getTokenExpiry();
  if (!expiry) {
    // If no expiry time is set, assume token is valid
    // The backend will handle token validation
    return false;
  }
  
  // Add 5 minute buffer before expiry
  const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
  return new Date().getTime() > (expiry.getTime() - bufferTime);
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  
  if (!token) {
    return {};
  }
  
  return { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}; 