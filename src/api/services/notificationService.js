import API_CONFIG from '../config/apiConfig';

/**
 * Notification Service for workflow notifications
 */
class NotificationService {
  /**
   * Fetch workflow notifications
   */
  static async getWorkflowNotifications() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/workflow`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching workflow notifications:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   * @param {number} notificationId - Notification ID
   */
  static async markAsRead(notificationId) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/mark-all-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Create a workflow notification
   * @param {string} type - Notification type
   * @param {string} message - Notification message
   * @param {number} requestId - Related request ID
   * @param {string} status - Workflow status
   */
  static async createWorkflowNotification(type, message, requestId, status) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        },
        body: JSON.stringify({
          type,
          message,
          requestId,
          status
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating workflow notification:', error);
      throw error;
    }
  }

  /**
   * Get notification count
   */
  static async getNotificationCount() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/count`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching notification count:', error);
      throw error;
    }
  }

  /**
   * Get user notifications (for NotificationCenter)
   */
  static async getUserNotifications() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/user`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  }

  /**
   * Get notification statistics
   */
  static async getNotificationStats() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw error;
    }
  }

  /**
   * Get notification preferences (opt-out settings)
   */
  static async getNotificationPreferences() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/preferences`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      throw error;
    }
  }

  /**
   * Update notification preferences
   * @param {string} type - Notification type to opt out/in
   * @param {boolean} optedOut - Whether to opt out
   */
  static async updateNotificationPreference(type, optedOut) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        },
        body: JSON.stringify({
          type,
          optedOut
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating notification preference:', error);
      throw error;
    }
  }

  /**
   * Toggle notification preference (convenience method)
   * @param {string} type - Notification type to toggle
   */
  static async toggleNotificationPreference(type) {
    try {
      // First get current preferences to determine current state
      const preferences = await this.getNotificationPreferences();
      const currentlyOptedOut = preferences.optedOutTypes.includes(type);

      // Toggle the state
      return await this.updateNotificationPreference(type, !currentlyOptedOut);
    } catch (error) {
      console.error('Error toggling notification preference:', error);
      throw error;
    }
  }
}

export default NotificationService;