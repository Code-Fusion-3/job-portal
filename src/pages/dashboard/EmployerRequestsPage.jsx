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
  X
} from 'lucide-react';
import { useRequests } from '../../api/hooks/useRequests.js';
import { useAuth } from '../../api/hooks/useAuth.js';
import { categoryService } from '../../api/services/categoryService.js';
import { useCategories } from '../../api/hooks/useCategories.js';
import { useJobSeekers } from '../../api/hooks/useJobSeekers.js';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import StatsGrid from '../../components/ui/StatsGrid';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

import { getStatusColor, getPriorityColor, handleContactEmployer } from '../../utils/adminHelpers';
import { motion } from 'motion/react';
import toast, { Toaster } from 'react-hot-toast';

const EmployerRequestsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // Hooks
  const {
    requests: safeData, 
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    pageInfo,
    hasNextPage,
    hasPrevPage,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    goToPage,
    nextPage,
    prevPage,
    applyFilters,
    replyToRequest,
    selectJobSeekerForRequest,
    updateRequestStatus // Added updateRequestStatus to useRequests hook
  } = useRequests({ includeAdmin: true });

  const { categories, loadingCategories, fetchCategories } = useCategories();

  // Filter options
  const filterOptions = {
    status: [
      { value: '', label: 'All Statuses' },
      { value: 'pending', label: 'Pending' },
      { value: 'in_progress', label: 'In Progress' },
      { value: 'approved', label: 'Approved' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' }
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
      { value: '0-50000', label: '0 - 50,000 RWF' },
      { value: '50000-100000', label: '50,000 - 100,000 RWF' },
      { value: '100000-200000', label: '100,000 - 200,000 RWF' },
      { value: '200000+', label: '200,000+ RWF' }
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
  const [completionError, setCompletionError] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');

  // Search and Filter state
  const [localSearchTerm, setLocalSearchTerm] = useState('');
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
  }, []);

  // State validation function for debugging
  const validateModalStates = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Modal State Validation:', {
        showActionModal,
        currentAction,
        selectedRequest: !!selectedRequest,
        showDetailsModal,
        replyMessage: !!replyMessage,
        adminNotes: !!adminNotes,
        completionNotes: !!completionNotes
      });
    }
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
            currency: 'RWF',
            minimumFractionDigits: 0
          }).format(rate);
        }
        
        // If it's a string, try to parse it
        if (typeof rate === 'string') {
          const numRate = parseFloat(rate);
          if (!isNaN(numRate)) {
            return new Intl.NumberFormat('en-RW', {
              style: 'currency',
              currency: 'RWF',
              minimumFractionDigits: 0
            }).format(numRate);
          }
          return rate; // Return as is if it can't be parsed
        }
        
        return 'Not specified';
      };

      return {
        id: backendRequest.id,
        employerName: backendRequest.name || 'Unknown',
        companyName: backendRequest.companyName || 'Private',
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
          email: backendRequest.email || '',
          phone: backendRequest.phoneNumber || ''
      },
      adminNotes: '',
        lastContactDate: backendRequest.updatedAt,
        isCompleted: backendRequest.status === 'completed',
        category: backendRequest.requestedCandidate?.profile?.jobCategory?.name_en || 'General',
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
      return {
        id: backendRequest?.id || 'unknown',
        employerName: 'Error loading data',
        companyName: 'Error loading data',
        candidateName: 'Error loading data',
        position: 'Error loading data',
        status: 'error',
        priority: 'normal',
        date: new Date(),
        monthlyRate: 'Error loading data',
        message: 'Error loading data',
        employerContact: { email: '', phone: '' },
        adminNotes: '',
        lastContactDate: new Date(),
      isCompleted: false,
        category: 'Error loading data',
        _backendData: backendRequest
      };
    }
  };

  // Transform the data for display
  const transformedRequests = safeData.map(transformRequestData).filter(Boolean);

  // Ensure data is safe for rendering
  const safeDataForRendering = transformedRequests.map(item => ({
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
  }));


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
      render: (item) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{item.candidateName}</div>
            <div className="text-sm text-gray-500">{item.position}</div>
          </div>
        </div>
      )
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


  // Search and filter logic
  const filteredData = useMemo(() => {
    let filtered = safeDataForRendering || [];

    // Apply search term
    if (localSearchTerm.trim()) {
      const searchLower = localSearchTerm.toLowerCase();
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
  }, [safeDataForRendering, localSearchTerm, localFilters]);

  // Handle search change with debouncing
  const handleSearchChange = useCallback((value) => {
    setLocalSearchTerm(value);
    setIsSearching(true);
    
    // Debounce the search
    const timeoutId = setTimeout(() => {
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((filterKey, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  }, []);

    // Clear all filters
  const clearAllFilters = useCallback(() => {
    setLocalFilters({
      status: '',
      priority: '',
      category: '',
      dateRange: '',
      monthlyRateRange: ''
    });
    setLocalSearchTerm('');
  }, []);

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (localSearchTerm.trim()) count++;
    Object.values(localFilters).forEach(value => {
      if (value) count++;
    });
    return count;
  }, [localSearchTerm, localFilters]);

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
      description: 'Awaiting admin review'
    },
    {
      title: 'In Progress',
      value: filteredData.filter(r => r.status === 'in_progress').length.toString(),
      change: '+1',
      changeType: 'increase',
      icon: AlertCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Under negotiation'
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
    console.log('🔄 Refreshing data');
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
        setShowDetailsModal(true);
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
      case 'select':
        setCurrentAction('select');
        setShowActionModal(true);
        break;
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
      console.log(`🔄 Updating request status: ${selectedRequest.id} -> ${newStatus}`);
      
      const result = await updateRequestStatus(selectedRequest.id, {
                status: newStatus, 
        adminNotes: message
      });
      
      if (result.success) {
        console.log('✅ Status updated successfully:', result.data);
        
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
      console.log(`📧 Sending reply to employer: ${selectedRequest.employerName} (${selectedRequest.employerContact.email})`);
      
      const result = await replyToRequest(selectedRequest.id, {
        content: replyMessage
      });
      
      if (result.success) {
        console.log('✅ Reply sent successfully:', result.data);
        
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
      console.log(`📤 Sending candidate information: ${jobSeekerId}, Details type: ${detailsType}`);
      
      const result = await selectJobSeekerForRequest(selectedRequest.id, jobSeekerId, detailsType);
      
      if (result.success) {
        console.log('✅ Candidate information sent successfully:', result.data);
        
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
      console.log(`✅ Completing request: ${selectedRequest.id}`);
      console.log(`📝 Completion notes: ${completionNotes || 'None'}`);
      
      const result = await updateRequestStatus(selectedRequest.id, {
        status: 'completed',
        adminNotes: completionNotes
      });
      
      console.log('📊 Completion result:', result);
      
      if (result.success) {
        console.log('✅ Request completed successfully:', result.data);
        
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

  // Get all action buttons for the modal
  const getAllActionButtons = (request) => {
    const baseActions = [
      // View Details - Always available
      { key: 'view', title: 'View Details', icon: Eye, className: 'text-blue-600 hover:bg-blue-50', group: 'view' },
      
      // Contact Group - Status-dependent
      { key: 'call', title: 'Call', icon: Phone, className: 'text-purple-600 hover:bg-purple-50', group: 'contact' },
      { key: 'contact', title: 'Contact Email', icon: Mail, className: 'text-green-600 hover:bg-green-50', group: 'contact' },
    ];

    // Add reply action only for non-terminal statuses
    if (request.status !== 'completed' && request.status !== 'cancelled' && request.status !== 'approved') {
      baseActions.push(
        { key: 'reply', title: 'Reply', icon: MessageSquare, className: 'text-orange-600 hover:bg-orange-50', group: 'contact' }
      );
    }

    // Status-based actions
    const statusActions = [];
    
    switch (request.status) {
      case 'pending':
        statusActions.push(
          { key: 'start', title: 'Start Processing', icon: Play, className: 'text-blue-600 hover:bg-blue-50', group: 'status' },
          { key: 'select', title: 'Send Candidate Details', icon: User, className: 'text-indigo-600 hover:bg-indigo-50', group: 'candidate' }
        );
        break;
        
      case 'in_progress':
        statusActions.push(
          { key: 'approve', title: 'Approve Request', icon: CheckCircle, className: 'text-green-600 hover:bg-green-50', group: 'status' },
          { key: 'select', title: 'Send Candidate Details', icon: User, className: 'text-indigo-600 hover:bg-indigo-50', group: 'candidate' }
        );
        break;
        
          case 'approved':
      statusActions.push(
        { key: 'complete', title: 'Mark Complete', icon: CheckCircle, className: 'text-green-600 hover:bg-green-50', group: 'status' }
        // Candidate selection removed - backend rejects it for approved requests
      );
      break;
        
      case 'completed':
        // No additional actions for completed requests
        break;
        
      case 'cancelled':
        statusActions.push(
          { key: 'reactivate', title: 'Reactivate', icon: RefreshCw, className: 'text-blue-600 hover:bg-blue-50', group: 'status' }
        );
        break;
        
      default:
        // For any other status, show all actions
        statusActions.push(
          { key: 'select', title: 'Send Candidate Details', icon: User, className: 'text-indigo-600 hover:bg-indigo-50', group: 'candidate' },
          { key: 'complete', title: 'Mark Complete', icon: CheckCircle, className: 'text-green-600 hover:bg-green-50', group: 'status' }
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
                  value={localSearchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                />
                {isSearching && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                  </div>
                )}
                {localSearchTerm && (
                  <button
                    onClick={() => setLocalSearchTerm('')}
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    showFilters 
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
                        {localSearchTerm && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            Search: "{localSearchTerm}"
                            <button
                              onClick={() => setLocalSearchTerm('')}
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
          onRowAction={handleRowAction}
                actionButtons={getActionButtons}
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
        }}
        title="Request Details"
          size="lg"
      >
          <div className="space-y-6">
            {/* Employer Information */}
              <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Employer Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{selectedRequest.employerName}</p>
                </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company</label>
                    <p className="text-gray-900">{selectedRequest.companyName}</p>
                </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{selectedRequest.employerContact.email}</p>
              </div>
              <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{selectedRequest.employerContact.phone}</p>
                </div>
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Request Details</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <Badge color={getStatusColor(selectedRequest.status)}>
                    {selectedRequest.status}
                  </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Priority</label>
                    <Badge color={getPriorityColor(selectedRequest.priority)}>
                    {selectedRequest.priority}
                  </Badge>
                </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Request Date</label>
                    <p className="text-gray-900">
                      {new Date(selectedRequest.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Message</label>
                    <p className="text-gray-900 mt-1">{selectedRequest.message}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Candidate Information */}
            {selectedRequest.candidateName !== 'Not specified' && (
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Candidate Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-4">
                    {/* Profile Header with Image */}
                    <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{selectedRequest.candidateName}</h4>
                        <p className="text-sm text-gray-600">{selectedRequest.category} • {selectedRequest.position}</p>
                        <p className="text-sm font-medium text-green-600">{selectedRequest.monthlyRate}</p>
              </div>
            </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-2 gap-4">
            <div>
                        <label className="text-sm font-medium text-gray-500">Job Category</label>
                        <p className="text-gray-900">{selectedRequest.category}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Skills/Position</label>
                        <p className="text-gray-900">{selectedRequest.position}</p>
                      </div>
            </div>

                    {/* Additional Candidate Details from Backend */}
                    {selectedRequest.candidateExperience !== 'Not specified' && (
                      <>
                        {/* Experience and Education */}
                        <div className="grid grid-cols-2 gap-4">
            <div>
                            <label className="text-sm font-medium text-gray-500">Experience Level</label>
                            <p className="text-gray-900">
                              {selectedRequest.candidateExperienceLevel}
                            </p>
                          </div>
                  <div>
                            <label className="text-sm font-medium text-gray-500">Education</label>
                            <p className="text-gray-900">
                              {selectedRequest.candidateEducation}
                            </p>
                  </div>
                </div>

                        {/* Location Information */}
                        <div className="grid grid-cols-3 gap-4">
                    <div>
                            <label className="text-sm font-medium text-gray-500">Location</label>
                            <p className="text-gray-900">
                              {selectedRequest.candidateLocation}
                            </p>
                    </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">City</label>
                            <p className="text-gray-900">
                              {selectedRequest.candidateCity}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Country</label>
                            <p className="text-gray-900">
                              {selectedRequest.candidateCountry}
                            </p>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Contact Number</label>
                            <p className="text-gray-900">
                              {selectedRequest.candidateContact}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <p className="text-gray-900">
                              {selectedRequest.candidateEmail}
                            </p>
                          </div>
                        </div>

                        {/* Additional Details */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Languages</label>
                            <p className="text-gray-900">
                              {selectedRequest.candidateLanguages}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Certifications</label>
                            <p className="text-gray-900">
                              {selectedRequest.candidateCertifications}
                            </p>
                          </div>
                        </div>

                        {/* Availability and Personal Details */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Availability</label>
                            <p className="text-gray-900">
                              {selectedRequest.candidateAvailability}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Gender</label>
                            <p className="text-gray-900">
                              {selectedRequest.candidateGender}
                            </p>
                          </div>
                        </div>

                        {/* Description and References */}
                        {selectedRequest.candidateDescription !== 'Not specified' && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Description</label>
                            <p className="text-gray-900">
                              {selectedRequest.candidateDescription}
                            </p>
                  </div>
                )}

                        {selectedRequest.candidateReferences !== 'Not specified' && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">References</label>
                            <p className="text-gray-900">
                              {selectedRequest.candidateReferences}
                            </p>
              </div>
                        )}

                        {/* ID Number */}
                        {selectedRequest.candidateIdNumber !== 'Not specified' && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">ID Number</label>
                            <p className="text-gray-900">
                              {selectedRequest.candidateIdNumber}
                            </p>
            </div>
                        )}
                      </>
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
            {getAllActionButtons(selectedRequest).map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleRowAction(action.key, selectedRequest)}
                  className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors duration-200 ${action.className}`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="text-gray-900">{action.title}</span>
                </button>
              );
            })}
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
                        <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
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
      
      <Toaster position="top-right" />
    </div>
  );
};

export default EmployerRequestsPage; 