import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Mail,
  Phone,
  Calendar,
  User,
  Building,
  RefreshCw,
  Play,
  MoreHorizontal,
  Search,
  Filter,
  X,
  Send,
  DollarSign,
  Banknote,
  Bell,
  BellRing,
  Trash as TrashIcon
} from 'lucide-react';
import { useRequests } from '../../api/hooks/useRequests.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { categoryService } from '../../api/services/categoryService.js';
import { useCategories } from '../../api/hooks/useCategories.js';
import { useJobSeekers } from '../../api/hooks/useJobSeekers.js';
import messagingService from '../../api/services/messagingService.js';
import EmployerRequestService from '../../api/services/employerRequestService.js';
import NotificationService from '../../api/services/notificationService.js';
import adminService from '../../api/services/adminService.js';
import WorkflowStatus from '../../components/workflow/WorkflowStatus.jsx';
import WorkflowProgress from '../../components/workflow/WorkflowProgress.jsx';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import StatsGrid from '../../components/ui/StatsGrid';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import defaultProfileImage from '../../assets/defaultProfileImage.jpeg';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import API_CONFIG from '../../api/config/apiConfig.js';

import { getStatusColor, getPriorityColor, handleContactEmployer } from '../../utils/adminHelpers';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const EmployerRequestsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Custom hook for rich data
  const [safeData, setSafeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageInfo, setPageInfo] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [cleaningData, setCleaningData] = useState(false);

  // Fetch data using the new rich data endpoint
  const fetchRequests = useCallback(async (page = currentPage, search = searchTerm, filterParams = filters) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = {
        page,
        limit: 10,
        search,
        ...filterParams
      };

      const result = await EmployerRequestService.getAllAdminRequests(queryParams);
      if (result.success) {
        setSafeData(result.data.requests || []);
        setTotalPages(result.data.pagination?.totalPages || 1);
        setTotalItems(result.data.pagination?.total || 0);
        setCurrentPage(result.data.pagination?.page || 1);
        setPageInfo(result.data.pagination || {});
      } else {
        setError(result.error || 'Failed to fetch requests');
      }
    } catch (error) {
      setError('An error occurred while fetching requests');
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filters]);

  // Pagination functions
  const goToPage = useCallback((page) => {
    setCurrentPage(page);
    fetchRequests(page, searchTerm, filters);
  }, [fetchRequests, searchTerm, filters]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const hasNextPage = useMemo(() => currentPage < totalPages, [currentPage, totalPages]);
  const hasPrevPage = useMemo(() => currentPage > 1, [currentPage]);

  const applyFilters = useCallback(() => {
    fetchRequests(currentPage, searchTerm, filters);
  }, [fetchRequests, currentPage, searchTerm, filters]);

  // Load initial data
  useEffect(() => {
    fetchRequests();
  }, []);

  // Search and filter functions
  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
    fetchRequests(1, term, filters);
  }, [filters, fetchRequests]);

  const handleFilterChange = useCallback((key, value) => {
    // Update both server-side filters and local form state
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Also update local filters for form display
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));

    setCurrentPage(1); // Reset to first page when filtering
    fetchRequests(1, searchTerm, newFilters);
  }, [filters, searchTerm, fetchRequests]);

  // Update search term function
  const setSearchTermUpdated = useCallback((term) => {
    handleSearchChange(term);
  }, [handleSearchChange]);

  // Update filters function  
  const setFiltersUpdated = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchRequests(1, searchTerm, newFilters);
  }, [searchTerm, fetchRequests]);

  // Legacy functions for compatibility
  const replyToRequest = () => { };
  const selectJobSeekerForRequest = () => { };

  // Clean testing data handler
  const handleCleanTestingData = async () => {
    const isConfirmed = window.confirm(
      '⚠️ DANGER: This will permanently delete all testing data!\n\n' +
      'This includes:\n' +
      '• All job seekers and their profiles\n' +
      '• All employer accounts and requests\n' +
      '• All payments and messages\n' +
      '• All notifications and progress data\n\n' +
      'This action CANNOT be undone!\n\n' +
      'Admin accounts and job categories will be preserved.\n\n' +
      'Are you absolutely sure you want to continue?'
    );

    if (!isConfirmed) return;

    // Double confirmation
    const secondConfirm = window.confirm(
      '🚨 FINAL WARNING!\n\n' +
      'You are about to delete ALL testing data.\n\n' +
      'Type "DELETE" in the next prompt to confirm:'
    );

    if (!secondConfirm) return;

    const userInput = window.prompt('Type "DELETE" to confirm deletion:');
    if (userInput !== 'DELETE') {
      alert('Deletion cancelled. You must type "DELETE" exactly as shown.');
      return;
    }

    setCleaningData(true);

    try {
      const result = await adminService.cleanTestingData();

      if (result.success) {
        alert(
          '✅ Testing data cleaned successfully!\n\n' +
          `Summary:\n` +
          `• ${result.summary.users || 0} users deleted\n` +
          `• ${result.summary.employerRequests || 0} employer requests deleted\n` +
          `• ${result.summary.profiles || 0} job seeker profiles deleted\n` +
          `• ${result.summary.payments || 0} payments deleted\n` +
          `• ${result.summary.messages || 0} messages deleted\n` +
          `• ${result.summary.notifications || 0} notifications deleted\n` +
          `• ${result.summary.contacts || 0} contacts deleted\n` +
          `• ${result.summary.auditLogs || 0} audit logs deleted\n\n` +
          'Preserved: Admin accounts, Job categories'
        );

        // Refresh the page data
        fetchRequests(1, '', {});
      } else {
        throw new Error(result.details || 'Failed to clean data');
      }
    } catch (error) {
      console.error('Error cleaning testing data:', error);
      alert(
        '❌ Failed to clean testing data!\n\n' +
        `Error: ${error.message}\n\n` +
        'Please check the console for more details and try again.'
      );
    } finally {
      setCleaningData(false);
    }
  };
  const updateRequestStatus = () => { };

  const { categories, loadingCategories, fetchCategories } = useCategories();

  // Filter options
  const filterOptions = {
    status: [
      { value: '', label: 'All Statuses' },
      { value: 'pending', label: 'Pending' },
      { value: 'approved', label: 'Approved' },
      { value: 'first_payment_required', label: 'First Payment Required' },
      { value: 'first_payment_confirmed', label: 'First Payment Confirmed' },
      { value: 'photo_access_granted', label: 'Photo Access Granted' },
      { value: 'full_details_requested', label: 'Full Details Requested' },
      { value: 'second_payment_required', label: 'Second Payment Required' },
      { value: 'second_payment_confirmed', label: 'Second Payment Confirmed' },
      { value: 'full_access_granted', label: 'Full Access Granted' },
      { value: 'hiring_decision_made', label: 'Hiring Decision Made' },
      { value: 'hired', label: 'Hired' },
      { value: 'available', label: 'Available' },
      { value: 'process_complete', label: 'Process Complete' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' },
      // Legacy statuses for backward compatibility
      { value: 'payment_required', label: 'Payment Required (Legacy)' },
      { value: 'payment_confirmed', label: 'Payment Confirmed (Legacy)' }
    ],
    priority: [
      { value: '', label: 'All Priorities' },
      { value: 'urgent', label: 'Urgent' },
      { value: 'high', label: 'High' },
      { value: 'normal', label: 'Normal' },
      { value: 'low', label: 'Low' }
    ],
    category: [
      { value: '', label: 'All Categories' },
      ...(categories || []).map(cat => ({
        value: cat.name_en.toLowerCase(),
        label: cat.name_en
      }))
    ],
    dateRange: [
      { value: '', label: 'All Time' },
      { value: 'today', label: 'Today' },
      { value: 'week', label: 'This Week' },
      { value: 'month', label: 'This Month' },
      { value: 'quarter', label: 'This Quarter' },
      { value: 'year', label: 'This Year' }
    ],
    monthlyRateRange: [
      { value: '', label: 'All Rates' },
      { value: '0-50000', label: '0 - 50,000 frw' },
      { value: '50000-100000', label: '50,000 - 100,000 frw' },
      { value: '100000-200000', label: '100,000 - 200,000 frw' },
      { value: '200000+', label: '200,000+ frw' }
    ],

  };

  // State management
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState('');

  // Candidate selection state
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateSelectionLoading, setCandidateSelectionLoading] = useState(false);
  const [candidateSelectionError, setCandidateSelectionError] = useState('');
  const [showCandidateDetails, setShowCandidateDetails] = useState(false);
  const [candidateDetailsType, setCandidateDetailsType] = useState('picture'); // 'picture' or 'full'

  // Completion state
  const [completionLoading, setCompletionLoading] = useState(false);

  // New workflow state
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [workflowAction, setWorkflowAction] = useState(null);
  const [workflowLoading, setWorkflowLoading] = useState(false);
  const [workflowError, setWorkflowError] = useState('');
  const [workflowNotes, setWorkflowNotes] = useState('');
  const [completionError, setCompletionError] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');
  const [actionLoadingStates, setActionLoadingStates] = useState({});

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationLoading, setNotificationLoading] = useState(false);

  // Messaging state
  const [showMessagingModal, setShowMessagingModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messagingLoading, setMessagingLoading] = useState(false);
  const [messagingError, setMessagingError] = useState('');

  // Payment state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentFormData, setPaymentFormData] = useState({
    amount: '',
    currency: 'RWF',
    description: '',
    paymentMethodId: '',
    paymentType: 'photo_access',
    dueDate: ''
  });

  // Payment approval state
  const [showPaymentApprovalModal, setShowPaymentApprovalModal] = useState(false);
  const [paymentApprovalLoading, setPaymentApprovalLoading] = useState(false);
  const [paymentApprovalError, setPaymentApprovalError] = useState('');
  const [paymentApprovalData, setPaymentApprovalData] = useState({
    action: 'approve',
    notes: ''
  });

  // Request details loading state
  const [requestDetailsLoading, setRequestDetailsLoading] = useState(false);

  // Search and Filter state (now using server-side filtering)
  // const [localSearchTerm, setLocalSearchTerm] = useState(''); // Replaced by searchTerm
  // const [localFilters, setLocalFilters] = useState({ // Replaced by filters
  const [localFilters, setLocalFilters] = useState({
    status: '',
    priority: '',
    category: '',
    dateRange: '',
    monthlyRateRange: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Centralized modal state reset function
  const resetModalStates = useCallback(() => {
    setShowActionModal(false);
    setCurrentAction(null);
    setSelectedRequest(null);
    setReplyMessage('');
    setAdminNotes('');
    setReplyError('');
    setCompletionNotes('');
    setCompletionError('');
    setSelectedCandidate(null);
    setCandidateSelectionError('');
    setShowDetailsModal(false);
    setShowMessagingModal(false);
    setMessages([]);
    setNewMessage('');
    setMessagingError('');
    setPaymentError('');
    setShowPaymentModal(false);
    setPaymentFormData({
      amount: '',
      currency: 'RWF',
      description: '',
      paymentMethodId: '',
      paymentType: 'photo_access',
      dueDate: ''
    });
    setPaymentError('');
    setShowPaymentApprovalModal(false);
    setPaymentApprovalData({
      action: 'approve',
      notes: ''
    });
    setPaymentApprovalError('');
    setRequestDetailsLoading(false);
  }, []);

  // Messaging functions
  const openMessaging = async (request) => {
    try {
      setSelectedRequest(request);
      setShowMessagingModal(true);
      setMessagingLoading(true);
      setMessagingError('');

      const response = await messagingService.getMessagesByRequest(request.id);
      setMessages(response.messages || []);
    } catch (error) {
      console.error('Error opening messaging:', error);
      setMessagingError('Failed to load messages');
      toast.error('Failed to load messages');
    } finally {
      setMessagingLoading(false);
    }
  };

  const closeMessaging = () => {
    setShowMessagingModal(false);
    setMessages([]);
    setNewMessage('');
    setMessagingError('');
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRequest) return;

    try {
      setMessagingLoading(true);
      setMessagingError('');

      await messagingService.sendMessage(selectedRequest.id, {
        content: newMessage.trim(),
        messageType: 'text'
      });

      setNewMessage('');
      // Refresh messages
      const response = await messagingService.getMessagesByRequest(selectedRequest.id);
      setMessages(response.messages || []);
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      setMessagingError('Failed to send message');
      toast.error('Failed to send message');
    } finally {
      setMessagingLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!selectedRequest) return;

    try {
      await messagingService.markMessagesAsRead(selectedRequest.id);
      // Refresh messages to update read status
      const response = await messagingService.getMessagesByRequest(selectedRequest.id);
      setMessages(response.messages || []);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Mark messages as read when messaging is opened
  useEffect(() => {
    if (showMessagingModal && selectedRequest) {
      markMessagesAsRead();
    }
  }, [showMessagingModal, selectedRequest]);

  // Notification functions
  const fetchNotifications = async () => {
    try {
      setNotificationLoading(true);
      const data = await NotificationService.getWorkflowNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to empty state
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setNotificationLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await NotificationService.markAsRead(notificationId);

      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();

      // Update local state
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const addWorkflowNotification = (type, message, requestId, status) => {
    const notification = {
      id: Date.now(),
      type,
      message,
      requestId,
      status,
      timestamp: new Date(),
      isRead: false
    };

    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show toast notification
    toast.success(message, {
      duration: 5000,
      position: 'top-right'
    });
  };

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications();

    // Set up polling for new notifications
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  // Payment functions
  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/payment-methods/active`);
      const data = await response.json();
      setPaymentMethods(data.paymentMethods || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to load payment methods');
    }
  };

  const openPaymentModal = async (request) => {
    setSelectedRequest(request);
    setShowPaymentModal(true);
    setPaymentFormData({
      amount: request.paymentAmount || '5000',
      currency: request.paymentCurrency || 'RWF',
      description: request.paymentDescription || '',
      paymentMethodId: '',
      paymentType: 'photo_access',
      dueDate: ''
    });
    await fetchPaymentMethods();
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentFormData({
      amount: '',
      currency: 'RWF',
      description: '',
      paymentMethodId: '',
      paymentType: 'photo_access',
      dueDate: ''
    });
    setPaymentError('');
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!paymentFormData.paymentMethodId || !paymentFormData.amount) {
      setPaymentError('Please select a payment method and enter amount');
      return;
    }

    try {
      setPaymentLoading(true);
      setPaymentError('');

      const response = await fetch(`${API_CONFIG.BASE_URL}/payments/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        },
        body: JSON.stringify({
          employerRequestId: selectedRequest.id,
          amount: paymentFormData.amount,
          currency: paymentFormData.currency,
          description: paymentFormData.description,
          paymentMethodId: paymentFormData.paymentMethodId,
          paymentType: paymentFormData.paymentType,
          dueDate: paymentFormData.dueDate || null
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Payment request sent successfully!');
        closePaymentModal();
        // Refresh the requests to show updated status
        handleRefresh();
      } else {
        setPaymentError(data.error || 'Failed to send payment request');
      }
    } catch (error) {
      console.error('Error sending payment request:', error);
      setPaymentError('Network error. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Request details functions
  const openRequestDetailsModal = async (request) => {
    console.log('Opening request details modal for request:', request);

    try {
      setRequestDetailsLoading(true);

      // Always fetch fresh data from the backend to ensure we have the latest information
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/employer-requests/${request.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        }
      });

      if (response.ok) {
        const backendRequest = await response.json();
        console.log('Fetched full request data from backend:', backendRequest);
        console.log('Employer Account data:', backendRequest.employerAccount);
        console.log('Employer User data:', backendRequest.employerAccount?.user);

        // Transform the backend data to frontend format
        const transformedRequest = transformRequestData(backendRequest);
        console.log('Transformed request data:', transformedRequest);

        // Set the transformed request as selected
        setSelectedRequest(transformedRequest);
      } else {
        console.error('Failed to fetch full request data');
        // Fallback to the original request data
        setSelectedRequest(request);
      }
    } catch (error) {
      console.error('Error fetching request details:', error);
      // Fallback to the original request data
      setSelectedRequest(request);
    } finally {
      setRequestDetailsLoading(false);
    }

    setShowDetailsModal(true);
  };

  // Payment approval functions
  const openPaymentApprovalModal = async (request) => {
    console.log('Opening payment approval modal for request:', request);
    console.log('Request latestPayment:', request.latestPayment);
    console.log('Request _backendData:', request._backendData);

    try {
      // Always fetch fresh data from the backend to ensure we have the latest payment information
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/employer-requests/${request.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        }
      });

      if (response.ok) {
        const backendRequest = await response.json();
        console.log('Fetched full request data from backend:', backendRequest);

        // Transform the backend data to frontend format
        const transformedRequest = transformRequestData(backendRequest);
        console.log('Transformed request data:', transformedRequest);

        // Set the transformed request as selected
        setSelectedRequest(transformedRequest);
      } else {
        console.error('Failed to fetch full request data');
        // Fallback to the original request data
        setSelectedRequest(request);
      }
    } catch (error) {
      console.error('Error fetching request details:', error);
      // Fallback to the original request data
      setSelectedRequest(request);
    }

    setShowPaymentApprovalModal(true);
    setPaymentApprovalData({
      action: 'approve',
      notes: ''
    });
    setPaymentApprovalError('');
  };

  const closePaymentApprovalModal = () => {
    setShowPaymentApprovalModal(false);
    setPaymentApprovalData({
      action: 'approve',
      notes: ''
    });
    setPaymentApprovalError('');
  };

  const handlePaymentApproval = async (e) => {
    e.preventDefault();

    if (!selectedRequest) {
      setPaymentApprovalError('No request selected');
      return;
    }

    try {
      setPaymentApprovalLoading(true);
      setPaymentApprovalError('');

      let result;
      const requestId = selectedRequest.id;

      // Determine which approval action to take based on the current status
      if (selectedRequest.status === 'first_payment_confirmed' || selectedRequest.status === 'payment_confirmed') {
        // Approve first payment
        if (paymentApprovalData.action === 'approve') {
          result = await EmployerRequestService.approveFirstPayment(requestId, paymentApprovalData.notes);
        } else {
          result = await EmployerRequestService.rejectFirstPayment(requestId, paymentApprovalData.notes);
        }
      } else if (selectedRequest.status === 'second_payment_confirmed') {
        // Approve second payment
        if (paymentApprovalData.action === 'approve') {
          result = await EmployerRequestService.approveSecondPayment(requestId, paymentApprovalData.notes);
        } else {
          result = await EmployerRequestService.rejectSecondPayment(requestId, paymentApprovalData.notes);
        }
      } else {
        setPaymentApprovalError('Invalid status for payment approval');
        return;
      }

      if (result) {
        const actionText = paymentApprovalData.action === 'approve' ? 'approved' : 'rejected';
        toast.success(`Payment ${actionText} successfully!`);
        closePaymentApprovalModal();
        // Refresh the requests to show updated status
        handleRefresh();
      } else {
        setPaymentApprovalError('Failed to process payment approval');
      }
    } catch (error) {
      console.error('Error processing payment approval:', error);
      setPaymentApprovalError(error.message || 'Network error. Please try again.');
    } finally {
      setPaymentApprovalLoading(false);
    }
  };

  // State validation function for debugging
  const validateModalStates = useCallback(() => {
    // Debug function - console.log removed for production
  }, [showActionModal, currentAction, selectedRequest, showDetailsModal, replyMessage, adminNotes, completionNotes]);


  // Transform backend data to frontend format
  const transformRequestData = (backendRequest) => {
    if (!backendRequest) return null;

    try {
      // Format monthly rate for display
      const formatMonthlyRate = (rate) => {
        if (!rate || rate === 'Not specified') return 'Not specified';

        // If it's already a number, format it
        if (typeof rate === 'number') {
          return new Intl.NumberFormat('en-RW', {
            style: 'currency',
            currency: 'frw',
            minimumFractionDigits: 0
          }).format(rate);
        }

        // If it's a string, try to parse it
        if (typeof rate === 'string') {
          const numRate = parseFloat(rate);
          if (!isNaN(numRate)) {
            return new Intl.NumberFormat('en-RW', {
              style: 'currency',
              currency: 'frw',
              minimumFractionDigits: 0
            }).format(numRate);
          }
          return rate; // Return as is if it can't be parsed
        }

        return 'Not specified';
      };

      return {
        id: backendRequest.id,
        employerName: backendRequest.employerAccount?.user?.name || backendRequest.employerAccount?.companyName || backendRequest.name || 'Unknown',
        companyName: backendRequest.employerAccount?.companyName || backendRequest.companyName || 'Private',
        candidateName: backendRequest.requestedCandidate
          ? `${backendRequest.requestedCandidate.profile?.firstName || ''} ${backendRequest.requestedCandidate.profile?.lastName || ''}`.trim() || 'Not specified'
          : 'Not specified',
        position: backendRequest.requestedCandidate?.profile?.skills || 'General',
        status: backendRequest.status || 'pending',
        priority: backendRequest.priority || 'normal',
        date: backendRequest.createdAt,
        monthlyRate: formatMonthlyRate(backendRequest.requestedCandidate?.profile?.monthlyRate),
        message: backendRequest.message || '',
        employerContact: {
          email: backendRequest.employerAccount?.user?.email || backendRequest.employerAccount?.email || backendRequest.email || '',
          phone: backendRequest.employerAccount?.phoneNumber || backendRequest.employerAccount?.user?.phoneNumber || backendRequest.phoneNumber || ''
        },
        // Additional employer details for enhanced display
        employerDetails: {
          companyAddress: backendRequest.employerAccount?.companyAddress || '',
          industry: backendRequest.employerAccount?.industry || '',
          companySize: backendRequest.employerAccount?.companySize || '',
          website: backendRequest.employerAccount?.website || '',
          description: backendRequest.employerAccount?.description || '',
          establishedYear: backendRequest.employerAccount?.establishedYear || '',
          contactPerson: backendRequest.employerAccount?.contactPerson || ''
        },
        adminNotes: '',
        lastContactDate: backendRequest.updatedAt,
        isCompleted: backendRequest.status === 'completed',
        category: backendRequest.requestedCandidate?.profile?.jobCategory?.name_en || 'General',
        // Payment information
        latestPayment: backendRequest.payments && backendRequest.payments.length > 0 ? {
          id: backendRequest.payments[0].id,
          amount: backendRequest.payments[0].amount,
          currency: backendRequest.payments[0].currency || 'RWF',
          paymentType: backendRequest.payments[0].paymentType,
          status: backendRequest.payments[0].status,
          confirmationName: backendRequest.payments[0].confirmationName,
          confirmationPhone: backendRequest.payments[0].confirmationPhone,
          confirmationDate: backendRequest.payments[0].confirmationDate,
          paymentReference: backendRequest.payments[0].paymentReference,
          adminNotes: backendRequest.payments[0].adminNotes,
          createdAt: backendRequest.payments[0].createdAt,
          updatedAt: backendRequest.payments[0].updatedAt
        } : null,
        // Additional candidate fields for detailed view
        candidateExperience: backendRequest.requestedCandidate?.profile?.experience || 'Not specified',
        candidateExperienceLevel: backendRequest.requestedCandidate?.profile?.experienceLevel || 'Not specified',
        candidateEducation: backendRequest.requestedCandidate?.profile?.educationLevel || 'Not specified',
        candidateLocation: backendRequest.requestedCandidate?.profile?.location || 'Not specified',
        candidateCity: backendRequest.requestedCandidate?.profile?.city || 'Not specified',
        candidateCountry: backendRequest.requestedCandidate?.profile?.country || 'Not specified',
        candidateContact: backendRequest.requestedCandidate?.profile?.contactNumber || 'Not specified',
        candidateEmail: backendRequest.requestedCandidate?.email || 'Not specified',
        candidateLanguages: backendRequest.requestedCandidate?.profile?.languages || 'Not specified',
        candidateCertifications: backendRequest.requestedCandidate?.profile?.certifications || 'Not specified',
        candidateAvailability: backendRequest.requestedCandidate?.profile?.availability || 'Not specified',
        candidateDescription: backendRequest.requestedCandidate?.profile?.description || 'Not specified',
        candidateGender: backendRequest.requestedCandidate?.profile?.gender || 'Not specified',
        candidateMaritalStatus: backendRequest.requestedCandidate?.profile?.maritalStatus || 'Not specified',
        candidateIdNumber: backendRequest.requestedCandidate?.profile?.idNumber || 'Not specified',
        candidateReferences: backendRequest.requestedCandidate?.profile?.references || 'Not specified',
        _backendData: backendRequest
      };
    } catch (error) {
      console.error('Error transforming request data:', error);
      // Return a more user-friendly error state instead of hardcoded error messages
      return {
        id: backendRequest?.id || 'unknown',
        employerName: 'Data unavailable',
        companyName: 'Data unavailable',
        candidateName: 'Data unavailable',
        position: 'Data unavailable',
        status: 'pending', // Default to pending instead of error
        priority: 'normal',
        date: new Date(),
        monthlyRate: 'Data unavailable',
        message: 'Data unavailable',
        employerContact: { email: '', phone: '' },
        adminNotes: '',
        lastContactDate: new Date(),
        isCompleted: false,
        category: 'Data unavailable',
        _backendData: backendRequest,
        _hasError: true // Flag to indicate this item had transformation issues
      };
    }
  };

  // Transform the data for display
  const transformedRequests = useMemo(() => {
    if (!safeData || !Array.isArray(safeData)) return [];

    const transformed = safeData.map(transformRequestData).filter(Boolean);

    return transformed;
  }, [safeData]);

  // Ensure data is safe for rendering
  const safeDataForRendering = transformedRequests.map(item => {
    // If item had transformation errors, show appropriate fallback values
    if (item._hasError) {
      return {
        ...item,
        employerName: 'Data unavailable',
        companyName: 'Data unavailable',
        candidateName: 'Data unavailable',
        position: 'Data unavailable',
        status: 'pending',
        priority: 'normal',
        monthlyRate: 'Data unavailable',
        message: 'Data unavailable',
        employerContact: {
          email: '',
          phone: ''
        }
      };
    }

    // Normal data processing
    return {
      ...item,
      employerName: item.employerName || 'Unknown',
      companyName: item.companyName || 'Private',
      candidateName: item.candidateName || 'Not specified',
      position: item.position || 'General',
      status: item.status || 'pending',
      priority: item.priority || 'normal',
      monthlyRate: item.monthlyRate || 'Not specified',
      message: item.message || '',
      employerContact: {
        email: item.employerContact?.email || '',
        phone: item.employerContact?.phone || ''
      }
    };
  });

  // Debug: log transformed requests and any raw photo paths present in backend payloads
  React.useEffect(() => {
    try {
      transformedRequests.forEach(r => {
        const raw = r._backendData?.requestedCandidate?.profile?.photo || r._backendData?.requestedCandidate?.photo || null;

      });

    } catch (err) {
      console.log('EmployerRequestsPage: debug logging error', err);
    }
  }, [transformedRequests]);


  // Table columns configuration
  const columns = [
    {
      key: 'employerInfo',
      label: 'Employer',
      sortable: false,
      render: (item) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <Building className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{item.employerName}</div>
            <div className="text-sm text-gray-500">{item.companyName}</div>
          </div>
        </div>
      )
    },
    {
      key: 'candidateInfo',
      label: 'Candidate',
      sortable: false,
      render: (item) => {
        // compute candidate avatar URL and log for debugging
        const requestedCandidate = item._backendData?.requestedCandidate;
        const rawPhoto = requestedCandidate?.profile?.photo || requestedCandidate?.photo || null;
        const avatarUrl = rawPhoto ? (/^https?:\/\//i.test(rawPhoto) ? rawPhoto : `${API_CONFIG.BASE_URL}/${rawPhoto.replace(/^\//, '')}`) : null;
        if (rawPhoto && !avatarUrl) {
        }

        return (
          <div className="flex items-center space-x-3">
            <Avatar
              src={avatarUrl}
              alt={item.candidateName}
              size="sm"
              fallback={item.candidateName}
              fallbackSrc={defaultProfileImage}
            />
            <div>
              <div className="font-medium text-gray-900">{item.candidateName}</div>
              <div className="text-sm text-gray-500">{item.position}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      searchable: true,
      type: 'badge',
      badgeColor: (category) => {
        switch (category?.toLowerCase()) {
          case 'domestic': return 'text-blue-600 bg-blue-50 border-blue-200';
          case 'care': return 'text-pink-600 bg-pink-50 border-pink-200';
          case 'food': return 'text-orange-600 bg-orange-50 border-orange-200';
          case 'maintenance': return 'text-green-600 bg-green-50 border-green-200';
          case 'transport': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
          case 'general': return 'text-gray-600 bg-gray-50 border-gray-200';
          default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
      }
    },
    {
      key: 'monthlyRate',
      label: 'Monthly Rate',
      sortable: true,
      type: 'text'
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      type: 'badge',
      badgeColor: getStatusColor
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      type: 'badge',
      badgeColor: getPriorityColor
    },
    {
      key: 'date',
      label: 'Request Date',
      sortable: true,
      type: 'date'
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-1">
          {getAllActionButtons(item).slice(0, 4).map((action, index) => {
            const IconComponent = action.icon;
            const isLoading = actionLoadingStates[`${action.key}-${item.id}`];
            return (
              <button
                key={index}
                onClick={() => handleRowAction(action.key, item)}
                disabled={isLoading}
                className={`relative group p-2 rounded-lg transition-all duration-200 hover:scale-110 ${action.className} border border-gray-200 hover:border-current ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={action.title}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                ) : (
                  <IconComponent className="w-4 h-4" />
                )}
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {isLoading ? 'Processing...' : action.title}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                </div>
              </button>
            );
          })}
          {getAllActionButtons(item).length > 4 && (
            <button
              onClick={() => handleRowAction('openActions', item)}
              className="relative group p-2 rounded-lg transition-all duration-200 hover:scale-110 text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-400"
              title="More actions"
            >
              <MoreHorizontal className="w-4 h-4" />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                More actions
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
              </div>
            </button>
          )}
        </div>
      )
    }
  ];





  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);



  // Cleanup modal states on component unmount
  useEffect(() => {
    return () => {
      // Cleanup on unmount to prevent state persistence
      resetModalStates();
    };
  }, [resetModalStates]);

  // Debug modal state changes in development
  useEffect(() => {
    validateModalStates();
  }, [validateModalStates]);


  // For display purposes, we'll use the already transformed data since server-side filtering is applied
  const filteredData = useMemo(() => {
    // Server-side filtering is applied, so we mostly use the data as-is
    // But we can still apply local filters if needed
    let filtered = safeDataForRendering || [];

    // Apply local filters (status, priority, etc.) if they're not sent to server
    if (localFilters.status && localFilters.status !== 'all') {
      filtered = filtered.filter(item => item.status === localFilters.status);
    }

    // Additional client-side search if needed (but server-side search is primary)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.employerName?.toLowerCase().includes(searchLower) ||
        item.companyName?.toLowerCase().includes(searchLower) ||
        item.candidateName?.toLowerCase().includes(searchLower) ||
        item.message?.toLowerCase().includes(searchLower) ||
        item.position?.toLowerCase().includes(searchLower)
      );
    }

    // Apply filters
    if (localFilters.status) {
      filtered = filtered.filter(item => item.status === localFilters.status);
    }

    if (localFilters.priority) {
      filtered = filtered.filter(item => item.priority === localFilters.priority);
    }

    if (localFilters.category) {
      filtered = filtered.filter(item =>
        item.category?.toLowerCase() === localFilters.category.toLowerCase()
      );
    }



    if (localFilters.dateRange) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);

        switch (localFilters.dateRange) {
          case 'today':
            return itemDate >= today;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return itemDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return itemDate >= monthAgo;
          case 'quarter':
            const quarterAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
            return itemDate >= quarterAgo;
          case 'year':
            const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
            return itemDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    if (localFilters.monthlyRateRange) {
      filtered = filtered.filter(item => {
        const rate = item.monthlyRate;
        if (rate === 'Not specified') return false;

        const numericRate = typeof rate === 'string' ?
          parseFloat(rate.replace(/[^\d.]/g, '')) : rate;

        if (isNaN(numericRate)) return false;

        switch (localFilters.monthlyRateRange) {
          case '0-50000':
            return numericRate >= 0 && numericRate <= 50000;
          case '50000-100000':
            return numericRate > 50000 && numericRate <= 100000;
          case '100000-200000':
            return numericRate > 100000 && numericRate <= 200000;
          case '200000+':
            return numericRate > 200000;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [safeDataForRendering, searchTerm, localFilters]);

  // Handle search change with debouncing (now triggers server-side search)
  const handleSearchChangeDebounced = useCallback((value) => {
    handleSearchChange(value);
    setIsSearching(true);

    // Debounce the search
    const timeoutId = setTimeout(() => {
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);


  // Clear all filters
  const clearAllFilters = useCallback(() => {
    // Clear both server and local filters
    const emptyFilters = {
      status: '',
      priority: '',
      category: '',
      dateRange: '',
      monthlyRateRange: ''
    };

    setLocalFilters(emptyFilters);
    setFilters(emptyFilters);
    handleSearchChange('');
    setCurrentPage(1);
    fetchRequests(1, '', emptyFilters);
  }, [fetchRequests, handleSearchChange]);

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm.trim()) count++;
    Object.values(localFilters).forEach(value => {
      if (value) count++;
    });
    return count;
  }, [searchTerm, localFilters]);

  // Statistics calculation
  const stats = useMemo(() => [
    {
      title: 'Total Requests',
      value: filteredData.length.toString(),
      change: `+${filteredData.length - (safeDataForRendering || []).length}`,
      changeType: filteredData.length >= (safeDataForRendering || []).length ? 'increase' : 'decrease',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: `${activeFiltersCount > 0 ? 'Filtered' : 'All'} employer requests`
    },
    {
      title: 'Pending Review',
      value: filteredData.filter(r => r.status === 'pending').length.toString(),
      change: '+2',
      changeType: 'increase',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Awaiting admin approval'
    },
    {
      title: 'Payment Pending',
      value: filteredData.filter(r =>
        ['first_payment_required', 'second_payment_required', 'first_payment_confirmed', 'second_payment_confirmed', 'payment_required', 'payment_confirmed'].includes(r.status)
      ).length.toString(),
      change: '+1',
      changeType: 'increase',
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Payment processing'
    },
    {
      title: 'Completed',
      value: filteredData.filter(r => r.status === 'completed').length.toString(),
      change: '+3',
      changeType: 'increase',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Successfully closed'
    }
  ], [filteredData, safeDataForRendering, activeFiltersCount]);

  // Refresh function that fetches fresh data
  const handleRefresh = useCallback(() => {
    // Reset to first page
    goToPage(1);
    // Apply filters to fetch fresh data
    applyFilters();
  }, [goToPage, applyFilters]);

  const handleRowAction = (action, request) => {
    setSelectedRequest(request);
    setAdminNotes(request.adminNotes || '');

    switch (action) {
      case 'openActions':
        setShowActionModal(true);
        setCurrentAction(null); // Ensure clean state
        break;
      case 'view':
        openRequestDetailsModal(request);
        setShowActionModal(false);
        break;
      case 'contact':
        handleContactEmployer(request.employerContact, 'email');
        resetModalStates(); // Use centralized cleanup
        break;
      case 'call':
        handleContactEmployer(request.employerContact, 'phone');
        resetModalStates(); // Use centralized cleanup
        break;
      case 'reply':
        setCurrentAction('reply');
        setShowActionModal(true);
        break;
      case 'message':
        openMessaging(request);
        break;
      case 'payment':
        openPaymentModal(request);
        break;
      case 'paymentApproval':
        openPaymentApprovalModal(request);
        break;
      case 'select':
        setCurrentAction('select');
        setShowActionModal(true);
        break;

      // New workflow actions
      case 'approveRequest':
        handleWorkflowAction('approveRequest', request);
        break;
      case 'rejectRequest':
        handleWorkflowAction('rejectRequest', request);
        break;
      case 'requestFirstPayment':
        handleWorkflowAction('requestFirstPayment', request);
        break;
      case 'viewPaymentDetails':
        handleWorkflowAction('viewPaymentDetails', request);
        break;

      case 'approveFirstPayment':
        handleWorkflowAction('approveFirstPayment', request);
        break;
      case 'rejectFirstPayment':
        handleWorkflowAction('rejectFirstPayment', request);
        break;
      case 'requestSecondPayment':
        handleWorkflowAction('requestSecondPayment', request);
        break;
      case 'viewPhotoAccess':
        handleWorkflowAction('viewPhotoAccess', request);
        break;

      case 'approveFullDetailsRequest':
        handleWorkflowAction('approveFullDetailsRequest', request);
        break;
      case 'rejectFullDetailsRequest':
        handleWorkflowAction('rejectFullDetailsRequest', request);
        break;
      case 'approveSecondPayment':
        handleWorkflowAction('approveSecondPayment', request);
        break;
      case 'rejectSecondPayment':
        handleWorkflowAction('rejectSecondPayment', request);
        break;
      case 'viewFullDetails':
        handleWorkflowAction('viewFullDetails', request);
        break;
      case 'waitForHiringDecision':
        handleWorkflowAction('waitForHiringDecision', request);
        break;
      case 'reviewHiringDecision':
        handleWorkflowAction('reviewHiringDecision', request);
        break;
      case 'updateCandidateAvailability':
        handleWorkflowAction('updateCandidateAvailability', request);
        break;
      case 'viewCompletedRequest':
        handleWorkflowAction('viewCompletedRequest', request);
        break;

      // Legacy actions (for backward compatibility)
      case 'start':
        handleStatusUpdate('in_progress', 'Starting to process this request');
        resetModalStates(); // Use centralized cleanup
        break;
      case 'approve':
        handleStatusUpdate('approved', 'Request approved and ready for completion');
        resetModalStates(); // Use centralized cleanup
        break;
      case 'complete':
        setCurrentAction('complete');
        setShowActionModal(true);
        break;
      case 'reactivate':
        handleStatusUpdate('pending', 'Request reactivated and back to pending status');
        resetModalStates(); // Use centralized cleanup
        break;
      default:
        console.warn('Unknown action:', action);
        resetModalStates(); // Cleanup for unknown actions
    }
  };

  const handleStatusUpdate = async (newStatus, message) => {
    if (!selectedRequest) return;

    try {

      const result = await updateRequestStatus(selectedRequest.id, {
        status: newStatus,
        adminNotes: message
      });

      if (result.success) {

        // Show success message
        toast.success(`Request status updated to ${newStatus}. ${message || ''}`);

        // Refresh the requests to show updated data
        handleRefresh();
      } else {
        console.error('❌ Failed to update status:', result.error);
        toast.error(`Failed to update status: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Error updating status:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const handleReplySubmit = async () => {
    if (!selectedRequest || !replyMessage.trim()) return;

    setReplyLoading(true);
    setReplyError('');

    try {

      const result = await replyToRequest(selectedRequest.id, {
        content: replyMessage
      });

      if (result.success) {

        // Show success message with details
        const successMessage = result.data.emailSent
          ? `Reply sent successfully to ${selectedRequest.employerName} at ${selectedRequest.employerContact.email}`
          : `Reply saved but email delivery failed. Please check the email configuration.`;

        toast.success(successMessage);

        // Clear form and close modal
        setReplyMessage('');
        setAdminNotes('');
        resetModalStates(); // Use centralized cleanup

        // Refresh the requests to show updated data
        handleRefresh();
      } else {
        console.error('❌ Reply failed:', result.error);
        setReplyError(result.error || 'Failed to send reply');
      }
    } catch (error) {
      console.error('❌ Error sending reply:', error);
      setReplyError('Network error. Please try again.');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleJobSeekerSelection = async (jobSeekerId, detailsType = 'picture') => {
    if (!selectedRequest) return;

    setCandidateSelectionLoading(true);
    setCandidateSelectionError('');

    try {

      const result = await selectJobSeekerForRequest(selectedRequest.id, jobSeekerId, detailsType);

      if (result.success) {

        const successMessage = detailsType === 'picture'
          ? `Candidate profile picture sent to ${selectedRequest.employerName}`
          : `Complete candidate details sent to ${selectedRequest.employerName}`;

        toast.success(successMessage);
        resetModalStates(); // Use centralized cleanup

        // Refresh the requests to show updated data
        handleRefresh();
      } else {
        console.error('❌ Failed to send candidate information:', result.error);
        setCandidateSelectionError(result.error || 'Failed to send candidate information');
      }
    } catch (error) {
      console.error('❌ Error sending candidate information:', error);
      setCandidateSelectionError('Network error. Please try again.');
    } finally {
      setCandidateSelectionLoading(false);
    }
  };

  const handleCandidateSelection = (candidate, detailsType) => {
    setSelectedCandidate(candidate);
    setCandidateDetailsType(detailsType);
    setShowCandidateDetails(true);
  };

  const handleRequestCompletion = async () => {
    if (!selectedRequest) return;

    setCompletionLoading(true);
    setCompletionError('');

    try {

      const result = await updateRequestStatus(selectedRequest.id, {
        status: 'completed',
        adminNotes: completionNotes
      });


      if (result.success) {

        toast.success(`Request completed successfully. ${completionNotes ? 'Notes have been saved.' : ''}`);

        // Clear form and close modal
        setCompletionNotes('');
        resetModalStates(); // Use centralized cleanup

        // Refresh the requests to show updated data
        handleRefresh();
      } else {
        console.error('❌ Failed to complete request:', result.error);
        setCompletionError(result.error || 'Failed to complete request');
      }
    } catch (error) {
      console.error('❌ Error completing request:', error);
      setCompletionError('Network error. Please try again.');
    } finally {
      setCompletionLoading(false);
    }
  };

  // New workflow functions
  const handleRequestFullDetails = async () => {
    if (!selectedRequest) return;

    try {
      setWorkflowLoading(true);
      setWorkflowError('');

      const result = await EmployerRequestService.requestFullDetails(
        selectedRequest.id,
        workflowNotes
      );

      if (result.message) {
        toast.success(result.message);
        setShowWorkflowModal(false);
        setWorkflowNotes('');
        handleRefresh();
      }
    } catch (error) {
      console.error('Error requesting full details:', error);
      setWorkflowError(error.message || 'Failed to request full details');
    } finally {
      setWorkflowLoading(false);
    }
  };

  const handleMarkHiringDecision = async (decision) => {
    if (!selectedRequest) return;

    try {
      setWorkflowLoading(true);
      setWorkflowError('');

      const result = await EmployerRequestService.markHiringDecision(
        selectedRequest.id,
        decision,
        workflowNotes
      );

      if (result.message) {
        toast.success(result.message);
        setShowWorkflowModal(false);
        setWorkflowNotes('');
        handleRefresh();
      }
    } catch (error) {
      console.error('Error marking hiring decision:', error);
      setWorkflowError(error.message || 'Failed to mark hiring decision');
    } finally {
      setWorkflowLoading(false);
    }
  };

  const handleGetPhotoAccess = async () => {
    if (!selectedRequest) return;

    try {
      setWorkflowLoading(true);
      setWorkflowError('');

      const data = await EmployerRequestService.getPhotoAccess(selectedRequest.id);

      // Show photo access data in a modal or update the candidate details
      setSelectedCandidate(data);
      setCandidateDetailsType('photo');
      setShowCandidateDetails(true);
      setShowWorkflowModal(false);
    } catch (error) {
      console.error('Error getting photo access:', error);
      setWorkflowError(error.message || 'Failed to get photo access');
    } finally {
      setWorkflowLoading(false);
    }
  };

  const handleGetFullDetails = async () => {
    if (!selectedRequest) return;

    try {
      setWorkflowLoading(true);
      setWorkflowError('');

      const data = await EmployerRequestService.getFullDetails(selectedRequest.id);

      // Show full details data in a modal or update the candidate details
      setSelectedCandidate(data);
      setCandidateDetailsType('full');
      setShowCandidateDetails(true);
      setShowWorkflowModal(false);
    } catch (error) {
      console.error('Error getting full details:', error);
      setWorkflowError(error.message || 'Failed to get full details');
    } finally {
      setWorkflowLoading(false);
    }
  };

  const openWorkflowAction = (action, request) => {
    setWorkflowAction(action);
    setSelectedRequest(request);
    setWorkflowError('');
    setWorkflowNotes('');
    setShowWorkflowModal(true);
  };

  // Get workflow action title
  const getWorkflowActionTitle = (action) => {
    const titles = {
      'approveRequest': 'Approve Request',
      'rejectRequest': 'Reject Request',
      'requestFirstPayment': 'Request First Payment',
      'viewPaymentDetails': 'View Payment Details',
      'approveFirstPayment': 'Approve First Payment',
      'rejectFirstPayment': 'Reject First Payment',
      'requestSecondPayment': 'Request Second Payment',
      'viewPhotoAccess': 'View Photo Access',
      'approveFullDetailsRequest': 'Approve Full Details Request',
      'rejectFullDetailsRequest': 'Reject Full Details Request',
      'approveSecondPayment': 'Approve Second Payment',
      'rejectSecondPayment': 'Reject Second Payment',
      'viewFullDetails': 'View Full Details',
      'waitForHiringDecision': 'Wait for Hiring Decision',
      'reviewHiringDecision': 'Review Hiring Decision',
      'updateCandidateAvailability': 'Update Candidate Availability',
      'viewCompletedRequest': 'View Completed Request',
      'request_full_details': 'Request Full Details',
      'mark_hired': 'Mark as Hired',
      'mark_not_hired': 'Mark as Not Hired',
      'get_photo_access': 'View Photo Access',
      'get_full_details': 'View Full Details'
    };
    return titles[action] || 'Workflow Action';
  };

  // Get workflow action content
  const getWorkflowActionContent = (action) => {
    const needsNotes = [
      'approveRequest', 'rejectRequest', 'requestFirstPayment', 'approveFirstPayment',
      'rejectFirstPayment', 'requestSecondPayment', 'approveFullDetailsRequest',
      'rejectFullDetailsRequest', 'approveSecondPayment', 'rejectSecondPayment',
      'updateCandidateAvailability', 'request_full_details', 'mark_hired', 'mark_not_hired'
    ];

    if (needsNotes.includes(action)) {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {getWorkflowActionNotesLabel(action)}
          </label>
          <textarea
            value={workflowNotes}
            onChange={(e) => setWorkflowNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={getWorkflowActionPlaceholder(action)}
          />
        </div>
      );
    }

    // View actions - show information
    if (action.startsWith('view') || action === 'reviewHiringDecision' || action === 'waitForHiringDecision') {
      return (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Information</h4>
          <p className="text-blue-800 text-sm">
            {getWorkflowActionInfo(action)}
          </p>
        </div>
      );
    }

    return null;
  };

  // Get workflow action notes label
  const getWorkflowActionNotesLabel = (action) => {
    const labels = {
      'approveRequest': 'Approval Notes (Optional)',
      'rejectRequest': 'Rejection Reason (Required)',
      'requestFirstPayment': 'Payment Request Notes (Optional)',
      'approveFirstPayment': 'Approval Notes (Optional)',
      'rejectFirstPayment': 'Rejection Reason (Required)',
      'requestSecondPayment': 'Payment Request Notes (Optional)',
      'approveFullDetailsRequest': 'Approval Notes (Optional)',
      'rejectFullDetailsRequest': 'Rejection Reason (Required)',
      'approveSecondPayment': 'Approval Notes (Optional)',
      'rejectSecondPayment': 'Rejection Reason (Required)',
      'updateCandidateAvailability': 'Update Notes (Optional)',
      'request_full_details': 'Reason for requesting full details (optional)',
      'mark_hired': 'Notes about hiring decision (optional)',
      'mark_not_hired': 'Notes about not hiring (optional)'
    };
    return labels[action] || 'Notes (Optional)';
  };

  // Get workflow action placeholder
  const getWorkflowActionPlaceholder = (action) => {
    const placeholders = {
      'approveRequest': 'Add any notes about approving this request...',
      'rejectRequest': 'Explain why this request is being rejected...',
      'requestFirstPayment': 'Add any notes about the payment request...',
      'approveFirstPayment': 'Add any notes about approving the first payment...',
      'rejectFirstPayment': 'Explain why the first payment is being rejected...',
      'requestSecondPayment': 'Add any notes about the second payment request...',
      'approveFullDetailsRequest': 'Add any notes about approving full details access...',
      'rejectFullDetailsRequest': 'Explain why full details access is being rejected...',
      'approveSecondPayment': 'Add any notes about approving the second payment...',
      'rejectSecondPayment': 'Explain why the second payment is being rejected...',
      'updateCandidateAvailability': 'Add any notes about updating candidate availability...',
      'request_full_details': 'Explain why you need full details...',
      'mark_hired': 'Add any notes about the hiring decision...',
      'mark_not_hired': 'Add any notes about why the candidate was not hired...'
    };
    return placeholders[action] || 'Add notes...';
  };

  // Get workflow action info
  const getWorkflowActionInfo = (action) => {
    const info = {
      'viewPaymentDetails': 'View payment confirmation details and approve or reject the payment.',
      'viewPhotoAccess': 'View the photo access that has been granted to the employer.',
      'viewFullDetails': 'View the full details access that has been granted to the employer.',
      'reviewHiringDecision': 'Review the hiring decision made by the employer and update candidate availability.',
      'waitForHiringDecision': 'The employer has full access and should make a hiring decision soon.',
      'viewCompletedRequest': 'This request has been completed successfully.'
    };
    return info[action] || 'No additional information available.';
  };

  // Get loading text for different actions
  const getLoadingText = (action) => {
    const loadingTexts = {
      'approveRequest': 'Approving Request...',
      'rejectRequest': 'Rejecting Request...',
      'requestFirstPayment': 'Requesting Payment...',
      'approveFirstPayment': 'Approving Payment...',
      'rejectFirstPayment': 'Rejecting Payment...',
      'requestSecondPayment': 'Requesting Payment...',
      'approveFullDetailsRequest': 'Approving Full Details...',
      'rejectFullDetailsRequest': 'Rejecting Full Details...',
      'approveSecondPayment': 'Approving Payment...',
      'rejectSecondPayment': 'Rejecting Payment...',
      'updateCandidateAvailability': 'Updating Status...',
      'request_full_details': 'Requesting Details...',
      'mark_hired': 'Marking as Hired...',
      'mark_not_hired': 'Marking as Not Hired...',
      'get_photo_access': 'Loading Photo Access...',
      'get_full_details': 'Loading Full Details...'
    };
    return loadingTexts[action] || 'Processing...';
  };

  // Get workflow action buttons
  const getWorkflowActionButtons = (action) => {
    const buttonConfigs = {
      'approveRequest': { text: 'Approve Request', className: 'bg-green-600 hover:bg-green-700', onClick: () => handleWorkflowAction('approveRequest', selectedRequest) },
      'rejectRequest': { text: 'Reject Request', className: 'bg-red-600 hover:bg-red-700', onClick: () => handleWorkflowAction('rejectRequest', selectedRequest) },
      'requestFirstPayment': { text: 'Request First Payment', className: 'bg-yellow-600 hover:bg-yellow-700', onClick: () => handleWorkflowAction('requestFirstPayment', selectedRequest) },
      'approveFirstPayment': { text: 'Approve First Payment', className: 'bg-green-600 hover:bg-green-700', onClick: () => handleWorkflowAction('approveFirstPayment', selectedRequest) },
      'rejectFirstPayment': { text: 'Reject First Payment', className: 'bg-red-600 hover:bg-red-700', onClick: () => handleWorkflowAction('rejectFirstPayment', selectedRequest) },
      'requestSecondPayment': { text: 'Request Second Payment', className: 'bg-yellow-600 hover:bg-yellow-700', onClick: () => handleWorkflowAction('requestSecondPayment', selectedRequest) },
      'approveFullDetailsRequest': { text: 'Approve Full Details', className: 'bg-green-600 hover:bg-green-700', onClick: () => handleWorkflowAction('approveFullDetailsRequest', selectedRequest) },
      'rejectFullDetailsRequest': { text: 'Reject Full Details', className: 'bg-red-600 hover:bg-red-700', onClick: () => handleWorkflowAction('rejectFullDetailsRequest', selectedRequest) },
      'approveSecondPayment': { text: 'Approve Second Payment', className: 'bg-green-600 hover:bg-green-700', onClick: () => handleWorkflowAction('approveSecondPayment', selectedRequest) },
      'rejectSecondPayment': { text: 'Reject Second Payment', className: 'bg-red-600 hover:bg-red-700', onClick: () => handleWorkflowAction('rejectSecondPayment', selectedRequest) },
      'updateCandidateAvailability': { text: 'Update Candidate Status', className: 'bg-purple-600 hover:bg-purple-700', onClick: () => handleWorkflowAction('updateCandidateAvailability', selectedRequest) },
      'request_full_details': { text: 'Request Full Details', className: 'bg-purple-600 hover:bg-purple-700', onClick: handleRequestFullDetails },
      'mark_hired': { text: 'Mark as Hired', className: 'bg-green-600 hover:bg-green-700', onClick: () => handleMarkHiringDecision('hired') },
      'mark_not_hired': { text: 'Mark as Not Hired', className: 'bg-red-600 hover:bg-red-700', onClick: () => handleMarkHiringDecision('not_hired') },
      'get_photo_access': { text: 'View Photo Access', className: 'bg-blue-600 hover:bg-blue-700', onClick: handleGetPhotoAccess },
      'get_full_details': { text: 'View Full Details', className: 'bg-indigo-600 hover:bg-indigo-700', onClick: handleGetFullDetails }
    };

    const config = buttonConfigs[action];
    if (!config) return null;

    return (
      <Button
        onClick={config.onClick}
        disabled={workflowLoading}
        className={config.className}
      >
        {workflowLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {getLoadingText(action)}
          </>
        ) : (
          config.text
        )}
      </Button>
    );
  };

  // New workflow action handler
  const handleWorkflowAction = async (action, request) => {
    setSelectedRequest(request);
    setWorkflowAction(action);
    setWorkflowError('');
    setWorkflowNotes('');

    // Set loading state for this specific action
    const actionKey = `${action}-${request.id}`;
    setActionLoadingStates(prev => ({ ...prev, [actionKey]: true }));

    try {
      setWorkflowLoading(true);

      let result;
      const requestId = request.id;

      switch (action) {
        case 'approveRequest':
          result = await EmployerRequestService.approveRequest(requestId, workflowNotes);
          break;
        case 'rejectRequest':
          result = await EmployerRequestService.rejectRequest(requestId, workflowNotes);
          break;
        case 'requestFirstPayment':
          result = await EmployerRequestService.requestFirstPayment(requestId, workflowNotes);
          break;
        case 'viewPaymentDetails':
          // This will open a modal to view payment details
          setShowWorkflowModal(true);
          return;

        case 'approveFirstPayment':
          console.log('Approving first payment for request:', requestId, 'with notes:', workflowNotes);
          result = await EmployerRequestService.approveFirstPayment(requestId, workflowNotes);
          console.log('First payment approval result:', result);
          break;
        case 'rejectFirstPayment':
          result = await EmployerRequestService.rejectFirstPayment(requestId, workflowNotes);
          break;
        case 'requestSecondPayment':
          result = await EmployerRequestService.requestSecondPayment(requestId, workflowNotes);
          break;
        case 'viewPhotoAccess':
          // This will open a modal to view photo access
          setShowWorkflowModal(true);
          return;

        case 'approveFullDetailsRequest':
          result = await EmployerRequestService.approveFullDetailsRequest(requestId, workflowNotes);
          break;
        case 'rejectFullDetailsRequest':
          result = await EmployerRequestService.rejectFullDetailsRequest(requestId, workflowNotes);
          break;
        case 'approveSecondPayment':
          result = await EmployerRequestService.approveSecondPayment(requestId, workflowNotes);
          break;
        case 'rejectSecondPayment':
          result = await EmployerRequestService.rejectSecondPayment(requestId, workflowNotes);
          break;
        case 'viewFullDetails':
          // This will open a modal to view full details
          setShowWorkflowModal(true);
          return;
        case 'waitForHiringDecision':
          // This is informational - no action needed
          toast.info('Waiting for employer to make hiring decision...');
          return;
        case 'reviewHiringDecision':
          // This will open a modal to review hiring decision
          setShowWorkflowModal(true);
          return;
        case 'updateCandidateAvailability':
          result = await EmployerRequestService.updateCandidateAvailability(requestId, workflowNotes);
          break;
        case 'viewCompletedRequest':
          // This will open a modal to view completed request
          setShowWorkflowModal(true);
          return;
        default:
          throw new Error(`Unknown workflow action: ${action}`);
      }

      if (result) {
        const successMessage = result.message || `${action.replace(/([A-Z])/g, ' $1').toLowerCase()} completed successfully`;
        toast.success(successMessage);

        // Add workflow notification
        addWorkflowNotification(
          action,
          successMessage,
          requestId,
          result.newStatus || 'updated'
        );

        handleRefresh();
      } else {
        // Fallback success message if no result
        const successMessage = `${action.replace(/([A-Z])/g, ' $1').toLowerCase()} completed successfully`;
        toast.success(successMessage);
        handleRefresh();
      }

    } catch (error) {
      console.error(`Error in workflow action ${action}:`, error);
      setWorkflowError(error.message || `Failed to ${action.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      toast.error(`Failed to ${action.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
    } finally {
      setWorkflowLoading(false);
      // Clear loading state for this specific action
      setActionLoadingStates(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  const getActionButtons = (request) => {
    return [
      {
        key: 'openActions',
        title: 'Actions',
        icon: MoreHorizontal,
        className: 'text-gray-600 hover:bg-gray-50'
      }
    ];
  };

  // Get all action buttons for the modal based on new workflow
  const getAllActionButtons = (request) => {
    const baseActions = [
      // View Details - Always available
      { key: 'view', title: 'View Details', icon: Eye, className: 'text-blue-600 hover:bg-blue-50', group: 'view' },

      // Messaging - Always available
      { key: 'message', title: 'Message', icon: MessageSquare, className: 'text-indigo-600 hover:bg-indigo-50', group: 'contact' },
    ];

    // Status-based actions for new workflow
    const statusActions = [];

    switch (request.status) {
      case 'pending':
        statusActions.push(
          { key: 'approveRequest', title: 'Approve Request', icon: CheckCircle, className: 'text-green-600 hover:bg-green-50', group: 'workflow' },
          { key: 'rejectRequest', title: 'Reject Request', icon: XCircle, className: 'text-red-600 hover:bg-red-50', group: 'workflow' }
        );
        break;

      case 'approved':
        statusActions.push(
          { key: 'requestFirstPayment', title: 'Request First Payment', icon: DollarSign, className: 'text-yellow-600 hover:bg-yellow-50', group: 'workflow' }
        );
        break;

      case 'first_payment_required':
        statusActions.push(
          { key: 'viewPaymentDetails', title: 'View Payment Details', icon: Eye, className: 'text-blue-600 hover:bg-blue-50', group: 'workflow' }
        );
        break;

      case 'first_payment_confirmed':
        statusActions.push(
          { key: 'paymentApproval', title: 'Approve First Payment', icon: CheckCircle, className: 'text-green-600 hover:bg-green-50', group: 'workflow' }
        );
        break;

      case 'photo_access_granted':
        statusActions.push(
          { key: 'requestSecondPayment', title: 'Request Second Payment', icon: DollarSign, className: 'text-yellow-600 hover:bg-yellow-50', group: 'workflow' },
          { key: 'viewPhotoAccess', title: 'View Photo Access', icon: Eye, className: 'text-blue-600 hover:bg-blue-50', group: 'workflow' }
        );
        break;

      case 'full_details_requested':
        statusActions.push(
          { key: 'approveFullDetailsRequest', title: 'Approve Full Details', icon: CheckCircle, className: 'text-green-600 hover:bg-green-50', group: 'workflow' },
          { key: 'rejectFullDetailsRequest', title: 'Reject Full Details', icon: XCircle, className: 'text-red-600 hover:bg-red-50', group: 'workflow' }
        );
        break;

      case 'second_payment_required':
        statusActions.push(
          { key: 'viewPaymentDetails', title: 'View Payment Details', icon: Eye, className: 'text-blue-600 hover:bg-blue-50', group: 'workflow' }
        );
        break;

      case 'second_payment_confirmed':
        statusActions.push(
          { key: 'paymentApproval', title: 'Approve Second Payment', icon: CheckCircle, className: 'text-green-600 hover:bg-green-50', group: 'workflow' }
        );
        break;

      case 'payment_required':
        // Legacy status - treat as first payment required
        statusActions.push(
          { key: 'viewPaymentDetails', title: 'View Payment Details', icon: Eye, className: 'text-blue-600 hover:bg-blue-50', group: 'workflow' }
        );
        break;

      case 'payment_confirmed':
        // Legacy status - treat as first payment confirmed
        statusActions.push(
          { key: 'paymentApproval', title: 'Approve Payment', icon: CheckCircle, className: 'text-green-600 hover:bg-green-50', group: 'workflow' }
        );
        break;

      case 'full_access_granted':
        statusActions.push(
          { key: 'viewFullDetails', title: 'View Full Details', icon: Eye, className: 'text-blue-600 hover:bg-blue-50', group: 'workflow' },
          { key: 'waitForHiringDecision', title: 'Wait for Hiring Decision', icon: Clock, className: 'text-orange-600 hover:bg-orange-50', group: 'workflow' }
        );
        break;

      case 'hiring_decision_made':
        statusActions.push(
          { key: 'reviewHiringDecision', title: 'Review Hiring Decision', icon: Eye, className: 'text-blue-600 hover:bg-blue-50', group: 'workflow' },
          { key: 'updateCandidateAvailability', title: 'Update Candidate Status', icon: User, className: 'text-purple-600 hover:bg-purple-50', group: 'workflow' }
        );
        break;

      case 'completed':
        statusActions.push(
          { key: 'viewCompletedRequest', title: 'View Completed Request', icon: Eye, className: 'text-gray-600 hover:bg-gray-50', group: 'workflow' }
        );
        break;

      case 'cancelled':
        statusActions.push(
          { key: 'reactivate', title: 'Reactivate', icon: RefreshCw, className: 'text-blue-600 hover:bg-blue-50', group: 'workflow' }
        );
        break;

      default:
        // For any other status, show basic actions
        statusActions.push(
          { key: 'view', title: 'View Details', icon: Eye, className: 'text-blue-600 hover:bg-blue-50', group: 'workflow' }
        );
    }

    return [...baseActions, ...statusActions];
  };

  // Loading state
  if (loading || !safeData || !safeDataForRendering) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading employer requests..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Requests</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="primary" disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {loading ? 'Retrying...' : 'Try Again'}
          </Button>
        </div>
      </div>
    );
  }

  // No data state
  if (!loading && safeDataForRendering && safeDataForRendering.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">Employer Requests</span>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Employer Requests</h2>
            <p className="text-gray-600 mb-6">
              There are currently no employer requests to display.
            </p>
            <Button onClick={handleRefresh} variant="primary" disabled={loading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="">
        <div className="">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="ml-2 text-xl font-bold text-gray-900">Employer Requests</span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Clean Testing Data Button */}
              <button
                onClick={handleCleanTestingData}
                disabled={cleaningData}
                className="flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Clean all testing data (preserves admin accounts and job categories)"
              >
                {cleaningData ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                    Cleaning...
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Clean Data
                  </>
                )}
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Workflow Notifications"
                >
                  {unreadCount > 0 ? (
                    <BellRing className="h-5 w-5 text-orange-500" />
                  ) : (
                    <Bell className="h-5 w-5" />
                  )}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="notification-dropdown absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Workflow Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllNotificationsAsRead}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notificationLoading ? (
                        <div className="p-4 text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="text-sm text-gray-600 mt-2">Loading notifications...</p>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''
                              }`}
                            onClick={() => {
                              if (!notification.isRead) {
                                markNotificationAsRead(notification.id);
                              }
                              // Optionally navigate to the request
                              if (notification.requestId) {
                                // You could add navigation logic here
                              }
                            }}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${!notification.isRead ? 'bg-blue-500' : 'bg-gray-300'
                                }`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </p>
                                {notification.status && (
                                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                    Status: {notification.status}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <StatsGrid stats={stats} />
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Employer Requests ({filteredData.length})
                </h2>
                {activeFiltersCount > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Showing {filteredData.length} of {(safeDataForRendering || []).length} total requests
                  </p>
                )}
              </div>
            </div>

            {/* Search and Filters Section */}
            <div className="mb-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by employer name, company, candidate, or message..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChangeDebounced(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                />
                {isSearching && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                  </div>
                )}
                {searchTerm && (
                  <button
                    onClick={() => handleSearchChange('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${showFilters
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Clear All
                  </button>
                )}
              </div>

              {/* Filter Dropdowns */}
              {showFilters && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={localFilters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                      >
                        {filterOptions.status.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Priority Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={localFilters.priority}
                        onChange={(e) => handleFilterChange('priority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                      >
                        {filterOptions.priority.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={localFilters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        disabled={loadingCategories}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        {loadingCategories ? (
                          <option value="">Loading categories...</option>
                        ) : (
                          filterOptions.category.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    {/* Date Range Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Range
                      </label>
                      <select
                        value={localFilters.dateRange}
                        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                      >
                        {filterOptions.dateRange.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Monthly Rate Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Rate
                      </label>
                      <select
                        value={localFilters.monthlyRateRange}
                        onChange={(e) => handleFilterChange('monthlyRateRange', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                      >
                        {filterOptions.monthlyRateRange.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>


                  </div>

                  {/* Active Filters Display */}
                  {activeFiltersCount > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {searchTerm && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            Search: "{searchTerm}"
                            <button
                              onClick={() => handleSearchChange('')}
                              className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        )}
                        {Object.entries(localFilters).map(([key, value]) => {
                          if (!value) return null;
                          const option = filterOptions[key]?.find(opt => opt.value === value);
                          if (!option) return null;

                          return (
                            <span key={key} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                              {option.label}
                              <button
                                onClick={() => handleFilterChange(key, '')}
                                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Data Table */}
            <div className="space-y-4">

              {filteredData.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600 mb-4">
                    {activeFiltersCount > 0
                      ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                      : 'There are no employer requests to display.'
                    }
                  </p>
                  {activeFiltersCount > 0 && (
                    <Button
                      onClick={clearAllFilters}
                      variant="outline"
                      size="sm"
                      className="mx-auto"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              ) : (
                <DataTable
                  data={filteredData}
                  columns={columns}
                  pagination={true}
                  itemsPerPage={15}
                  showSearch={false}
                />
              )}

            </div>

            {/* Server-side pagination is handled by the DataTable component */}
          </Card>
        </motion.div>
      </div>

      {/* Request Details Modal */}
      {showDetailsModal && selectedRequest && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedRequest(null);
            setRequestDetailsLoading(false);
          }}
          title={`Request Details - #${selectedRequest.id}`}
          size="xl"
        >
          <div className="space-y-6 relative">
            {/* Loading Overlay */}
            {requestDetailsLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                <div className="flex flex-col items-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <div className="text-sm font-medium text-gray-700">
                    Loading request details...
                  </div>
                  <div className="text-xs text-gray-500 text-center max-w-xs">
                    Fetching the latest information from the database.
                  </div>
                </div>
              </div>
            )}
            {/* Request Header with Status */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Request #{selectedRequest.id}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Created on {new Date(selectedRequest.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <WorkflowStatus status={selectedRequest.status} />
                  <Badge color={getPriorityColor(selectedRequest.priority)}>
                    {selectedRequest.priority} Priority
                  </Badge>
                </div>
              </div>


            </div>

            {/* Employer Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-600" />
                Employer Information
              </h3>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <label className="text-sm font-medium text-blue-600 block mb-1">Full Name</label>
                      <p className="text-gray-900 font-medium">{selectedRequest.employerName}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <label className="text-sm font-medium text-blue-600 block mb-1">Company Name</label>
                      <p className="text-gray-900 font-medium">{selectedRequest.companyName}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <label className="text-sm font-medium text-blue-600 block mb-1 flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        Email Address
                      </label>
                      <p className="text-gray-900 font-medium">{selectedRequest.employerContact.email || 'Not provided'}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <label className="text-sm font-medium text-blue-600 block mb-1 flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        Phone Number
                      </label>
                      <p className="text-gray-900 font-medium">{selectedRequest.employerContact.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Employer Details */}
                {(selectedRequest.employerDetails.companyAddress || selectedRequest.employerDetails.industry || selectedRequest.employerDetails.companySize || selectedRequest.employerDetails.website || selectedRequest.employerDetails.description || selectedRequest.employerDetails.establishedYear || selectedRequest.employerDetails.contactPerson) && (
                  <div className="mt-6 pt-6 border-t border-blue-200">
                    <h4 className="text-md font-semibold text-blue-900 mb-3">Additional Company Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedRequest.employerDetails.companyAddress && (
                        <div className="bg-white rounded-lg p-4 border border-blue-100">
                          <label className="text-sm font-medium text-blue-600 block mb-1">Company Address</label>
                          <p className="text-gray-900 text-sm">{selectedRequest.employerDetails.companyAddress}</p>
                        </div>
                      )}
                      {selectedRequest.employerDetails.industry && (
                        <div className="bg-white rounded-lg p-4 border border-blue-100">
                          <label className="text-sm font-medium text-blue-600 block mb-1">Industry</label>
                          <p className="text-gray-900 text-sm">{selectedRequest.employerDetails.industry}</p>
                        </div>
                      )}
                      {selectedRequest.employerDetails.companySize && (
                        <div className="bg-white rounded-lg p-4 border border-blue-100">
                          <label className="text-sm font-medium text-blue-600 block mb-1">Company Size</label>
                          <p className="text-gray-900 text-sm">{selectedRequest.employerDetails.companySize}</p>
                        </div>
                      )}
                      {selectedRequest.employerDetails.website && (
                        <div className="bg-white rounded-lg p-4 border border-blue-100">
                          <label className="text-sm font-medium text-blue-600 block mb-1">Website</label>
                          <a href={selectedRequest.employerDetails.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm underline">
                            {selectedRequest.employerDetails.website}
                          </a>
                        </div>
                      )}
                      {selectedRequest.employerDetails.establishedYear && (
                        <div className="bg-white rounded-lg p-4 border border-blue-100">
                          <label className="text-sm font-medium text-blue-600 block mb-1">Established Year</label>
                          <p className="text-gray-900 text-sm">{selectedRequest.employerDetails.establishedYear}</p>
                        </div>
                      )}
                      {selectedRequest.employerDetails.contactPerson && (
                        <div className="bg-white rounded-lg p-4 border border-blue-100">
                          <label className="text-sm font-medium text-blue-600 block mb-1">Contact Person</label>
                          <p className="text-gray-900 text-sm">{selectedRequest.employerDetails.contactPerson}</p>
                        </div>
                      )}
                    </div>

                    {/* Company Description */}
                    {selectedRequest.employerDetails.description && (
                      <div className="mt-4">
                        <div className="bg-white rounded-lg p-4 border border-blue-100">
                          <label className="text-sm font-medium text-blue-600 block mb-2">Company Description</label>
                          <p className="text-gray-900 text-sm leading-relaxed">{selectedRequest.employerDetails.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Request Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                Request Information
              </h3>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <label className="text-sm font-medium text-green-600 block mb-2">Request Message</label>
                    <p className="text-gray-900 leading-relaxed">{selectedRequest.message || 'No message provided'}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <label className="text-sm font-medium text-green-600 block mb-1">Request Date</label>
                      <p className="text-gray-900 font-medium">
                        {new Date(selectedRequest.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <label className="text-sm font-medium text-green-600 block mb-1">Last Updated</label>
                      <p className="text-gray-900 font-medium">
                        {new Date(selectedRequest.lastContactDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <label className="text-sm font-medium text-green-600 block mb-1">Request ID</label>
                      <p className="text-gray-900 font-mono text-sm">#{selectedRequest.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Candidate Information */}
            {selectedRequest.candidateName !== 'Not specified' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-purple-600" />
                  Candidate Information
                </h3>
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
                  {/* Profile Header with Image */}
                  <div className="flex items-center space-x-6 pb-6 border-b border-purple-200 mb-6">
                    {(() => {
                      const raw = selectedRequest._backendData?.requestedCandidate?.profile?.photo || selectedRequest._backendData?.requestedCandidate?.photo || null;
                      const url = raw ? (/^https?:\/\//i.test(raw) ? raw : `${API_CONFIG.BASE_URL}/${raw.replace(/^\//, '')}`) : null;
                      return (
                        <Avatar
                          src={url}
                          alt={selectedRequest.candidateName}
                          size="xl"
                          fallback={selectedRequest.candidateName}
                          fallbackSrc={defaultProfileImage}
                        />
                      );
                    })()}
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">{selectedRequest.candidateName}</h4>
                      <div className="flex items-center space-x-4 mb-3">
                        <Badge color="text-purple-600 bg-purple-100 border-purple-200">
                          {selectedRequest.category}
                        </Badge>
                        <Badge color="text-blue-600 bg-blue-100 border-blue-200">
                          {selectedRequest.position}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-lg font-semibold text-green-600">{selectedRequest.monthlyRate}</span>
                        </div>
                        {selectedRequest.candidateExperienceLevel !== 'Not specified' && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Experience:</span>
                            <span className="text-sm font-medium text-gray-900">{selectedRequest.candidateExperienceLevel}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Candidate Details Sections */}
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h4 className="text-md font-semibold text-purple-900 mb-3">Basic Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-purple-100">
                          <label className="text-sm font-medium text-purple-600 block mb-1">Job Category</label>
                          <p className="text-gray-900 font-medium">{selectedRequest.category}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-purple-100">
                          <label className="text-sm font-medium text-purple-600 block mb-1">Skills/Position</label>
                          <p className="text-gray-900 font-medium">{selectedRequest.position}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-purple-100">
                          <label className="text-sm font-medium text-purple-600 block mb-1">Experience Level</label>
                          <p className="text-gray-900 font-medium">{selectedRequest.candidateExperienceLevel}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-purple-100">
                          <label className="text-sm font-medium text-purple-600 block mb-1">Education Level</label>
                          <p className="text-gray-900 font-medium">{selectedRequest.candidateEducation}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h4 className="text-md font-semibold text-purple-900 mb-3">Contact Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-purple-100">
                          <label className="text-sm font-medium text-purple-600 block mb-1 flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            Contact Number
                          </label>
                          <p className="text-gray-900 font-medium">{selectedRequest.candidateContact}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-purple-100">
                          <label className="text-sm font-medium text-purple-600 block mb-1 flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            Email Address
                          </label>
                          <p className="text-gray-900 font-medium">{selectedRequest.candidateEmail}</p>
                        </div>
                      </div>
                    </div>

                    {/* Location Information */}
                    <div>
                      <h4 className="text-md font-semibold text-purple-900 mb-3">Location Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-purple-100">
                          <label className="text-sm font-medium text-purple-600 block mb-1">Location</label>
                          <p className="text-gray-900 font-medium">{selectedRequest.candidateLocation}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-purple-100">
                          <label className="text-sm font-medium text-purple-600 block mb-1">City</label>
                          <p className="text-gray-900 font-medium">{selectedRequest.candidateCity}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-purple-100">
                          <label className="text-sm font-medium text-purple-600 block mb-1">Country</label>
                          <p className="text-gray-900 font-medium">{selectedRequest.candidateCountry}</p>
                        </div>
                      </div>
                    </div>

                    {/* Skills and Qualifications */}
                    <div>
                      <h4 className="text-md font-semibold text-purple-900 mb-3">Skills & Qualifications</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-purple-100">
                          <label className="text-sm font-medium text-purple-600 block mb-1">Languages</label>
                          <p className="text-gray-900 font-medium">{selectedRequest.candidateLanguages}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-purple-100">
                          <label className="text-sm font-medium text-purple-600 block mb-1">Certifications</label>
                          <p className="text-gray-900 font-medium">{selectedRequest.candidateCertifications}</p>
                        </div>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div>
                      <h4 className="text-md font-semibold text-purple-900 mb-3">Personal Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-purple-100">
                          <label className="text-sm font-medium text-purple-600 block mb-1">Gender</label>
                          <p className="text-gray-900 font-medium">{selectedRequest.candidateGender}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-purple-100">
                          <label className="text-sm font-medium text-purple-600 block mb-1">Marital Status</label>
                          <p className="text-gray-900 font-medium">{selectedRequest.candidateMaritalStatus}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-purple-100">
                          <label className="text-sm font-medium text-purple-600 block mb-1">ID Number</label>
                          <p className="text-gray-900 font-medium font-mono text-sm">{selectedRequest.candidateIdNumber}</p>
                        </div>
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <h4 className="text-md font-semibold text-purple-900 mb-3">Availability</h4>
                      <div className="bg-white rounded-lg p-4 border border-purple-100">
                        <label className="text-sm font-medium text-purple-600 block mb-1">Availability Status</label>
                        <p className="text-gray-900 font-medium">{selectedRequest.candidateAvailability}</p>
                      </div>
                    </div>

                    {/* Description */}
                    {selectedRequest.candidateDescription !== 'Not specified' && (
                      <div>
                        <h4 className="text-md font-semibold text-purple-900 mb-3">Description</h4>
                        <div className="bg-white rounded-lg p-4 border border-purple-100">
                          <p className="text-gray-900 leading-relaxed">{selectedRequest.candidateDescription}</p>
                        </div>
                      </div>
                    )}

                    {/* References */}
                    {selectedRequest.candidateReferences !== 'Not specified' && (
                      <div>
                        <h4 className="text-md font-semibold text-purple-900 mb-3">References</h4>
                        <div className="bg-white rounded-lg p-4 border border-purple-100">
                          <p className="text-gray-900 leading-relaxed">{selectedRequest.candidateReferences}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}


          </div>
        </Modal>
      )}

      {/* Action Modal */}
      {showActionModal && selectedRequest && !currentAction && (
        <Modal
          isOpen={showActionModal}
          onClose={resetModalStates} // Use centralized cleanup
          title={`Actions for ${selectedRequest.employerName} - ${selectedRequest.companyName}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-3">
              {getAllActionButtons(selectedRequest).map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleRowAction(action.key, selectedRequest)}
                    className={`relative group flex items-center justify-center p-4 rounded-lg transition-all duration-200 hover:scale-105 ${action.className} border border-gray-200 hover:border-current`}
                    title={action.title}
                  >
                    <IconComponent className="w-6 h-6" />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      {action.title}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Modal>
      )}

      {/* Specific Action Modal (Reply, Select, Complete) */}
      {showActionModal && selectedRequest && currentAction && (
        <Modal
          isOpen={showActionModal}
          onClose={resetModalStates} // Use centralized cleanup
          title={currentAction === 'reply' ? 'Reply to Request' :
            currentAction === 'select' ? 'Send Candidate Details' :
              currentAction === 'complete' ? 'Complete Request' : 'Action'}
          size="md"
        >
          {currentAction === 'reply' && (
            <div className="space-y-4">
              {/* Employer Information */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Replying to:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Name:</span>
                    <span className="text-blue-900 ml-1">{selectedRequest.employerName}</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Company:</span>
                    <span className="text-blue-900 ml-1">{selectedRequest.companyName}</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Email:</span>
                    <span className="text-blue-900 ml-1">{selectedRequest.employerContact.email}</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Phone:</span>
                    <span className="text-blue-900 ml-1">{selectedRequest.employerContact.phone}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reply Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your reply message to the employer..."
                  disabled={replyLoading}
                />
                {replyLoading && (
                  <div className="mt-2 text-sm text-gray-600 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Sending reply to employer...
                  </div>
                )}
                {replyError && (
                  <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                    {replyError}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes (Internal)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Add internal notes for your reference..."
                  disabled={replyLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  These notes are for internal use only and won't be sent to the employer.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    resetModalStates(); // Use centralized cleanup
                  }}
                  disabled={replyLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleReplySubmit}
                  disabled={!replyMessage.trim() || replyLoading}
                >
                  {replyLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    'Send Reply'
                  )}
                </Button>
              </div>
            </div>
          )}

          {currentAction === 'select' && (
            <div className="space-y-4">
              {/* Employer Information */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-900 mb-2">Selecting candidate for:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-green-700 font-medium">Employer:</span>
                    <span className="text-green-900 ml-1">{selectedRequest.employerName}</span>
                  </div>
                  <div>
                    <span className="text-green-700 font-medium">Company:</span>
                    <span className="text-green-900 ml-1">{selectedRequest.companyName}</span>
                  </div>
                  <div>
                    <span className="text-green-700 font-medium">Position:</span>
                    <span className="text-green-900 ml-1">{selectedRequest.position}</span>
                  </div>
                  <div>
                    <span className="text-green-700 font-medium">Category:</span>
                    <span className="text-green-900 ml-1">{selectedRequest.category}</span>
                  </div>
                </div>
              </div>

              {/* Requested Candidate */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Send Candidate Information</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Send the requested candidate's information to the employer. Choose whether to send just a profile picture or complete details.
                </p>
                {selectedRequest._backendData?.requestedCandidate ? (
                  <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {(() => {
                          const raw = selectedRequest._backendData?.requestedCandidate?.profile?.photo || selectedRequest._backendData?.requestedCandidate?.photo || null;
                          const url = raw ? (/^https?:\/\//i.test(raw) ? raw : `${API_CONFIG.BASE_URL}/${raw.replace(/^\//, '')}`) : null;
                          return (
                            <Avatar
                              src={url}
                              alt={selectedRequest.candidateName}
                              size="md"
                              fallback={selectedRequest.candidateName}
                              fallbackSrc={defaultProfileImage}
                            />
                          );
                        })()}
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 text-lg">
                            {selectedRequest.candidateName}
                          </h5>
                          <p className="text-sm text-gray-600 mb-2">
                            {selectedRequest.position} • {selectedRequest.candidateExperience}
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                            <div>
                              <span className="font-medium">Location:</span> {selectedRequest.candidateLocation}
                            </div>
                            <div>
                              <span className="font-medium">Rate:</span> {selectedRequest.monthlyRate}
                            </div>
                            <div>
                              <span className="font-medium">Experience Level:</span> {selectedRequest.candidateExperienceLevel}
                            </div>
                            <div>
                              <span className="font-medium">Education:</span> {selectedRequest.candidateEducation}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleJobSeekerSelection(selectedRequest._backendData.requestedCandidate.id, 'picture')}
                          disabled={candidateSelectionLoading}
                        >
                          Send Profile Picture
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleJobSeekerSelection(selectedRequest._backendData.requestedCandidate.id, 'full')}
                          disabled={candidateSelectionLoading}
                        >
                          Send Complete Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <User className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p>No candidate specified in this request</p>
                    <p className="text-sm text-gray-400 mt-1">The employer did not specify a particular candidate</p>
                  </div>
                )}
              </div>

              {candidateSelectionError && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  {candidateSelectionError}
                </div>
              )}

              {candidateSelectionLoading && (
                <div className="text-sm text-gray-600 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                  Sending candidate information to employer...
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    resetModalStates(); // Use centralized cleanup
                  }}
                  disabled={candidateSelectionLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {currentAction === 'complete' && (
            <div className="space-y-4">
              {/* Request Information */}
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-orange-900 mb-2">Completing Request:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-orange-700 font-medium">Employer:</span>
                    <span className="text-orange-900 ml-1">{selectedRequest.employerName}</span>
                  </div>
                  <div>
                    <span className="text-orange-700 font-medium">Company:</span>
                    <span className="text-orange-900 ml-1">{selectedRequest.companyName}</span>
                  </div>
                  <div>
                    <span className="text-orange-700 font-medium">Position:</span>
                    <span className="text-orange-900 ml-1">{selectedRequest.position}</span>
                  </div>
                  <div>
                    <span className="text-orange-700 font-medium">Current Status:</span>
                    <span className="text-orange-900 ml-1">{selectedRequest.status}</span>
                  </div>
                </div>
              </div>

              {/* Completion Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Completion Notes (Optional)
                </label>
                <textarea
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Add notes about how this request was completed..."
                  disabled={completionLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  These notes will be saved with the request and sent to the employer.
                </p>
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mr-2">
                    <span className="text-yellow-800 text-xs">!</span>
                  </div>
                  <p className="text-sm text-yellow-800">
                    <strong>Warning:</strong> This action will permanently mark the request as completed and close it.
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              {completionError && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  {completionError}
                </div>
              )}

              {completionLoading && (
                <div className="text-sm text-gray-600 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2"></div>
                  Completing request...
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    resetModalStates(); // Use centralized cleanup
                  }}
                  disabled={completionLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleRequestCompletion}
                  disabled={completionLoading}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {completionLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Completing...
                    </>
                  ) : (
                    'Complete Request'
                  )}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Messaging Modal */}
      {showMessagingModal && selectedRequest && (
        <Modal
          isOpen={showMessagingModal}
          onClose={closeMessaging}
          title={`Messaging - Request #${selectedRequest.id}`}
          maxWidth="max-w-2xl"
        >
          <div className="flex flex-col h-[calc(100vh-200px)]">
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto pr-4 space-y-4 mb-4">
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
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.fromAdmin ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg shadow-sm ${msg.fromAdmin
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.fromAdmin ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}

              {messagingError && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  {messagingError}
                </div>
              )}
            </div>

            {/* New Message Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={messagingLoading}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button
                variant="primary"
                onClick={sendMessage}
                disabled={!newMessage.trim() || messagingLoading}
              >
                {messagingLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedRequest && (
        <Modal
          isOpen={showPaymentModal}
          onClose={closePaymentModal}
          title={`Request Payment - Request #${selectedRequest.id}`}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            {/* Request Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Request Details:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Employer:</span>
                  <span className="text-blue-900 ml-1">{selectedRequest.employerName}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Company:</span>
                  <span className="text-blue-900 ml-1">{selectedRequest.companyName}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Candidate:</span>
                  <span className="text-blue-900 ml-1">{selectedRequest.candidateName}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Status:</span>
                  <span className="text-blue-900 ml-1">{selectedRequest.status}</span>
                </div>
              </div>
            </div>

            {/* Payment Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentType"
                    value="photo_access"
                    checked={paymentFormData.paymentType === 'photo_access'}
                    onChange={(e) => setPaymentFormData({ ...paymentFormData, paymentType: e.target.value })}
                    className="mr-2"
                  />
                  <div>
                    <div className="font-medium">Photo Access</div>
                    <div className="text-sm text-gray-500">Basic candidate photo</div>
                  </div>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentType"
                    value="full_details"
                    checked={paymentFormData.paymentType === 'full_details'}
                    onChange={(e) => setPaymentFormData({ ...paymentFormData, paymentType: e.target.value })}
                    className="mr-2"
                  />
                  <div>
                    <div className="font-medium">Full Details</div>
                    <div className="text-sm text-gray-500">Complete candidate information</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <select
                value={paymentFormData.paymentMethodId}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, paymentMethodId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Payment Method</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name} - {method.accountNumber}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount and Currency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={paymentFormData.amount}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5000"
                  min="0"
                  step="100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={paymentFormData.currency}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="RWF">RWF (Rwandan Franc)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={paymentFormData.description}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder={`Payment for ${paymentFormData.paymentType === 'photo_access' ? 'photo access' : 'full details'} access to candidate information`}
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date (Optional)
              </label>
              <input
                type="date"
                value={paymentFormData.dueDate}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Error Display */}
            {paymentError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                {paymentError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={closePaymentModal}
                disabled={paymentLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={paymentLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {paymentLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  'Send Payment Request'
                )}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Payment Approval Modal */}
      {showPaymentApprovalModal && selectedRequest && (
        <Modal
          isOpen={showPaymentApprovalModal}
          onClose={closePaymentApprovalModal}
          title={`Approve Payment - Request #${selectedRequest.id}`}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handlePaymentApproval} className="space-y-6">
            {/* Request Information */}
            <div className="space-y-6">
              {/* Request Overview */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Request Overview
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <span className="text-blue-600 font-medium block mb-1">Employer:</span>
                    <span className="text-gray-900">{selectedRequest.employerName}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <span className="text-blue-600 font-medium block mb-1">Company:</span>
                    <span className="text-gray-900">{selectedRequest.companyName}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <span className="text-blue-600 font-medium block mb-1">Candidate:</span>
                    <span className="text-gray-900">{selectedRequest.candidateName}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <span className="text-blue-600 font-medium block mb-1">Request Status:</span>
                    <span className="text-gray-900 capitalize">{selectedRequest.status?.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Payment Confirmation Details */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Payment Confirmation Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <span className="text-green-600 font-medium block mb-1">Payer Name:</span>
                    <span className="text-gray-900">{selectedRequest.latestPayment?.confirmationName || 'Not specified'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <span className="text-green-600 font-medium block mb-1">Phone Number:</span>
                    <span className="text-gray-900">{selectedRequest.latestPayment?.confirmationPhone || 'Not specified'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <span className="text-green-600 font-medium block mb-1">Payment Reference:</span>
                    <span className="text-gray-900 font-mono text-xs">{selectedRequest.latestPayment?.paymentReference || 'Not specified'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <span className="text-green-600 font-medium block mb-1">Transfer Amount:</span>
                    <span className="text-gray-900 font-semibold">
                      {selectedRequest.latestPayment?.amount ? `${selectedRequest.latestPayment.amount} RWF` : 'Not specified'}
                    </span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <span className="text-green-600 font-medium block mb-1">Confirmation Date:</span>
                    <span className="text-gray-900">
                      {selectedRequest.latestPayment?.confirmationDate
                        ? new Date(selectedRequest.latestPayment.confirmationDate).toLocaleDateString()
                        : 'Not specified'}
                    </span>
                  </div>

                </div>

                {/* Additional Notes */}
                {selectedRequest.latestPayment?.adminNotes && selectedRequest.latestPayment.adminNotes !== 'No additional notes' && (
                  <div className="mt-4 bg-white rounded-lg p-3 border border-green-100">
                    <span className="text-green-600 font-medium block mb-2">Additional Notes:</span>
                    <p className="text-gray-900 text-sm leading-relaxed">{selectedRequest.latestPayment.adminNotes}</p>
                  </div>
                )}
              </div>

              {/* Payment System Details */}
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
                <h4 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  System Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3 border border-purple-100">
                    <span className="text-purple-600 font-medium block mb-1">Payment Type:</span>
                    <span className="text-gray-900 capitalize">
                      {selectedRequest.latestPayment?.paymentType?.replace('_', ' ') || 'Not specified'}
                    </span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-purple-100">
                    <span className="text-purple-600 font-medium block mb-1">Payment Status:</span>
                    <span className="text-gray-900 capitalize">
                      {selectedRequest.latestPayment?.status || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Approval Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="action"
                    value="approve"
                    checked={paymentApprovalData.action === 'approve'}
                    onChange={(e) => setPaymentApprovalData({ ...paymentApprovalData, action: e.target.value })}
                    className="mr-2"
                  />
                  <div>
                    <div className="font-medium">Approve</div>
                    <div className="text-sm text-gray-500">Approve the payment</div>
                  </div>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="action"
                    value="reject"
                    checked={paymentApprovalData.action === 'reject'}
                    onChange={(e) => setPaymentApprovalData({ ...paymentApprovalData, action: e.target.value })}
                    className="mr-2"
                  />
                  <div>
                    <div className="font-medium">Reject</div>
                    <div className="text-sm text-gray-500">Reject the payment</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={paymentApprovalData.notes}
                onChange={(e) => setPaymentApprovalData({ ...paymentApprovalData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Add any additional notes for the payment approval..."
              />
            </div>

            {/* Error Display */}
            {paymentApprovalError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                {paymentApprovalError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={closePaymentApprovalModal}
                disabled={paymentApprovalLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={paymentApprovalLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {paymentApprovalLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  'Submit Approval'
                )}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* New Workflow Modal */}
      {showWorkflowModal && selectedRequest && (
        <Modal
          isOpen={showWorkflowModal}
          onClose={workflowLoading ? undefined : () => setShowWorkflowModal(false)}
          title={`${getWorkflowActionTitle(workflowAction)}`}
          className="max-w-2xl"
        >
          <div className="space-y-6 relative">
            {/* Loading Overlay */}
            {workflowLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                <div className="flex flex-col items-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <div className="text-sm font-medium text-gray-700">
                    Processing your request...
                  </div>
                  <div className="text-xs text-gray-500 text-center max-w-xs">
                    This may take a few moments as we send notifications and update the system.
                  </div>
                </div>
              </div>
            )}

            {/* Request Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Request Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Request ID:</span>
                  <span className="ml-2 font-medium">#{selectedRequest.id}</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-2">
                    <WorkflowStatus status={selectedRequest.status} />
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Employer:</span>
                  <span className="ml-2 font-medium">{selectedRequest.employerName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Candidate:</span>
                  <span className="ml-2 font-medium">{selectedRequest.candidateName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Created:</span>
                  <span className="ml-2">{new Date(selectedRequest.date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Company:</span>
                  <span className="ml-2 font-medium">{selectedRequest.companyName}</span>
                </div>
              </div>
            </div>

            {/* Workflow Progress */}
            <WorkflowProgress currentStatus={selectedRequest.status} />

            {/* Action-specific content */}
            {getWorkflowActionContent(workflowAction)}

            {/* Error Display */}
            {workflowError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">{workflowError}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowWorkflowModal(false)}
                disabled={workflowLoading}
              >
                Cancel
              </Button>

              {getWorkflowActionButtons(workflowAction)}
            </div>
          </div>
        </Modal>
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default EmployerRequestsPage; 