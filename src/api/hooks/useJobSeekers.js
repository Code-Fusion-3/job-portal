/**
 * Custom Job Seekers Hook
 * Provides data management for job seekers with frontend pagination
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { jobSeekerService } from '../services/jobSeekerService.js';

export const useJobSeekers = (options = {}) => {
  const {
    initialPage = 1,
    itemsPerPage = 10,
    autoFetch = true,
    includePrivate = false
  } = options;

  // State management
  const [jobSeekers, setJobSeekers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    gender: '',
    location: '',
    skills: '',
    experienceLevel: '',
    availability: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Fetch job seekers data
  const fetchJobSeekers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = includePrivate 
        ? await jobSeekerService.getAllJobSeekers()
        : await jobSeekerService.getPublicJobSeekers();
      
      if (result.success) {
        setJobSeekers(result.data || []);
      } else {
        setError(result.error || 'Failed to fetch job seekers');
      }
    } catch (error) {
      setError('An error occurred while fetching job seekers');
      console.error('Error fetching job seekers:', error);
    } finally {
      setLoading(false);
    }
  }, [includePrivate]);

  // Create new job seeker
  const createJobSeeker = useCallback(async (jobSeekerData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await jobSeekerService.createJobSeeker(jobSeekerData);
      if (result.success) {
        // Refresh the list after creation
        await fetchJobSeekers();
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to create job seeker');
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An error occurred while creating job seeker';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchJobSeekers]);

  // Update job seeker
  const updateJobSeeker = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await jobSeekerService.updateJobSeeker(id, updateData);
      if (result.success) {
        // Update the local state
        setJobSeekers(prev => 
          prev.map(seeker => 
            seeker.id === id ? { ...seeker, ...result.data } : seeker
          )
        );
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to update job seeker');
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An error occurred while updating job seeker';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete job seeker
  const deleteJobSeeker = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await jobSeekerService.deleteJobSeeker(id);
      if (result.success) {
        // Remove from local state
        setJobSeekers(prev => prev.filter(seeker => seeker.id !== id));
        return { success: true };
      } else {
        setError(result.error || 'Failed to delete job seeker');
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An error occurred while deleting job seeker';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and search logic
  const filteredJobSeekers = useMemo(() => {
    let filtered = [...jobSeekers];

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(seeker => 
        seeker.firstName?.toLowerCase().includes(term) ||
        seeker.lastName?.toLowerCase().includes(term) ||
        seeker.email?.toLowerCase().includes(term) ||
        seeker.skills?.toLowerCase().includes(term) ||
        seeker.location?.toLowerCase().includes(term)
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(seeker => {
          const seekerValue = seeker[key];
          if (Array.isArray(seekerValue)) {
            return seekerValue.some(item => 
              item.toLowerCase().includes(value.toLowerCase())
            );
          }
          return seekerValue?.toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [jobSeekers, searchTerm, filters, sortBy, sortOrder]);

  // Pagination logic
  const totalItems = filteredJobSeekers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobSeekers = filteredJobSeekers.slice(startIndex, endIndex);

  // Pagination controls
  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
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

  // Reset pagination when search/filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortBy, sortOrder]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchJobSeekers();
    }
  }, [fetchJobSeekers, autoFetch]);

  // Clear error when search/filters change
  useEffect(() => {
    setError(null);
  }, [searchTerm, filters]);

  return {
    // Data
    jobSeekers: paginatedJobSeekers,
    allJobSeekers: jobSeekers,
    filteredJobSeekers,
    
    // State
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    searchTerm,
    filters,
    sortBy,
    sortOrder,
    
    // Actions
    fetchJobSeekers,
    createJobSeeker,
    updateJobSeeker,
    deleteJobSeeker,
    
    // Pagination
    goToPage,
    nextPage,
    prevPage,
    setCurrentPage,
    
    // Search and filters
    setSearchTerm,
    setFilters,
    setSortBy,
    setSortOrder,
    
    // Utilities
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, totalItems)
  };
};

// Specialized hooks for different use cases
export const usePublicJobSeekers = (options = {}) => {
  return useJobSeekers({ ...options, includePrivate: false });
};

export const useAdminJobSeekers = (options = {}) => {
  return useJobSeekers({ ...options, includePrivate: true });
};

export const useJobSeekerById = (id) => {
  const [jobSeeker, setJobSeeker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobSeeker = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await jobSeekerService.getJobSeekerById(id);
      if (result.success) {
        setJobSeeker(result.data);
      } else {
        setError(result.error || 'Failed to fetch job seeker');
      }
    } catch (error) {
      setError('An error occurred while fetching job seeker');
      console.error('Error fetching job seeker:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJobSeeker();
  }, [fetchJobSeeker]);

  return {
    jobSeeker,
    loading,
    error,
    fetchJobSeeker
  };
}; 