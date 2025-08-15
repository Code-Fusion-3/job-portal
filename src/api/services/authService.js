/**
 * Authentication Service
 */

import { authApi } from '../index.js';
import { handleError } from '../utils/errorHandler.js';

export const authService = {
  registerJobSeeker: async (userData, photo = null) => {
    try {
      const result = await authApi.registerJobSeeker(userData, photo);
      return { success: true, user: result };
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data) {
        const { data } = error.response;
        
        // Handle validation errors with field details
        if (data.details && Array.isArray(data.details)) {
          const fieldErrors = data.details
            .map(detail => `${detail.field}: ${detail.message}`)
            .join(', ');
          return { success: false, error: fieldErrors };
        }
        
        // Handle simple error messages
        if (data.error) {
          return { success: false, error: data.error };
        }
        
        // Handle generic error messages
        if (data.message) {
          return { success: false, error: data.message };
        }
      }
      
      // Fallback to error handler
      const apiError = handleError(error, { context: 'register_job_seeker' });
      return { success: false, error: apiError.userMessage };
    }
  },

  loginJobSeeker: async (credentials) => {
    try {
      const result = await authApi.loginJobSeeker(credentials);
      return { success: true, user: result.user, token: result.token };
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      const apiError = handleError(error, { context: 'login_job_seeker' });
      return { success: false, error: apiError.userMessage };
    }
  },

  loginAdmin: async (credentials) => {
    try {
      const result = await authApi.loginAdmin(credentials);
      return { success: true, user: result.user, token: result.token };
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      const apiError = handleError(error, { context: 'login_admin' });
      return { success: false, error: apiError.userMessage };
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
      return { success: true };
    } catch (error) {
      const apiError = handleError(error, { context: 'logout' });
      return { success: false, error: apiError.userMessage };
    }
  }
};

export default authService; 