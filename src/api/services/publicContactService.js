import { apiClient } from '../client/apiClient';
import { handleError } from '../utils/errorHandler';

/**
 * Public Contact Service
 */
export const publicContactService = {
  /**
   * Submit contact message (Public)
   * POST /contact/submit
   */
  submitContactMessage: async (contactData) => {
    try {
      // Attempt to call the actual backend endpoint
      const response = await apiClient.post('/contact/submit', contactData);
      
      if (response.data) {
        return {
          success: true,
          data: response.data.contact || response.data,
          message: response.data.message || 'Contact message submitted successfully. We will respond to you soon.'
        };
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Contact message submitted successfully.'
      };
      
    } catch (error) {
      // Handle specific backend error cases
      if (error.response?.data) {
        const { data } = error.response;
        
        // Handle validation errors with field details
        if (data.details && Array.isArray(data.details)) {
          const fieldErrors = data.details
            .map(detail => `${detail.field}: ${detail.message}`)
            .join(', ');
          return { success: false, error: fieldErrors };
        }
        
        // Handle simple error messages
        if (data.error) {
          return { success: false, error: data.error };
        }
        
        // Handle generic error messages
        if (data.message) {
          return { success: false, error: data.message };
        }
      }
      
      // Handle network or server errors
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        return { 
          success: false, 
          error: 'Unable to connect to server. Please check your internet connection and try again.' 
        };
      }
      
      if (error.response?.status === 404) {
        return { 
          success: false, 
          error: 'Contact submission service is currently unavailable. Please try again later or contact support.' 
        };
      }
      
      if (error.response?.status === 500) {
        return { 
          success: false, 
          error: 'Server error occurred. Please try again later.' 
        };
      }
      
      const apiError = handleError(error, { context: 'submit_contact_message' });
      return { success: false, error: apiError.userMessage };
    }
  }
}; 