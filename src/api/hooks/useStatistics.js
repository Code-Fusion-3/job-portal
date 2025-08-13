/**
 * Custom hook for fetching platform statistics
 */

import { useState, useEffect, useCallback } from 'react';
import { statisticsService } from '../services/statisticsService.js';

export const useStatistics = (options = {}) => {
  const { autoFetch = true } = options;
  
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fetching public statistics...');
      // Try to get public statistics first
      let result = await statisticsService.getPublicStatistics();
      console.log('📊 Public statistics result:', result);
      
      // If public statistics doesn't have all the data we need, fall back to job seeker statistics
      if (!result.success || !result.data.activeWorkers || !result.data.citiesCovered) {
        console.log('⚠️ Public statistics incomplete, fetching job seeker statistics as fallback');
        result = await statisticsService.getJobSeekerStatistics();
        console.log('📊 Job seeker statistics fallback result:', result);
      }
      
      if (result.success) {
        console.log('✅ Statistics fetched successfully:', result.data);
        setStatistics(result.data);
      } else {
        console.error('❌ Statistics fetch failed:', result.error);
        setError(result.error || 'Failed to fetch statistics');
      }
    } catch (err) {
      console.error('💥 Error fetching statistics:', err);
      setError('Failed to fetch statistics');
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
