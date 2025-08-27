/**
 * Custom Messaging Hook
 * Provides messaging functionality for employer-admin communication
 */

import { useState, useEffect, useCallback } from 'react';
import messagingService from '../services/messagingService';

export const useMessaging = (requestId = null) => {
  // State management
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch messages for a specific request
  const fetchMessages = useCallback(async (reqId = requestId) => {
    if (!reqId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await messagingService.getMessagesByRequest(reqId);
      setMessages(data.messages || []);
    } catch (error) {
      setError('Failed to fetch messages');
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  // Send a message
  const sendMessage = useCallback(async (content, messageType = 'text') => {
    if (!requestId || !content?.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await messagingService.sendMessage(requestId, {
        content: content.trim(),
        messageType
      });
      
      // Refresh messages to get the new one
      await fetchMessages(requestId);
      return { success: true, data: result.data };
    } catch (error) {
      setError('Failed to send message');
      console.error('Error sending message:', error);
      return { success: false, error: 'Failed to send message' };
    } finally {
      setLoading(false);
    }
  }, [requestId, fetchMessages]);

  // Mark messages as read
  const markAsRead = useCallback(async (messageIds = []) => {
    if (!requestId) return;
    
    try {
      await messagingService.markMessagesAsRead(requestId, messageIds);
      // Refresh messages to update read status
      await fetchMessages(requestId);
      return { success: true };
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return { success: false, error: 'Failed to mark messages as read' };
    }
  }, [requestId, fetchMessages]);

  // Get unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await messagingService.getUnreadCount();
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  // Auto-fetch messages when requestId changes
  useEffect(() => {
    if (requestId) {
      fetchMessages(requestId);
    }
  }, [requestId, fetchMessages]);

  // Auto-fetch unread count on mount
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Clear error when requestId changes
  useEffect(() => {
    setError(null);
  }, [requestId]);

  return {
    // Data
    messages,
    unreadCount,
    
    // State
    loading,
    error,
    
    // Actions
    fetchMessages,
    sendMessage,
    markAsRead,
    fetchUnreadCount,
    
    // Utilities
    hasMessages: messages.length > 0,
    messagesCount: messages.length,
    isAdmin: messages.some(msg => msg.fromAdmin)
  };
};

// Specialized hook for employer messaging
export const useEmployerMessaging = (requestId) => {
  return useMessaging(requestId);
};

// Hook for managing multiple conversations
export const useMultiRequestMessaging = () => {
  const [conversations, setConversations] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchConversation = useCallback(async (requestId) => {
    if (conversations.has(requestId)) return conversations.get(requestId);
    
    setLoading(true);
    try {
      const data = await messagingService.getMessagesByRequest(requestId);
      const conversation = {
        requestId,
        messages: data.messages || [],
        lastMessage: data.messages?.[data.messages.length - 1] || null,
        unreadCount: data.messages?.filter(msg => !msg.isRead && msg.fromAdmin).length || 0
      };
      
      setConversations(prev => new Map(prev).set(requestId, conversation));
      return conversation;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [conversations]);

  const sendMessageToRequest = useCallback(async (requestId, content, messageType = 'text') => {
    try {
      const result = await messagingService.sendMessage(requestId, {
        content: content.trim(),
        messageType
      });
      
      // Update the conversation
      await fetchConversation(requestId);
      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: 'Failed to send message' };
    }
  }, [fetchConversation]);

  return {
    conversations: Array.from(conversations.values()),
    loading,
    error,
    fetchConversation,
    sendMessageToRequest,
    getConversation: (requestId) => conversations.get(requestId)
  };
}; 