import API_CONFIG from '../config/apiConfig';

/**
 * Employer Request Service for new workflow
 */
class EmployerRequestService {
  // ===== ADMIN WORKFLOW METHODS =====

  /**
   * Approve employer request
   * @param {number} requestId - Employer request ID
   * @param {string} notes - Optional approval notes
   */
  static async approveRequest(requestId, notes = '') {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/employer-requests/${requestId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        },
        body: JSON.stringify({ notes })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error approving request:', error);
      throw error;
    }
  }

  /**
   * Reject employer request
   * @param {number} requestId - Employer request ID
   * @param {string} reason - Rejection reason
   */
  static async rejectRequest(requestId, reason = '') {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/employer-requests/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error rejecting request:', error);
      throw error;
    }
  }

  /**
   * Request first payment
   * @param {number} requestId - Employer request ID
   * @param {string} notes - Optional notes
   */
  static async requestFirstPayment(requestId, notes = '') {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/employer-requests/${requestId}/request-first-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        },
        body: JSON.stringify({ notes })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error requesting first payment:', error);
      throw error;
    }
  }

  /**
   * Approve first payment
   * @param {number} requestId - Employer request ID
   * @param {string} notes - Optional approval notes
   */
  static async approveFirstPayment(requestId, notes = '') {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/employer-requests/${requestId}/approve-first-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        },
        body: JSON.stringify({ notes })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error approving first payment:', error);
      throw error;
    }
  }

  /**
   * Reject first payment
   * @param {number} requestId - Employer request ID
   * @param {string} reason - Rejection reason
   */
  static async rejectFirstPayment(requestId, reason = '') {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/employer-requests/${requestId}/reject-first-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error rejecting first payment:', error);
      throw error;
    }
  }

  /**
   * Request second payment
   * @param {number} requestId - Employer request ID
   * @param {string} notes - Optional notes
   */
  static async requestSecondPayment(requestId, notes = '') {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/employer-requests/${requestId}/request-second-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        },
        body: JSON.stringify({ notes })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error requesting second payment:', error);
      throw error;
    }
  }

  /**
   * Approve full details request
   * @param {number} requestId - Employer request ID
   * @param {string} notes - Optional approval notes
   */
  static async approveFullDetailsRequest(requestId, notes = '') {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/employer-requests/${requestId}/approve-full-details-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        },
        body: JSON.stringify({ notes })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error approving full details request:', error);
      throw error;
    }
  }

  /**
   * Reject full details request
   * @param {number} requestId - Employer request ID
   * @param {string} reason - Rejection reason
   */
  static async rejectFullDetailsRequest(requestId, reason = '') {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/employer-requests/${requestId}/reject-full-details-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error rejecting full details request:', error);
      throw error;
    }
  }

  /**
   * Approve second payment
   * @param {number} requestId - Employer request ID
   * @param {string} notes - Optional approval notes
   */
  static async approveSecondPayment(requestId, notes = '') {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/employer-requests/${requestId}/approve-second-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        },
        body: JSON.stringify({ notes })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error approving second payment:', error);
      throw error;
    }
  }

  /**
   * Reject second payment
   * @param {number} requestId - Employer request ID
   * @param {string} reason - Rejection reason
   */
  static async rejectSecondPayment(requestId, reason = '') {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/employer-requests/${requestId}/reject-second-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error rejecting second payment:', error);
      throw error;
    }
  }

  /**
   * Update candidate availability
   * @param {number} requestId - Employer request ID
   * @param {string} notes - Optional notes
   */
  static async updateCandidateAvailability(requestId, notes = '') {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/employer-requests/${requestId}/update-candidate-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        },
        body: JSON.stringify({ notes })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating candidate availability:', error);
      throw error;
    }
  }

  // ===== EMPLOYER WORKFLOW METHODS =====
  /**
   * Request full details for a candidate
   * @param {number} requestId - Employer request ID
   * @param {string} reason - Optional reason for requesting full details
   */
  static async requestFullDetails(requestId, reason = '') {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/employer/requests/${requestId}/request-full-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error requesting full details:', error);
      throw error;
    }
  }

  /**
   * Mark hiring decision
   * @param {number} requestId - Employer request ID
   * @param {string} decision - 'hired' or 'not_hired'
   * @param {string} notes - Optional notes
   */
  static async markHiringDecision(requestId, decision, notes = '') {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/employer/requests/${requestId}/mark-${decision}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        },
        body: JSON.stringify({ decision, notes })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error marking hiring decision:', error);
      throw error;
    }
  }

  /**
   * Get photo access for candidate
   * @param {number} requestId - Employer request ID
   */
  static async getPhotoAccess(requestId) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/employer/requests/${requestId}/photo-access`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting photo access:', error);
      throw error;
    }
  }

  /**
   * Get full details for candidate
   * @param {number} requestId - Employer request ID
   */
  static async getFullDetails(requestId) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/employer/requests/${requestId}/full-details`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting full details:', error);
      throw error;
    }
  }

  /**
   * Get all admin employer requests with rich data (Admin)
   * @param {Object} params - Query parameters
   */
  static async getAllAdminRequests(params = {}) {
    try {
      const { page = 1, limit = 10, status, priority, search, sortBy, sortOrder, category, dateFrom, dateTo, ...otherParams } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...otherParams
      });

      // Add optional filters
      if (status) queryParams.append('status', status);
      if (priority) queryParams.append('priority', priority);
      if (search) queryParams.append('search', search);
      if (sortBy) queryParams.append('sortBy', sortBy);
      if (sortOrder) queryParams.append('sortOrder', sortOrder);
      if (category) queryParams.append('category', category);
      if (dateFrom) queryParams.append('dateFrom', dateFrom);
      if (dateTo) queryParams.append('dateTo', dateTo);

      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/employer-requests?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: {
          requests: data.requests || [],
          pagination: data.pagination || {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 0,
            totalPages: 1
          }
        }
      };
    } catch (error) {
      console.error('Error getting all admin requests:', error);
      return { success: false, error: error.message };
    }
  }


}

export default EmployerRequestService;
