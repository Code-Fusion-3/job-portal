import React, { useState, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, AlertCircle, Info, CheckCircle } from 'lucide-react';
import NotificationService from '../../api/services/notificationService';
import toast from 'react-hot-toast';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [optOutTypes, setOptOutTypes] = useState([]);

  useEffect(() => {
    fetchNotifications();
    fetchStats();
    fetchOptOutTypes();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await NotificationService.getUserNotifications();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await NotificationService.getNotificationStats();
      setStats(data.stats || { total: 0, unread: 0, read: 0 });
    } catch (error) {
      console.error('Error fetching notification stats:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, isRead: true, readAt: new Date().toISOString() }
            : notif
        )
      );
      setStats(prev => ({
        ...prev,
        unread: prev.unread - 1,
        read: prev.read + 1
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true, readAt: new Date().toISOString() }))
      );
      setStats(prev => ({
        ...prev,
        unread: 0,
        read: prev.total
      }));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const fetchOptOutTypes = async () => {
    try {
      const data = await NotificationService.getNotificationPreferences();
      setOptOutTypes(data.optedOutTypes || []);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    }
  };
  const toggleOptOut = async (type) => {
    try {
      await NotificationService.toggleNotificationPreference(type);
      fetchOptOutTypes();
    } catch (error) {
      console.error('Error toggling notification preference:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'request_received': return <Info className="w-5 h-5 text-blue-500" />;
      case 'request_approved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'hired': return <CheckCheck className="w-5 h-5 text-emerald-600" />;
      case 'cancelled': return <X className="w-5 h-5 text-red-500" />;
      case 'payment_confirmed':
      case 'photo_access_granted':
      case 'full_access_granted':
      case 'matched_with_employer':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'request_rejected':
      case 'payment_rejected':
      case 'full_details_rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'payment_request':
      case 'full_details_requested':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {stats.unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {stats.unread > 9 ? '9+' : stats.unread}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {stats.unread > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {stats.unread} unread of {stats.total} total
            </p>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications yet</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50' : ''
                    }`}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Opt-out controls for candidates */}
          {/* Assuming 'user' is available in the component's scope or passed as a prop */}
          {/* For now, adding a placeholder for user role */}
          {/* In a real application, you'd fetch user data or pass it as a prop */}
          {/* <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Notification Preferences</h4>
            <div className="flex flex-wrap gap-2">
              {['request_received', 'request_approved', 'hired', 'cancelled'].map(type => (
                <button
                  key={type}
                  onClick={() => toggleOptOut(type)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${optOutTypes.includes(type) ? 'bg-gray-200 text-gray-500 border-gray-300' : 'bg-blue-100 text-blue-700 border-blue-200'}`}
                >
                  {optOutTypes.includes(type) ? 'Opted Out' : 'Opt In'}: {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div> */}

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={fetchNotifications}
                className="text-sm text-blue-600 hover:text-blue-800 w-full text-center"
              >
                Refresh notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
