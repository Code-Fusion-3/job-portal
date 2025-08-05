/**
 * Custom Requests Hook
 * Provides data management for employer requests
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { requestService } from '../services/requestService.js';

export const useRequests = (options = {}) => {
  const {
    autoFetch = true,
    includeAdmin = false,
    itemsPerPage = 10
  } = options;

  // State management
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageInfo, setPageInfo] = useState({});

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Fetch requests data
  const fetchRequests = useCallback(async (page = currentPage, search = searchTerm, filterParams = filters, sort = { field: sortBy, order: sortOrder }) => {
    if (!includeAdmin) {
      // Public users can't fetch all requests
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const queryParams = {
        page,
        limit: itemsPerPage,
        search,
        sortBy: sort.field,
        sortOrder: sort.order,
        ...filterParams
      };

      const result = await requestService.getAllRequests(queryParams);
      if (result.success) {
        setRequests(result.data.requests || []);
        setTotalPages(result.data.pagination?.totalPages || 1);
        setTotalItems(result.data.pagination?.total || 0);
        setCurrentPage(result.data.pagination?.page || 1);
        setPageInfo(result.data.pagination || {});
      } else {
        setError(result.error || 'Failed to fetch requests');
      }
    } catch (error) {
      setError('An error occurred while fetching requests');
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  }, [includeAdmin, itemsPerPage, currentPage, searchTerm, filters, sortBy, sortOrder]);

  // Submit new request (public)
  const submitRequest = useCallback(async (requestData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await requestService.submitRequest(requestData);
      if (result.success) {
        // For public users, we don't update the list since they can't see all requests
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to submit request');
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An error occurred while submitting request';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get specific request (admin)
  const getRequestById = useCallback(async (id) => {
    if (!includeAdmin || !id) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await requestService.getRequestById(id);
      if (result.success) {
        setSelectedRequest(result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to fetch request');
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An error occurred while fetching request';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [includeAdmin]);

  // Reply to request (admin)
  const replyToRequest = useCallback(async (id, replyData) => {
    if (!includeAdmin) return { success: false, error: 'Unauthorized' };
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await requestService.replyToRequest(id, replyData);
      if (result.success) {
        // Refresh the requests list to get updated data
        await fetchRequests();
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to reply to request');
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An error occurred while replying to request';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [includeAdmin, fetchRequests]);

  // Select job seeker for request (admin)
  const selectJobSeekerForRequest = useCallback(async (requestId, jobSeekerId, detailsType = 'picture') => {
    if (!includeAdmin) return { success: false, error: 'Unauthorized' };
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await requestService.selectJobSeeker(requestId, jobSeekerId, detailsType);
      if (result.success) {
        // Refresh the requests list to get updated data
        await fetchRequests();
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to send candidate information');
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An error occurred while sending candidate information';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [includeAdmin, fetchRequests]);

  // Pagination functions
  const goToPage = useCallback((page) => {
    setCurrentPage(page);
    fetchRequests(page, searchTerm, filters, { field: sortBy, order: sortOrder });
  }, [fetchRequests, searchTerm, filters, sortBy, sortOrder]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const hasNextPage = useMemo(() => currentPage < totalPages, [currentPage, totalPages]);
  const hasPrevPage = useMemo(() => currentPage > 1, [currentPage]);

  // Search and filter functions
  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
    // Don't call fetchRequests here - let the component handle it
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
    // Don't call fetchRequests here - let the component handle it
  }, [filters]);

  const handleSortChange = useCallback((field, order) => {
    setSortBy(field);
    setSortOrder(order);
    // Don't call fetchRequests here - let the component handle it
  }, []);

  // Apply filters and search
  const applyFilters = useCallback(() => {
    fetchRequests(currentPage, searchTerm, filters, { field: sortBy, order: sortOrder });
  }, [fetchRequests, currentPage, searchTerm, filters, sortBy, sortOrder]);

  // Auto-apply filters when they change
  useEffect(() => {
    if (includeAdmin) {
      applyFilters();
    }
  }, [applyFilters, includeAdmin]);

  // Request selection
  const selectRequest = useCallback((request) => {
    setSelectedRequest(request);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRequest(null);
  }, []);

  // Filter requests by status
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      // Add any filtering logic here
      return true;
    });
  }, [requests]);

  // Auto-fetch on mount (admin only)
  useEffect(() => {
    if (autoFetch && includeAdmin) {
      fetchRequests();
    }
  }, [fetchRequests, autoFetch, includeAdmin]);

  // Clear error when selection changes
  useEffect(() => {
    setError(null);
  }, [selectedRequest]);

  return {
    // Data
    requests: filteredRequests,
    selectedRequest,
    
    // State
    loading,
    error,
    
    // Pagination
    currentPage,
    totalPages,
    totalItems,
    pageInfo,
    hasNextPage,
    hasPrevPage,
    
    // Search and filters
    searchTerm,
    filters,
    sortBy,
    sortOrder,
    
    // Actions
    fetchRequests,
    submitRequest,
    getRequestById,
    replyToRequest,
    selectJobSeekerForRequest,
    
    // Pagination actions
    goToPage,
    nextPage,
    prevPage,
    
    // Search and filter actions
    setSearchTerm: handleSearchChange,
    setFilters: handleFilterChange,
    setSortBy: (field) => handleSortChange(field, sortOrder),
    setSortOrder: (order) => handleSortChange(sortBy, order),
    applyFilters,
    
    // Selection
    selectRequest,
    clearSelection,
    
    // Utilities
    hasRequests: requests.length > 0,
    requestsCount: requests.length,
    isAdmin: includeAdmin
  };
};

// Specialized hooks for different use cases
export const usePublicRequests = (options = {}) => {
  return useRequests({ ...options, includeAdmin: false });
};

export const useAdminRequests = (options = {}) => {
  return useRequests({ ...options, includeAdmin: true });
};

export const useRequestById = (id) => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { getRequestById } = useRequests({ autoFetch: false, includeAdmin: true });

  const fetchRequest = useCallback(async () => {
    if (!id) return;
    
    const result = await getRequestById(id);
    if (result?.success) {
      setRequest(result.data);
    } else {
      setError(result?.error || 'Failed to fetch request');
    }
  }, [id, getRequestById]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  return {
    request,
    loading,
    error,
    fetchRequest
  };
}; 