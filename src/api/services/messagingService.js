import { apiClient } from '../client/apiClient';
import { handleError } from '../utils/errorHandler';
import { ENDPOINTS } from '../config/endpoints';

/**
 * Messaging Service
 * Handles all messaging functionality including conversations and messages
 */
export const messagingService = {
  /**
   * Send a new message
   * POST /admin/messages
   */
  sendMessage: async (messageData) => {
    try {
      const response = await apiClient.post(ENDPOINTS.MESSAGING.SEND, messageData);
      
      if (response.data) {
        return {
          success: true,
          data: response.data.message || response.data,
          message: response.data.message || 'Message sent successfully'
        };
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Message sent successfully'
      };
      
    } catch (error) {
      const apiError = handleError(error, { context: 'send_message' });
      return {
        success: false,
        error: apiError.userMessage
      };
    }
  },

  /**
   * Get all conversations for the current user
   * GET /admin/messages/conversations
   */
  getConversations: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${ENDPOINTS.MESSAGING.GET_CONVERSATIONS}?${queryString}` : ENDPOINTS.MESSAGING.GET_CONVERSATIONS;
      
      const response = await apiClient.get(url);
      
      if (response.data) {
        return {
          success: true,
          data: response.data.conversations || response.data || []
        };
      }
      
      return {
        success: true,
        data: []
      };
      
    } catch (error) {
      const apiError = handleError(error, { context: 'get_conversations' });
      return {
        success: false,
        error: apiError.userMessage
      };
    }
  },

  /**
   * Get messages for a specific conversation
   * GET /admin/messages/conversations/:id
   */
  getConversation: async (conversationId, params = {}) => {
    try {
      if (!conversationId) {
        return {
          success: false,
          error: 'Conversation ID is required'
        };
      }

      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${ENDPOINTS.MESSAGING.GET_CONVERSATION(conversationId)}?${queryString}` : ENDPOINTS.MESSAGING.GET_CONVERSATION(conversationId);
      
      const response = await apiClient.get(url);
      
      if (response.data) {
        return {
          success: true,
          data: response.data.messages || response.data || []
        };
      }
      
      return {
        success: true,
        data: []
      };
      
    } catch (error) {
      const apiError = handleError(error, { context: 'get_conversation' });
      return {
        success: false,
        error: apiError.userMessage
      };
    }
  },

  /**
   * Reply to a conversation
   * POST /messages/reply
   */
  replyToConversation: async (conversationId, replyData) => {
    try {
      if (!conversationId) {
        return {
          success: false,
          error: 'Conversation ID is required'
        };
      }

      const response = await apiClient.post(ENDPOINTS.MESSAGING.REPLY, {
        conversationId,
        ...replyData
      });
      
      if (response.data) {
        return {
          success: true,
          data: response.data.message || response.data,
          message: response.data.message || 'Reply sent successfully'
        };
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Reply sent successfully'
      };
      
    } catch (error) {
      const apiError = handleError(error, { context: 'reply_to_conversation' });
      return {
        success: false,
        error: apiError.userMessage
      };
    }
  },

  /**
   * Mark messages as read
   * PUT /admin/messages/read
   */
  markAsRead: async (messageIds) => {
    try {
      if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
        return {
          success: false,
          error: 'Message IDs are required'
        };
      }

      const response = await apiClient.put('/admin/messages/read', {
        messageIds
      });
      
      if (response.data) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || 'Messages marked as read'
        };
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Messages marked as read'
      };
      
    } catch (error) {
      const apiError = handleError(error, { context: 'mark_messages_read' });
      return {
        success: false,
        error: apiError.userMessage
      };
    }
  },

  /**
   * Get unread message count
   * GET /admin/messages/unread-count
   */
  getUnreadCount: async () => {
    try {
      const response = await apiClient.get('/admin/messages/unread-count');
      
      if (response.data) {
        return {
          success: true,
          data: response.data.count || response.data || 0
        };
      }
      
      return {
        success: true,
        data: 0
      };
      
    } catch (error) {
      const apiError = handleError(error, { context: 'get_unread_count' });
      return {
        success: false,
        error: apiError.userMessage
      };
    }
  },

  /**
   * Create a new conversation
   * POST /admin/messages/conversations
   */
  createConversation: async (conversationData) => {
    try {
      const response = await apiClient.post('/admin/messages/conversations', conversationData);
      
      if (response.data) {
        return {
          success: true,
          data: response.data.conversation || response.data,
          message: response.data.message || 'Conversation created successfully'
        };
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Conversation created successfully'
      };
      
    } catch (error) {
      const apiError = handleError(error, { context: 'create_conversation' });
      return {
        success: false,
        error: apiError.userMessage
      };
    }
  },

  /**
   * Delete a conversation
   * DELETE /admin/messages/conversations/:id
   */
  deleteConversation: async (conversationId) => {
    try {
      if (!conversationId) {
        return {
          success: false,
          error: 'Conversation ID is required'
        };
      }

      const response = await apiClient.delete(`/admin/messages/conversations/${conversationId}`);
      
      if (response.data) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || 'Conversation deleted successfully'
        };
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Conversation deleted successfully'
      };
      
    } catch (error) {
      const apiError = handleError(error, { context: 'delete_conversation' });
      return {
        success: false,
        error: apiError.userMessage
      };
    }
  }
};

export default messagingService;
