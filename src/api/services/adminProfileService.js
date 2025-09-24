import { api } from '../client/apiClient.js';
import API_CONFIG from '../config/apiConfig.js';

class AdminProfileService {
  // Get admin profile data
  async getProfile() {
    try {
      // console.log('🔍 AdminProfileService: Getting profile...');
      const response = await api.get('/admin-profile/profile');
      // console.log('✅ AdminProfileService: Profile loaded successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AdminProfileService: Error getting profile:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      throw error;
    }
  }

  // Update admin profile data
  async updateProfile(profileData) {
    try {
      const response = await api.put('/admin-profile/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating admin profile:', error);
      throw error;
    }
  }

  // Get public admin profile (for AdminInfo page)
  async getPublicProfile() {
    try {
      // console.log('🔍 AdminProfileService: Getting public profile via API client...');
      // console.log('🔍 API client:', api);
      // console.log('🔍 API client methods:', Object.keys(api));
      
      const response = await api.get('/admin-profile/public-profile');
      // console.log('✅ AdminProfileService: Public profile loaded successfully via API client:', response);
      return response;
    } catch (error) {
      // console.error('❌ AdminProfileService: API client failed, trying fetch fallback...');
      // console.error('❌ Error details:', error);
      
      // Fallback to fetch since public profile doesn't require authentication
      try {
        // console.log('🔄 AdminProfileService: Using fetch fallback...');
        const fetchResponse = await fetch(`${API_CONFIG.BASE_URL}/admin-profile/public-profile`);
        
        if (!fetchResponse.ok) {
          throw new Error(`HTTP error! status: ${fetchResponse.status}`);
        }
        
        const data = await fetchResponse.json();
        // console.log('✅ AdminProfileService: Public profile loaded successfully via fetch:', data);
        return data;
      } catch (fetchError) {
        console.error('❌ AdminProfileService: Fetch fallback also failed:', fetchError);
        throw fetchError;
      }
    }
  }
}

export default new AdminProfileService();
