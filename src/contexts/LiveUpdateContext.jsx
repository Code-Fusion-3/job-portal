import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useLiveUpdates as useLiveUpdatesHook } from '../hooks/useLiveUpdates';
import LiveNotification from '../components/ui/LiveNotification';

const LiveUpdateContext = createContext();

export const useLiveUpdates = () => {
  const context = useContext(LiveUpdateContext);
  if (!context) {
    throw new Error('useLiveUpdates must be used within a LiveUpdateProvider');
  }
  return context;
};

export const LiveUpdateProvider = ({ children }) => {
  const [liveData, setLiveData] = useState({
    dashboard: null,
    requests: null,
    jobSeekers: null,
    categories: null
  });
  
  const [lastUpdate, setLastUpdate] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [user] = useState(() => {
    try {
      const token = localStorage.getItem('job_portal_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          id: payload.userId,
          email: payload.email,
          role: payload.role
        };
      }
      return null;
    } catch (error) {
      console.error('Error parsing user from token:', error);
      return null;
    }
  });

  const notificationIdCounter = useRef(0);

  // Dashboard endpoints for polling - Fixed endpoints
  const dashboardEndpoints = user ? [
    '/dashboard/stats',
    '/employer/requests?limit=5',
    '/public/job-seekers?limit=5',
    '/categories' // Fixed: categories endpoint is at /categories, not /public/categories
  ] : [
    '/public/job-seekers?limit=5'
    // Removed /public/categories as it doesn't exist
  ];

  // Add notification function
  const addNotification = useCallback((notification) => {
    const id = `notification_${Date.now()}_${notificationIdCounter.current++}`;
    const newNotification = {
      ...notification,
      id,
      timestamp: Date.now()
    };

    // Prevent duplicate notifications with same message
    setNotifications(prev => {
      const isDuplicate = prev.some(n => 
        n.message === notification.message && 
        Date.now() - n.timestamp < 5000 // Within 5 seconds
      );
      
      if (isDuplicate) {
        return prev;
      }
      
      return [...prev, newNotification];
    });
  }, []);

  // Remove notification function
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Clear all notifications function
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Handle data updates
  const handleDataUpdate = useCallback((results) => {
    const timestamp = Date.now();
    const newData = { ...liveData };

    // Handle different data formats
    const dataArray = Array.isArray(results) ? results : [results];

    dataArray.forEach((item) => {
      if (item.endpoint && item.data) {
        // Polling data format
        if (item.endpoint.includes('dashboard/stats')) {
          newData.dashboard = item.data;
        } else if (item.endpoint.includes('employer/requests')) {
          newData.requests = item.data;
        } else if (item.endpoint.includes('job-seekers')) {
          newData.jobSeekers = item.data;
        } else if (item.endpoint.includes('categories')) {
          newData.categories = item.data;
        }
      } else if (item.type) {
        // WebSocket message format
        if (item.type === 'new_request' && item.data) {
          // Handle new request notification
          addNotification({
            message: `New request from ${item.data.name}`,
            type: 'info',
            duration: 5000
          });
        } else if (item.type === 'dashboard_update') {
          // Handle dashboard update notification
          addNotification({
            message: 'Dashboard updated',
            type: 'success',
            duration: 3000
          });
        }
      }
    });

    setLiveData(newData);
    setLastUpdate(timestamp);

    // Add notification for significant changes (but not too frequently)
    if (dataArray.length > 0 && (!lastUpdate || timestamp - lastUpdate > 10000)) {
      addNotification({
        message: 'Dashboard data updated',
        type: 'info',
        duration: 3000
      });
    }
  }, [liveData, lastUpdate, addNotification]);

  // Handle errors
  const handleError = useCallback((error) => {
    console.error('Live update error:', error);
    addNotification({
      message: 'Connection error. Retrying...',
      type: 'error',
      duration: 5000
    });
  }, [addNotification]);

  // Live updates hook
  const { isConnected, refresh, stopPolling, startPolling } = useLiveUpdatesHook({
    enabled: !!user,
    interval: 30000, // 30 seconds
    endpoints: dashboardEndpoints,
    onDataUpdate: handleDataUpdate,
    onError: handleError,
    websocketUrl: null // Temporarily disable WebSocket to stop the loop
  });

  // Manual refresh function
  const manualRefresh = useCallback(() => {
    refresh();
    addNotification({
      message: 'Refreshing data...',
      type: 'info',
      duration: 2000
    });
  }, [refresh, addNotification]);

  // Context value
  const contextValue = {
    liveData,
    lastUpdate,
    notifications,
    isConnected,
    addNotification,
    removeNotification,
    clearNotifications,
    manualRefresh,
    stopPolling,
    startPolling
  };

  return (
    <LiveUpdateContext.Provider value={contextValue}>
      {children}
      
      {/* Live Notifications */}
      {notifications.map(notification => (
        <LiveNotification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </LiveUpdateContext.Provider>
  );
};

 