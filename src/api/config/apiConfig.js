/**
 * API Configuration
 * Centralized configuration for all API requests
 */

// Environment-based API configuration
const API_CONFIG = {
  // Base URLs - Updated to use the correct environment variable
  BASE_URL: import.meta.env.VITE_DEV_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000',
  
  // Timeouts (in milliseconds) - Optimized for better UX
  TIMEOUT: 15000, // Reduced from 30s to 15s for better responsiveness
  UPLOAD_TIMEOUT: 30000, // Reduced from 60s to 30s for file uploads
  
  // Retry configuration - Optimized for performance
  MAX_RETRIES: 2, // Reduced from 3 to 2 for faster failure detection
  RETRY_DELAY: 500, // Reduced from 1s to 500ms for faster retries
  
  // Rate limiting - Optimized for better performance
  RATE_LIMIT_DELAY: 500, // Reduced from 1s to 500ms between requests
  
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
  API_CONFIG.TIMEOUT = 15000; // Increased from 8s to 15s for development to handle complex queries
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
  
  // Add 3 minute buffer before expiry (reduced from 5 minutes)
  const bufferTime = 3 * 60 * 1000; // 3 minutes in milliseconds
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