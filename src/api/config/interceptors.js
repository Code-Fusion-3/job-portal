/**
 * API Interceptors Configuration
 */

import API_CONFIG, { getAuthToken, getRefreshToken, setAuthTokens, clearAuthTokens, isTokenExpired } from './apiConfig.js';
import { handleError, ERROR_TYPES } from '../utils/errorHandler.js';

// Request interceptor
export const requestInterceptor = (config) => {
  // Add base URL if not present
  if (!config.url.startsWith('http')) {
    config.url = `${API_CONFIG.BASE_URL}${config.url}`;
  }

  // Add default headers
  config.headers = {
    ...API_CONFIG.DEFAULT_HEADERS,
    ...config.headers,
  };

  // Add authentication token
  if (!isTokenExpired()) {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Request interceptor: Adding token for URL:', config.url);
      console.log('🔐 Token (first 20 chars):', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ Request interceptor: No token found for URL:', config.url);
    }
  } else {
    console.log('⚠️ Request interceptor: Token expired for URL:', config.url);
  }

  // Add timeout
  config.timeout = config.timeout || API_CONFIG.TIMEOUT;

  return config;
};

// Response interceptor
export const responseInterceptor = (response) => {
  return response;
};

// Error interceptor
export const errorInterceptor = async (error) => {
  const originalRequest = error.config;

  // Handle 401 Unauthorized
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        const response = await fetch(`${API_CONFIG.BASE_URL}/security/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (response.ok) {
          const data = await response.json();
          setAuthTokens(data.accessToken, data.refreshToken, data.expiresAt);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return fetch(originalRequest.url, originalRequest);
        }
      }
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
    }

    // Clear auth tokens and redirect to login
    clearAuthTokens();
    
    // Check if we're already on the login page to avoid infinite redirects
    if (window.location.pathname !== '/login') {
      window.location.href = '/login?session=expired';
    }
    
    return Promise.reject(error);
  }

  // Handle 403 Forbidden (insufficient permissions)
  if (error.response?.status === 403) {
    console.warn('Access forbidden - insufficient permissions');
    // Redirect to appropriate dashboard based on user role
    const token = getAuthToken();
    if (token) {
      try {
        // Try to decode token to get user role (basic implementation)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userRole = payload.role;
        const dashboardPath = userRole === 'admin' ? '/dashboard/admin' : '/dashboard/jobseeker';
        
        if (window.location.pathname !== dashboardPath) {
          window.location.href = dashboardPath;
        }
      } catch (decodeError) {
        console.error('Error decoding token:', decodeError);
        window.location.href = '/login';
      }
    } else {
    window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }

  // Use the new error handling system
  const context = {
    url: originalRequest?.url,
    method: originalRequest?.method,
  };

  return Promise.reject(handleError(error, context));
}; 