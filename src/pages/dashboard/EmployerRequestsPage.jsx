import { useState, useEffect, useCallback } from 'react';
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
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { useAdminRequests } from '../../api/hooks/useRequests.js';
import { useAuth } from '../../api/hooks/useAuth.js';
import { categoryService } from '../../api/services/categoryService.js';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import StatsGrid from '../../components/ui/StatsGrid';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import { getStatusColor, getPriorityColor, handleContactEmployer } from '../../utils/adminHelpers';
import { motion } from 'motion/react';

const EmployerRequestsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // Use the custom hook for requests management
  const {
    requests,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    searchTerm,
    filters,
    sortBy,
    sortOrder,
    fetchRequests,
    replyToRequest,
    selectJobSeekerForRequest,
    setSearchTerm,
    setFilters,
    setSortBy,
    setSortOrder,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
    pageInfo,
    applyFilters
  } = useAdminRequests({
    autoFetch: true,
    itemsPerPage: 10
  });

  // State management
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState('');

  // Filter state
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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
        adminNotes: '', // This should be stored separately
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
        // Backend fields for reference
        _backendData: backendRequest
      };
    } catch (error) {
      console.error('Error transforming request data:', error, backendRequest);
      // Return a safe fallback object
      return {
        id: backendRequest.id || 'unknown',
        employerName: 'Error loading data',
        companyName: 'Unknown',
        candidateName: 'Not specified',
        position: 'General',
        status: 'pending',
        priority: 'normal',
        date: new Date().toISOString(),
        monthlyRate: 'Not specified',
        message: 'Error loading request data',
        employerContact: {
          email: '',
          phone: ''
        },
        adminNotes: '',
        lastContactDate: new Date().toISOString(),
        isCompleted: false,
        category: 'domestic',
        _backendData: backendRequest
      };
    }
  };

  // Transform all requests
  const transformedRequests = requests.map(transformRequestData).filter(Boolean);

  // Debug logging
  useEffect(() => {
    if (requests.length > 0) {
      console.log('Raw requests from backend:', requests);
      console.log('Transformed requests:', transformedRequests);
    }
  }, [requests, transformedRequests]);

  // Create filter structure for DataTable
  const tableFilters = [
    {
      key: 'status',
      value: filters.status || '',
      placeholder: 'Filter by status',
      options: [
        { value: '', label: 'All Statuses' },
        { value: 'pending', label: 'Pending' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    },
    {
      key: 'priority',
      value: filters.priority || '',
      placeholder: 'Filter by priority',
      options: [
        { value: '', label: 'All Priorities' },
        { value: 'low', label: 'Low' },
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
      ]
    },
    {
      key: 'category',
      value: filters.category || '',
      placeholder: 'Filter by category',
      options: [
        { value: '', label: 'All Categories' },
        ...categories.map(cat => ({ value: cat.name_en, label: cat.name_en }))
      ]
    }
  ];

  // Ensure data is safe for rendering
  const safeData = transformedRequests.map(item => ({
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

  // Statistics calculation
  const stats = [
    {
      title: 'Total Requests',
      value: safeData.length.toString(),
      change: '+5',
      changeType: 'increase',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'All employer requests'
    },
    {
      title: 'Pending Review',
      value: safeData.filter(r => r.status === 'pending').length.toString(),
      change: '+2',
      changeType: 'increase',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Awaiting admin review'
    },
    {
      title: 'In Progress',
      value: safeData.filter(r => r.status === 'in_progress').length.toString(),
      change: '+1',
      changeType: 'increase',
      icon: AlertCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Under negotiation'
    },
    {
      title: 'Completed',
      value: safeData.filter(r => r.status === 'completed').length.toString(),
      change: '+3',
      changeType: 'increase',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Successfully closed'
    }
  ];

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

  // Event handlers
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Fetch categories for filtering
  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const result = await categoryService.getAllCategories();
      if (result.success) {
        setCategories(result.data || []);
      } else {
        console.error('Failed to fetch categories:', result.error);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  // Handle date filter changes
  const handleDateFilterChange = (type, value) => {
    if (type === 'from') {
      setDateFrom(value);
      setFilters(prev => ({ ...prev, dateFrom: value }));
    } else {
      setDateTo(value);
      setFilters(prev => ({ ...prev, dateTo: value }));
    }
  };

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Refresh function that clears all filters and fetches fresh data
  const handleRefresh = useCallback(() => {
    // Clear all filters
    setSearchTerm('');
    setFilters({});
    setDateFrom('');
    setDateTo('');
    // Reset to first page
    goToPage(1);
    // Apply filters to fetch fresh data
    applyFilters();
  }, [setSearchTerm, setFilters, goToPage, applyFilters]);

  const handleRowAction = (action, request) => {
    setSelectedRequest(request);
    setAdminNotes(request.adminNotes || '');
    
    switch (action) {
      case 'view':
        setShowDetailsModal(true);
        break;
      case 'contact':
        handleContactEmployer(request.employerContact, 'email');
        break;
      case 'call':
        handleContactEmployer(request.employerContact, 'phone');
        break;
      case 'reply':
        setCurrentAction('reply');
        setShowActionModal(true);
        break;
      case 'select':
        setCurrentAction('select');
        setShowActionModal(true);
        break;
      case 'complete':
        setCurrentAction('complete');
        setShowActionModal(true);
        break;
      default:
        console.warn('Unknown action:', action);
    }
  };

  const handleStatusUpdate = (newStatus) => {
    if (!selectedRequest) return;
    
    // Update the request status
    const updatedRequest = { ...selectedRequest, status: newStatus };
    setSelectedRequest(updatedRequest);
    
    // Close modal
    setShowActionModal(false);
    setCurrentAction(null);
    
    // Show success message
    alert(`Request status updated to ${newStatus}`);
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
        
        alert(successMessage);
        
        // Clear form and close modal
        setReplyMessage('');
        setAdminNotes('');
        setShowActionModal(false);
        setCurrentAction(null);
        
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

  const handleJobSeekerSelection = async (jobSeekerId) => {
    if (!selectedRequest) return;
    
    try {
      const result = await selectJobSeekerForRequest(selectedRequest.id, jobSeekerId);
      
      if (result.success) {
        alert('Job seeker selected successfully');
        setShowActionModal(false);
        setCurrentAction(null);
      } else {
        alert(result.error || 'Failed to select job seeker');
      }
    } catch (error) {
      console.error('Error selecting job seeker:', error);
      alert('Error selecting job seeker');
    }
  };

  // Loading state
  if (loading && transformedRequests.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading employer requests..." />
      </div>
    );
  }

  // Error state
  if (error && transformedRequests.length === 0) {
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
  if (!loading && safeData.length === 0) {
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
                <RefreshCw className="mr-2 h-4 w-4" />
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <h2 className="text-xl font-semibold text-gray-900">
                Employer Requests ({safeData.length})
              </h2>
            </div>

            {/* Data Table */}
            <div className="space-y-4">
              {/* Custom Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                
                {loading && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    Loading...
                  </div>
                )}
                
                {showFilters && (
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">From:</label>
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => handleDateFilterChange('from', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">To:</label>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => handleDateFilterChange('to', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDateFrom('');
                        setDateTo('');
                        setFilters(prev => ({ ...prev, dateFrom: '', dateTo: '' }));
                      }}
                    >
                      Clear Dates
                    </Button>
                  </div>
                )}
              </div>

              <DataTable
                data={safeData}
                columns={columns}
                searchTerm={searchTerm}
                filters={tableFilters}
                onSearchChange={handleSearchChange}
                onFilterChange={handleFilterChange}
                onRowAction={handleRowAction}
                actionButtons={[
                  // View Details - Primary action
                  { key: 'view', title: 'View Details', icon: Eye, className: 'text-blue-600 hover:bg-blue-50', group: 'view' },
                  
                  // Contact Group - Communication actions
                  { key: 'call', title: 'Call', icon: Phone, className: 'text-purple-600 hover:bg-purple-50', group: 'contact' },
                  { key: 'contact', title: 'Contact Email', icon: Mail, className: 'text-green-600 hover:bg-green-50', group: 'contact' },
                  { key: 'reply', title: 'Reply', icon: MessageSquare, className: 'text-orange-600 hover:bg-orange-50', group: 'contact' },
                  
                  // Candidate Selection
                  { key: 'select', title: 'Select Candidate', icon: User, className: 'text-indigo-600 hover:bg-indigo-50', group: 'candidate' },
                  
                  // Completion Action
                  { key: 'complete', title: 'Mark Complete', icon: CheckCircle, className: 'text-green-600 hover:bg-green-50', group: 'completion' }
                ]}
                pagination={false}
                itemsPerPage={10}
              />

              {/* Server-side Pagination */}
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    onNextPage={nextPage}
                    onPrevPage={prevPage}
                    hasNextPage={hasNextPage}
                    hasPrevPage={hasPrevPage}
                    pageInfo={pageInfo}
                  />
                </div>
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
          onClose={() => setShowDetailsModal(false)}
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
      {showActionModal && selectedRequest && (
        <Modal
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
          title={currentAction === 'reply' ? 'Reply to Request' : 
                 currentAction === 'select' ? 'Select Job Seeker' : 
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
                    setShowActionModal(false);
                    setReplyMessage('');
                    setAdminNotes('');
                    setReplyError('');
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
              <p className="text-gray-600">
                Select a job seeker for this request. This will notify the employer.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowActionModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleJobSeekerSelection(1)} // Placeholder ID
                >
                  Select Candidate
                </Button>
              </div>
            </div>
          )}

          {currentAction === 'complete' && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Mark this request as completed. This will close the request.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowActionModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleStatusUpdate('completed')}
                >
                  Complete Request
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default EmployerRequestsPage; 