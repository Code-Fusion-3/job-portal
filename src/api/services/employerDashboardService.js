import { api } from '../client/apiClient.js';
import { ENDPOINTS } from '../config/endpoints.js';

class EmployerDashboardService {
  // Get employer dashboard data
  async getDashboardData() {
    try {
      console.log('🔍 employerDashboardService.getDashboardData called');
      console.log('🔍 API endpoint:', ENDPOINTS.EMPLOYER.DASHBOARD);
      console.log('🔍 Auth token:', localStorage.getItem('job_portal_token'));
      
      const response = await api.get(ENDPOINTS.EMPLOYER.DASHBOARD);
      console.log('✅ API response:', response);
      return response;
    } catch (error) {
      console.error('❌ employerDashboardService.getDashboardData error:', error);
      console.error('❌ Error response:', error.response);
      throw error;
    }
  }

  // Get specific request details
  async getRequestDetails(requestId) {
    try {
      const response = await api.get(ENDPOINTS.EMPLOYER.GET_REQUEST_BY_ID(requestId));
      return response.data;
    } catch (error) {
      console.error('Error getting request details:', error);
      throw error;
    }
  }

  // Update request status (if allowed)
  async updateRequestStatus(requestId, status) {
    try {
      const response = await api.put(ENDPOINTS.EMPLOYER.GET_REQUEST_BY_ID(requestId), {
        status
      });
      return response.data;
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
  }

  // Get request statistics
  async getRequestStats() {
    try {
      const response = await api.get(ENDPOINTS.EMPLOYER.GET_REQUESTS + '/stats');
      return response.data;
    } catch (error) {
      console.error('Error getting request stats:', error);
      throw error;
    }
  }
}

export default new EmployerDashboardService();
