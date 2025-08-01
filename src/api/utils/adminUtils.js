/**
 * Admin Utilities
 * Helper functions for admin data validation, transformation, and processing
 */

import { DASHBOARD_STATS_FIELDS, ANALYTICS_FIELDS, SYSTEM_SETTINGS_FIELDS } from '../services/adminService.js';

/**
 * Validation rules for system settings fields
 */
export const SYSTEM_SETTINGS_VALIDATION_RULES = {
  siteName: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  siteDescription: {
    required: true,
    minLength: 10,
    maxLength: 500
  },
  contactEmail: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  maxFileSize: {
    required: true,
    type: 'number',
    min: 1024, // 1KB
    max: 10485760 // 10MB
  },
  allowedFileTypes: {
    required: true,
    type: 'array',
    minLength: 1
  },
  emailNotifications: {
    required: true,
    type: 'boolean'
  },
  maintenanceMode: {
    required: true,
    type: 'boolean'
  }
};

/**
 * Validation rules for admin profile fields
 */
export const ADMIN_PROFILE_VALIDATION_RULES = {
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  description: {
    required: false,
    maxLength: 500
  },
  skills: {
    required: false,
    maxLength: 200
  }
};

/**
 * Validation rules for password change
 */
export const PASSWORD_VALIDATION_RULES = {
  currentPassword: {
    required: true,
    minLength: 6
  },
  newPassword: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  },
  confirmPassword: {
    required: true
  }
};

/**
 * Analytics period options
 */
export const ANALYTICS_PERIOD_OPTIONS = [
  { value: 7, label: 'Last 7 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' },
  { value: 365, label: 'Last year' }
];

/**
 * Export format options
 */
export const EXPORT_FORMAT_OPTIONS = [
  { value: 'json', label: 'JSON' },
  { value: 'csv', label: 'CSV' },
  { value: 'xlsx', label: 'Excel' }
];

/**
 * Export type options
 */
export const EXPORT_TYPE_OPTIONS = [
  { value: 'all', label: 'All Data' },
  { value: 'jobSeekers', label: 'Job Seekers' },
  { value: 'employerRequests', label: 'Employer Requests' },
  { value: 'categories', label: 'Categories' },
  { value: 'analytics', label: 'Analytics' }
];

/**
 * Log level options
 */
export const LOG_LEVEL_OPTIONS = [
  { value: 'error', label: 'Error', color: 'red' },
  { value: 'warn', label: 'Warning', color: 'orange' },
  { value: 'info', label: 'Info', color: 'blue' },
  { value: 'debug', label: 'Debug', color: 'gray' }
];

/**
 * Validate system settings data
 * @param {Object} data - Settings data to validate
 * @returns {Object} Validation result with errors and isValid flag
 */
export const validateSystemSettings = (data) => {
  const errors = {};
  let isValid = true;

  // Validate required fields
  Object.keys(SYSTEM_SETTINGS_VALIDATION_RULES).forEach(field => {
    const rule = SYSTEM_SETTINGS_VALIDATION_RULES[field];
    const value = data[field];

    if (rule.required && (value === undefined || value === null || value === '')) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      isValid = false;
    } else if (value !== undefined && value !== null && value !== '') {
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
        } else if (rule.max && numValue > rule.max) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be no more than ${rule.max}`;
          isValid = false;
        }
      }

      // Validate array type
      if (rule.type === 'array') {
        if (!Array.isArray(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be an array`;
          isValid = false;
        } else if (rule.minLength && value.length < rule.minLength) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must have at least ${rule.minLength} items`;
          isValid = false;
        }
      }

      // Validate boolean type
      if (rule.type === 'boolean') {
        if (typeof value !== 'boolean') {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be true or false`;
          isValid = false;
        }
      }
    }
  });

  return { errors, isValid };
};

/**
 * Validate admin profile data
 * @param {Object} data - Profile data to validate
 * @returns {Object} Validation result with errors and isValid flag
 */
export const validateAdminProfile = (data) => {
  const errors = {};
  let isValid = true;

  // Validate required fields
  Object.keys(ADMIN_PROFILE_VALIDATION_RULES).forEach(field => {
    const rule = ADMIN_PROFILE_VALIDATION_RULES[field];
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
    }
  });

  return { errors, isValid };
};

/**
 * Validate password change data
 * @param {Object} data - Password data to validate
 * @returns {Object} Validation result with errors and isValid flag
 */
export const validatePasswordChange = (data) => {
  const errors = {};
  let isValid = true;

  // Validate required fields
  Object.keys(PASSWORD_VALIDATION_RULES).forEach(field => {
    const rule = PASSWORD_VALIDATION_RULES[field];
    const value = data[field];

    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      isValid = false;
    } else if (value && value.trim() !== '') {
      // Validate pattern
      if (rule.pattern && !rule.pattern.test(value)) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must contain at least one uppercase letter, one lowercase letter, one number, and one special character`;
        isValid = false;
      }

      // Validate length
      if (rule.minLength && value.length < rule.minLength) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rule.minLength} characters`;
        isValid = false;
      }
    }
  });

  // Validate password confirmation
  if (data.newPassword && data.confirmPassword && data.newPassword !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
    isValid = false;
  }

  return { errors, isValid };
};

/**
 * Transform system settings data for API submission
 * @param {Object} data - Raw form data
 * @returns {Object} Transformed data ready for API
 */
export const transformSystemSettings = (data) => {
  const transformed = {};

  // Copy all valid fields
  Object.keys(SYSTEM_SETTINGS_FIELDS).forEach(field => {
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
 * Transform admin profile data for API submission
 * @param {Object} data - Raw form data
 * @returns {Object} Transformed data ready for API
 */
export const transformAdminProfile = (data) => {
  const transformed = {};

  // Copy all valid fields
  Object.keys(ADMIN_PROFILE_VALIDATION_RULES).forEach(field => {
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
 * Format dashboard statistics for display
 * @param {Object} stats - Dashboard statistics from API
 * @returns {Object} Formatted data for UI display
 */
export const formatDashboardStats = (stats) => {
  if (!stats) return null;

  return {
    ...stats,
    overview: {
      ...stats.overview,
      formattedTotalJobSeekers: stats.overview?.totalJobSeekers?.toLocaleString() || '0',
      formattedTotalEmployerRequests: stats.overview?.totalEmployerRequests?.toLocaleString() || '0',
      formattedTotalCategories: stats.overview?.totalCategories?.toLocaleString() || '0',
      formattedPendingEmployerRequests: stats.overview?.pendingEmployerRequests?.toLocaleString() || '0'
    },
    recentActivity: {
      ...stats.recentActivity,
      recentJobSeekers: stats.recentActivity?.recentJobSeekers?.map(seeker => ({
        ...seeker,
        formattedRegisteredAt: seeker.registeredAt ? new Date(seeker.registeredAt).toLocaleDateString() : ''
      })) || [],
      recentEmployerRequests: stats.recentActivity?.recentEmployerRequests?.map(request => ({
        ...request,
        formattedCreatedAt: request.createdAt ? new Date(request.createdAt).toLocaleDateString() : ''
      })) || []
    },
    distributions: {
      ...stats.distributions,
      categories: stats.distributions?.categories?.map(category => ({
        ...category,
        formattedCount: category.count?.toLocaleString() || '0'
      })) || [],
      locations: stats.distributions?.locations?.map(location => ({
        ...location,
        formattedCount: location.count?.toLocaleString() || '0'
      })) || []
    }
  };
};

/**
 * Format analytics data for display
 * @param {Object} analytics - Analytics data from API
 * @returns {Object} Formatted data for UI display
 */
export const formatAnalytics = (analytics) => {
  if (!analytics) return null;

  return {
    ...analytics,
    growth: {
      ...analytics.growth,
      jobSeekers: analytics.growth?.jobSeekers?.map(item => ({
        ...item,
        formattedDate: item.date ? new Date(item.date).toLocaleDateString() : '',
        formattedCount: item.count?.toLocaleString() || '0'
      })) || [],
      employerRequests: analytics.growth?.employerRequests?.map(item => ({
        ...item,
        formattedDate: item.date ? new Date(item.date).toLocaleDateString() : '',
        formattedCount: item.count?.toLocaleString() || '0'
      })) || []
    },
    categories: {
      ...analytics.categories,
      all: analytics.categories?.all?.map(category => ({
        ...category,
        formattedCount: category.count?.toLocaleString() || '0'
      })) || [],
      top: analytics.categories?.top?.map(category => ({
        ...category,
        formattedCount: category.count?.toLocaleString() || '0'
      })) || []
    },
    locations: analytics.locations?.map(location => ({
      ...location,
      formattedCount: location.count?.toLocaleString() || '0'
    })) || [],
    skills: analytics.skills?.map(skill => ({
      ...skill,
      formattedCount: skill.count?.toLocaleString() || '0'
    })) || []
  };
};

/**
 * Format system settings for display
 * @param {Object} settings - System settings from API
 * @returns {Object} Formatted data for UI display
 */
export const formatSystemSettings = (settings) => {
  if (!settings) return null;

  return {
    ...settings,
    formattedMaxFileSize: settings.maxFileSize ? `${(settings.maxFileSize / 1024 / 1024).toFixed(1)} MB` : '0 MB',
    formattedAllowedFileTypes: settings.allowedFileTypes?.join(', ') || '',
    formattedRateLimit: settings.rateLimit ? `${settings.rateLimit.max} requests per ${settings.rateLimit.windowMs / 1000 / 60} minutes` : 'Not set'
  };
};

/**
 * Create analytics search filters
 * @param {Object} filters - Filter parameters
 * @returns {Object} Formatted search parameters
 */
export const createAnalyticsSearchFilters = (filters = {}) => {
  const searchParams = {};

  // Basic filters
  if (filters.period) searchParams.period = filters.period;
  if (filters.startDate) searchParams.startDate = filters.startDate;
  if (filters.endDate) searchParams.endDate = filters.endDate;

  return searchParams;
};

/**
 * Create system logs search filters
 * @param {Object} filters - Filter parameters
 * @returns {Object} Formatted search parameters
 */
export const createSystemLogsSearchFilters = (filters = {}) => {
  const searchParams = {};

  // Basic filters
  if (filters.level) searchParams.level = filters.level;
  if (filters.startDate) searchParams.startDate = filters.startDate;
  if (filters.endDate) searchParams.endDate = filters.endDate;

  // Pagination
  if (filters.page) searchParams.page = filters.page;
  if (filters.limit) searchParams.limit = filters.limit;

  return searchParams;
};

/**
 * Get analytics statistics
 * @param {Object} analytics - Analytics data
 * @returns {Object} Statistics object
 */
export const getAnalyticsStatistics = (analytics) => {
  if (!analytics) return {};

  const stats = {
    totalJobSeekers: 0,
    totalEmployerRequests: 0,
    totalCategories: 0,
    totalLocations: 0,
    totalSkills: 0,
    averageGrowthRate: 0
  };

  // Calculate totals
  if (analytics.growth?.jobSeekers) {
    stats.totalJobSeekers = analytics.growth.jobSeekers.reduce((sum, item) => sum + (item.count || 0), 0);
  }

  if (analytics.growth?.employerRequests) {
    stats.totalEmployerRequests = analytics.growth.employerRequests.reduce((sum, item) => sum + (item.count || 0), 0);
  }

  if (analytics.categories?.all) {
    stats.totalCategories = analytics.categories.all.length;
  }

  if (analytics.locations) {
    stats.totalLocations = analytics.locations.length;
  }

  if (analytics.skills) {
    stats.totalSkills = analytics.skills.length;
  }

  return stats;
};

/**
 * Export analytics data to CSV
 * @param {Object} analytics - Analytics data
 * @returns {string} CSV string
 */
export const exportAnalyticsToCSV = (analytics) => {
  if (!analytics) return '';

  const csvRows = [];

  // Growth data
  if (analytics.growth?.jobSeekers) {
    csvRows.push(['Job Seekers Growth']);
    csvRows.push(['Date', 'Count']);
    analytics.growth.jobSeekers.forEach(item => {
      csvRows.push([
        item.date ? new Date(item.date).toLocaleDateString() : '',
        item.count || 0
      ]);
    });
    csvRows.push([]);
  }

  if (analytics.growth?.employerRequests) {
    csvRows.push(['Employer Requests Growth']);
    csvRows.push(['Date', 'Count']);
    analytics.growth.employerRequests.forEach(item => {
      csvRows.push([
        item.date ? new Date(item.date).toLocaleDateString() : '',
        item.count || 0
      ]);
    });
    csvRows.push([]);
  }

  // Categories data
  if (analytics.categories?.all) {
    csvRows.push(['Categories Distribution']);
    csvRows.push(['Name', 'Name (Kinyarwanda)', 'Count']);
    analytics.categories.all.forEach(category => {
      csvRows.push([
        category.name || '',
        category.nameRw || '',
        category.count || 0
      ]);
    });
    csvRows.push([]);
  }

  // Skills data
  if (analytics.skills) {
    csvRows.push(['Top Skills']);
    csvRows.push(['Skill', 'Count']);
    analytics.skills.forEach(skill => {
      csvRows.push([
        skill.skill || '',
        skill.count || 0
      ]);
    });
  }

  return csvRows.map(row => row.join(',')).join('\n');
};

/**
 * Get log level color
 * @param {string} level - Log level
 * @returns {string} Color class
 */
export const getLogLevelColor = (level) => {
  const levelOption = LOG_LEVEL_OPTIONS.find(option => option.value === level);
  return levelOption ? levelOption.color : 'gray';
};

/**
 * Format log entry for display
 * @param {Object} log - Log entry from API
 * @returns {Object} Formatted log entry for UI display
 */
export const formatLogEntry = (log) => {
  if (!log) return null;

  return {
    ...log,
    levelColor: getLogLevelColor(log.level),
    formattedTimestamp: log.timestamp ? new Date(log.timestamp).toLocaleString() : '',
    displayMessage: log.message || 'No message',
    displayLevel: log.level?.toUpperCase() || 'UNKNOWN'
  };
};

/**
 * Format log entries for display
 * @param {Array} logs - Array of log entries from API
 * @returns {Array} Formatted log entries for UI display
 */
export const formatLogEntries = (logs = []) => {
  return logs.map(log => formatLogEntry(log));
};

export default {
  SYSTEM_SETTINGS_VALIDATION_RULES,
  ADMIN_PROFILE_VALIDATION_RULES,
  PASSWORD_VALIDATION_RULES,
  ANALYTICS_PERIOD_OPTIONS,
  EXPORT_FORMAT_OPTIONS,
  EXPORT_TYPE_OPTIONS,
  LOG_LEVEL_OPTIONS,
  validateSystemSettings,
  validateAdminProfile,
  validatePasswordChange,
  transformSystemSettings,
  transformAdminProfile,
  formatDashboardStats,
  formatAnalytics,
  formatSystemSettings,
  createAnalyticsSearchFilters,
  createSystemLogsSearchFilters,
  getAnalyticsStatistics,
  exportAnalyticsToCSV,
  getLogLevelColor,
  formatLogEntry,
  formatLogEntries
}; 