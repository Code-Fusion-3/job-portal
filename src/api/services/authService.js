/**
 * Authentication Service
 */

import { authApi } from '../index.js';
import { handleError } from '../utils/errorHandler.js';

export const authService = {
  registerJobSeeker: async (userData, photo = null) => {
    try {
      console.log('🔍 AuthService: Starting registration with data:', userData);
      console.log('🔍 AuthService: Photo:', photo);
      
      const result = await authApi.registerJobSeeker(userData, photo);
      console.log('✅ AuthService: Registration successful:', result);
      
      return { success: true, user: result.user };
    } catch (error) {
      console.error('❌ AuthService: Registration error:', error);
      console.error('❌ AuthService: Error response:', error.response);
      console.error('❌ AuthService: Error message:', error.message);
      
      const apiError = handleError(error, { context: 'register_job_seeker' });
      console.log('🔍 AuthService: Processed error:', apiError);
      
      return { success: false, error: apiError.userMessage };
    }
  },

  loginJobSeeker: async (credentials) => {
    try {
      const result = await authApi.loginJobSeeker(credentials);
      return { success: true, user: result.user };
    } catch (error) {
      const apiError = handleError(error, { context: 'login_job_seeker' });
      return { success: false, error: apiError.userMessage };
    }
  },

  loginAdmin: async (credentials) => {
    try {
      const result = await authApi.loginAdmin(credentials);
      return { success: true, user: result.user };
    } catch (error) {
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