/**
 * Category Service
 * Comprehensive service for job category management operations
 */

import { apiClient } from '../client/apiClient.js';
import { handleError } from '../utils/errorHandler.js';
import { getAuthHeaders } from '../config/apiConfig.js';

/**
 * Category Data Structure
 * Matches the backend API response format
 */
export const CATEGORY_FIELDS = {
  // Required fields
  name_en: 'string', // English name
  name_rw: 'string', // Kinyarwanda name
  
  // System fields (read-only)
  id: 'number',
  createdAt: 'string',
  updatedAt: 'string',
  _count: 'object' // { profiles: number } - for admin responses
};

/**
 * Category Service
 */
export const categoryService = {
  /**
   * Get all categories (Public)
   * GET /categories
   */
  getAllCategories: async () => {
    try {
      const response = await apiClient.get('/categories');

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      const apiError = handleError(error, { context: 'get_all_categories' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Get all categories (Admin with profile counts - no pagination)
   * GET /categories/admin/all
   */
  getAllCategoriesAdmin: async (params = {}) => {
    try {
      const response = await apiClient.get('/categories/admin/all', {
        headers: getAuthHeaders()
      });

      return {
        success: true,
        data: response.data.categories,
        total: response.data.total
      };
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      const apiError = handleError(error, { context: 'get_all_categories_admin' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Get category by ID (Admin)
   * GET /categories/{id}
   */
  getCategoryById: async (id) => {
    try {
      const response = await apiClient.get(`/categories/${id}`, {
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
      
      const apiError = handleError(error, { context: 'get_category_by_id' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Create category (Admin only)
   * POST /categories
   */
  createCategory: async (categoryData) => {
    try {
      const response = await apiClient.post('/categories', categoryData, {
        headers: getAuthHeaders()
      });

      return {
        success: true,
        data: response.data.category,
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
      
      const apiError = handleError(error, { context: 'create_category' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Update category (Admin only)
   * PUT /categories/{id}
   */
  updateCategory: async (id, categoryData) => {
    try {
      const response = await apiClient.put(`/categories/${id}`, categoryData, {
        headers: getAuthHeaders()
      });

      return {
        success: true,
        data: response.data.category,
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
      
      const apiError = handleError(error, { context: 'update_category' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Delete category (Admin only)
   * DELETE /categories/{id}
   */
  deleteCategory: async (id) => {
    try {
      const response = await apiClient.delete(`/categories/${id}`, {
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
        
        // Handle category in use error
        if (data.error && data.error.includes('Cannot delete')) {
          return { 
            success: false, 
            error: data.error,
            profilesCount: data.profilesCount
          };
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
      
      const apiError = handleError(error, { context: 'delete_category' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Get category statistics (Admin)
   * This is typically part of dashboard statistics
   */
  getCategoryStatistics: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard/stats', {
        headers: getAuthHeaders()
      });

      return {
        success: true,
        data: response.data.categories || response.data.distributions?.categories || []
      };
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      const apiError = handleError(error, { context: 'get_category_statistics' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Get available filters (Public)
   * GET /public/filters
   */
  getAvailableFilters: async () => {
    try {
      const response = await apiClient.get('/public/filters');

      return {
        success: true,
        data: response.data.categories || []
      };
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      const apiError = handleError(error, { context: 'get_available_filters' });
      return { success: false, error: apiError.userMessage };
    }
  }
};

export default categoryService; 