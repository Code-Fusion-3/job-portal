/**
 * API Endpoints Configuration
 */

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    JOB_SEEKER_REGISTER: '/register',
    JOB_SEEKER_LOGIN: '/auth/login',
    ADMIN_LOGIN: '/auth/login',
    REFRESH_TOKEN: '/security/refresh',
  },

  // Employer Authentication & Requests
  EMPLOYER: {
    LOGIN: '/employer/auth/login',
    REGISTER: '/employer/auth/register',
    SUBMIT_REQUEST: '/employer/request', // Corrected from '/employer/requests'
    GET_REQUESTS: '/employer/requests',
    GET_REQUEST_BY_ID: (id) => `/employer/requests/${id}`,
    CHANGE_PASSWORD: '/employer/auth/change-password',
    FORGOT_PASSWORD: '/employer/auth/forgot-password',
    GET_PROFILE: '/employer/auth/profile',
    UPDATE_PROFILE: '/employer/auth/profile',
    // New endpoints
    DASHBOARD: '/employer/dashboard',
    MESSAGES: {
      GET_BY_REQUEST: (requestId) => `/messaging/request/${requestId}`,
      SEND: (requestId) => `/messaging/request/${requestId}`,
      MARK_READ: (requestId) => `/messaging/request/${requestId}/read`,
      DELETE: (messageId) => `/messaging/message/${messageId}`,
      UNREAD_COUNT: '/messaging/unread-count'
    }
  },

  // Job Seekers
  JOB_SEEKERS: {
    GET_ALL: '/job-seekers',
    GET_BY_ID: (id) => `/job-seekers/${id}`,
    CREATE: '/job-seekers',
    UPDATE: (id) => `/job-seekers/${id}`,
    DELETE: (id) => `/job-seekers/${id}`,
    GET_PUBLIC: '/job-seekers/public',
    UPLOAD_PHOTO: (id) => `/job-seekers/${id}/photo`,
  },

  // Categories
  CATEGORIES: {
    GET_ALL: '/categories',
    GET_BY_ID: (id) => `/categories/${id}`,
    CREATE: '/admin/categories',
    UPDATE: (id) => `/admin/categories/${id}`,
    DELETE: (id) => `/admin/categories/${id}`,
  },

  // Requests
  REQUESTS: {
    SUBMIT: '/requests',
    GET_ALL: '/admin/requests',
    GET_BY_ID: (id) => `/admin/requests/${id}`,
    REPLY: (id) => `/admin/requests/${id}/reply`,
    SELECT_JOB_SEEKER: (id) => `/admin/requests/${id}/select-job-seeker`,
  },

  // Messaging
  MESSAGING: {
    SEND: '/admin/messages',
    GET_CONVERSATIONS: '/admin/messages/conversations',
    GET_CONVERSATION: (id) => `/admin/messages/conversations/${id}`,
    REPLY: '/messages/reply',
  },

  // Public
  PUBLIC: {
    GET_STATS: '/public/statistics',
    GET_FILTERS: '/public/filters',
    SEARCH: '/public/search',
  },

  // Admin
  ADMIN: {
    GET_DASHBOARD: '/admin/dashboard/stats',
    GET_ANALYTICS: '/admin/analytics',
  },

  // Upload
  UPLOAD: {
    UPLOAD_FILE: '/upload/file',
    UPLOAD_IMAGE: '/upload/image',
  },
};

export const buildUrl = (endpoint, baseUrl = null) => {
  const base = baseUrl || import.meta.env.VITE_API_URL || 'localhost:3000';
  return `${base}${endpoint}`;
};

export const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) return '';
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => queryParams.append(key, item));
      } else {
        queryParams.append(key, value);
      }
    }
  });
  return queryParams.toString();
}; 