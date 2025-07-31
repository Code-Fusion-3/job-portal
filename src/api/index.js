/**
 * API Module Index
 * Central export point for all API-related modules
 */

// Configuration
export { default as API_CONFIG } from './config/apiConfig.js';
export { ENDPOINTS, buildUrl, buildQueryString } from './config/endpoints.js';
export { requestInterceptor, responseInterceptor, errorInterceptor } from './config/interceptors.js';

// Error Handling
export { 
  ERROR_TYPES, 
  ERROR_SEVERITY, 
  APIError, 
  classifyError, 
  logError, 
  handleError, 
  retryRequest, 
  useErrorHandler 
} from './utils/errorHandler.js';

// Clients
export { default as api, apiClient } from './client/apiClient.js';
export { default as authApi } from './client/authClient.js';
export { default as uploadApi } from './client/uploadClient.js';

// Services
export { default as authService } from './services/authService.js';

// Re-export commonly used functions
export { 
  getAuthToken, 
  getRefreshToken, 
  setAuthTokens, 
  clearAuthTokens, 
  isTokenExpired, 
  getAuthHeaders 
} from './config/apiConfig.js'; 