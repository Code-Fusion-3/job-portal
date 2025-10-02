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
  // Request password reset (email only)
  requestPasswordReset: async ({ email }) => {
    try {
      const response = await authClient.post('/security/request-password-reset', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reset password with token
  resetPassword: async ({ token, newPassword }) => {
    try {
      const response = await authClient.post('/security/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
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

  // Employer Registration
  registerEmployer: async (employerData, logo = null) => {
    try {
      console.log('🔍 authClient.registerEmployer called with:', employerData);
      
      // Use FormData for file uploads
      const formData = new FormData();
      
      // Append all employer data to formData
      Object.keys(employerData).forEach(key => {
        if (employerData[key] !== null && employerData[key] !== undefined) {
          formData.append(key, employerData[key]);
        }
      });
      
      // Append logo if provided
      if (logo) {
        formData.append('logo', logo);
      }
      
      console.log('🔍 Sending employer registration request to /employer/auth/register');
      const response = await authClient.post('/employer/auth/register', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data' 
        },
        validateStatus: function (status) {
          // Accept all status codes to handle them in the catch block
          return true;
        }
      });
      
      console.log('🔍 Employer registration response status:', response.status);
      console.log('🔍 Employer registration response data:', response.data);
      
      // If the response is successful (2xx)
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
      
      // If there's an error in the response
      if (response.data) {
        // Create a new error object with the response data
        const error = new Error(response.data.message || 'Registration failed');
        error.response = response;
        throw error;
      }
      
      // For other errors
      throw new Error('Registration failed. Please try again.');
      
    } catch (error) {
      console.error('❌ registerEmployer error:', error);
      
      // If this is an error from the server with a response
      if (error.response) {
        // Return the error response data if available
        if (error.response.data) {
          return error.response.data;
        }
        
        // Otherwise return a structured error object
        return { 
          success: false,
          error: error.message || 'Registration failed',
          status: error.response.status
        };
      }
      
      // For other errors, rethrow them
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

  // Employer Login
  loginEmployer: async (credentials) => {
    try {
      console.log('🔍 authClient.loginEmployer called with:', credentials);
      // Don't log the password in production
      const { password, ...credentialsToLog } = credentials;
      console.log('🔍 authClient.loginEmployer called with email:', credentialsToLog.email);
      
      const response = await authClient.post('/employer/auth/login', credentials);
      console.log('🔍 authClient.loginEmployer response status:', response.status);
      
      // Check if the response indicates an error
      if (response.data.error) {
        console.error('❌ Employer login error in response:', response.data.error);
        return { 
          error: response.data.error,
          status: response.status 
        };
      }
      
      if (response.data.token) {
        console.log('🔍 Token found, setting auth tokens...');
        // Backend returns 'token' instead of 'accessToken'
        setAuthTokens(
          response.data.token,
          null, // No refresh token
          null  // No expiry time
        );
        console.log('🔍 Auth tokens set');
        return response.data;
      } else {
        console.log('🔍 No token found in response');
        return { 
          error: 'No authentication token received from server',
          status: 401
        };
      }
    } catch (error) {
      console.error('❌ loginEmployer error:', error);
      // Return a structured error object instead of throwing
      return { 
        error: error.response?.data?.message || 
              error.message || 
              'Failed to connect to the server. Please try again.',
        status: error.response?.status || 500
      };
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