/**
 * Admin Service
 * Comprehensive service for admin dashboard and system management operations
 */

import { apiClient } from '../client/apiClient.js';
import { handleError } from '../utils/errorHandler.js';
import { getAuthHeaders } from '../config/apiConfig.js';

/**
 * Dashboard Statistics Data Structure
 * Matches the backend API response format
 */
export const DASHBOARD_STATS_FIELDS = {
  overview: {
    totalJobSeekers: 'number',
    totalEmployerRequests: 'number',
    totalCategories: 'number',
    pendingEmployerRequests: 'number'
  },
  recentActivity: {
    recentJobSeekers: 'array',
    recentEmployerRequests: 'array'
  },
  distributions: {
    categories: 'array',
    locations: 'array'
  },
  trends: {
    monthlyRegistrations: 'object',
    topSkills: 'array'
  }
};

/**
 * Analytics Data Structure
 * Matches the backend API response format
 */
export const ANALYTICS_FIELDS = {
  period: 'string',
  growth: {
    jobSeekers: 'array',
    employerRequests: 'array'
  },
  categories: {
    all: 'array',
    top: 'array'
  },
  locations: 'array',
  skills: 'array'
};

/**
 * System Settings Data Structure
 * Matches the backend API response format
 */
export const SYSTEM_SETTINGS_FIELDS = {
  siteName: 'string',
  siteDescription: 'string',
  contactEmail: 'string',
  maxFileSize: 'number',
  allowedFileTypes: 'array',
  emailNotifications: 'boolean',
  maintenanceMode: 'boolean',
  rateLimit: {
    windowMs: 'number',
    max: 'number'
  }
};

/**
 * Admin Service
 */
export const adminService = {
  /**
   * Get dashboard statistics (Admin)
   * GET /dashboard/stats
   */
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get('/dashboard/stats', {
        headers: getAuthHeaders()
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      const apiError = handleError(error, { context: 'get_dashboard_stats' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Get analytics (Admin)
   * GET /dashboard/analytics
   */
  getAnalytics: async (params = {}) => {
    try {
      const { period = 30, ...otherParams } = params;
      
      const queryParams = new URLSearchParams({
        period: period.toString(),
        ...otherParams
      });

      const response = await apiClient.get(`/dashboard/analytics?${queryParams}`, {
        headers: getAuthHeaders()
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      const apiError = handleError(error, { context: 'get_analytics' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Get system settings (Admin)
   * GET /settings
   */
  getSystemSettings: async () => {
    try {
      const response = await apiClient.get('/settings', {
        headers: getAuthHeaders()
      });

      return {
        success: true,
        data: response.data.settings
      };
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      const apiError = handleError(error, { context: 'get_system_settings' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Update system settings (Admin)
   * PUT /settings
   */
  updateSystemSettings: async (settingsData) => {
    try {
      const response = await apiClient.put('/settings', settingsData, {
        headers: getAuthHeaders()
      });

      return {
        success: true,
        data: response.data.settings,
        message: response.data.message
      };
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
      
      const apiError = handleError(error, { context: 'update_system_settings' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Get admin profile (Admin)
   * GET /admin/profile
   */
  getAdminProfile: async () => {
    try {
      const response = await apiClient.get('/admin/profile', {
        headers: getAuthHeaders()
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      const apiError = handleError(error, { context: 'get_admin_profile' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Update admin profile (Admin)
   * PUT /admin/profile
   */
  updateAdminProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/admin/profile', profileData, {
        headers: getAuthHeaders()
      });

      return {
        success: true,
        data: response.data.profile,
        message: response.data.message
      };
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
      
      const apiError = handleError(error, { context: 'update_admin_profile' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Change admin password (Admin)
   * PUT /admin/password
   */
  changeAdminPassword: async (passwordData) => {
    try {
      const response = await apiClient.put('/admin/password', passwordData, {
        headers: getAuthHeaders()
      });

      return {
        success: true,
        message: response.data.message
      };
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
      
      const apiError = handleError(error, { context: 'change_admin_password' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Get system health status (Admin)
   * GET /admin/health
   */
  getSystemHealth: async () => {
    try {
      const response = await apiClient.get('/admin/health', {
        headers: getAuthHeaders()
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      const apiError = handleError(error, { context: 'get_system_health' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Get system logs (Admin)
   * GET /admin/logs
   */
  getSystemLogs: async (params = {}) => {
    try {
      const { page = 1, limit = 50, level, startDate, endDate, ...otherParams } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...otherParams
      });

      // Add optional filters
      if (level) queryParams.append('level', level);
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const response = await apiClient.get(`/admin/logs?${queryParams}`, {
        headers: getAuthHeaders()
      });

      return {
        success: true,
        data: response.data.logs,
        pagination: response.data.pagination
      };
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      const apiError = handleError(error, { context: 'get_system_logs' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Export system data (Admin)
   * GET /admin/export
   */
  exportSystemData: async (params = {}) => {
    try {
      const { type = 'all', format = 'pdf', startDate, endDate, ...otherParams } = params;
      
      const queryParams = new URLSearchParams({
        type,
        format,
        ...otherParams
      });

      // Add optional date filters
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const response = await apiClient.get(`/admin/export?${queryParams}`, {
        headers: getAuthHeaders(),
        responseType: format === 'pdf' ? 'arraybuffer' : 'text' // Use arraybuffer for PDF
      });

      return {
        success: true,
        data: response.data,
        filename: response.headers['content-disposition']?.split('filename=')[1] || `export-${type}-${new Date().toISOString().split('T')[0]}.${format}`
      };
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      const apiError = handleError(error, { context: 'export_system_data' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Get platform statistics (Admin)
   * GET /admin/platform-stats
   */
  getPlatformStats: async () => {
    try {
      const response = await apiClient.get('/admin/platform-stats', {
        headers: getAuthHeaders()
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      const apiError = handleError(error, { context: 'get_platform_stats' });
      return { success: false, error: apiError.userMessage };
    }
  }
};

export default adminService; 