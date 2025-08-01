/**
 * Category Utilities
 * Helper functions for category data validation, transformation, and processing
 */

import { CATEGORY_FIELDS } from '../services/categoryService.js';

/**
 * Validation rules for category fields
 */
export const VALIDATION_RULES = {
  name_en: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-_&]+$/
  },
  name_rw: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-_&]+$/
  }
};

/**
 * Validate category data
 * @param {Object} data - Category data to validate
 * @returns {Object} Validation result with errors and isValid flag
 */
export const validateCategoryData = (data) => {
  const errors = {};
  let isValid = true;

  // Validate required fields
  Object.keys(VALIDATION_RULES).forEach(field => {
    const rule = VALIDATION_RULES[field];
    const value = data[field];

    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${field === 'name_en' ? 'English name' : 'Kinyarwanda name'} is required`;
      isValid = false;
    } else if (value && value.trim() !== '') {
      // Validate pattern
      if (rule.pattern && !rule.pattern.test(value)) {
        errors[field] = `${field === 'name_en' ? 'English name' : 'Kinyarwanda name'} contains invalid characters`;
        isValid = false;
      }

      // Validate length
      if (rule.minLength && value.length < rule.minLength) {
        errors[field] = `${field === 'name_en' ? 'English name' : 'Kinyarwanda name'} must be at least ${rule.minLength} characters`;
        isValid = false;
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        errors[field] = `${field === 'name_en' ? 'English name' : 'Kinyarwanda name'} must be no more than ${rule.maxLength} characters`;
        isValid = false;
      }
    }
  });

  return { errors, isValid };
};

/**
 * Transform category data for API submission
 * @param {Object} data - Raw form data
 * @returns {Object} Transformed data ready for API
 */
export const transformCategoryData = (data) => {
  const transformed = {};

  // Copy all valid fields
  Object.keys(CATEGORY_FIELDS).forEach(field => {
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
 * Format category data for display
 * @param {Object} category - Category data from API
 * @param {string} language - Current language ('en' or 'rw')
 * @returns {Object} Formatted data for UI display
 */
export const formatCategoryForDisplay = (category, language = 'en') => {
  if (!category) return null;

  return {
    ...category,
    displayName: language === 'rw' ? category.name_rw : category.name_en,
    displayNameEn: category.name_en,
    displayNameRw: category.name_rw,
    profileCount: category._count?.profiles || 0,
    formattedCreatedAt: category.createdAt ? new Date(category.createdAt).toLocaleDateString() : '',
    formattedUpdatedAt: category.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : '',
    isActive: category._count?.profiles > 0,
    canDelete: category._count?.profiles === 0
  };
};

/**
 * Format categories list for display
 * @param {Array} categories - Array of categories from API
 * @param {string} language - Current language ('en' or 'rw')
 * @returns {Array} Formatted categories for UI display
 */
export const formatCategoriesForDisplay = (categories = [], language = 'en') => {
  return categories.map(category => formatCategoryForDisplay(category, language));
};

/**
 * Create search filters for categories
 * @param {Object} filters - Filter parameters
 * @returns {Object} Formatted search parameters
 */
export const createCategorySearchFilters = (filters = {}) => {
  const searchParams = {};

  // Basic filters
  if (filters.q) searchParams.q = filters.q;
  if (filters.language) searchParams.language = filters.language;

  // Pagination
  if (filters.page) searchParams.page = filters.page;
  if (filters.limit) searchParams.limit = filters.limit;

  return searchParams;
};

/**
 * Get category statistics
 * @param {Array} categories - Array of categories
 * @returns {Object} Statistics object
 */
export const getCategoryStatistics = (categories = []) => {
  const stats = {
    total: categories.length,
    active: 0,
    inactive: 0,
    totalProfiles: 0,
    topCategories: [],
    recentCategories: 0
  };

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  categories.forEach(category => {
    const profileCount = category._count?.profiles || 0;
    
    // Active/inactive count
    if (profileCount > 0) {
      stats.active++;
    } else {
      stats.inactive++;
    }

    // Total profiles
    stats.totalProfiles += profileCount;

    // Recent categories
    if (category.createdAt && new Date(category.createdAt) > thirtyDaysAgo) {
      stats.recentCategories++;
    }
  });

  // Top categories by profile count
  stats.topCategories = categories
    .filter(category => category._count?.profiles > 0)
    .sort((a, b) => (b._count?.profiles || 0) - (a._count?.profiles || 0))
    .slice(0, 5)
    .map(category => ({
      id: category.id,
      name_en: category.name_en,
      name_rw: category.name_rw,
      profileCount: category._count?.profiles || 0
    }));

  return stats;
};

/**
 * Export category data to CSV
 * @param {Array} categories - Array of categories
 * @returns {string} CSV string
 */
export const exportCategoriesToCSV = (categories = []) => {
  const headers = [
    'ID',
    'English Name',
    'Kinyarwanda Name',
    'Profile Count',
    'Created Date',
    'Last Updated'
  ];

  const csvRows = [headers.join(',')];

  categories.forEach(category => {
    const row = [
      category.id,
      `"${category.name_en || ''}"`,
      `"${category.name_rw || ''}"`,
      category._count?.profiles || 0,
      `"${category.createdAt ? new Date(category.createdAt).toLocaleDateString() : ''}"`,
      `"${category.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : ''}"`
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
};

/**
 * Sort categories by different criteria
 * @param {Array} categories - Array of categories
 * @param {string} sortBy - Sort criteria ('name_en', 'name_rw', 'profileCount', 'createdAt')
 * @param {string} sortOrder - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted categories
 */
export const sortCategories = (categories = [], sortBy = 'name_en', sortOrder = 'asc') => {
  return [...categories].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'name_en':
        aValue = a.name_en || '';
        bValue = b.name_en || '';
        break;
      case 'name_rw':
        aValue = a.name_rw || '';
        bValue = b.name_rw || '';
        break;
      case 'profileCount':
        aValue = a._count?.profiles || 0;
        bValue = b._count?.profiles || 0;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt || 0);
        bValue = new Date(b.createdAt || 0);
        break;
      default:
        aValue = a.name_en || '';
        bValue = b.name_en || '';
    }

    if (sortOrder === 'desc') {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    } else {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    }
  });
};

/**
 * Filter categories by search term
 * @param {Array} categories - Array of categories
 * @param {string} searchTerm - Search term
 * @param {string} language - Language to search in ('en', 'rw', or 'both')
 * @returns {Array} Filtered categories
 */
export const filterCategories = (categories = [], searchTerm = '', language = 'both') => {
  if (!searchTerm.trim()) return categories;

  const term = searchTerm.toLowerCase().trim();

  return categories.filter(category => {
    const nameEn = (category.name_en || '').toLowerCase();
    const nameRw = (category.name_rw || '').toLowerCase();

    switch (language) {
      case 'en':
        return nameEn.includes(term);
      case 'rw':
        return nameRw.includes(term);
      case 'both':
      default:
        return nameEn.includes(term) || nameRw.includes(term);
    }
  });
};

/**
 * Get category options for select components
 * @param {Array} categories - Array of categories
 * @param {string} language - Current language ('en' or 'rw')
 * @returns {Array} Category options for select components
 */
export const getCategoryOptions = (categories = [], language = 'en') => {
  return categories.map(category => ({
    value: category.id,
    label: language === 'rw' ? category.name_rw : category.name_en,
    labelEn: category.name_en,
    labelRw: category.name_rw,
    profileCount: category._count?.profiles || 0
  }));
};

/**
 * Find category by ID
 * @param {Array} categories - Array of categories
 * @param {number} id - Category ID
 * @returns {Object|null} Category object or null
 */
export const findCategoryById = (categories = [], id) => {
  return categories.find(category => category.id === id) || null;
};

/**
 * Get category name by ID
 * @param {Array} categories - Array of categories
 * @param {number} id - Category ID
 * @param {string} language - Current language ('en' or 'rw')
 * @returns {string} Category name or 'Unknown'
 */
export const getCategoryNameById = (categories = [], id, language = 'en') => {
  const category = findCategoryById(categories, id);
  if (!category) return 'Unknown';
  
  return language === 'rw' ? category.name_rw : category.name_en;
};

export default {
  VALIDATION_RULES,
  validateCategoryData,
  transformCategoryData,
  formatCategoryForDisplay,
  formatCategoriesForDisplay,
  createCategorySearchFilters,
  getCategoryStatistics,
  exportCategoriesToCSV,
  sortCategories,
  filterCategories,
  getCategoryOptions,
  findCategoryById,
  getCategoryNameById
}; 