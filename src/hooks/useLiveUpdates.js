import { useEffect, useRef, useCallback } from 'react';
import API_CONFIG from '../api/config/apiConfig';

export const useLiveUpdates = (options = {}) => {
  const {
    enabled = true,
    interval = 30000, // 30 seconds
    endpoints = [],
    onDataUpdate = () => {},
    onError = () => {},
    websocketUrl = null
  } = options;

  const intervalRef = useRef(null);
  const wsRef = useRef(null);
  const isConnected = useRef(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeoutRef = useRef(null);

  // WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (!websocketUrl || !enabled || isConnected.current) return;

    // Clear any existing timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Limit reconnection attempts
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      // console.log('Max reconnection attempts reached, stopping WebSocket connection');
      return;
    }

    try {
      // Close existing connection if any
      if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
        wsRef.current.close();
      }

      wsRef.current = new WebSocket(websocketUrl);
      
      wsRef.current.onopen = () => {
        // console.log('ed');
        isConnected.current = true;
        reconnectAttempts.current = 0; // Reset attempts on successful connection
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onDataUpdate(data);
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        onError(error);
      };

      wsRef.current.onclose = (event) => {
        // console.log('WebSocket disconnected', event.code, event.reason);
        isConnected.current = false;
        
        // Only attempt to reconnect if not a normal closure and attempts remain
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000); // Exponential backoff, max 30s
          
          // console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, delay);
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          // console.log('Max reconnection attempts reached, switching to polling only');
        }
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      reconnectAttempts.current += 1;
    }
  }, [websocketUrl, enabled, onDataUpdate, onError]);

  // Polling mechanism for endpoints
  const pollEndpoints = useCallback(async () => {
    if (!enabled || endpoints.length === 0) return;

    try {
      const token = localStorage.getItem('job_portal_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const promises = endpoints.map(async (endpoint) => {
        try {
          // Skip authenticated endpoints if no token
          if ((endpoint.includes('/dashboard/') || endpoint.includes('/employer/')) && !token) {
            return { endpoint, error: 'No authentication token', success: false };
          }

          const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            headers: token ? headers : { 'Content-Type': 'application/json' },
            method: 'GET'
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          return { endpoint, data, success: true };
        } catch (error) {
          console.error(`Error polling ${endpoint}:`, error);
          return { endpoint, error, success: false };
        }
      });

      const results = await Promise.all(promises);
      const successfulResults = results.filter(result => result.success);
      
      if (successfulResults.length > 0) {
        onDataUpdate(successfulResults);
      }
    } catch (error) {
      console.error('Polling error:', error);
      onError(error);
    }
  }, [enabled, endpoints, onDataUpdate, onError]);

  // Start polling
  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (enabled && endpoints.length > 0) {
      // Initial poll
      pollEndpoints();
      
      // Set up interval
      intervalRef.current = setInterval(pollEndpoints, interval);
    }
  }, [enabled, endpoints, interval, pollEndpoints]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Manual refresh
  const refresh = useCallback(() => {
    pollEndpoints();
  }, [pollEndpoints]);

  // Cleanup function
  const cleanup = useCallback(() => {
    stopPolling();
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    isConnected.current = false;
    reconnectAttempts.current = 0;
  }, [stopPolling]);

  // Effects
  useEffect(() => {
    if (enabled) {
      // Only start WebSocket connection if URL is provided
      if (websocketUrl) {
        connectWebSocket();
      }
      
      // Start polling
      startPolling();
    }

    return cleanup;
  }, [enabled, websocketUrl, connectWebSocket, startPolling, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    isConnected: isConnected.current,
    refresh,
    stopPolling,
    startPolling
  };
}; 