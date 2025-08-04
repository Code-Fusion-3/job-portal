/**
 * Job Seeker Service
 * Comprehensive service for job seeker management operations
 */

import { apiClient } from '../client/apiClient.js';
import { handleError } from '../utils/errorHandler.js';
import { getAuthHeaders } from '../config/apiConfig.js';

/**
 * Job Seeker Profile Data Structure
 * Matches the backend API response format
 */
export const JOB_SEEKER_FIELDS = {
  // Required fields
  firstName: 'string',
  lastName: 'string',
  email: 'string',
  
  // Optional profile fields
  description: 'string',
  skills: 'string',
  gender: 'string', // Male, Female, Other
  photo: 'File',
  dateOfBirth: 'string', // YYYY-MM-DD format
  idNumber: 'string', // Exactly 16 digits
  contactNumber: 'string', // Phone number
  maritalStatus: 'string', // Single, Married, Divorced, Widowed
  location: 'string', // Full address
  city: 'string',
  country: 'string',
  references: 'string',
  experience: 'string',
  jobCategoryId: 'number',
  
  // System fields (read-only)
  id: 'number',
  userId: 'number',
  createdAt: 'string',
  updatedAt: 'string',
  jobCategory: 'object' // { id, name_en, name_rw }
};

/**
 * Public Job Seeker Data Structure (Anonymized)
 */
export const PUBLIC_JOB_SEEKER_FIELDS = {
  id: 'string', // Anonymized ID (e.g., "JS0001")
  firstName: 'string', // Anonymized (e.g., "J****")
  lastName: 'string', // Anonymized (e.g., "D***")
  skills: 'string',
  experience: 'string',
  location: 'string',
  city: 'string',
  country: 'string',
  jobCategory: 'object', // { name_en, name_rw }
  memberSince: 'string'
};

/**
 * Job Seeker Service
 */
export const jobSeekerService = {
  /**
   * Get all job seekers (Admin only)
   * GET /profile/all
   */
  getAllJobSeekers: async (params = {}) => {
    try {
      console.log('🔍 getAllJobSeekers called with params:', params);
      
      const { page = 1, limit = 10, ...otherParams } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...otherParams
      });

      console.log('🔗 Making API call to:', `/profile/all?${queryParams}`);

      const response = await apiClient.get(`/profile/all?${queryParams}`, {
        headers: getAuthHeaders()
      });

      console.log('📊 Raw API response:', response);
      console.log('📊 Response data:', response.data);

      // Backend returns { users: [...], pagination: {...} }
      const result = {
        success: true,
        data: response.data.users || [],
        pagination: response.data.pagination || {}
      };
      
      console.log('✅ Processed result:', result);
      return result;
    } catch (error) {
      console.error('❌ getAllJobSeekers error:', error);
      console.error('❌ Error response:', error.response);
      
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      const apiError = handleError(error, { context: 'get_all_job_seekers' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Get job seeker by ID (Admin only)
   * GET /profile/{id}
   */
  getJobSeekerById: async (id) => {
    try {
      const response = await apiClient.get(`/profile/${id}`, {
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
      
      const apiError = handleError(error, { context: 'get_job_seeker_by_id' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Create job seeker (Admin only)
   * POST /profile
   */
  createJobSeeker: async (jobSeekerData, photo = null) => {
    try {
      let data = jobSeekerData;
      let headers = getAuthHeaders();

      if (photo) {
        const formData = new FormData();
        Object.keys(jobSeekerData).forEach(key => {
          if (jobSeekerData[key] !== null && jobSeekerData[key] !== undefined) {
            formData.append(key, jobSeekerData[key]);
          }
        });
        formData.append('photo', photo);
        data = formData;
        headers = { ...headers, 'Content-Type': 'multipart/form-data' };
      }

      const response = await apiClient.post('/profile', data, { headers });

      return {
        success: true,
        data: response.data.user,
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
      
      const apiError = handleError(error, { context: 'create_job_seeker' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Update job seeker (Admin only)
   * PUT /profile/{id}
   */
  updateJobSeeker: async (id, jobSeekerData, photo = null) => {
    try {
      let data = jobSeekerData;
      let headers = getAuthHeaders();

      if (photo) {
        const formData = new FormData();
        Object.keys(jobSeekerData).forEach(key => {
          if (jobSeekerData[key] !== null && jobSeekerData[key] !== undefined) {
            formData.append(key, jobSeekerData[key]);
          }
        });
        formData.append('photo', photo);
        data = formData;
        headers = { ...headers, 'Content-Type': 'multipart/form-data' };
      }

      const response = await apiClient.put(`/profile/${id}`, data, { headers });

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
      
      const apiError = handleError(error, { context: 'update_job_seeker' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Delete job seeker (Admin only)
   * DELETE /profile/{id}
   */
  deleteJobSeeker: async (id) => {
    try {
      const response = await apiClient.delete(`/profile/${id}`, {
        headers: getAuthHeaders()
      });

      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      const apiError = handleError(error, { context: 'delete_job_seeker' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Get public job seekers (Anonymized)
   * GET /public/job-seekers
   */
  getPublicJobSeekers: async (params = {}) => {
    try {
      const { page = 1, limit = 10, categoryId, skills, location, experience, ...otherParams } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(categoryId && { categoryId: categoryId.toString() }),
        ...(skills && { skills }),
        ...(location && { location }),
        ...(experience && { experience }),
        ...otherParams
      });

      const response = await apiClient.get(`/public/job-seekers?${queryParams}`);

      return {
        success: true,
        data: response.data.jobSeekers,
        pagination: response.data.pagination
      };
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      const apiError = handleError(error, { context: 'get_public_job_seekers' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Get my profile (Authenticated user)
   * GET /profile/me
   */
  getMyProfile: async () => {
    try {
      const response = await apiClient.get('/profile/me', {
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
      
      const apiError = handleError(error, { context: 'get_my_profile' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Update my profile (Authenticated user)
   * PUT /profile/me
   */
  updateMyProfile: async (profileData, photo = null) => {
    try {
      let data = profileData;
      let headers = getAuthHeaders();

      if (photo) {
        const formData = new FormData();
        Object.keys(profileData).forEach(key => {
          if (profileData[key] !== null && profileData[key] !== undefined) {
            formData.append(key, profileData[key]);
          }
        });
        formData.append('photo', photo);
        data = formData;
        headers = { ...headers, 'Content-Type': 'multipart/form-data' };
      }

      const response = await apiClient.put('/profile/me', data, { headers });

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
      
      const apiError = handleError(error, { context: 'update_my_profile' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Search job seekers (Admin only)
   * GET /search/job-seekers
   */
  searchJobSeekers: async (params = {}) => {
    try {
      const { q, categoryId, location, experience, skills, page = 1, limit = 10, ...otherParams } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(q && { q }),
        ...(categoryId && { categoryId: categoryId.toString() }),
        ...(location && { location }),
        ...(experience && { experience }),
        ...(skills && { skills }),
        ...otherParams
      });

      const response = await apiClient.get(`/search/job-seekers?${queryParams}`, {
        headers: getAuthHeaders()
      });

      return {
        success: true,
        data: response.data.jobSeekers,
        pagination: response.data.pagination
      };
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      const apiError = handleError(error, { context: 'search_job_seekers' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Get latest job seekers for public display
   * GET /public/job-seekers
   */
  getLatestJobSeekers: async (limit = 6) => {
    try {
      const response = await apiClient.get(`/public/job-seekers?limit=${limit}`);

      return {
        success: true,
        data: response.data.jobSeekers || [],
        pagination: response.data.pagination || {}
      };
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      const apiError = handleError(error, { context: 'get_latest_job_seekers' });
      return { success: false, error: apiError.userMessage };
    }
  }
};

export default jobSeekerService; 