/**
 * Employer Request Utilities
 * Helper functions for employer request data validation, transformation, and processing
 */

import { REQUEST_FIELDS, MESSAGE_FIELDS } from '../services/requestService.js';

/**
 * Validation rules for employer request fields
 */
export const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s]+$/
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000
  },
  phoneNumber: {
    required: false,
    pattern: /^\+?[1-9]\d{1,14}$/
  },
  companyName: {
    required: false,
    minLength: 2,
    maxLength: 100
  },
  requestedCandidateId: {
    required: false,
    type: 'number',
    min: 1
  }
};

/**
 * Message validation rules
 */
export const MESSAGE_VALIDATION_RULES = {
  content: {
    required: true,
    minLength: 1,
    maxLength: 1000
  },
  messageType: {
    required: false,
    enum: ['text', 'file']
  }
};

/**
 * Request status options
 */
export const REQUEST_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'in_progress', label: 'In Progress', color: 'blue' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' }
];

/**
 * Request priority options
 */
export const REQUEST_PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'gray' },
  { value: 'normal', label: 'Normal', color: 'blue' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'urgent', label: 'Urgent', color: 'red' }
];

/**
 * Validate employer request data
 * @param {Object} data - Request data to validate
 * @returns {Object} Validation result with errors and isValid flag
 */
export const validateRequestData = (data) => {
  const errors = {};
  let isValid = true;

  // Validate required fields
  Object.keys(VALIDATION_RULES).forEach(field => {
    const rule = VALIDATION_RULES[field];
    const value = data[field];

    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      isValid = false;
    } else if (value && value.trim() !== '') {
      // Validate pattern
      if (rule.pattern && !rule.pattern.test(value)) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} format is invalid`;
        isValid = false;
      }

      // Validate length
      if (rule.minLength && value.length < rule.minLength) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rule.minLength} characters`;
        isValid = false;
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be no more than ${rule.maxLength} characters`;
        isValid = false;
      }

      // Validate number type
      if (rule.type === 'number') {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be a valid number`;
          isValid = false;
        } else if (rule.min && numValue < rule.min) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rule.min}`;
          isValid = false;
        }
      }
    }
  });

  return { errors, isValid };
};

/**
 * Validate message data
 * @param {Object} data - Message data to validate
 * @returns {Object} Validation result with errors and isValid flag
 */
export const validateMessageData = (data) => {
  const errors = {};
  let isValid = true;

  // Validate required fields
  Object.keys(MESSAGE_VALIDATION_RULES).forEach(field => {
    const rule = MESSAGE_VALIDATION_RULES[field];
    const value = data[field];

    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      isValid = false;
    } else if (value && value.trim() !== '') {
      // Validate length
      if (rule.minLength && value.length < rule.minLength) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rule.minLength} characters`;
        isValid = false;
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be no more than ${rule.maxLength} characters`;
        isValid = false;
      }

      // Validate enum values
      if (rule.enum && !rule.enum.includes(value)) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be one of: ${rule.enum.join(', ')}`;
        isValid = false;
      }
    }
  });

  return { errors, isValid };
};

/**
 * Transform request data for API submission
 * @param {Object} data - Raw form data
 * @returns {Object} Transformed data ready for API
 */
export const transformRequestData = (data) => {
  const transformed = {};

  // Copy all valid fields
  Object.keys(REQUEST_FIELDS).forEach(field => {
    if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
      transformed[field] = data[field];
    }
  });

  // Remove undefined values
  Object.keys(transformed).forEach(key => {
    if (transformed[key] === undefined) {
      delete transformed[key];
    }
  });

  return transformed;
};

/**
 * Transform message data for API submission
 * @param {Object} data - Raw message data
 * @returns {Object} Transformed data ready for API
 */
export const transformMessageData = (data) => {
  const transformed = {};

  // Copy all valid fields
  Object.keys(MESSAGE_FIELDS).forEach(field => {
    if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
      transformed[field] = data[field];
    }
  });

  // Remove undefined values
  Object.keys(transformed).forEach(key => {
    if (transformed[key] === undefined) {
      delete transformed[key];
    }
  });

  return transformed;
};

/**
 * Format request data for display
 * @param {Object} request - Request data from API
 * @returns {Object} Formatted data for UI display
 */
export const formatRequestForDisplay = (request) => {
  if (!request) return null;

  return {
    ...request,
    displayName: request.name || 'Unknown',
    displayEmail: request.email || 'No email',
    displayPhone: request.phoneNumber || 'No phone',
    displayCompany: request.companyName || 'No company',
    displayStatus: getStatusLabel(request.status),
    displayPriority: getPriorityLabel(request.priority),
    statusColor: getStatusColor(request.status),
    priorityColor: getPriorityColor(request.priority),
    formattedCreatedAt: request.createdAt ? new Date(request.createdAt).toLocaleDateString() : '',
    formattedUpdatedAt: request.updatedAt ? new Date(request.updatedAt).toLocaleDateString() : '',
    messageCount: request._count?.messages || request.messages?.length || 0,
    hasSelectedUser: !!request.selectedUserId,
    hasRequestedCandidate: !!request.requestedCandidateId,
    isUrgent: request.priority === 'urgent',
    isPending: request.status === 'pending',
    isCompleted: request.status === 'completed'
  };
};

/**
 * Format requests list for display
 * @param {Array} requests - Array of requests from API
 * @returns {Array} Formatted requests for UI display
 */
export const formatRequestsForDisplay = (requests = []) => {
  return requests.map(request => formatRequestForDisplay(request));
};

/**
 * Format message data for display
 * @param {Object} message - Message data from API
 * @returns {Object} Formatted message for UI display
 */
export const formatMessageForDisplay = (message) => {
  if (!message) return null;

  return {
    ...message,
    displayContent: message.content || '',
    displaySender: message.fromAdmin ? 'Admin' : 'Employer',
    senderColor: message.fromAdmin ? 'blue' : 'green',
    formattedCreatedAt: message.createdAt ? new Date(message.createdAt).toLocaleString() : '',
    isFromAdmin: message.fromAdmin,
    hasAttachment: !!message.attachmentUrl,
    messageType: message.messageType || 'text'
  };
};

/**
 * Format messages list for display
 * @param {Array} messages - Array of messages from API
 * @returns {Array} Formatted messages for UI display
 */
export const formatMessagesForDisplay = (messages = []) => {
  return messages.map(message => formatMessageForDisplay(message));
};

/**
 * Create search filters for requests
 * @param {Object} filters - Filter parameters
 * @returns {Object} Formatted search parameters
 */
export const createRequestSearchFilters = (filters = {}) => {
  const searchParams = {};

  // Basic filters
  if (filters.q) searchParams.q = filters.q;
  if (filters.status) searchParams.status = filters.status;
  if (filters.priority) searchParams.priority = filters.priority;
  if (filters.email) searchParams.email = filters.email;

  // Pagination
  if (filters.page) searchParams.page = filters.page;
  if (filters.limit) searchParams.limit = filters.limit;

  return searchParams;
};

/**
 * Get request statistics
 * @param {Array} requests - Array of requests
 * @returns {Object} Statistics object
 */
export const getRequestStatistics = (requests = []) => {
  const stats = {
    total: requests.length,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    urgent: 0,
    high: 0,
    normal: 0,
    low: 0,
    withSelectedUser: 0,
    withRequestedCandidate: 0,
    recentRequests: 0,
    averageResponseTime: 0
  };

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  requests.forEach(request => {
    // Status counts
    switch (request.status) {
      case 'pending':
        stats.pending++;
        break;
      case 'in_progress':
        stats.inProgress++;
        break;
      case 'completed':
        stats.completed++;
        break;
      case 'cancelled':
        stats.cancelled++;
        break;
    }

    // Priority counts
    switch (request.priority) {
      case 'urgent':
        stats.urgent++;
        break;
      case 'high':
        stats.high++;
        break;
      case 'normal':
        stats.normal++;
        break;
      case 'low':
        stats.low++;
        break;
    }

    // Other counts
    if (request.selectedUserId) stats.withSelectedUser++;
    if (request.requestedCandidateId) stats.withRequestedCandidate++;

    // Recent requests
    if (request.createdAt && new Date(request.createdAt) > thirtyDaysAgo) {
      stats.recentRequests++;
    }
  });

  return stats;
};

/**
 * Export request data to CSV
 * @param {Array} requests - Array of requests
 * @returns {string} CSV string
 */
export const exportRequestsToCSV = (requests = []) => {
  const headers = [
    'ID',
    'Employer Name',
    'Email',
    'Phone Number',
    'Company Name',
    'Message',
    'Status',
    'Priority',
    'Selected User ID',
    'Requested Candidate ID',
    'Message Count',
    'Created Date',
    'Last Updated'
  ];

  const csvRows = [headers.join(',')];

  requests.forEach(request => {
    const row = [
      request.id,
      `"${request.name || ''}"`,
      `"${request.email || ''}"`,
      `"${request.phoneNumber || ''}"`,
      `"${request.companyName || ''}"`,
      `"${(request.message || '').replace(/"/g, '""')}"`,
      request.status || '',
      request.priority || '',
      request.selectedUserId || '',
      request.requestedCandidateId || '',
      request._count?.messages || request.messages?.length || 0,
      `"${request.createdAt ? new Date(request.createdAt).toLocaleDateString() : ''}"`,
      `"${request.updatedAt ? new Date(request.updatedAt).toLocaleDateString() : ''}"`
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
};

/**
 * Sort requests by different criteria
 * @param {Array} requests - Array of requests
 * @param {string} sortBy - Sort criteria ('createdAt', 'status', 'priority', 'name', 'email')
 * @param {string} sortOrder - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted requests
 */
export const sortRequests = (requests = [], sortBy = 'createdAt', sortOrder = 'desc') => {
  return [...requests].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'createdAt':
        aValue = new Date(a.createdAt || 0);
        bValue = new Date(b.createdAt || 0);
        break;
      case 'status':
        aValue = a.status || '';
        bValue = b.status || '';
        break;
      case 'priority':
        aValue = a.priority || '';
        bValue = b.priority || '';
        break;
      case 'name':
        aValue = a.name || '';
        bValue = b.name || '';
        break;
      case 'email':
        aValue = a.email || '';
        bValue = b.email || '';
        break;
      default:
        aValue = new Date(a.createdAt || 0);
        bValue = new Date(b.createdAt || 0);
    }

    if (sortOrder === 'desc') {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    } else {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    }
  });
};

/**
 * Filter requests by search term
 * @param {Array} requests - Array of requests
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered requests
 */
export const filterRequests = (requests = [], searchTerm = '') => {
  if (!searchTerm.trim()) return requests;

  const term = searchTerm.toLowerCase().trim();

  return requests.filter(request => {
    const name = (request.name || '').toLowerCase();
    const email = (request.email || '').toLowerCase();
    const company = (request.companyName || '').toLowerCase();
    const message = (request.message || '').toLowerCase();

    return name.includes(term) || 
           email.includes(term) || 
           company.includes(term) || 
           message.includes(term);
  });
};

/**
 * Get status label
 * @param {string} status - Status value
 * @returns {string} Status label
 */
export const getStatusLabel = (status) => {
  const statusOption = REQUEST_STATUS_OPTIONS.find(option => option.value === status);
  return statusOption ? statusOption.label : 'Unknown';
};

/**
 * Get priority label
 * @param {string} priority - Priority value
 * @returns {string} Priority label
 */
export const getPriorityLabel = (priority) => {
  const priorityOption = REQUEST_PRIORITY_OPTIONS.find(option => option.value === priority);
  return priorityOption ? priorityOption.label : 'Unknown';
};

/**
 * Get status color
 * @param {string} status - Status value
 * @returns {string} Color class
 */
export const getStatusColor = (status) => {
  const statusOption = REQUEST_STATUS_OPTIONS.find(option => option.value === status);
  return statusOption ? statusOption.color : 'gray';
};

/**
 * Get priority color
 * @param {string} priority - Priority value
 * @returns {string} Color class
 */
export const getPriorityColor = (priority) => {
  const priorityOption = REQUEST_PRIORITY_OPTIONS.find(option => option.value === priority);
  return priorityOption ? priorityOption.color : 'gray';
};

/**
 * Find request by ID
 * @param {Array} requests - Array of requests
 * @param {number} id - Request ID
 * @returns {Object|null} Request object or null
 */
export const findRequestById = (requests = [], id) => {
  return requests.find(request => request.id === id) || null;
};

/**
 * Get requests by status
 * @param {Array} requests - Array of requests
 * @param {string} status - Status to filter by
 * @returns {Array} Filtered requests
 */
export const getRequestsByStatus = (requests = [], status) => {
  return requests.filter(request => request.status === status);
};

/**
 * Get urgent requests
 * @param {Array} requests - Array of requests
 * @returns {Array} Urgent requests
 */
export const getUrgentRequests = (requests = []) => {
  return requests.filter(request => request.priority === 'urgent');
};

/**
 * Get pending requests
 * @param {Array} requests - Array of requests
 * @returns {Array} Pending requests
 */
export const getPendingRequests = (requests = []) => {
  return requests.filter(request => request.status === 'pending');
};

export default {
  VALIDATION_RULES,
  MESSAGE_VALIDATION_RULES,
  REQUEST_STATUS_OPTIONS,
  REQUEST_PRIORITY_OPTIONS,
  validateRequestData,
  validateMessageData,
  transformRequestData,
  transformMessageData,
  formatRequestForDisplay,
  formatRequestsForDisplay,
  formatMessageForDisplay,
  formatMessagesForDisplay,
  createRequestSearchFilters,
  getRequestStatistics,
  exportRequestsToCSV,
  sortRequests,
  filterRequests,
  getStatusLabel,
  getPriorityLabel,
  getStatusColor,
  getPriorityColor,
  findRequestById,
  getRequestsByStatus,
  getUrgentRequests,
  getPendingRequests
}; 