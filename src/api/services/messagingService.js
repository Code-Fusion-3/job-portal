import { api } from '../client/apiClient.js';
import { ENDPOINTS } from '../config/endpoints.js';

class MessagingService {
  // Get messages for a specific request
  async getMessagesByRequest(requestId, page = 1, limit = 50) {
    try {
      const response = await api.get(
        `${ENDPOINTS.EMPLOYER.MESSAGES.GET_BY_REQUEST(requestId)}?page=${page}&limit=${limit}`
      );
      return response;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  // Send a message
  async sendMessage(requestId, messageData) {
    try {
      const response = await api.post(
        ENDPOINTS.EMPLOYER.MESSAGES.SEND(requestId),
        messageData
      );
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Mark messages as read
  async markMessagesAsRead(requestId, messageIds = []) {
    try {
      const response = await api.patch(
        ENDPOINTS.EMPLOYER.MESSAGES.MARK_READ(requestId),
        { messageIds }
      );
      return response;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  // Get unread message count
  async getUnreadCount() {
    try {
      const response = await api.get(ENDPOINTS.EMPLOYER.MESSAGES.UNREAD_COUNT);
      return response;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  // Delete a message
  async deleteMessage(messageId) {
    try {
      const response = await api.delete(
        ENDPOINTS.EMPLOYER.MESSAGES.DELETE(messageId)
      );
      return response;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
}

export default new MessagingService();
