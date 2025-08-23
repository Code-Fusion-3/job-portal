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
          // Return backend errors in the format expected by the modal
          return { 
            success: false, 
            backendErrors: data.details,
            error: 'Validation failed. Please check the details below.'
          };
        }
        
        // Handle simple error messages - convert to modal format for specific errors
        if (data.error) {
          // Check if this is a field-specific error that should be shown in modal
          const fieldSpecificErrors = [
            'Email already registered.',
            'Phone number already registered.',
            'ID number already registered.'
          ];
          
          if (fieldSpecificErrors.includes(data.error)) {
            // Convert simple error to modal format
            let field = 'email'; // default
            if (data.error.includes('Phone')) field = 'contactnumber';
            if (data.error.includes('ID')) field = 'idnumber';
            
            return {
              success: false,
              backendErrors: [{
                field: field,
                message: data.error
              }],
              error: 'Please check the details below.'
            };
          }
          
          // For other errors, show as general error
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