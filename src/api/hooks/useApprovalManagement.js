import { useState, useCallback, useEffect, useRef } from 'react';
import { jobSeekerService } from '../services/jobSeekerService.js';
import { 
  extractProfileId, 
  validateProfileId, 
  logProfileOperation, 
  createProfileErrorMessage 
} from '../utils/profileUtils.js';

export const useApprovalManagement = (options = {}) => {
  const {
    autoFetch = false,
    initialPage = 1,
    itemsPerPage = 10
  } = options;

  // State management
  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [approvedProfiles, setApprovedProfiles] = useState([]);
  const [rejectedProfiles, setRejectedProfiles] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: itemsPerPage,
    total: 0,
    totalPages: 0
  });

    // Enhanced error handling utility
  const handleApiError = useCallback((error, context, customMessage) => {
    console.error(`💥 ${context} error:`, error);
    
    let errorMessage = customMessage || 'An unexpected error occurred';
    
    if (error?.response?.status) {
      switch (error.response.status) {
        case 401:
          errorMessage = 'Authentication failed. Please log in again.';
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = error?.response?.data?.message || errorMessage;
      }
    } else if (error?.code === 'NETWORK_ERROR') {
      errorMessage = 'Network error. Please check your connection and try again.';
    }
    
    return errorMessage;
  }, []);

  // Retry mechanism
  const retryWithBackoff = useCallback(async (operation, maxRetries = 3) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        setRetryCount(prev => prev + 1);
      }
    }
  }, []);

  // Fetch profiles by approval status with enhanced error handling
  const fetchProfilesByStatus = useCallback(async (status, page = 1, useRetry = true) => {
    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);

    const fetchOperation = async () => {
      const result = await jobSeekerService.getProfilesByStatus(status, {
        page,
        limit: itemsPerPage,
        signal: abortControllerRef.current?.signal
      });

      if (result.success) {
        const profiles = result.data || [];
        const paginationData = result.pagination || {};

        // Update the appropriate state based on status
        switch (status) {
          case 'pending':
            setPendingProfiles(profiles);
            break;
          case 'approved':
            setApprovedProfiles(profiles);
            break;
          case 'rejected':
            setRejectedProfiles(profiles);
            break;
          default:
            console.warn(`Unknown status: ${status}`);
            break;
        }

        setPagination(paginationData);
        setCurrentPage(page);
        setRetryCount(0); // Reset retry count on success

        return { success: true, data: profiles, pagination: paginationData };
      } else {
        throw new Error(result.error || 'Failed to fetch profiles');
      }
    };

    try {
      if (useRetry) {
        return await retryWithBackoff(fetchOperation);
      } else {
        return await fetchOperation();
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch operation was cancelled');
        return { success: false, error: 'Operation cancelled' };
      }
      
      const errorMessage = handleApiError(error, 'fetchProfilesByStatus', `Failed to fetch ${status} profiles`);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [itemsPerPage, handleApiError, retryWithBackoff]);

  // Approve profile with enhanced error handling and race condition prevention
  const approveProfile = useCallback(async (profileId) => {
    // Validate profile ID
    if (!validateProfileId(profileId)) {
      const error = createProfileErrorMessage('approve profile', 'Invalid profile ID provided');
      setError(error);
      return { success: false, error };
    }

    // Prevent multiple simultaneous operations on the same profile
    if (loading) {
      const error = 'Another operation is in progress. Please wait.';
      console.warn('🚫 approveProfile: Operation blocked - another operation in progress');
      return { success: false, error };
    }

    setLoading(true);
    setError(null);

    // Log operation for debugging
    logProfileOperation('approve', { id: profileId }, { hook: 'useApprovalManagement' });

    const approveOperation = async () => {
      const result = await jobSeekerService.approveJobSeeker(profileId);

      if (result.success) {
        return result;
      } else {
        throw new Error(result.error || 'Failed to approve profile');
      }
    };

    try {
      // Optimistic update - remove from pending, add to approved
      setPendingProfiles(prev => prev.filter(profile => {
        const profileIdToCheck = extractProfileId(profile);
        return profileIdToCheck !== profileId;
      }));
      
      const result = await retryWithBackoff(approveOperation);
      
      // Update approved profiles with the returned data
      if (result.data) {
        setApprovedProfiles(prev => [...prev, result.data]);
      }

      // Sequential refresh to prevent race conditions
      try {
        console.log('🔄 Refreshing data after successful approval...');
        await fetchProfilesByStatus('pending', currentPage, false);
        console.log('✅ Pending profiles refreshed successfully');
      } catch (refreshError) {
        console.warn('⚠️ Failed to refresh pending profiles after approval:', refreshError);
        // Don't fail the whole operation if refresh fails
      }

      console.log('✅ Profile approval completed successfully:', { profileId, result });
      return { 
        success: true, 
        data: result.data, 
        message: result.message || 'Profile approved successfully' 
      };
    } catch (error) {
      console.error('❌ Profile approval failed, rolling back state:', error);
      
      // Rollback optimistic updates on error - use functional updates to avoid dependency issues
      setPendingProfiles(prev => {
        const profileToRestore = prev.find(p => extractProfileId(p) === profileId);
        if (profileToRestore) {
          return [...prev, profileToRestore];
        }
        return prev;
      });
      
      setApprovedProfiles(prev => prev.filter(p => extractProfileId(p) !== profileId));
      
      const errorMessage = handleApiError(error, 'approveProfile', 'Failed to approve profile');
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchProfilesByStatus, currentPage, retryWithBackoff, handleApiError, loading]);

  // Reject profile with enhanced error handling and race condition prevention
  const rejectProfile = useCallback(async (profileId, reason) => {
    // Validate profile ID
    if (!validateProfileId(profileId)) {
      const error = createProfileErrorMessage('reject profile', 'Invalid profile ID provided');
      setError(error);
      return { success: false, error };
    }

    // Validate rejection reason
    if (!reason || typeof reason !== 'string' || reason.trim().length < 10) {
      const error = 'Rejection reason must be at least 10 characters long.';
      setError(error);
      return { success: false, error };
    }

    // Prevent multiple simultaneous operations on the same profile
    if (loading) {
      const error = 'Another operation is in progress. Please wait.';
      console.warn('🚫 rejectProfile: Operation blocked - another operation in progress');
      return { success: false, error };
    }

    setLoading(true);
    setError(null);

    // Log operation for debugging
    logProfileOperation('reject', { id: profileId, reason }, { hook: 'useApprovalManagement' });

    const rejectOperation = async () => {
      const result = await jobSeekerService.rejectJobSeeker(profileId, reason);

      if (result.success) {
        return result;
      } else {
        throw new Error(result.error || 'Failed to reject profile');
      }
    };

    try {
      // Optimistic update - remove from pending, add to rejected
      setPendingProfiles(prev => prev.filter(profile => {
        const profileIdToCheck = extractProfileId(profile);
        return profileIdToCheck !== profileId;
      }));
      
      const result = await retryWithBackoff(rejectOperation);
      
      // Update rejected profiles with the returned data
      if (result.data) {
        setRejectedProfiles(prev => [...prev, result.data]);
      }

      // Sequential refresh to prevent race conditions
      try {
        console.log('🔄 Refreshing data after successful rejection...');
        await fetchProfilesByStatus('pending', currentPage, false);
        console.log('✅ Pending profiles refreshed successfully');
      } catch (refreshError) {
        console.warn('⚠️ Failed to refresh pending profiles after rejection:', refreshError);
        // Don't fail the whole operation if refresh fails
      }

      console.log('✅ Profile rejection completed successfully:', { profileId, result });
      return { 
        success: true, 
        data: result.data, 
        message: result.message || 'Profile rejected successfully' 
      };
    } catch (error) {
      console.error('❌ Profile rejection failed, rolling back state:', error);
      
      // Rollback optimistic updates on error - use functional updates to avoid dependency issues
      setPendingProfiles(prev => {
        const profileToRestore = prev.find(p => extractProfileId(p) === profileId);
        if (profileToRestore) {
          return [...prev, profileToRestore];
        }
        return prev;
      });
      
      setRejectedProfiles(prev => prev.filter(p => extractProfileId(p) !== profileId));
      
      const errorMessage = handleApiError(error, 'rejectProfile', 'Failed to reject profile');
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchProfilesByStatus, currentPage, retryWithBackoff, handleApiError, loading]);

  // Bulk operations
  const bulkApprove = useCallback(async (profileIds) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await Promise.all(
        profileIds.map(id => jobSeekerService.approveJobSeeker(id))
      );
      
      const successful = results.filter(result => result.success);
      const failed = results.filter(result => !result.success);
      
      if (failed.length === 0) {
        // All successful
        setPendingProfiles(prev => prev.filter(profile => !profileIds.includes(profile.id)));
        setApprovedProfiles(prev => [...prev, ...successful.map(result => result.data)]);
        
        // Refresh counts
        await fetchProfilesByStatus('pending', currentPage);
        
        return { 
          success: true, 
          message: `Successfully approved ${successful.length} profiles`,
          count: successful.length
        };
      } else {
        // Some failed
        const errorMessage = `Failed to approve ${failed.length} profiles`;
        setError(errorMessage);
        return { success: false, error: errorMessage, failed };
      }
    } catch (error) {
      const errorMessage = 'An error occurred during bulk approval';
      console.error('💥 Bulk approve error:', error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchProfilesByStatus, currentPage]);

  const bulkReject = useCallback(async (profileIds, reason) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await Promise.all(
        profileIds.map(id => jobSeekerService.rejectJobSeeker(id, reason))
      );
      
      const successful = results.filter(result => result.success);
      const failed = results.filter(result => !result.success);
      
      if (failed.length === 0) {
        // All successful
        setPendingProfiles(prev => prev.filter(profile => !profileIds.includes(profile.id)));
        setRejectedProfiles(prev => [...prev, ...successful.map(result => result.data)]);
        
        // Refresh counts
        await fetchProfilesByStatus('pending', currentPage);
        
        return { 
          success: true, 
          message: `Successfully rejected ${successful.length} profiles`,
          count: successful.length
        };
      } else {
        // Some failed
        const errorMessage = `Failed to reject ${failed.length} profiles`;
        setError(errorMessage);
        return { success: false, error: errorMessage, failed };
      }
    } catch (error) {
      const errorMessage = 'An error occurred during bulk rejection';
      console.error('💥 Bulk reject error:', error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchProfilesByStatus, currentPage]);

  // Pagination controls
  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, pagination.totalPages)));
  }, [pagination.totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, pagination.totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchProfilesByStatus('pending', 1);
    }
  }, [autoFetch, fetchProfilesByStatus]);

  // Clear error when status changes
  useEffect(() => {
    setError(null);
  }, [currentPage]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // Data
    pendingProfiles,
    approvedProfiles,
    rejectedProfiles,
    
    // State
    loading,
    error,
    retryCount,
    currentPage,
    pagination,
    
    // Actions
    fetchProfilesByStatus,
    approveProfile,
    rejectProfile,
    bulkApprove,
    bulkReject,
    
    // Pagination
    goToPage,
    nextPage,
    prevPage,
    setCurrentPage,
    
    // Utilities
    hasNextPage: currentPage < pagination.totalPages,
    hasPrevPage: currentPage > 1,
    totalItems: pagination.total,
    totalPages: pagination.totalPages,
    
    // Error handling utilities
    clearError: () => setError(null),
    hasError: !!error,
    isRetrying: retryCount > 0
  };
};
