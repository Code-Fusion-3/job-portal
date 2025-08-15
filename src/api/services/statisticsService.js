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
      
      // Debug: Log the actual response
      console.log('statisticsService raw response:', response);
      console.log('statisticsService response.data:', response.data);
      
      if (response.data) {
        const stats = response.data;
        
        // Transform the data to match expected format
        const transformedStats = {
          totalJobSeekers: stats.totalJobSeekers || 0,
          totalEmployers: stats.totalEmployers || 0,
          totalRequests: stats.totalRequests || 0,
          totalCategories: stats.totalCategories || 0,
          recentJobSeekers: stats.recentRegistrations || 0, // Map recentRegistrations to recentJobSeekers
          topCategories: stats.topCategories || [],
          monthlyStats: stats.monthlyStats || [],
          // Add new fields from the actual response
          topLocations: stats.topLocations || [],
          activeWorkers: stats.totalJobSeekers || 0, // Map totalJobSeekers to activeWorkers
          citiesCovered: stats.topLocations?.length || 0 // Count of cities from topLocations
        };
        
        console.log('statisticsService transformed stats:', transformedStats);
        
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
   * This endpoint provides job seeker-specific data, not general platform statistics
   */
  getJobSeekerStatistics: async () => {
    try {
      const response = await apiClient.get('/job-seekers/public');
      
      if (response.data && response.data.success) {
        const jobSeekers = response.data.data;
        
        if (!Array.isArray(jobSeekers)) {
          return { success: false, error: 'Invalid response format from job seekers endpoint' };
        }
        
        // Return only job seeker-specific data, not platform statistics
        const stats = {
          totalJobSeekers: jobSeekers.length,
          recentJobSeekers: jobSeekers.slice(0, 5),
          // Note: These fields are not available from this endpoint
          // and should not be populated with fake data
          totalEmployers: null,
          totalRequests: null,
          totalCategories: null,
          topCategories: [],
          monthlyStats: []
        };
        
        return { success: true, data: stats };
      }
      
      return { success: false, error: 'Failed to fetch job seeker data' };
    } catch (error) {
      console.error('❌ getJobSeekerStatistics error:', error);
      return { success: false, error: error.message };
    }
  }
};

export default statisticsService;
