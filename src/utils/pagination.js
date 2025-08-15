/**
 * Frontend Pagination Utilities
 * Provides comprehensive pagination functionality for client-side data management
 */

import { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * Custom hook for frontend pagination
 * @param {Array} data - The data to paginate
 * @param {Object} options - Pagination options
 * @returns {Object} Pagination state and controls
 */
export const usePagination = (data = [], options = {}) => {
  const {
    itemsPerPage = 10,
    initialPage = 1,
    initialSearchTerm = '',
    initialFilters = {},
    initialSortBy = null,
    initialSortOrder = 'asc'
  } = options;

  // State management
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);
  const [itemsPerPageState, setItemsPerPage] = useState(itemsPerPage);

  // Filter and search logic
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        // Search in all string fields
        return Object.values(item).some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(term);
          }
          if (Array.isArray(value)) {
            return value.some(v => 
              typeof v === 'string' && v.toLowerCase().includes(term)
            );
          }
          return false;
        });
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        filtered = filtered.filter(item => {
          const itemValue = item[key];
          if (Array.isArray(itemValue)) {
            return itemValue.some(v => 
              typeof v === 'string' && v.toLowerCase().includes(value.toLowerCase())
            );
          }
          if (typeof itemValue === 'string') {
            return itemValue.toLowerCase().includes(value.toLowerCase());
          }
          return itemValue === value;
        });
      }
    });

    return filtered;
  }, [data, searchTerm, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortBy) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return sortOrder === 'asc' ? comparison : -comparison;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        const comparison = aValue.getTime() - bValue.getTime();
        return sortOrder === 'asc' ? comparison : -comparison;
      }

      // Default string comparison
      const comparison = String(aValue).localeCompare(String(bValue));
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortBy, sortOrder]);

  // Pagination calculations
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPageState);
  const startIndex = (currentPage - 1) * itemsPerPageState;
  const endIndex = startIndex + itemsPerPageState;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Pagination controls
  const goToPage = useCallback((page) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  // Reset pagination when search/filters/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortBy, sortOrder]);

  // Validate current page when data changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return {
    // Data
    data: paginatedData,
    allData: data,
    filteredData,
    sortedData,
    
    // Pagination state
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage: itemsPerPageState,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, totalItems),
    
    // Search and filters
    searchTerm,
    filters,
    sortBy,
    sortOrder,
    
    // Controls
    setCurrentPage,
    goToPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    setSearchTerm,
    setFilters,
    setSortBy,
    setSortOrder,
    setItemsPerPage,
    
    // Utilities
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    hasData: totalItems > 0,
    isEmpty: totalItems === 0,
    pageInfo: {
      current: currentPage,
      total: totalPages,
      items: totalItems,
      showing: `${startIndex + 1}-${Math.min(endIndex, totalItems)} of ${totalItems}`
    }
  };
};

/**
 * Generate page numbers for pagination controls
 * @param {number} currentPage - Current page
 * @param {number} totalPages - Total number of pages
 * @param {number} maxVisible - Maximum visible page numbers
 * @returns {Array} Array of page numbers to display
 */
export const generatePageNumbers = (currentPage, totalPages, maxVisible = 5) => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const halfVisible = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - halfVisible);
  let end = Math.min(totalPages, start + maxVisible - 1);

  // Adjust start if we're near the end
  if (end === totalPages) {
    start = Math.max(1, end - maxVisible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

/**
 * Format pagination info for display
 * @param {Object} pagination - Pagination object from usePagination
 * @returns {Object} Formatted pagination info
 */
export const formatPaginationInfo = (pagination) => {
  const { currentPage, totalPages, totalItems, startIndex, endIndex } = pagination;
  
  return {
    currentPage,
    totalPages,
    totalItems,
    showing: `${startIndex}-${endIndex} of ${totalItems}`,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages
  };
};

/**
 * Create pagination controls component props
 * @param {Object} pagination - Pagination object from usePagination
 * @returns {Object} Props for pagination controls
 */
export const createPaginationControls = (pagination) => {
  const {
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    hasNextPage,
    hasPrevPage
  } = pagination;

  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  return {
    currentPage,
    totalPages,
    pageNumbers,
    goToPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    hasNextPage,
    hasPrevPage,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages
  };
};

/**
 * Search utility for filtering data
 * @param {Array} data - Data to search
 * @param {string} searchTerm - Search term
 * @param {Array} searchFields - Fields to search in
 * @returns {Array} Filtered data
 */
export const searchData = (data, searchTerm, searchFields = []) => {
  if (!searchTerm) return data;

  const term = searchTerm.toLowerCase();
  
  return data.filter(item => {
    if (searchFields.length > 0) {
      // Search in specific fields
      return searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term);
        }
        if (Array.isArray(value)) {
          return value.some(v => 
            typeof v === 'string' && v.toLowerCase().includes(term)
          );
        }
        return false;
      });
    } else {
      // Search in all string fields
      return Object.values(item).some(value => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term);
        }
        if (Array.isArray(value)) {
          return value.some(v => 
            typeof v === 'string' && v.toLowerCase().includes(term)
          );
        }
        return false;
      });
    }
  });
};

/**
 * Sort utility for sorting data
 * @param {Array} data - Data to sort
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted data
 */
export const sortData = (data, sortBy, sortOrder = 'asc') => {
  if (!sortBy) return data;

  return [...data].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    // Handle different data types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'asc' ? comparison : -comparison;
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      const comparison = aValue - bValue;
      return sortOrder === 'asc' ? comparison : -comparison;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      const comparison = aValue.getTime() - bValue.getTime();
      return sortOrder === 'asc' ? comparison : -comparison;
    }

    // Default string comparison
    const comparison = String(aValue).localeCompare(String(bValue));
    return sortOrder === 'asc' ? comparison : -comparison;
  });
}; 