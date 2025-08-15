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
      
      // Get public statistics
      const result = await statisticsService.getPublicStatistics();
      
      // Debug: Log the result
      console.log('useStatistics received result:', result);
      
      if (result.success && result.data) {
        setStatistics(result.data);
      } else {
        setError(result.error || 'Unable to load statistics');
      }
    } catch (err) {
      console.error('💥 Error fetching statistics:', err);
      setError('Network error. Please check your connection and try again.');
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
