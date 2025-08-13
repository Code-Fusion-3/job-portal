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
      console.log('🌐 Calling /public/statistics endpoint...');
      const response = await apiClient.get('/public/statistics');
      console.log('📡 Raw response:', response);
      
      // Transform the response to match our expected format
      const stats = {
        activeWorkers: response.data?.totalJobSeekers || 0,
        citiesCovered: response.data?.topLocations?.length || 0,
        totalJobSeekers: response.data?.totalJobSeekers || 0,
        totalCategories: response.data?.totalCategories || 0,
        recentRegistrations: response.data?.recentRegistrations || 0
      };
      
      console.log('🔢 Transformed stats:', stats);
      
      const result = {
        success: true,
        data: stats
      };
      
      return result;
    } catch (error) {
      console.error('❌ getPublicStatistics error:', error);
      
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      return { success: false, error: 'Failed to fetch statistics' };
    }
  },

  /**
   * Get job seeker statistics (for cities and active workers)
   * This will be used as a fallback if the public statistics endpoint doesn't provide all needed data
   */
  getJobSeekerStatistics: async () => {
    try {
      console.log('🔄 Fallback: Calling /job-seekers/public endpoint...');
      // Get all public job seekers to calculate statistics
      const response = await apiClient.get('/job-seekers/public');
      console.log('📡 Fallback raw response:', response);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('⚠️ Fallback: Invalid response format');
        return { success: false, error: 'Invalid response format' };
      }

      const jobSeekers = response.data;
      console.log('👥 Fallback: Job seekers data:', jobSeekers);
      
      // Calculate statistics
      const stats = {
        activeWorkers: jobSeekers.length,
        citiesCovered: new Set(jobSeekers.map(seeker => seeker.city).filter(Boolean)).size,
        totalJobSeekers: jobSeekers.length
      };
      
      console.log('🔢 Fallback calculated stats:', stats);
      
      const result = {
        success: true,
        data: stats
      };
      
      return result;
    } catch (error) {
      console.error('❌ getJobSeekerStatistics error:', error);
      
      // Handle specific backend error cases
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      
      return { success: false, error: 'Failed to fetch job seeker statistics' };
    }
  }
};

export default statisticsService;
