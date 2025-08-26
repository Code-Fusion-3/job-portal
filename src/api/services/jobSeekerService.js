/**
 * Job Seeker Service
 * Comprehensive service for job seeker management operations
 */

import { apiClient } from '../client/apiClient.js';
import { handleError } from '../utils/errorHandler.js';
import { getAuthHeaders } from '../config/apiConfig.js';
import { 
  extractProfileId, 
  validateProfileId, 
  createProfileErrorMessage 
} from '../utils/profileUtils.js';

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
      
      const { page = 1, limit = 10, ...otherParams } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...otherParams
      });


      const response = await apiClient.get(`/profile/all?${queryParams}`, {
        headers: getAuthHeaders()
      });

     
      // Backend returns { users: [...], pagination: {...} }
      const result = {
        success: true,
        data: response.data.users || [],
        pagination: response.data.pagination || {}
      };
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
        data: response.data, // Return the full response data to include email
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
   * Get a single public job seeker by ID (anonymized)
   * GET /public/job-seekers/:id
   */
  getPublicJobSeekerById: async (id) => {
    try {
      const response = await apiClient.get(`/public/job-seekers/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      const apiError = handleError(error, { context: 'get_public_job_seeker_by_id' });
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
  },

  /**
   * Approve job seeker profile (Admin only)
   * PUT /profile/{id}/approve
   */
  approveJobSeeker: async (id) => {
    try {
      // Validate profile ID
      if (!validateProfileId(id)) {
        const error = createProfileErrorMessage('approve profile', 'Invalid profile ID provided');
        console.error('❌ approveJobSeeker validation error:', error);
        return { success: false, error };
      }

      const response = await apiClient.put(`/profile/${id}/approve`, {}, {
        headers: getAuthHeaders()
      });
      
      console.log('✅ Profile approved successfully:', { profileId: id, response: response.data });
      
      return {
        success: true,
        data: response.data.profile || response.data,
        message: 'Profile approved successfully'
      };
    } catch (error) {
      console.error('❌ approveJobSeeker error:', error);
      console.error('❌ Error response:', error.response);
      
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        const errorMsg = createProfileErrorMessage('approve profile', error.response.data.error);
        return { success: false, error: errorMsg };
      }
      
      const apiError = handleError(error, { context: 'approve_job_seeker' });
      const errorMsg = createProfileErrorMessage('approve profile', apiError.userMessage);
      return { success: false, error: errorMsg };
    }
  },

  /**
   * Reject job seeker profile with reason (Admin only)
   * PUT /profile/{id}/reject
   */
  rejectJobSeeker: async (id, reason) => {
    try {
      // Validate profile ID
      if (!validateProfileId(id)) {
        const error = createProfileErrorMessage('reject profile', 'Invalid profile ID provided');
        console.error('❌ rejectJobSeeker validation error:', error);
        return { success: false, error };
      }

      // Validate rejection reason
      if (!reason || typeof reason !== 'string' || reason.trim().length < 10) {
        const error = createProfileErrorMessage('reject profile', 'Rejection reason must be at least 10 characters long');
        console.error('❌ rejectJobSeeker validation error:', error);
        return { success: false, error };
      }

      const response = await apiClient.put(`/profile/${id}/reject`, { reason: reason.trim() }, {
        headers: getAuthHeaders()
      });
      
      console.log('✅ Profile rejected successfully:', { profileId: id, reason: reason.trim(), response: response.data });
      
      return {
        success: true,
        data: response.data.profile || response.data,
        message: 'Profile rejected successfully'
      };
    } catch (error) {
      console.error('❌ rejectJobSeeker error:', error);
      console.error('❌ Error response:', error.response);
      
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        const errorMsg = createProfileErrorMessage('reject profile', error.response.data.error);
        return { success: false, error: errorMsg };
      }
      
      const apiError = handleError(error, { context: 'reject_job_seeker' });
      const errorMsg = createProfileErrorMessage('reject profile', apiError.userMessage);
      return { success: false, error: errorMsg };
    }
  },

  /**
   * Get profiles by approval status (Admin only)
   * GET /profile/status/{status}
   */
  getProfilesByStatus: async (status, params = {}) => {
    try {
      // Validate status parameter
      const validStatuses = ['pending', 'approved', 'rejected'];
      if (!validStatuses.includes(status)) {
        const error = `Invalid status '${status}'. Must be one of: ${validStatuses.join(', ')}`;
        console.error('❌ getProfilesByStatus validation error:', error);
        return { success: false, error };
      }

      const { page = 1, limit = 10, ...otherParams } = params;
      
      // Validate pagination parameters
      if (page < 1 || limit < 1 || limit > 100) {
        const error = 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100';
        console.error('❌ getProfilesByStatus pagination error:', error);
        return { success: false, error };
      }
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...otherParams
      });


      const response = await apiClient.get(`/profile/status/${status}?${queryParams}`, {
        headers: getAuthHeaders()
      });
      
      const profiles = response.data.profiles || response.data || [];
      const pagination = response.data.pagination || {};
      
      // console.log(`✅ Retrieved ${profiles.length} profiles with status '${status}'`, { 
      //   status, 
      //   count: profiles.length, 
      //   pagination 
      // });
      
      return {
        success: true,
        data: profiles,
        pagination: pagination
      };
    } catch (error) {
      console.error(`❌ getProfilesByStatus error for status '${status}':`, error);
      console.error('❌ Error response:', error.response);
      
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        const errorMsg = `Failed to fetch ${status} profiles: ${error.response.data.error}`;
        return { success: false, error: errorMsg };
      }
      
      const apiError = handleError(error, { context: 'get_profiles_by_status' });
      const errorMsg = `Failed to fetch ${status} profiles: ${apiError.userMessage}`;
      return { success: false, error: errorMsg };
    }
  }
};

export default jobSeekerService; 