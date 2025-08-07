import { apiClient } from '../client/apiClient';
import { getAuthHeaders } from '../config/apiConfig';
import { handleError } from '../utils/errorHandler';

// Mock data for development
const mockContactMessages = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    subject: 'General Inquiry',
    message: 'Hello, I would like to know more about your job portal services. Can you provide information about how employers can post jobs and how job seekers can apply?',
    category: 'general',
    status: 'new',
    isRead: false,
    submittedAt: '2024-01-15T10:30:00.000Z'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    subject: 'Support Request',
    message: 'I am having trouble uploading my profile photo. The system keeps showing an error message. Can you help me resolve this issue?',
    category: 'support',
    status: 'read',
    isRead: true,
    submittedAt: '2024-01-14T14:20:00.000Z'
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    subject: 'Feedback on Platform',
    message: 'Great platform! I found my dream job through your portal. The interface is user-friendly and the matching system works perfectly. Keep up the good work!',
    category: 'feedback',
    status: 'replied',
    isRead: true,
    submittedAt: '2024-01-13T09:15:00.000Z'
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@test.com',
    subject: 'Account Issue',
    message: 'I cannot log into my account. I have tried resetting my password multiple times but still cannot access my profile. Please help me regain access.',
    category: 'support',
    status: 'new',
    isRead: false,
    submittedAt: '2024-01-12T16:45:00.000Z'
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'david.wilson@business.com',
    subject: 'Partnership Inquiry',
    message: 'I represent a recruitment agency and would like to discuss potential partnership opportunities with your platform. We have many clients looking for qualified candidates.',
    category: 'general',
    status: 'read',
    isRead: true,
    submittedAt: '2024-01-11T11:30:00.000Z'
  }
];

const mockStatistics = {
  total: 5,
  new: 2,
  read: 2,
  replied: 1,
  archived: 0
};

/**
 * Contact Service
 */
export const contactService = {
  /**
   * Get all contact messages (Admin)
   * GET /contact/admin/messages
   */
  getAllMessages: async (params = {}) => {
    try {
      // For now, return mock data since backend endpoints don't exist
      // TODO: Replace with actual API call when backend is ready
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter mock data based on params
      let filteredMessages = [...mockContactMessages];
      
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredMessages = filteredMessages.filter(msg => 
          msg.name.toLowerCase().includes(searchTerm) ||
          msg.email.toLowerCase().includes(searchTerm) ||
          msg.subject.toLowerCase().includes(searchTerm) ||
          msg.message.toLowerCase().includes(searchTerm)
        );
      }
      
      if (params.status) {
        filteredMessages = filteredMessages.filter(msg => msg.status === params.status);
      }
      
      if (params.category) {
        filteredMessages = filteredMessages.filter(msg => msg.category === params.category);
      }
      
      // Simulate pagination
      const page = params.page || 1;
      const limit = params.itemsPerPage || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMessages = filteredMessages.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: paginatedMessages,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredMessages.length / limit),
          totalItems: filteredMessages.length,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      const apiError = handleError(error, { context: 'get_all_contact_messages' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Get specific contact message (Admin)
   * GET /contact/admin/messages/{id}
   */
  getMessageById: async (id) => {
    try {
      // For now, return mock data
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const message = mockContactMessages.find(msg => msg.id === parseInt(id));
      
      if (!message) {
        return { success: false, error: 'Message not found' };
      }
      
      return {
        success: true,
        data: message
      };
    } catch (error) {
      const apiError = handleError(error, { context: 'get_contact_message_by_id' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Respond to contact message (Admin)
   * POST /contact/admin/{id}/respond
   */
  respondToMessage: async (id, responseData) => {
    try {
      // For now, simulate response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update message status in mock data
      const messageIndex = mockContactMessages.findIndex(msg => msg.id === parseInt(id));
      if (messageIndex !== -1) {
        mockContactMessages[messageIndex].status = 'replied';
        mockContactMessages[messageIndex].isRead = true;
      }
      
      return {
        success: true,
        data: { id, ...responseData },
        message: 'Response sent successfully'
      };
    } catch (error) {
      const apiError = handleError(error, { context: 'respond_to_contact_message' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Mark message as read (Admin)
   * PATCH /contact/admin/messages/{id}/read
   */
  markAsRead: async (id) => {
    try {
      // For now, simulate marking as read
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const messageIndex = mockContactMessages.findIndex(msg => msg.id === parseInt(id));
      if (messageIndex !== -1) {
        mockContactMessages[messageIndex].isRead = true;
        if (mockContactMessages[messageIndex].status === 'new') {
          mockContactMessages[messageIndex].status = 'read';
        }
      }
      
      return {
        success: true,
        data: { id },
        message: 'Message marked as read'
      };
    } catch (error) {
      const apiError = handleError(error, { context: 'mark_contact_message_read' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Delete contact message (Admin)
   * DELETE /contact/admin/messages/{id}
   */
  deleteMessage: async (id) => {
    try {
      // For now, simulate deletion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const messageIndex = mockContactMessages.findIndex(msg => msg.id === parseInt(id));
      if (messageIndex !== -1) {
        mockContactMessages.splice(messageIndex, 1);
      }
      
      return {
        success: true,
        message: 'Message deleted successfully'
      };
    } catch (error) {
      const apiError = handleError(error, { context: 'delete_contact_message' });
      return { success: false, error: apiError.userMessage };
    }
  },

  /**
   * Get contact message statistics (Admin)
   * GET /contact/admin/statistics
   */
  getStatistics: async () => {
    try {
      // For now, return mock statistics
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Calculate real statistics from mock data
      const total = mockContactMessages.length;
      const newCount = mockContactMessages.filter(msg => msg.status === 'new').length;
      const readCount = mockContactMessages.filter(msg => msg.status === 'read').length;
      const repliedCount = mockContactMessages.filter(msg => msg.status === 'replied').length;
      const archivedCount = mockContactMessages.filter(msg => msg.status === 'archived').length;
      
      return {
        success: true,
        data: {
          total,
          new: newCount,
          read: readCount,
          replied: repliedCount,
          archived: archivedCount
        }
      };
    } catch (error) {
      const apiError = handleError(error, { context: 'get_contact_statistics' });
      return { success: false, error: apiError.userMessage };
    }
  }
}; 