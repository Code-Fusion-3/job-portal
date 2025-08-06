/**
 * Authentication Client
 */

import axios from 'axios';
import API_CONFIG, { setAuthTokens, clearAuthTokens } from '../config/apiConfig.js';

const authClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Auth methods
export const authApi = {
  // Job Seeker Registration
  registerJobSeeker: async (userData, photo = null) => {
    try {
      // Always use FormData for registration
      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        if (userData[key] !== null && userData[key] !== undefined) {
          formData.append(key, userData[key]);
        }
      });
      if (photo) {
        formData.append('photo', photo);
      }
      // Always set Content-Type to multipart/form-data (let browser set boundary)
      const response = await authClient.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Job Seeker Login
  loginJobSeeker: async (credentials) => {
    try {
      const response = await authClient.post('/auth/login', credentials);
      
      if (response.data.token) {
        // Backend returns 'token' instead of 'accessToken'
        // No refreshToken or expiresAt in the response
        setAuthTokens(
          response.data.token,
          null, // No refresh token
          null  // No expiry time
        );
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Admin Login
  loginAdmin: async (credentials) => {
    try {
      const response = await authClient.post('/auth/login', credentials);
      
      if (response.data.token) {
        // Backend returns 'token' instead of 'accessToken'
        // No refreshToken or expiresAt in the response
        setAuthTokens(
          response.data.token,
          null, // No refresh token
          null  // No expiry time
        );
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Refresh Token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem(API_CONFIG.AUTH_CONFIG.refreshTokenKey);
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authClient.post('/security/refresh', { refreshToken });
      
      if (response.data.accessToken) {
        setAuthTokens(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.expiresAt
        );
      }

      return response.data;
    } catch (error) {
      clearAuthTokens();
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      // Clear local tokens
      clearAuthTokens();
      
      // Optionally call logout endpoint if available
      // const response = await authClient.post('/auth/logout');
      // return response.data;
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
};

export default authApi; 