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

  registerEmployer: async (employerData, logo = null) => {
    try {
      console.log('🔍 authService.registerEmployer called with:', employerData);
      const response = await authApi.registerEmployer(employerData, logo);
      console.log('🔍 authService.registerEmployer response:', response);
      
      // The response should be the data we want to return
      const result = response.data || response;
      console.log('🔍 authService.registerEmployer result:', result);
      
      // If the API returned an error response directly
      if (result && result.error) {
        return { 
          success: false, 
          error: result.error,
          details: result.details,
          status: result.status
        };
      }
      
      // If we have a success message
      if (result.message) {
        return { 
          success: true, 
          message: result.message,
          request: result.request,
          loginCredentials: result.loginCredentials
        };
      }
      
      // If we have login credentials in the response (generated password)
      if (result.loginCredentials) {
        return { 
          success: true, 
          user: result.user,
          loginCredentials: result.loginCredentials,
          request: result.request,
          message: result.message || 'Registration successful!'
        };
      }
      
      // Standard success response
      console.log('🔍 Returning standard success response');
      return { 
        success: true, 
        user: result.user || result,
        token: result.token,
        request: result.request,
        message: result.message || 'Registration successful!',
        loginCredentials: result.loginCredentials
      };
      
    } catch (error) {
      console.error('❌ authService.registerEmployer error:', error);
      
      // Handle specific backend error cases
      if (error.response?.data) {
        const { data } = error.response;
        
        // Handle validation errors with field details
        if (data.details && Array.isArray(data.details)) {
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
            'Company name already registered.',
            'Company registration number already registered.'
          ];
          
          if (fieldSpecificErrors.some(msg => data.error.includes(msg))) {
            // Convert simple error to modal format
            let field = 'email'; // default
            if (data.error.includes('Company name')) field = 'companyName';
            if (data.error.includes('registration number')) field = 'registrationNumber';
            
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
      const apiError = handleError(error, { context: 'register_employer' });
      return { 
        success: false, 
        error: apiError.userMessage || 'Failed to register employer. Please try again.'
      };
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