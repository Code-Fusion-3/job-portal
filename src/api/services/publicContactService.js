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
      // For now, simulate successful submission since backend endpoint doesn't exist
      // TODO: Replace with actual API call when backend is ready
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful response
      const mockResponse = {
        contact: {
          id: Date.now(),
          subject: contactData.subject,
          category: contactData.category || 'general',
          submittedAt: new Date().toISOString()
        },
        message: 'Contact message submitted successfully. We will respond to you soon.'
      };
      
      return {
        success: true,
        data: mockResponse.contact,
        message: mockResponse.message
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
      
      const apiError = handleError(error, { context: 'submit_contact_message' });
      return { success: false, error: apiError.userMessage };
    }
  }
}; 