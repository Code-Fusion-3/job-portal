import { handleError } from '../utils/errorHandler.js';

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
    const token = localStorage.getItem('job_portal_token');
    
    const response = await fetch(`${API_BASE_URL}/contact/admin/${contactId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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
    const token = localStorage.getItem('job_portal_token');
    
    const response = await fetch(`${API_BASE_URL}/contact/admin/${contactId}/respond`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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
    const token = localStorage.getItem('job_portal_token');
    
    const response = await fetch(`${API_BASE_URL}/contact/admin/${contactId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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
    const token = localStorage.getItem('job_portal_token');
    
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const response = await fetch(`${API_BASE_URL}/contact/admin/all?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch contact messages');
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
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
    const token = localStorage.getItem('job_portal_token');
    
    const response = await fetch(`${API_BASE_URL}/contact/admin/${contactId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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
    const token = localStorage.getItem('job_portal_token');
    
    const response = await fetch(`${API_BASE_URL}/contact/admin/statistics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch contact statistics');
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    const apiError = handleError(error, { context: 'get_contact_statistics' });
    return {
      success: false,
      error: apiError.message
    };
  }
}; 