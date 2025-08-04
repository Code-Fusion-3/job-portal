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
      console.log('🔍 Fetching job seekers...');
      
      const result = includePrivate 
        ? await jobSeekerService.getAllJobSeekers()
        : await jobSeekerService.getPublicJobSeekers();
      
      console.log('📊 API Response:', result);
      
      if (result.success) {
        console.log('✅ Job seekers data:', result.data);
        setJobSeekers(result.data || []);
      } else {
        console.error('❌ API Error:', result.error);
        setError(result.error || 'Failed to fetch job seekers');
      }
    } catch (error) {
      console.error('💥 Fetch error:', error);
      setError('An error occurred while fetching job seekers');
    } finally {
      setLoading(false);
    }
  }, [includePrivate]);

  // Create new job seeker
  const createJobSeeker = useCallback(async (jobSeekerData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('➕ Creating job seeker:', jobSeekerData);
      const result = await jobSeekerService.createJobSeeker(jobSeekerData);
      if (result.success) {
        console.log('✅ Job seeker created:', result.data);
        // Refresh the list after creation
        await fetchJobSeekers();
        return { success: true, data: result.data };
      } else {
        console.error('❌ Create error:', result.error);
        setError(result.error || 'Failed to create job seeker');
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An error occurred while creating job seeker';
      console.error('💥 Create error:', error);
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
      console.log('✏️ Updating job seeker:', id, updateData);
      const result = await jobSeekerService.updateJobSeeker(id, updateData);
      if (result.success) {
        console.log('✅ Job seeker updated:', result.data);
        // Update the local state
        setJobSeekers(prev => 
          prev.map(seeker => 
            seeker.id === id ? { ...seeker, ...result.data } : seeker
          )
        );
        return { success: true, data: result.data };
      } else {
        console.error('❌ Update error:', result.error);
        setError(result.error || 'Failed to update job seeker');
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An error occurred while updating job seeker';
      console.error('💥 Update error:', error);
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
      console.log('🗑️ Deleting job seeker:', id);
      const result = await jobSeekerService.deleteJobSeeker(id);
      if (result.success) {
        console.log('✅ Job seeker deleted');
        // Remove from local state
        setJobSeekers(prev => prev.filter(seeker => seeker.id !== id));
        return { success: true };
      } else {
        console.error('❌ Delete error:', result.error);
        setError(result.error || 'Failed to delete job seeker');
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An error occurred while deleting job seeker';
      console.error('💥 Delete error:', error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and search logic
  const filteredJobSeekers = useMemo(() => {
    console.log('🔍 Filtering job seekers...');
    console.log('📊 Raw job seekers:', jobSeekers);
    
    let filtered = [...jobSeekers];

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      console.log('🔎 Searching for:', term);
      filtered = filtered.filter(seeker => {
        const firstName = seeker.profile?.firstName || seeker.firstName || '';
        const lastName = seeker.profile?.lastName || seeker.lastName || '';
        const email = seeker.email || '';
        const skills = seeker.profile?.skills || seeker.skills || '';
        const location = seeker.profile?.location || seeker.location || '';
        
        return firstName.toLowerCase().includes(term) ||
               lastName.toLowerCase().includes(term) ||
               email.toLowerCase().includes(term) ||
               skills.toLowerCase().includes(term) ||
               location.toLowerCase().includes(term);
      });
      console.log('🔍 Search results:', filtered.length);
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        console.log('🎯 Filtering by:', key, value);
        filtered = filtered.filter(seeker => {
          const seekerValue = seeker.profile?.[key] || seeker[key];
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
      let aValue, bValue;
      
      if (sortBy === 'name') {
        aValue = `${a.profile?.firstName || a.firstName || ''} ${a.profile?.lastName || a.lastName || ''}`;
        bValue = `${b.profile?.firstName || b.firstName || ''} ${b.profile?.lastName || b.lastName || ''}`;
      } else {
        aValue = a[sortBy] || a.profile?.[sortBy] || '';
        bValue = b[sortBy] || b.profile?.[sortBy] || '';
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    console.log('✅ Filtered job seekers:', filtered);
    return filtered;
  }, [jobSeekers, searchTerm, filters, sortBy, sortOrder]);

  // Pagination logic
  const totalItems = filteredJobSeekers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobSeekers = filteredJobSeekers.slice(startIndex, endIndex);

  console.log('📄 Pagination:', {
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    paginatedJobSeekers: paginatedJobSeekers.length
  });

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

  // Calculate page info
  const pageInfo = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const showing = endIndex - startIndex;
    
    return {
      showing,
      from: startIndex + 1,
      to: endIndex,
      total: totalItems
    };
  }, [currentPage, totalItems, itemsPerPage]);

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
    endIndex: Math.min(endIndex, totalItems),
    pageInfo
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