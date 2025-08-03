/**
 * Custom Requests Hook
 * Provides data management for employer requests
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { requestService } from '../services/requestService.js';

export const useRequests = (options = {}) => {
  const {
    autoFetch = true,
    includeAdmin = false
  } = options;

  // State management
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch requests data
  const fetchRequests = useCallback(async () => {
    if (!includeAdmin) {
      // Public users can't fetch all requests
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await requestService.getAllRequests();
      if (result.success) {
        setRequests(result.data || []);
      } else {
        setError(result.error || 'Failed to fetch requests');
      }
    } catch (error) {
      setError('An error occurred while fetching requests');
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  }, [includeAdmin]);

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
        // Update the local state
        setRequests(prev => 
          prev.map(request => 
            request.id === id ? { ...request, ...result.data } : request
          )
        );
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
  }, [includeAdmin]);

  // Select job seeker for request (admin)
  const selectJobSeekerForRequest = useCallback(async (requestId, jobSeekerId) => {
    if (!includeAdmin) return { success: false, error: 'Unauthorized' };
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await requestService.selectJobSeekerForRequest(requestId, jobSeekerId);
      if (result.success) {
        // Update the local state
        setRequests(prev => 
          prev.map(request => 
            request.id === requestId ? { ...request, ...result.data } : request
          )
        );
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to select job seeker');
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An error occurred while selecting job seeker';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [includeAdmin]);

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
    
    // Actions
    fetchRequests,
    submitRequest,
    getRequestById,
    replyToRequest,
    selectJobSeekerForRequest,
    
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