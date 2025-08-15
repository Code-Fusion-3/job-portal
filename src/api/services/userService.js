/**
 * User Service
 * Handles user profile operations and authentication state management
 */

import { apiClient } from '../client/apiClient.js';
import { handleError } from '../utils/errorHandler.js';

// User Service
export const userService = {
  /**
   * Get current user profile from backend
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/profile/me');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const apiError = handleError(error, { context: 'get_current_user' });
      return {
        success: false,
        error: apiError.userMessage,
        errorType: apiError.type
      };
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData, photo = null) => {
    try {
      let data = profileData;
      let headers = {};

      if (photo) {
        const formData = new FormData();
        Object.keys(profileData).forEach(key => {
          if (profileData[key] !== null && profileData[key] !== undefined) {
            formData.append(key, profileData[key]);
          }
        });
        formData.append('photo', photo);
        data = formData;
        headers = { 'Content-Type': 'multipart/form-data' };
      }

      const response = await apiClient.put('/profile/me', data, { headers });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const apiError = handleError(error, { context: 'update_profile' });
      return {
        success: false,
        error: apiError.userMessage,
        errorType: apiError.type
      };
    }
  },

  /**
   * Change user password
   */
  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.post('/security/change-password', passwordData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const apiError = handleError(error, { context: 'change_password' });
      return {
        success: false,
        error: apiError.userMessage,
        errorType: apiError.type
      };
    }
  },

  /**
   * Delete user account
   */
  deleteAccount: async () => {
    try {
      const response = await apiClient.delete('/profile/me');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const apiError = handleError(error, { context: 'delete_account' });
      return {
        success: false,
        error: apiError.userMessage,
        errorType: apiError.type
      };
    }
  },

  /**
   * Get user statistics
   */
  getUserStats: async () => {
    try {
      const response = await apiClient.get('/profile/stats');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const apiError = handleError(error, { context: 'get_user_stats' });
      return {
        success: false,
        error: apiError.userMessage,
        errorType: apiError.type
      };
    }
  }
}; 