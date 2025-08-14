/**
 * Statistics Service
 * Service for fetching platform statistics and analytics
 */

import { apiClient } from '../client/apiClient.js';
import { handleError } from '../utils/errorHandler.js';

/**
 * Statistics Service
 */
export const statisticsService = {
  /**
   * Get public platform statistics
   * GET /public/statistics
   */
  getPublicStatistics: async () => {
    try {
      const response = await apiClient.get('/public/statistics');
      
      if (response.data && response.data.success) {
        const stats = response.data.data;
        
        // Transform the data to match expected format
        const transformedStats = {
          totalJobSeekers: stats.totalJobSeekers || 0,
          totalEmployers: stats.totalEmployers || 0,
          totalRequests: stats.totalRequests || 0,
          totalCategories: stats.totalCategories || 0,
          recentJobSeekers: stats.recentJobSeekers || [],
          topCategories: stats.topCategories || [],
          monthlyStats: stats.monthlyStats || []
        };
        
        return { success: true, data: transformedStats };
      }
      
      return { success: false, error: 'Invalid response format' };
    } catch (error) {
      console.error('❌ getPublicStatistics error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get job seeker statistics (for cities and active workers)
   * This will be used as a fallback if the public statistics endpoint doesn't provide all needed data
   */
  getJobSeekerStatistics: async () => {
    try {
      const response = await apiClient.get('/job-seekers/public');
      
      if (response.data && response.data.success) {
        const jobSeekers = response.data.data;
        
        if (!Array.isArray(jobSeekers)) {
          console.warn('⚠️ Fallback: Invalid response format');
          return { success: false, error: 'Invalid response format' };
        }
        
        // Calculate statistics from job seekers data
        const stats = {
          totalJobSeekers: jobSeekers.length,
          totalEmployers: 0, // Not available in this endpoint
          totalRequests: 0, // Not available in this endpoint
          totalCategories: 0, // Not available in this endpoint
          recentJobSeekers: jobSeekers.slice(0, 5),
          topCategories: [],
          monthlyStats: []
        };
        
        return { success: true, data: stats };
      }
      
      return { success: false, error: 'Failed to fetch statistics' };
    } catch (error) {
      console.error('❌ getJobSeekerStatistics error:', error);
      return { success: false, error: error.message };
    }
  }
};

export default statisticsService;
