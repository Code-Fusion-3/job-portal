/**
 * Employer Request Service
 * Comprehensive service for employer request management operations
 */

import { apiClient } from '../client/apiClient.js';
import { handleError } from '../utils/errorHandler.js';
import { getAuthHeaders } from '../config/apiConfig.js';

/**
 * Employer Request Data Structure
 * Matches the backend API response format
 */
export const REQUEST_FIELDS = {
  // Required fields for submission
  name: 'string', // Employer name
  email: 'string', // Employer email
  message: 'string', // Job request message
  
  // Optional fields
  phoneNumber: 'string', // Employer phone number
  companyName: 'string', // Company name
  requestedCandidateId: 'number', // Specific candidate ID if requested
  
  // System fields (read-only)
  id: 'number',
  status: 'string', // 'pending', 'in_progress', 'completed', 'cancelled'
  priority: 'string', // 'low', 'normal', 'high', 'urgent'
  createdAt: 'string',
  updatedAt: 'string',
  
  // Related data (for admin responses)
  selectedUserId: 'number',
  selectedUser: 'object', // Job seeker details
  requestedCandidate: 'object', // Requested candidate details
  messages: 'array', // Conversation messages
  _count: 'object' // { messages: number }
};

/**
 * Message Data Structure
 * For request conversations
 */
export const MESSAGE_FIELDS = {
  id: 'number',
  employerRequestId: 'number',
  fromAdmin: 'boolean',
  employerEmail: 'string',
  content: 'string',
  messageType: 'string', // 'text', 'file'
  attachmentUrl: 'string',
  createdAt: 'string'
};

/**
 * Employer Request Service
 */
export const requestService = {
  /**
   * Submit employer request (Public)
   * POST /employer/request
   */
  submitRequest: async (requestData) => {
    try {
      const response = await apiClient.post('/employer/request', requestData);

      return {
        success: true,
        data: response.data.request,
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
      
      const apiError = handleError(error, { context: 'submit_employer_request' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Get all employer requests (Admin with pagination)
   * GET /employer/requests
   */
  getAllRequests: async (params = {}) => {
    try {
      const { page = 1, limit = 10, status, priority, search, sortBy, sortOrder, category, dateFrom, dateTo, ...otherParams } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...otherParams
      });

      // Add optional filters
      if (status) queryParams.append('status', status);
      if (priority) queryParams.append('priority', priority);
      if (search) queryParams.append('search', search);
      if (sortBy) queryParams.append('sortBy', sortBy);
      if (sortOrder) queryParams.append('sortOrder', sortOrder);
      if (category) queryParams.append('category', category);
      if (dateFrom) queryParams.append('dateFrom', dateFrom);
      if (dateTo) queryParams.append('dateTo', dateTo);

      const response = await apiClient.get(`/employer/requests?${queryParams}`, {
        headers: getAuthHeaders()
      });

      return {
        success: true,
        data: {
          requests: response.data.requests || [],
          pagination: response.data.pagination || {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 0,
            totalPages: 1
          }
        }
      };
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      const apiError = handleError(error, { context: 'get_all_employer_requests' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Get specific employer request (Admin)
   * GET /employer/requests/{id}
   */
  getRequestById: async (id) => {
    try {
      const response = await apiClient.get(`/employer/requests/${id}`, {
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
      
      const apiError = handleError(error, { context: 'get_employer_request_by_id' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Reply to employer request (Admin)
   * POST /employer/requests/{id}/reply
   */
  replyToRequest: async (id, messageData) => {
    try {
      const response = await apiClient.post(`/employer/requests/${id}/reply`, messageData, {
        headers: getAuthHeaders()
      });

      return {
        success: true,
        data: response.data.messageData,
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
      
      const apiError = handleError(error, { context: 'reply_to_employer_request' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Select job seeker for request (Admin)
   * POST /employer/requests/{id}/select
   */
  selectJobSeeker: async (id, selectionData) => {
    try {
      const response = await apiClient.post(`/employer/requests/${id}/select`, selectionData, {
        headers: getAuthHeaders()
      });

      return {
        success: true,
        data: response.data.request,
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
      
      const apiError = handleError(error, { context: 'select_job_seeker_for_request' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Update request status (Admin)
   * PUT /employer/requests/{id}
   */
  updateRequestStatus: async (id, statusData) => {
    try {
      const response = await apiClient.put(`/employer/requests/${id}`, statusData, {
        headers: getAuthHeaders()
      });

      return {
        success: true,
        data: response.data.request,
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
      
      const apiError = handleError(error, { context: 'update_request_status' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Get request statistics (Admin)
   * This is typically part of dashboard statistics
   */
  getRequestStatistics: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard/stats', {
        headers: getAuthHeaders()
      });

      return {
        success: true,
        data: {
          totalRequests: response.data.overview?.totalEmployerRequests || 0,
          pendingRequests: response.data.overview?.pendingEmployerRequests || 0,
          recentRequests: response.data.recentActivity?.recentEmployerRequests || [],
          requestDistribution: response.data.distributions?.employerRequests || []
        }
      };
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      const apiError = handleError(error, { context: 'get_request_statistics' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Get public request conversation (for employers)
   * GET /public/employer/requests/{requestId}
   */
  getPublicConversation: async (requestId, email) => {
    try {
      const response = await apiClient.get(`/public/employer/requests/${requestId}`, {
        params: { email }
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
      
      const apiError = handleError(error, { context: 'get_public_conversation' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Reply to request as employer (Public)
   * POST /public/employer/requests/{requestId}/reply
   */
  replyAsEmployer: async (requestId, email, messageData) => {
    try {
      const response = await apiClient.post(`/public/employer/requests/${requestId}/reply`, {
        ...messageData,
        email
      });

      return {
        success: true,
        data: response.data.messageData,
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
      
      const apiError = handleError(error, { context: 'reply_as_employer' });
      return { success: false, error: apiError.userMessage };
    }
  }
};

export default requestService; 