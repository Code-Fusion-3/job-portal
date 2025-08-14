/**
 * Custom Messaging Hook
 * Provides messaging functionality with real-time updates
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { messagingService } from '../services/messagingService';

export const useMessaging = (options = {}) => {
  const {
    autoFetch = true,
    includeAdmin = false,
    conversationId = null
  } = options;

  // State management
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await messagingService.getConversations();
      if (result.success) {
        setConversations(result.data || []);
      } else {
        setError(result.error || 'Failed to fetch conversations');
      }
    } catch (error) {
      setError('An error occurred while fetching conversations');
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (convId) => {
    if (!convId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await messagingService.getConversation(convId);
      if (result.success) {
        setMessages(result.data || []);
        setSelectedConversation(convId);
      } else {
        setError(result.error || 'Failed to fetch messages');
      }
    } catch (error) {
      setError('An error occurred while fetching messages');
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(async (messageData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await messagingService.sendMessage(messageData);
      if (result.success) {
        // Add the new message to the current conversation
        setMessages(prev => [...prev, result.data]);
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to send message');
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An error occurred while sending message';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark messages as read
  const markAsRead = useCallback(async (messageIds) => {
    try {
      const result = await messagingService.markAsRead(messageIds);
      if (result.success) {
        // Update local state to mark messages as read
        setMessages(prev => 
          prev.map(message => 
            messageIds.includes(message.id) 
              ? { ...message, read: true }
              : message
          )
        );
        return { success: true };
      } else {
        setError(result.error || 'Failed to mark messages as read');
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An error occurred while marking messages as read';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Get unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const result = await messagingService.getUnreadCount();
      if (result.success) {
        setUnreadCount(result.data || 0);
      } else {
        console.warn('Failed to fetch unread count:', result.error);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  // Select conversation
  const selectConversation = useCallback((conversation) => {
    setSelectedConversation(conversation);
    if (conversation?.id) {
      fetchMessages(conversation.id);
    }
  }, [fetchMessages]);

  const clearSelection = useCallback(() => {
    setSelectedConversation(null);
    setMessages([]);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchConversations();
      fetchUnreadCount();
    }
  }, [fetchConversations, fetchUnreadCount, autoFetch]);

  // Auto-fetch messages when conversationId changes
  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId, fetchMessages]);

  // Clear error when selection changes
  useEffect(() => {
    setError(null);
  }, [selectedConversation]);

  return {
    // Data
    messages,
    conversations,
    selectedConversation,
    unreadCount,
    
    // State
    loading,
    error,
    
    // Actions
    fetchConversations,
    fetchMessages,
    sendMessage,
    markAsRead,
    fetchUnreadCount,
    
    // Selection
    selectConversation,
    clearSelection,
    
    // Utilities
    hasMessages: messages.length > 0,
    hasConversations: conversations.length > 0,
    messagesCount: messages.length,
    conversationsCount: conversations.length,
    isAdmin: includeAdmin
  };
};

// Specialized hooks for different use cases
export const useAdminMessaging = (options = {}) => {
  return useMessaging({ ...options, includeAdmin: true });
};

export const useEmployerMessaging = (options = {}) => {
  return useMessaging({ ...options, includeAdmin: false });
};

export const useConversation = (conversationId) => {
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { fetchMessages, sendMessage } = useMessaging({ 
    autoFetch: false, 
    conversationId 
  });

  const fetchConversation = useCallback(async () => {
    if (!conversationId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await messagingService.getConversation(conversationId);
      if (result.success) {
        setConversation(result.data);
      } else {
        setError(result.error || 'Failed to fetch conversation');
      }
    } catch (error) {
      setError('An error occurred while fetching conversation');
      console.error('Error fetching conversation:', error);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  return {
    conversation,
    loading,
    error,
    fetchConversation,
    sendMessage
  };
}; 