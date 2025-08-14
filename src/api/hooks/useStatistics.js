/**
 * Custom hook for fetching platform statistics
 */

import { useState, useEffect, useCallback } from 'react';
import { statisticsService } from '../services/statisticsService.js';

export const useStatistics = (options = {}) => {
  const { autoFetch = true } = options;
  
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get public statistics first
      const result = await statisticsService.getPublicStatistics();
      
      if (result.success && result.data) {
        // Check if we have complete statistics
        if (result.data.totalJobSeekers > 0 && result.data.totalCategories > 0) {
          setStatistics(result.data);
          return;
        }
      }
      
      // Fallback to job seeker statistics if public stats are incomplete
      const fallbackResult = await statisticsService.getJobSeekerStatistics();
      
      if (fallbackResult.success && fallbackResult.data) {
        setStatistics(fallbackResult.data);
      } else {
        throw new Error(fallbackResult.error || 'Failed to fetch statistics');
      }
    } catch (err) {
      console.error('💥 Error fetching statistics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchStatistics();
    }
  }, [autoFetch, fetchStatistics]);

  return {
    statistics,
    loading,
    error,
    fetchStatistics
  };
};

export default useStatistics;
