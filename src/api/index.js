/**
 * API Module Index
 * Central export point for all API-related modules
 */

// Export all API configurations
export { default as API_CONFIG, getAuthToken, getRefreshToken, setAuthTokens, clearAuthTokens, isTokenExpired, getAuthHeaders } from './config/apiConfig.js';
export * from './config/endpoints.js';
export * from './config/interceptors.js';

// Export API clients
export { default as apiClient } from './client/apiClient.js';
export { default as authApi } from './client/authClient.js';
export { default as uploadClient } from './client/uploadClient.js';

// Export services
export { authService } from './services/authService.js';
export { userService } from './services/userService.js';
export { jobSeekerService } from './services/jobSeekerService.js';
export { categoryService } from './services/categoryService.js';
export { requestService } from './services/requestService.js';
export { adminService } from './services/adminService.js';

// Export utilities
export * from './utils/errorHandler.js';
export { default as jobSeekerUtils } from './utils/jobSeekerUtils.js';
export { default as categoryUtils } from './utils/categoryUtils.js';
export { default as requestUtils } from './utils/requestUtils.js';
export { default as adminUtils } from './utils/adminUtils.js';

// Export hooks
export * from './hooks/useAuth.js'; 