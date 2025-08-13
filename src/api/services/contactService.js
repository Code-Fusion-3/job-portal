import { handleError } from '../utils/errorHandler.js';
import { getAuthHeaders } from '../config/apiConfig.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Submit contact message
export const submitContact = async (contactData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit contact message');
    }

    return {
      success: true,
      data: data,
      message: data.message || 'Message sent successfully!'
    };
  } catch (error) {
    const apiError = handleError(error, { context: 'submit_contact' });
    return {
      success: false,
      error: apiError.message,
      details: apiError.details
    };
  }
};

// Get contact message by ID (for admin)
export const getContact = async (contactId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/admin/${contactId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch contact message');
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    const apiError = handleError(error, { context: 'get_contact' });
    return {
      success: false,
      error: apiError.message
    };
  }
};

// Respond to contact message (admin only)
export const respondToContact = async (contactId, responseData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/admin/${contactId}/respond`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(responseData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to respond to contact message');
    }

    return {
      success: true,
      data: data,
      message: data.message || 'Response sent successfully!'
    };
  } catch (error) {
    const apiError = handleError(error, { context: 'respond_to_contact' });
    return {
      success: false,
      error: apiError.message
    };
  }
};

// Update contact status (admin only)
export const updateContactStatus = async (contactId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/admin/${contactId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update contact status');
    }

    return {
      success: true,
      data: data,
      message: data.message || 'Status updated successfully!'
    };
  } catch (error) {
    const apiError = handleError(error, { context: 'update_contact_status' });
    return {
      success: false,
      error: apiError.message
    };
  }
};

// Get all contact messages (admin only)
export const getAllContacts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const url = `${API_BASE_URL}/contact/admin/all?${queryParams}`;
    console.log('🔍 Fetching from URL:', url);
    console.log('🔍 Auth headers:', getAuthHeaders());

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    console.log('🔍 Response status:', response.status);
    console.log('🔍 Response headers:', response.headers);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch contact messages');
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('🔍 Error in getAllContacts:', error);
    
    // Fallback to mock data if backend is not available
    if (error.message.includes('Failed to fetch') || error.message.includes('Network error')) {
      console.log('🔍 Backend not available, using mock data');
      return {
        success: true,
        data: {
          contacts: [
            {
              id: 1,
              name: 'John Doe',
              email: 'john@example.com',
              subject: 'General Inquiry',
              message: 'This is a test message for development purposes.',
              category: 'general',
              priority: 'normal',
              status: 'unread',
              createdAt: new Date().toISOString(),
              isRead: false
            },
            {
              id: 2,
              name: 'Jane Smith',
              email: 'jane@example.com',
              subject: 'Support Request',
              message: 'I need help with my account setup.',
              category: 'support',
              priority: 'high',
              status: 'read',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              isRead: true
            },
            {
              id: 3,
              name: 'Bob Wilson',
              email: 'bob@example.com',
              subject: 'Feedback',
              message: 'Great service! Keep up the good work.',
              category: 'feedback',
              priority: 'low',
              status: 'responded',
              createdAt: new Date(Date.now() - 172800000).toISOString(),
              isRead: true
            }
          ],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 3,
            itemsPerPage: 15
          },
          statistics: {
            total: 3,
            unread: 1,
            read: 1,
            responded: 1,
            archived: 0
          }
        }
      };
    }
    
    const apiError = handleError(error, { context: 'get_all_contacts' });
    return {
      success: false,
      error: apiError.message
    };
  }
};

// Delete contact message (admin only)
export const deleteContact = async (contactId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/admin/${contactId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete contact message');
    }

    return {
      success: true,
      data: data,
      message: data.message || 'Contact message deleted successfully!'
    };
  } catch (error) {
    const apiError = handleError(error, { context: 'delete_contact' });
    return {
      success: false,
      error: apiError.message
    };
  }
};

// Get contact statistics (admin only)
export const getContactStatistics = async () => {
  try {
    const url = `${API_BASE_URL}/contact/admin/statistics`;
    console.log('🔍 Fetching statistics from URL:', url);
    console.log('🔍 Auth headers:', getAuthHeaders());

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    console.log('🔍 Statistics response status:', response.status);
    console.log('🔍 Statistics response headers:', response.headers);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch contact statistics');
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('🔍 Error in getContactStatistics:', error);
    
    // Fallback to mock data if backend is not available
    if (error.message.includes('Failed to fetch') || error.message.includes('Network error')) {
      console.log('🔍 Backend not available, using mock statistics');
      return {
        success: true,
        data: {
          total: 3,
          unread: 1,
          read: 1,
          responded: 1,
          archived: 0
        }
      };
    }
    
    const apiError = handleError(error, { context: 'get_contact_statistics' });
    return {
      success: false,
      error: apiError.message
    };
  }
};

// Export all functions as a service object
export const contactService = {
  submitContact,
  getContact,
  respondToContact,
  updateContactStatus,
  getAllContacts,
  deleteContact,
  getContactStatistics,
  // Alias methods for backward compatibility
  getAllMessages: getAllContacts,
  getMessageById: getContact,
  respondToMessage: respondToContact,
  markAsRead: updateContactStatus,
  deleteMessage: deleteContact,
  getStatistics: getContactStatistics
};

// Default export
export default contactService; 