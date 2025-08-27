import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  DollarSign, 
  Eye, 
  EyeOff, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Users,
  MessageSquare,
  ArrowRight,
  Filter,
  Search,
  RefreshCw,
  Send,
  Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import employerDashboardService from '../../api/services/employerDashboardService';
import messagingService from '../../api/services/messagingService';
import { useAuth } from '../../api/hooks/useAuth';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMessaging, setShowMessaging] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messagingLoading, setMessagingLoading] = useState(false);

  // Helper function to safely format location data
  const formatLocation = (location, city, country) => {
    const locationParts = [];
    if (location && typeof location === 'string') locationParts.push(location);
    if (city && typeof city === 'string') locationParts.push(city);
    if (country && typeof country === 'string') locationParts.push(country);
    return locationParts.length > 0 ? locationParts.join(', ') : 'Not specified';
  };

  // Helper function to safely display text fields
  const safeText = (value, fallback = 'Not specified') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'string') return value.trim() || fallback;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value.toString();
    return fallback;
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const data = await employerDashboardService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a request
  const fetchMessages = async (requestId) => {
    try {
      setMessagingLoading(true);
      const data = await messagingService.getMessagesByRequest(requestId);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setMessagingLoading(false);
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRequest) return;

    try {
      setMessagingLoading(true);
      await messagingService.sendMessage(selectedRequest.id, {
        content: newMessage.trim(),
        messageType: 'text'
      });
      
      setNewMessage('');
      // Refresh messages
      await fetchMessages(selectedRequest.id);
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setMessagingLoading(false);
    }
  };

  // Open messaging for a request
  const openMessaging = async (request) => {
    setSelectedRequest(request);
    setShowMessaging(true);
    await fetchMessages(request.id);
  };

  // Close messaging
  const closeMessaging = () => {
    setShowMessaging(false);
    setSelectedRequest(null);
    setMessages([]);
    setNewMessage('');
  };

  // Mark messages as read
  const markMessagesAsRead = async () => {
    if (!selectedRequest) return;

    try {
      await messagingService.markMessagesAsRead(selectedRequest.id);
      // Refresh messages to update read status
      await fetchMessages(selectedRequest.id);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Open details modal for a request
  const openDetails = async (request) => {
    setSelectedRequest(request);
    setShowDetails(true);
    // Fetch messages for this request to display in the details modal
    await fetchMessages(request.id);
  };

  // Close details modal
  const closeDetails = () => {
    setShowDetails(false);
    setSelectedRequest(null);
  };

  // Load dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Mark messages as read when messaging is opened
  useEffect(() => {
    if (showMessaging && selectedRequest) {
      markMessagesAsRead();
    }
  }, [showMessaging, selectedRequest]);

  // Filter requests based on search and status
  const filteredRequests = dashboardData?.requests?.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesSearch = request.candidate?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.candidate?.skills?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }) || [];

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'payment_required': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'payment_confirmed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get progress percentage based on status
  const getProgressPercentage = (request) => {
    switch (request.status) {
      case 'pending': return 20;
      case 'reviewing': return 40;
      case 'payment_required': return 60;
      case 'payment_confirmed': return 80;
      case 'approved': return 90;
      case 'completed': return 100;
      default: return 0;
    }
  };

  // Get progress color
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load dashboard data</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Requests',
      value: dashboardData.stats.totalRequests,
      icon: FileText,
      color: 'bg-blue-500',
  
    },
    {
      title: 'Pending Payments',
      value: dashboardData.stats.paymentRequired,
      icon: DollarSign,
      color: 'bg-yellow-500',

    },
    {
      title: 'Approved Requests',
      value: dashboardData.stats.approvedRequests,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      title: 'Unread Messages',
      value: dashboardData.stats.unreadMessages,
      icon: MessageSquare,
      color: 'bg-purple-500',

    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {dashboardData.employer?.name || 'Employer'}! 
                Manage your job seeker requests and payments
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={fetchDashboardData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>

                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search candidates or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="payment_required">Payment Required</option>
                <option value="payment_confirmed">Payment Confirmed</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Filter className="h-4 w-4" />
              <span>{filteredRequests.length} of {dashboardData.stats.totalRequests} requests</span>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Your Requests</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills & Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => {
                  const progress = getProgressPercentage(request);
                  return (
                    <motion.tr
                      key={request.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.candidate?.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            Requested {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{request.candidate?.skills || 'Not specified'}</div>
                        <div className="text-sm text-gray-500">{request.candidate?.experienceLevel || 'Not specified'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {request.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                          {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(progress)}`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openMessaging(request)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs transition-colors flex items-center space-x-1"
                          >
                            <MessageSquare className="h-3 w-3" />
                            <span>Message</span>
                          </button>
                          <button 
                            onClick={() => openDetails(request)}
                            className="text-blue-600 hover:text-blue-900 text-xs"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters.'
                : 'Get started by submitting your first job seeker request.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Messaging Modal */}
      {showMessaging && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Messages - Request #{selectedRequest.id}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedRequest.candidate?.name || 'N/A'} • {selectedRequest.status}
                </p>
              </div>
              <button
                onClick={closeMessaging}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messagingLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No messages yet</p>
                  <p className="text-sm text-gray-500">Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.fromAdmin ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.fromAdmin
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div className={`text-xs mt-1 ${
                        message.fromAdmin ? 'text-gray-500' : 'text-blue-100'
                      }`}>
                        {new Date(message.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || messagingLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Request Details - #{selectedRequest.id}
              </h3>
              <button
                onClick={closeDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Request Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Request Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Request ID</p>
                    <p className="text-base font-semibold text-gray-900">#{selectedRequest.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Priority</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(selectedRequest.priority)}`}>
                      {selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Created</p>
                    <p className="text-base text-gray-900">{new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Progress</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(getProgressPercentage(selectedRequest))}`}
                          style={{ width: `${getProgressPercentage(selectedRequest)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">{getProgressPercentage(selectedRequest)}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Message Count</p>
                    <p className="text-base text-gray-900">{selectedRequest.messageCount || 0}</p>
                  </div>
                </div>
                
                {/* Employer's Original Message */}
                {selectedRequest.message && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">Your Request Message</p>
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-900">{selectedRequest.message}</p>
                    </div>
                  </div>
                )}
                
                {/* Latest Progress Update */}
                {selectedRequest.latestProgress && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">Latest Progress Update</p>
                    <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-900">{selectedRequest.latestProgress.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(selectedRequest.latestProgress.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Candidate Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Candidate Information</h4>
                
                {/* Candidate Photo */}
                {selectedRequest.candidate?.photo && selectedRequest.imageAccessGranted ? (
                  <div className="mb-4 flex justify-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                      <img 
                        src={selectedRequest.candidate.photo} 
                        alt="Candidate" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm" style={{ display: 'none' }}>
                        Photo
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 flex justify-center">
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="text-xs">
                          {selectedRequest.imageAccessGranted ? 'No Photo' : 'Photo Access Required'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Name</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRequest.candidate?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Skills</p>
                    <p className="text-base text-gray-900">{selectedRequest.candidate?.skills || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Experience</p>
                    <p className="text-base text-gray-900">{selectedRequest.candidate?.experience || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Experience Level</p>
                    <p className="text-base text-gray-900">{selectedRequest.candidate?.experienceLevel || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Education Level</p>
                    <p className="text-base text-gray-900">{selectedRequest.candidate?.educationLevel || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Monthly Rate</p>
                    <p className="text-base text-gray-900">
                      {selectedRequest.candidate?.monthlyRate ? `${selectedRequest.candidate.monthlyRate} RWF` : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    <p className="text-base text-gray-900">
                      {formatLocation(selectedRequest.candidate?.location, selectedRequest.candidate?.city, selectedRequest.candidate?.country)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Availability</p>
                    <p className="text-base text-gray-900">{selectedRequest.candidate?.availability || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Languages</p>
                    <p className="text-base text-gray-900">{selectedRequest.candidate?.languages || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Certifications</p>
                    <p className="text-base text-gray-900">{selectedRequest.candidate?.certifications || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Gender</p>
                    <p className="text-base text-gray-900">{selectedRequest.candidate?.gender || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Marital Status</p>
                    <p className="text-base text-gray-900">{selectedRequest.candidate?.maritalStatus || 'Not specified'}</p>
                  </div>
                  
                  {/* Job Category */}
                  <div>
                    <p className="text-sm font-medium text-gray-700">Job Category</p>
                    <p className="text-base text-gray-900">
                      {selectedRequest.candidate?.jobCategory?.name_en || 'Not specified'}
                      {selectedRequest.candidate?.jobCategory?.name_rw && (
                        <span className="block text-sm text-gray-500 mt-1">
                          {selectedRequest.candidate.jobCategory.name_rw}
                        </span>
                      )}
                    </p>
                  </div>
                  
                  {/* Contact Information - Only show if access granted */}
                  {selectedRequest.contactAccessGranted ? (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Contact Number</p>
                      <p className="text-base text-gray-900">{selectedRequest.candidate?.contactNumber || 'Not specified'}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Contact Number</p>
                      <p className="text-base text-gray-400 italic">Contact access required</p>
                    </div>
                  )}
                </div>
                
                {selectedRequest.candidate?.description && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">Description</p>
                    <p className="text-base text-gray-900 mt-1">{selectedRequest.candidate.description}</p>
                  </div>
                )}
              </div>

              {/* Selected User Information (if different from requested candidate) */}
              {selectedRequest.selectedUser && selectedRequest.selectedUser.id !== selectedRequest.candidate?.id && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Selected Candidate Information</h4>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 mb-3">
                      <strong>Note:</strong> Admin has selected a different candidate than the one you requested.
                    </p>
                    
                    {/* Selected User Photo */}
                    {selectedRequest.selectedUser?.photo && selectedRequest.imageAccessGranted ? (
                      <div className="mb-4 flex justify-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-200">
                          <img 
                            src={selectedRequest.selectedUser.photo} 
                            alt="Selected Candidate" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-xs" style={{ display: 'none' }}>
                            Photo
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4 flex justify-center">
                        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                          <div className="text-center">
                            <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <p className="text-xs">
                              {selectedRequest.imageAccessGranted ? 'No Photo' : 'Photo Access Required'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Name</p>
                        <p className="text-base font-semibold text-gray-900">{selectedRequest.selectedUser.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Skills</p>
                        <p className="text-base text-gray-900">{selectedRequest.selectedUser.skills || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Experience</p>
                        <p className="text-base text-gray-900">{selectedRequest.selectedUser.experience || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Experience Level</p>
                        <p className="text-base text-gray-900">{selectedRequest.selectedUser.experienceLevel || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Education Level</p>
                        <p className="text-base text-gray-900">{selectedRequest.selectedUser.educationLevel || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Monthly Rate</p>
                        <p className="text-base text-gray-900">
                          {selectedRequest.selectedUser.monthlyRate ? `${selectedRequest.selectedUser.monthlyRate} RWF` : 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Location</p>
                        <p className="text-base text-gray-900">
                          {formatLocation(selectedRequest.selectedUser.location, selectedRequest.selectedUser.city, selectedRequest.selectedUser.country)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Availability</p>
                        <p className="text-base text-gray-900">{selectedRequest.selectedUser.availability || 'Not specified'}</p>
                      </div>
                      
                      {/* Contact Information - Only show if access granted */}
                      {selectedRequest.contactAccessGranted ? (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Contact Number</p>
                          <p className="text-base text-gray-900">{selectedRequest.selectedUser?.contactNumber || 'Not specified'}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Contact Number</p>
                          <p className="text-base text-gray-400 italic">Contact access required</p>
                        </div>
                      )}
                      
                      {/* Job Category */}
                      <div>
                        <p className="text-sm font-medium text-gray-700">Job Category</p>
                        <p className="text-base text-gray-900">
                          {selectedRequest.selectedUser?.jobCategory?.name_en || 'Not specified'}
                          {selectedRequest.selectedUser?.jobCategory?.name_rw && (
                            <span className="block text-sm text-gray-500 mt-1">
                              {selectedRequest.selectedUser.jobCategory.name_rw}
                            </span>
                          )}
                        </p>
                      </div>
                      
                      {/* Languages */}
                      <div>
                        <p className="text-sm font-medium text-gray-700">Languages</p>
                        <p className="text-base text-gray-900">{selectedRequest.selectedUser?.languages || 'Not specified'}</p>
                      </div>
                      
                      {/* Certifications */}
                      <div>
                        <p className="text-sm font-medium text-gray-700">Certifications</p>
                        <p className="text-base text-gray-900">{selectedRequest.selectedUser?.certifications || 'Not specified'}</p>
                      </div>
                      
                      {/* Gender */}
                      <div>
                        <p className="text-sm font-medium text-gray-700">Gender</p>
                        <p className="text-base text-gray-900">{selectedRequest.selectedUser?.gender || 'Not specified'}</p>
                      </div>
                      
                      {/* Marital Status */}
                      <div>
                        <p className="text-sm font-medium text-gray-700">Marital Status</p>
                        <p className="text-base text-gray-900">{selectedRequest.selectedUser?.maritalStatus || 'Not specified'}</p>
                      </div>
                      
                      {/* ID Number and References - Only show if full access granted */}
                      {selectedRequest.selectedUser?.accessLevel === 'full' && (
                        <>
                          <div>
                            <p className="text-sm font-medium text-gray-700">ID Number</p>
                            <p className="text-base text-gray-900">{selectedRequest.selectedUser?.idNumber || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">References</p>
                            <p className="text-base text-gray-900">{selectedRequest.selectedUser?.references || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Date of Birth</p>
                            <p className="text-base text-gray-900">
                              {selectedRequest.selectedUser?.dateOfBirth ? new Date(selectedRequest.selectedUser.dateOfBirth).toLocaleDateString() : 'Not specified'}
                            </p>
                          </div>
                        </>
                      )}
                      
                      {/* Access Level for Selected User */}
                      <div>
                        <p className="text-sm font-medium text-gray-700">Access Level</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedRequest.selectedUser?.accessLevel === 'full' ? 'bg-green-100 text-green-800 border-green-200' :
                          selectedRequest.selectedUser?.accessLevel === 'photo' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {selectedRequest.selectedUser?.accessLevel === 'full' ? 'Full Access' :
                           selectedRequest.selectedUser?.accessLevel === 'photo' ? 'Photo Access' : 'No Access'}
                        </span>
                      </div>
                    </div>
                    
                    {selectedRequest.selectedUser.description && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700">Description</p>
                        <p className="text-base text-gray-900">{selectedRequest.selectedUser.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Access Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Access Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Photo Access</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedRequest.imageAccessGranted 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {selectedRequest.imageAccessGranted ? 'Granted' : 'Not Granted'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Contact Access</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedRequest.contactAccessGranted 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {selectedRequest.contactAccessGranted ? 'Granted' : 'Not Granted'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Access Level</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedRequest.candidate?.accessLevel === 'full' ? 'bg-green-100 text-green-800 border-green-200' :
                      selectedRequest.candidate?.accessLevel === 'photo' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {selectedRequest.candidate?.accessLevel === 'full' ? 'Full Access' :
                       selectedRequest.candidate?.accessLevel === 'photo' ? 'Photo Access' : 'No Access'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              {selectedRequest.paymentRequired && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Amount Required</p>
                      <p className="text-base font-semibold text-green-600">
                        {selectedRequest.paymentAmount} {selectedRequest.paymentCurrency}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Due Date</p>
                      <p className="text-base text-gray-900">
                        {selectedRequest.paymentDueDate ? new Date(selectedRequest.paymentDueDate).toLocaleDateString() : 'Not specified'}
                      </p>
                    </div>
                    {selectedRequest.paymentDescription && (
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-700">Description</p>
                        <p className="text-base text-gray-900">{selectedRequest.paymentDescription}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Latest Payment Information */}
                  {selectedRequest.latestPayment && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700">Latest Payment</p>
                      <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Amount</p>
                            <p className="text-base font-semibold text-gray-900">
                              {selectedRequest.latestPayment.amount} {selectedRequest.latestPayment.currency}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Status</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              selectedRequest.latestPayment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              selectedRequest.latestPayment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {selectedRequest.latestPayment.status.charAt(0).toUpperCase() + selectedRequest.latestPayment.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(selectedRequest.latestPayment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Messages Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Messages</h4>
                {messagingLoading ? (
                  <div className="text-center py-4">
                    <RefreshCw className="animate-spin h-6 w-6 text-blue-500 mx-auto" />
                    <p className="text-gray-600">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-4">
                    <MessageSquare className="h-10 w-10 text-gray-400 mx-auto" />
                    <p className="text-gray-600">No messages yet for this request.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.fromAdmin ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.fromAdmin
                              ? 'bg-gray-100 text-gray-900'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          <div className="text-sm">{message.content}</div>
                          <div className={`text-xs mt-1 ${
                            message.fromAdmin ? 'text-gray-500' : 'text-blue-100'
                          }`}>
                            {new Date(message.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || messagingLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
