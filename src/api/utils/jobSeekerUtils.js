/**
 * Job Seeker Utilities
 * Helper functions for job seeker data validation, transformation, and processing
 */

import { JOB_SEEKER_FIELDS, PUBLIC_JOB_SEEKER_FIELDS } from '../services/jobSeekerService.js';

/**
 * Validation rules for job seeker fields
 */
export const VALIDATION_RULES = {
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
  password: {
    required: true,
    minLength: 6,
    maxLength: 100
  },
  contactNumber: {
    pattern: /^\+?[0-9\s\-\(\)]+$/,
    maxLength: 20
  },
  idNumber: {
    pattern: /^[0-9]{16}$/,
    message: 'ID number must be exactly 16 digits'
  },
  dateOfBirth: {
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    message: 'Date must be in YYYY-MM-DD format'
  },
  photo: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    message: 'Photo must be an image file under 5MB'
  }
};

/**
 * Gender options
 */
export const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' }
];

/**
 * Marital status options
 */
export const MARITAL_STATUS_OPTIONS = [
  { value: 'Single', label: 'Single' },
  { value: 'Married', label: 'Married' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Widowed', label: 'Widowed' }
];

/**
 * Validate job seeker data
 * @param {Object} data - Job seeker data to validate
 * @param {boolean} isRegistration - Whether this is for registration (stricter validation)
 * @returns {Object} Validation result with errors and isValid flag
 */
export const validateJobSeekerData = (data, isRegistration = false) => {
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
        errors[field] = rule.message || `${field.charAt(0).toUpperCase() + field.slice(1)} format is invalid`;
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

  // Special validation for registration
  if (isRegistration) {
    if (!data.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
  }

  return { errors, isValid };
};

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @returns {Object} Validation result
 */
export const validateFileUpload = (file) => {
  const errors = {};
  let isValid = true;

  if (!file) {
    return { errors, isValid };
  }

  // Check file type
  if (!VALIDATION_RULES.photo.allowedTypes.includes(file.type)) {
    errors.photo = 'Only image files (JPEG, PNG, WebP) are allowed';
    isValid = false;
  }

  // Check file size
  if (file.size > VALIDATION_RULES.photo.maxSize) {
    errors.photo = 'File size must be less than 5MB';
    isValid = false;
  }

  return { errors, isValid };
};

/**
 * Transform job seeker data for API submission
 * @param {Object} data - Raw form data
 * @returns {Object} Transformed data ready for API
 */
export const transformJobSeekerData = (data) => {
  const transformed = {};

  // Copy all valid fields
  Object.keys(JOB_SEEKER_FIELDS).forEach(field => {
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
 * Format job seeker data for display
 * @param {Object} jobSeeker - Job seeker data from API
 * @returns {Object} Formatted data for UI display
 */
export const formatJobSeekerForDisplay = (jobSeeker) => {
  if (!jobSeeker) return null;

  return {
    ...jobSeeker,
    fullName: `${jobSeeker.firstName || ''} ${jobSeeker.lastName || ''}`.trim(),
    displaySkills: jobSeeker.skills ? jobSeeker.skills.split(',').map(skill => skill.trim()) : [],
    formattedDateOfBirth: jobSeeker.dateOfBirth ? new Date(jobSeeker.dateOfBirth).toLocaleDateString() : '',
    formattedContactNumber: jobSeeker.contactNumber || 'Not provided',
    formattedLocation: jobSeeker.location || 'Not specified',
    hasPhoto: !!jobSeeker.photo,
    photoUrl: jobSeeker.photo ? `${import.meta.env.VITE_API_URL}/${jobSeeker.photo}` : null,
    memberSince: jobSeeker.createdAt ? new Date(jobSeeker.createdAt).toLocaleDateString() : '',
    lastUpdated: jobSeeker.updatedAt ? new Date(jobSeeker.updatedAt).toLocaleDateString() : ''
  };
};

/**
 * Format public job seeker data (anonymized)
 * @param {Object} publicJobSeeker - Public job seeker data from API
 * @returns {Object} Formatted data for public display
 */
export const formatPublicJobSeekerForDisplay = (publicJobSeeker) => {
  if (!publicJobSeeker) return null;

  return {
    ...publicJobSeeker,
    displaySkills: publicJobSeeker.skills ? publicJobSeeker.skills.split(',').map(skill => skill.trim()) : [],
    formattedLocation: publicJobSeeker.location || 'Not specified',
    memberSince: publicJobSeeker.memberSince ? new Date(publicJobSeeker.memberSince).toLocaleDateString() : '',
    categoryName: publicJobSeeker.jobCategory?.name_en || 'Uncategorized'
  };
};

/**
 * Create search filters for job seekers
 * @param {Object} filters - Filter parameters
 * @returns {Object} Formatted search parameters
 */
export const createJobSeekerSearchFilters = (filters = {}) => {
  const searchParams = {};

  // Basic filters
  if (filters.q) searchParams.q = filters.q;
  if (filters.categoryId) searchParams.categoryId = filters.categoryId;
  if (filters.location) searchParams.location = filters.location;
  if (filters.experience) searchParams.experience = filters.experience;
  if (filters.skills) searchParams.skills = filters.skills;

  // Pagination
  if (filters.page) searchParams.page = filters.page;
  if (filters.limit) searchParams.limit = filters.limit;

  return searchParams;
};

/**
 * Get job seeker statistics
 * @param {Array} jobSeekers - Array of job seekers
 * @returns {Object} Statistics object
 */
export const getJobSeekerStatistics = (jobSeekers = []) => {
  const stats = {
    total: jobSeekers.length,
    byGender: {},
    byLocation: {},
    byCategory: {},
    byExperience: {},
    recentRegistrations: 0
  };

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  jobSeekers.forEach(jobSeeker => {
    // Gender statistics
    const gender = jobSeeker.gender || 'Not specified';
    stats.byGender[gender] = (stats.byGender[gender] || 0) + 1;

    // Location statistics
    const location = jobSeeker.city || jobSeeker.location || 'Not specified';
    stats.byLocation[location] = (stats.byLocation[location] || 0) + 1;

    // Category statistics
    const category = jobSeeker.jobCategory?.name_en || 'Uncategorized';
    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;

    // Experience statistics
    const experience = jobSeeker.experience || 'Not specified';
    stats.byExperience[experience] = (stats.byExperience[experience] || 0) + 1;

    // Recent registrations
    if (jobSeeker.createdAt && new Date(jobSeeker.createdAt) > thirtyDaysAgo) {
      stats.recentRegistrations++;
    }
  });

  return stats;
};

/**
 * Export job seeker data to CSV
 * @param {Array} jobSeekers - Array of job seekers
 * @returns {string} CSV string
 */
export const exportJobSeekersToCSV = (jobSeekers = []) => {
  const headers = [
    'ID',
    'First Name',
    'Last Name',
    'Email',
    'Contact Number',
    'Gender',
    'Location',
    'Skills',
    'Experience',
    'Category',
    'Registration Date'
  ];

  const csvRows = [headers.join(',')];

  jobSeekers.forEach(jobSeeker => {
    const row = [
      jobSeeker.id,
      `"${jobSeeker.firstName || ''}"`,
      `"${jobSeeker.lastName || ''}"`,
      `"${jobSeeker.email || ''}"`,
      `"${jobSeeker.contactNumber || ''}"`,
      `"${jobSeeker.gender || ''}"`,
      `"${jobSeeker.location || ''}"`,
      `"${jobSeeker.skills || ''}"`,
      `"${jobSeeker.experience || ''}"`,
      `"${jobSeeker.jobCategory?.name_en || ''}"`,
      `"${jobSeeker.createdAt ? new Date(jobSeeker.createdAt).toLocaleDateString() : ''}"`
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
};

export default {
  VALIDATION_RULES,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  validateJobSeekerData,
  validateFileUpload,
  transformJobSeekerData,
  formatJobSeekerForDisplay,
  formatPublicJobSeekerForDisplay,
  createJobSeekerSearchFilters,
  getJobSeekerStatistics,
  exportJobSeekersToCSV
}; 