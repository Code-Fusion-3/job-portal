/**
 * API Configuration
 * Centralized configuration for all API requests
 */

// Environment-based API configuration
const API_CONFIG = {
  // Base URLs
  BASE_URL: import.meta.env.VITE_API_URL || 'https://job-portal-backend-cfk4.onrender.com',
  
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

// Debug logging
console.log('🔍 API Config:', {
  BASE_URL: API_CONFIG.BASE_URL,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_DEV_API_URL: import.meta.env.VITE_DEV_API_URL,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD
});

// Environment-specific overrides
if (import.meta.env.DEV) {
  API_CONFIG.BASE_URL = import.meta.env.VITE_DEV_API_URL || API_CONFIG.BASE_URL;
  API_CONFIG.TIMEOUT = 10000; // Shorter timeout for development
}

// Production overrides
if (import.meta.env.PROD) {
  API_CONFIG.LOG_REQUESTS = false;
  API_CONFIG.LOG_RESPONSES = false;
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
  localStorage.setItem(API_CONFIG.AUTH_CONFIG.tokenKey, token);
  localStorage.setItem(API_CONFIG.AUTH_CONFIG.refreshTokenKey, refreshToken);
  localStorage.setItem(API_CONFIG.AUTH_CONFIG.tokenExpiryKey, expiry);
};

export const clearAuthTokens = () => {
  localStorage.removeItem(API_CONFIG.AUTH_CONFIG.tokenKey);
  localStorage.removeItem(API_CONFIG.AUTH_CONFIG.refreshTokenKey);
  localStorage.removeItem(API_CONFIG.AUTH_CONFIG.tokenExpiryKey);
};

export const isTokenExpired = () => {
  const expiry = getTokenExpiry();
  if (!expiry) return true;
  
  // Add 5 minute buffer before expiry
  const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
  return new Date().getTime() > (expiry.getTime() - bufferTime);
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}; 