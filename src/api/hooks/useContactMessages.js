import { useState, useEffect, useCallback } from 'react';
import { contactService } from '../services/contactService';

export const useContactMessages = (options = {}) => {
  const {
    autoFetch = false,
    itemsPerPage = 10,
    page = 1,
    searchTerm = '',
    status = '',
    category = ''
  } = options;

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [statistics, setStatistics] = useState(null);

  const fetchMessages = useCallback(async (params = {}) => {
    setLoading(true);
    setError('');

    try {
      const queryParams = {
        page: params.page || page,
        limit: params.itemsPerPage || itemsPerPage,
        search: params.searchTerm || searchTerm,
        status: params.status || status,
        category: params.category || category,
        ...params
      };

      const result = await contactService.getAllMessages(queryParams);

      if (result.success) {
        setMessages(result.data);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch contact messages');
      console.error('Error fetching contact messages:', err);
    } finally {
      setLoading(false);
    }
  }, [page, itemsPerPage, searchTerm, status, category]);

  const fetchMessageById = useCallback(async (id) => {
    setLoading(true);
    setError('');

    try {
      const result = await contactService.getMessageById(id);

      if (result.success) {
        return result.data;
      } else {
        setError(result.error);
        return null;
      }
    } catch (err) {
      setError('Failed to fetch contact message');
      console.error('Error fetching contact message:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const respondToMessage = useCallback(async (id, responseData) => {
    setLoading(true);
    setError('');

    try {
      const result = await contactService.respondToMessage(id, responseData);

      if (result.success) {
        // Refresh messages to show updated status
        await fetchMessages();
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      setError('Failed to respond to message');
      console.error('Error responding to message:', err);
      return { success: false, error: 'Failed to respond to message' };
    } finally {
      setLoading(false);
    }
  }, [fetchMessages]);

  const markAsRead = useCallback(async (id) => {
    try {
      const result = await contactService.markAsRead(id);

      if (result.success) {
        // Update the message in the list
        setMessages(prev => 
          prev.map(msg => 
            msg.id === id ? { ...msg, isRead: true } : msg
          )
        );
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      setError('Failed to mark message as read');
      console.error('Error marking message as read:', err);
      return { success: false, error: 'Failed to mark message as read' };
    }
  }, []);

  const deleteMessage = useCallback(async (id) => {
    try {
      const result = await contactService.deleteMessage(id);

      if (result.success) {
        // Remove the message from the list
        setMessages(prev => prev.filter(msg => msg.id !== id));
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      setError('Failed to delete message');
      console.error('Error deleting message:', err);
      return { success: false, error: 'Failed to delete message' };
    }
  }, []);

  const fetchStatistics = useCallback(async () => {
    try {
      const result = await contactService.getStatistics();

      if (result.success) {
        setStatistics(result.data);
        return result.data;
      } else {
        setError(result.error);
        return null;
      }
    } catch (err) {
      setError('Failed to fetch statistics');
      console.error('Error fetching statistics:', err);
      return null;
    }
  }, []);

  const refreshMessages = useCallback(() => {
    return fetchMessages();
  }, [fetchMessages]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchMessages();
      fetchStatistics();
    }
  }, [autoFetch, fetchMessages, fetchStatistics]);

  return {
    messages,
    loading,
    error,
    pagination,
    statistics,
    fetchMessages,
    fetchMessageById,
    respondToMessage,
    markAsRead,
    deleteMessage,
    fetchStatistics,
    refreshMessages
  };
}; 