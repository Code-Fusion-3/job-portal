import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Building2,
  Calendar,
  Clock,
  MessageSquare,
  Send,
  X,
  RefreshCw,
  DollarSign,
  Eye,
  FileText,
  CheckCircle,
  UserCheck,
  UserX,
  AlertCircle,
  CreditCard,
  History,
  Search,
  Filter,
  LogOut,
  Home,
  ArrowLeft
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import API_CONFIG from '../../api/config/apiConfig';
import Modal from '../../components/ui/Modal';
import RequestDetailsModal from '../../components/modals/RequestDetailsModal';
import employerDashboardService from '../../api/services/employerDashboardService';
import messagingService from '../../api/services/messagingService';
import { useAuth } from '../../contexts/AuthContext.jsx';

const EmployerDashboard = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingPaymentHistory, setLoadingPaymentHistory] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMessaging, setShowMessaging] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messagingLoading, setMessagingLoading] = useState(false);

  // Payment confirmation state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentConfirmation, setPaymentConfirmation] = useState({
    confirmationName: '',
    confirmationPhone: '',
    paymentReference: '',
    transferAmount: '',
    transferDate: '',
    notes: ''
  });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState('');

  // Hiring decision modal states
  const [showHiringDecisionModal, setShowHiringDecisionModal] = useState(false);
  const [hiringDecision, setHiringDecision] = useState('');
  const [hiringDecisionNotes, setHiringDecisionNotes] = useState('');
  const [hiringDecisionLoading, setHiringDecisionLoading] = useState(false);

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
    setMessagingLoading(true);
    try {
      const token = localStorage.getItem('job_portal_token');
      console.log('Token found:', !!token, token ? 'exists' : 'missing');

      if (!token) {
        console.error('No authentication token found');
        setMessages([]);
        return;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/messaging/request/${requestId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        console.error('Failed to fetch messages, status:', response.status);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setMessagingLoading(false);
    }
  };

  // Payment history functions
  const fetchPaymentHistory = async (requestId) => {
    setLoadingPaymentHistory(true);
    try {
      const token = localStorage.getItem('job_portal_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/payments/details/${requestId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        // The API now returns an array of payments with more details
        if (data.payments && Array.isArray(data.payments)) {
          // Transform payments data to match the expected structure
          const transformedPayments = data.payments.map(payment => ({
            id: payment.id,
            payment: {
              id: payment.id,
              amount: payment.amount,
              currency: payment.currency,
              paymentMethod: payment.paymentMethod,
              paymentType: payment.paymentType,
              status: payment.status,
              description: payment.description,
              createdAt: payment.createdAt,
              updatedAt: payment.updatedAt,
              confirmationName: payment.confirmationName,
              confirmationPhone: payment.confirmationPhone,
              confirmationDate: payment.confirmationDate,
              confirmationReference: payment.confirmationReference,
              adminNotes: payment.adminNotes
            }
          }));
          setPaymentHistory(transformedPayments);
        } else {
          setPaymentHistory([]);
        }
      } else {
        console.error('Failed to fetch payment history, using latestPayment if available');
        console.log('selectedRequest:', selectedRequest);
        console.log('latestPayment:', selectedRequest?.latestPayment);
        // Fallback to latestPayment from the request object if API fails
        if (selectedRequest?.latestPayment) {
          console.log('Setting paymentHistory with latestPayment:', selectedRequest.latestPayment);
          setPaymentHistory([selectedRequest.latestPayment]);
        } else {
          console.log('No latestPayment found, setting empty array');
          setPaymentHistory([]);
        }
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
      console.log('selectedRequest in catch:', selectedRequest);
      console.log('latestPayment in catch:', selectedRequest?.latestPayment);
      // Fallback to latestPayment from the request object if API fails
      if (selectedRequest?.latestPayment) {
        console.log('Setting paymentHistory with latestPayment in catch:', selectedRequest.latestPayment);
        setPaymentHistory([selectedRequest.latestPayment]);
      } else {
        console.log('No latestPayment found in catch, setting empty array');
        setPaymentHistory([]);
      }
    } finally {
      setLoadingPaymentHistory(false);
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

  // Close details modal
  const closeDetails = () => {
    setShowDetails(false);
    setSelectedRequest(null);
    setMessages([]);
    setNewMessage('');
    setPaymentHistory([]);
  };

  // Handle backdrop click to close modals
  const handleBackdropClick = (e, modalType) => {
    if (e.target === e.currentTarget) {
      if (modalType === 'messaging') {
        closeMessaging();
      } else if (modalType === 'details') {
        closeDetails();
      }
    }
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
  const openDetails = (request) => {
    setSelectedRequest(request);
    setShowDetails(true);
    // Load messages for this request
    fetchMessages(request.id);
    // Load payment history for this request
    fetchPaymentHistory(request.id);
  };

  // Add 'Request Full Details' action for employer
  const requestFullDetails = async (request) => {
    if (!request || request.status !== 'photo_access_granted') return;
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/employer/requests/${request.id}/request-full-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        },
        body: JSON.stringify({ reason: '' })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Full details request submitted. Admin will review your request.');
        fetchDashboardData();
      } else {
        toast.error(data.error || 'Failed to request full details.');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
  };

  // Open hiring decision modal
  const openHiringDecisionModal = (request, decision) => {
    setSelectedRequest(request);
    setHiringDecision(decision);
    setHiringDecisionNotes('');
    setShowHiringDecisionModal(true);
  };

  // Close hiring decision modal
  const closeHiringDecisionModal = () => {
    setShowHiringDecisionModal(false);
    setSelectedRequest(null);
    setHiringDecision('');
    setHiringDecisionNotes('');
  };

  // Submit hiring decision
  const submitHiringDecision = async () => {
    if (!selectedRequest || !hiringDecision) return;

    setHiringDecisionLoading(true);
    try {
      const endpoint = hiringDecision === 'hired'
        ? `${API_CONFIG.BASE_URL}/employer/requests/${selectedRequest.id}/mark-hired`
        : `${API_CONFIG.BASE_URL}/employer/requests/${selectedRequest.id}/mark-not-hired`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        },
        body: JSON.stringify({
          decision: hiringDecision,
          notes: hiringDecisionNotes
        })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Hiring decision recorded: ${hiringDecision === 'hired' ? 'Hired' : 'Not Hired'}`);
        closeHiringDecisionModal();
        fetchDashboardData();
      } else {
        toast.error(data.error || 'Failed to submit hiring decision');
      }
    } catch (error) {
      console.error('Error submitting hiring decision:', error);
      toast.error('Failed to submit hiring decision');
    } finally {
      setHiringDecisionLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  // Handle back to platform (homepage)
  const handleBackToPlatform = () => {
    window.location.href = '/';
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

  // Payment confirmation functions
  const openPaymentModal = (request) => {
    console.log('🔍 PAYMENT MODAL DEBUG:', {
      request_id: request.id,
      status: request.status,
      latestPayment_exists: !!request.latestPayment,
      latestPayment_id: request.latestPayment?.id,
      latestPayment_amount: request.latestPayment?.amount,
      paymentMethod_exists: !!request.latestPayment?.paymentMethod,
      paymentMethod_name: request.latestPayment?.paymentMethod?.name,
      full_latestPayment: request.latestPayment
    });
    setSelectedRequest(request);
    setShowPaymentModal(true);
    setPaymentConfirmation({
      confirmationName: '',
      confirmationPhone: '',
      paymentReference: '',
      transferAmount: '',
      transferDate: '',
      notes: ''
    });
    setPaymentError('');
    setPaymentSuccess('');
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentConfirmation({
      confirmationName: '',
      confirmationPhone: '',
      paymentReference: '',
      transferAmount: '',
      transferDate: '',
      notes: ''
    });
    setPaymentError('');
    setPaymentSuccess('');
  };

  const handlePaymentConfirmation = async (e) => {
    e.preventDefault();

    if (!paymentConfirmation.confirmationName || !paymentConfirmation.confirmationPhone) {
      setPaymentError('Please provide your name and phone number');
      return;
    }

    try {
      setPaymentLoading(true);
      setPaymentError('');

      const response = await fetch(`${API_CONFIG.BASE_URL}/payment-confirmations/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        },
        body: JSON.stringify({
          paymentId: selectedRequest.latestPayment?.id,
          confirmationName: paymentConfirmation.confirmationName,
          confirmationPhone: paymentConfirmation.confirmationPhone,
          paymentReference: paymentConfirmation.paymentReference,
          transferAmount: selectedRequest.latestPayment?.amount || selectedRequest.paymentAmount,
          transferDate: paymentConfirmation.transferDate,
          notes: paymentConfirmation.notes
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Payment confirmation submitted successfully!');
        closePaymentModal();
        // Refresh dashboard data
        fetchDashboardData();
        // Reset payment confirmation form
        setPaymentConfirmation({
          confirmationName: '',
          confirmationPhone: '',
          paymentReference: '',
          transferAmount: '',
          transferDate: '',
          notes: ''
        });
        setPaymentSuccess('Payment confirmation submitted successfully!');
      } else {
        const errorMessage = data.error || 'Failed to submit payment confirmation';
        setPaymentError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error submitting payment confirmation:', error);
      setPaymentError('Network error. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Filter requests based on search and status
  const filteredRequests = dashboardData?.requests?.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesSearch = request.candidate?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.candidate?.skills?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }) || [];

  // 1. Update status color and progress logic for all new statuses
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'first_payment_required': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'first_payment_confirmed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'photo_access_granted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'full_details_requested': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'second_payment_required': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'second_payment_confirmed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'full_access_granted': return 'bg-green-100 text-green-800 border-green-200';
      case 'hiring_decision_made': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'hired': return 'bg-green-200 text-green-900 border-green-300';
      case 'available': return 'bg-blue-200 text-blue-900 border-blue-300';
      case 'process_complete': return 'bg-gray-200 text-gray-900 border-gray-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
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

  // 2. Show/hide action buttons based on status
  const getAvailableActions = (request) => {
    const actions = [];
    if (request.status === 'first_payment_required' || request.status === 'second_payment_required') {
      actions.push('pay');
    }
    if (request.status === 'photo_access_granted') {
      actions.push('request_full_details');
      actions.push('exit_process');
    }
    if (request.status === 'full_access_granted') {
      actions.push('hiring_decision');
    }
    // Add more as needed
    return actions;
  };

  // 3. Hide employer identity from candidate until 'hired' status
  // (Assume candidate view logic is handled elsewhere, but ensure employer details are not shown unless request.status === 'hired')
  // 4. Add TODO for in-app notification display
  // TODO: Integrate in-app notification display here

  // Get progress percentage based on status
  const getProgressPercentage = (request) => {
    switch (request.status) {
      case 'pending': return 10;
      case 'approved': return 20;
      case 'first_payment_required': return 30;
      case 'first_payment_confirmed': return 40;
      case 'photo_access_granted': return 50;
      case 'full_details_requested': return 60;
      case 'second_payment_required': return 70;
      case 'second_payment_confirmed': return 80;
      case 'full_access_granted': return 90;
      case 'hiring_decision_made': return 95;
      case 'hired': return 100;
      case 'available': return 100;
      case 'process_complete': return 100;
      case 'cancelled': return 0;
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

  // Unify Confirm Payment and Messages modal appearance with Request Details modal
  // Use the same overlay and modal styling for all three modals
  const ModalOverlay = ({ children, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-20" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-200">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 relative">
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
                onClick={handleBackToPlatform}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                title="Back to Platform"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Platform</span>
              </button>
              <button
                onClick={fetchDashboardData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
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
                <option value="approved">Approved</option>
                <option value="first_payment_required">First Payment Required</option>
                <option value="first_payment_confirmed">First Payment Confirmed</option>
                <option value="photo_access_granted">Photo Access Granted</option>
                <option value="full_details_requested">Full Details Requested</option>
                <option value="second_payment_required">Second Payment Required</option>
                <option value="second_payment_confirmed">Second Payment Confirmed</option>
                <option value="full_access_granted">Full Access Granted</option>
                <option value="hiring_decision_made">Hiring Decision Made</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                {/* Legacy statuses for backward compatibility */}
                <option value="payment_required">Payment Required (Legacy)</option>
                <option value="payment_confirmed">Payment Confirmed (Legacy)</option>
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
            <h3 className="text-lg font-semibold text-gray-900">Your Requestsyyy</h3>
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
                          {(request.status === 'payment_required' || request.status === 'first_payment_required' || request.status === 'second_payment_required') && request.paymentRequired && (
                            <button
                              onClick={() => openPaymentModal(request)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs transition-colors flex items-center space-x-1"
                            >
                              <DollarSign className="h-3 w-3" />
                              <span>Confirm Payment</span>
                            </button>
                          )}
                          {request.status === 'photo_access_granted' && (
                            <button
                              onClick={() => requestFullDetails(request)}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-xs transition-colors flex items-center space-x-1"
                            >
                              <Eye className="h-3 w-3" />
                              <span>Request Full Details</span>
                            </button>
                          )}
                          {request.status === 'full_access_granted' && (
                            <>
                              <button
                                onClick={() => openHiringDecisionModal(request, 'hired')}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs transition-colors flex items-center space-x-1"
                              >
                                <UserCheck className="h-3 w-3" />
                                <span>Hire</span>
                              </button>
                              <button
                                onClick={() => openHiringDecisionModal(request, 'not_hired')}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs transition-colors flex items-center space-x-1"
                              >
                                <UserX className="h-3 w-3" />
                                <span>Not Hire</span>
                              </button>
                            </>
                          )}
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
        <Modal
          isOpen={showMessaging}
          onClose={closeMessaging}
          title={`Messages`}
          maxWidth="max-w-2xl"
        >
          {/* Modal content */}
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
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
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${message.fromAdmin
                      ? 'bg-white text-gray-900 border border-gray-200'
                      : 'bg-blue-600 text-white'
                      }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div className={`text-xs mt-1 ${message.fromAdmin ? 'text-gray-500' : 'text-blue-100'
                      }`}>
                      {new Date(message.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white rounded-b-xl">
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
        </Modal>
      )}

      {/* Request Details Modal */}
      <RequestDetailsModal
        isOpen={showDetails && selectedRequest}
        onClose={closeDetails}
        selectedRequest={selectedRequest}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        messagingLoading={messagingLoading}
        paymentHistory={paymentHistory}
        loadingPaymentHistory={loadingPaymentHistory}
        getStatusColor={getStatusColor}
        getPriorityColor={getPriorityColor}
        getProgressColor={getProgressColor}
        getProgressPercentage={getProgressPercentage}
      />

      {/* Payment Confirmation Modal */}
      {showPaymentModal && selectedRequest && (
        <Modal
          isOpen={showPaymentModal}
          onClose={closePaymentModal}
          title={`Confirm Payment`}
          maxWidth="max-w-2xl"
        >
          {/* Modal content */}

          <div className="flex-1 p-6 bg-gray-50">
            <form onSubmit={handlePaymentConfirmation} className="space-y-6">
              {/* Payment Information */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-3">Payment Details:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700 font-medium">Amount:</span>
                    <span className="text-blue-900 font-semibold">
                      {selectedRequest.latestPayment
                        ? `${selectedRequest.latestPayment.amount} ${selectedRequest.latestPayment.currency}`
                        : `${selectedRequest.paymentAmount} ${selectedRequest.paymentCurrency}` // Fallback
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 font-medium">Description:</span>
                    <span className="text-blue-900">
                      {selectedRequest.latestPayment?.description ||
                        (selectedRequest.status === 'second_payment_required'
                          ? 'Second payment for full candidate details access'
                          : 'First payment for candidate photo access')
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 font-medium">Payment Type:</span>
                    <span className="text-blue-900 capitalize">
                      {selectedRequest.latestPayment?.paymentType?.replace('_', ' ') || 'First Installment'}
                    </span>
                  </div>

                  {selectedRequest.latestPayment?.paymentMethod && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-blue-700 font-medium">Payment Method:</span>
                        <span className="text-blue-900">{selectedRequest.latestPayment.paymentMethod.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700 font-medium">Account Name:</span>
                        <span className="text-blue-900">{selectedRequest.latestPayment.paymentMethod.accountName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700 font-medium">Account Number:</span>
                        <span className="text-blue-900 font-mono">{selectedRequest.latestPayment.paymentMethod.accountNumber}</span>
                      </div>
                      {selectedRequest.latestPayment.paymentMethod.bankName && (
                        <div className="flex justify-between">
                          <span className="text-blue-700 font-medium">Bank:</span>
                          <span className="text-blue-900">{selectedRequest.latestPayment.paymentMethod.bankName}</span>
                        </div>
                      )}
                    </>
                  )}
                  {!selectedRequest.latestPayment?.paymentMethod && (
                    <div className="text-amber-700 text-xs bg-amber-50 p-2 rounded border border-amber-200">
                      ⚠️ Payment method details not available. Please contact admin for payment instructions.
                    </div>
                  )}
                </div>
              </div>

              {/* Confirmation Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={paymentConfirmation.confirmationName}
                    onChange={(e) => setPaymentConfirmation({ ...paymentConfirmation, confirmationName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="As shown on transfer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={paymentConfirmation.confirmationPhone}
                    onChange={(e) => setPaymentConfirmation({ ...paymentConfirmation, confirmationPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+250123456789"
                    required
                  />
                </div>
                {/* Payment Reference is now hidden in the Confirm Payment modal. */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transfer Amount (Admin Requested)
                  </label>
                  <input
                    type="number"
                    value={
                      selectedRequest.latestPayment?.amount ||
                      selectedRequest.paymentAmount ||
                      ''
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                    placeholder="Amount set by admin"
                    min="0"
                    step="100"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">This amount cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transfer Date
                  </label>
                  <input
                    type="date"
                    value={paymentConfirmation.transferDate}
                    onChange={(e) => setPaymentConfirmation({ ...paymentConfirmation, transferDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={paymentConfirmation.notes}
                  onChange={(e) => setPaymentConfirmation({ ...paymentConfirmation, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Any additional information about your payment..."
                />
              </div>

              {/* Error Display */}
              {paymentError && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  {paymentError}
                </div>
              )}

              {/* Success Message Display */}
              {paymentSuccess && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                  {paymentSuccess}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closePaymentModal}
                  disabled={paymentLoading}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 flex items-center space-x-2"
                >
                  {paymentLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-4 w-4" />
                      <span>Confirm Payment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Hiring Decision Modal */}
      {showHiringDecisionModal && selectedRequest && (
        <Modal
          isOpen={showHiringDecisionModal}
          onClose={closeHiringDecisionModal}
          title={`${hiringDecision === 'hired' ? 'Hire' : 'Not Hire'} Candidate`}
          maxWidth="max-w-md"
        >
          <div className="space-y-6">
            <div className="text-center">
              <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${hiringDecision === 'hired' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                {hiringDecision === 'hired' ? (
                  <UserCheck className={`h-6 w-6 text-green-600`} />
                ) : (
                  <UserX className={`h-6 w-6 text-red-600`} />
                )}
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                {hiringDecision === 'hired' ? 'Hire Candidate' : 'Not Hire Candidate'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Are you sure you want to mark <strong>{selectedRequest.candidate?.name}</strong> as{' '}
                {hiringDecision === 'hired' ? 'hired' : 'not hired'}?
              </p>
            </div>

            <div>
              <label htmlFor="hiringNotes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="hiringNotes"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Add any notes about your ${hiringDecision === 'hired' ? 'hiring' : 'rejection'} decision...`}
                value={hiringDecisionNotes}
                onChange={(e) => setHiringDecisionNotes(e.target.value)}
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={closeHiringDecisionModal}
                className="flex-1 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitHiringDecision}
                disabled={hiringDecisionLoading}
                className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${hiringDecision === 'hired'
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
              >
                {hiringDecisionLoading ? (
                  <>
                    <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    {hiringDecision === 'hired' ? (
                      <UserCheck className="h-4 w-4 mr-2" />
                    ) : (
                      <UserX className="h-4 w-4 mr-2" />
                    )}
                    <span>Confirm {hiringDecision === 'hired' ? 'Hire' : 'Not Hire'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast notifications */}
      <Toaster position="top-right" />
    </div>
  );
};

export default EmployerDashboard;
