/**
 * Authentication Client
 */

import axios from 'axios';
import API_CONFIG from '../config/apiConfig.js';

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
      let data = userData;
      let headers = {};

      if (photo) {
        const formData = new FormData();
        Object.keys(userData).forEach(key => {
          if (userData[key] !== null && userData[key] !== undefined) {
            formData.append(key, userData[key]);
          }
        });
        formData.append('photo', photo);
        data = formData;
        headers = { 'Content-Type': 'multipart/form-data' };
      }

      const response = await authClient.post('/register', data, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Job Seeker Login
  loginJobSeeker: async (credentials) => {
    try {
      const response = await authClient.post('/login', credentials);
      
      if (response.data.accessToken) {
        localStorage.setItem(API_CONFIG.AUTH_CONFIG.tokenKey, response.data.accessToken);
        localStorage.setItem(API_CONFIG.AUTH_CONFIG.refreshTokenKey, response.data.refreshToken);
        localStorage.setItem(API_CONFIG.AUTH_CONFIG.tokenExpiryKey, response.data.expiresAt);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Admin Login
  loginAdmin: async (credentials) => {
    try {
      const response = await authClient.post('/login', credentials);
      
      if (response.data.accessToken) {
        localStorage.setItem(API_CONFIG.AUTH_CONFIG.tokenKey, response.data.accessToken);
        localStorage.setItem(API_CONFIG.AUTH_CONFIG.refreshTokenKey, response.data.refreshToken);
        localStorage.setItem(API_CONFIG.AUTH_CONFIG.tokenExpiryKey, response.data.expiresAt);
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
        localStorage.setItem(API_CONFIG.AUTH_CONFIG.tokenKey, response.data.accessToken);
        localStorage.setItem(API_CONFIG.AUTH_CONFIG.refreshTokenKey, response.data.refreshToken);
        localStorage.setItem(API_CONFIG.AUTH_CONFIG.tokenExpiryKey, response.data.expiresAt);
      }

      return response.data;
    } catch (error) {
      localStorage.removeItem(API_CONFIG.AUTH_CONFIG.tokenKey);
      localStorage.removeItem(API_CONFIG.AUTH_CONFIG.refreshTokenKey);
      localStorage.removeItem(API_CONFIG.AUTH_CONFIG.tokenExpiryKey);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      // Clear local tokens
      localStorage.removeItem(API_CONFIG.AUTH_CONFIG.tokenKey);
      localStorage.removeItem(API_CONFIG.AUTH_CONFIG.refreshTokenKey);
      localStorage.removeItem(API_CONFIG.AUTH_CONFIG.tokenExpiryKey);
      
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