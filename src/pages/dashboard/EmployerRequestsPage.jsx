import { useState, useEffect } from 'react';
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
  Building
} from 'lucide-react';
import { useAdminRequests } from '../../api/hooks/useRequests.js';
import { useAuth } from '../../api/hooks/useAuth.js';
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
    pageInfo
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

  // Mock data for employer requests (temporary until full integration)
  const mockRequests = [
    {
      id: 1,
      employerName: 'Mrs. Uwimana',
      companyName: 'Private Household',
      candidateName: 'Francine Mukamana',
      position: 'Housemaid',
      status: 'pending',
      priority: 'high',
      date: '2024-01-15T10:30:00Z',
      dailyRate: 5000,
      monthlyRate: 120000,
      message: 'Need reliable housemaid for daily cleaning and cooking. We have a family of 4 with 2 children. Looking for someone who can start immediately.',
      employerContact: {
        email: 'uwimana@email.com',
        phone: '+250 788 111 111'
      },
      adminNotes: '',
      lastContactDate: null,
      isCompleted: false,
      category: 'domestic'
    },
    {
      id: 2,
      employerName: 'Mr. Ndayisaba',
      companyName: 'Hotel Rwanda',
      candidateName: 'Jean Pierre Ndayisaba',
      position: 'Driver',
      status: 'in_progress',
      priority: 'medium',
      date: '2024-01-14T14:20:00Z',
      dailyRate: 6000,
      monthlyRate: 150000,
      message: 'Looking for experienced driver for hotel transportation. Must have clean driving record and be available for shift work.',
      employerContact: {
        email: 'ndayisaba@hotelrwanda.com',
        phone: '+250 788 222 222'
      },
      adminNotes: 'Called employer - interested in proceeding. Waiting for final confirmation on start date.',
      lastContactDate: '2024-01-15T14:30:00Z',
      isCompleted: false,
      category: 'transport'
    },
    {
      id: 3,
      employerName: 'Mrs. Mukamana',
      companyName: 'Private Household',
      candidateName: 'Marie Claire Uwineza',
      position: 'Babysitter',
      status: 'completed',
      priority: 'low',
      date: '2024-01-13T09:15:00Z',
      dailyRate: 4000,
      monthlyRate: 100000,
      message: 'Need caring babysitter for 2 children aged 3 and 5. Must be patient and have experience with young children.',
      employerContact: {
        email: 'mukamana@email.com',
        phone: '+250 788 333 333'
      },
      adminNotes: 'Deal completed successfully. Employer hired the candidate. Start date: January 20, 2024.',
      lastContactDate: '2024-01-14T16:45:00Z',
      isCompleted: true,
      category: 'care'
    },
    {
      id: 4,
      employerName: 'Mr. Uwimana',
      companyName: 'Restaurant Kigali',
      candidateName: 'Sarah Mukamana',
      position: 'Cook',
      status: 'pending',
      priority: 'high',
      date: '2024-01-15T11:45:00Z',
      dailyRate: 7000,
      monthlyRate: 180000,
      message: 'Need experienced cook for our restaurant. Must know local and international cuisine. Full-time position.',
      employerContact: {
        email: 'uwimana@restaurant.com',
        phone: '+250 788 444 444'
      },
      adminNotes: '',
      lastContactDate: null,
      isCompleted: false,
      category: 'food'
    },
    {
      id: 5,
      employerName: 'Mrs. Nshuti',
      companyName: 'Private Household',
      candidateName: 'Emmanuel Niyonshuti',
      position: 'Gardener',
      status: 'in_progress',
      priority: 'medium',
      date: '2024-01-12T16:30:00Z',
      dailyRate: 5500,
      monthlyRate: 140000,
      message: 'Looking for gardener for large property. Must have experience with landscaping and plant care.',
      employerContact: {
        email: 'nshuti@email.com',
        phone: '+250 788 555 555'
      },
      adminNotes: 'Employer requested additional information about candidate\'s experience. Will follow up tomorrow.',
      lastContactDate: '2024-01-15T10:20:00Z',
      isCompleted: false,
      category: 'maintenance'
    }
  ];



  // Statistics calculation
  const stats = [
    {
      title: 'Total Requests',
      value: requests.length.toString(),
      change: '+5',
      changeType: 'increase',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'All employer requests'
    },
    {
      title: 'Pending Review',
      value: requests.filter(r => r.status === 'pending').length.toString(),
      change: '+2',
      changeType: 'increase',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Awaiting admin review'
    },
    {
      title: 'In Progress',
      value: requests.filter(r => r.status === 'in_progress').length.toString(),
      change: '+1',
      changeType: 'increase',
      icon: AlertCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Under negotiation'
    },
    {
      title: 'Completed',
      value: requests.filter(r => r.status === 'completed').length.toString(),
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
      render: (value, item) => (
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
      render: (value, item) => (
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
        switch (category) {
          case 'domestic': return 'text-blue-600 bg-blue-50 border-blue-200';
          case 'care': return 'text-pink-600 bg-pink-50 border-pink-200';
          case 'food': return 'text-orange-600 bg-orange-50 border-orange-200';
          case 'maintenance': return 'text-green-600 bg-green-50 border-green-200';
          case 'transport': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
          default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
      }
    },
    {
      key: 'dailyRate',
      label: 'Daily Rate',
      sortable: true,
      type: 'currency'
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
      case 'approve':
      case 'reject':
      case 'complete':
        setCurrentAction(action);
        setShowActionModal(true);
        break;
      default:
        break;
    }
  };

  const handleStatusUpdate = (newStatus) => {
    if (selectedRequest) {
      setRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { 
                ...req, 
                status: newStatus, 
                adminNotes: adminNotes,
                lastContactDate: new Date().toISOString(),
                isCompleted: newStatus === 'completed'
              }
            : req
        )
      );
      setShowActionModal(false);
      setSelectedRequest(null);
      setCurrentAction(null);
      setAdminNotes('');
    }
  };

  // Action buttons for table
  const actionButtons = [
    {
      key: 'view',
      icon: Eye,
      title: 'View Details',
      className: 'text-blue-600 hover:bg-blue-50'
    },
    {
      key: 'contact',
      icon: Mail,
      title: 'Send Email',
      className: 'text-green-600 hover:bg-green-50'
    },
    {
      key: 'call',
      icon: Phone,
      title: 'Call',
      className: 'text-purple-600 hover:bg-purple-50'
    },
    {
      key: 'approve',
      icon: CheckCircle,
      title: 'Approve',
      className: 'text-green-600 hover:bg-green-50'
    },
    {
      key: 'reject',
      icon: XCircle,
      title: 'Reject',
      className: 'text-red-600 hover:bg-red-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <StatsGrid stats={stats} />

      {/* Search and Filters */}
      <Pagination
        pagination={{
          currentPage,
          totalPages,
          totalItems,
          searchTerm,
          filters,
          sortBy,
          sortOrder,
          setSearchTerm,
          setFilters,
          setSortBy,
          setSortOrder,
          goToPage,
          nextPage,
          prevPage,
          hasNextPage,
          hasPrevPage,
          pageInfo
        }}
        onSearch={handleSearchChange}
        onFilter={handleFilterChange}
        searchPlaceholder="Search requests by employer, candidate, or position..."
        showSearch={true}
        showFilters={true}
        showSort={true}
      />

      {/* Requests Table */}
      <Card className="p-0">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Employer Requests ({requests.length})
            </h2>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                Export Data
              </Button>
              <Button variant="primary" size="sm">
                Process All
              </Button>
            </div>
          </div>
        </div>
        
        <DataTable
          columns={columns}
          data={requests}
          onRowAction={handleRowAction}
          actionButtons={actionButtons}
          pagination={false}
          className="rounded-none"
        />
      </Card>

      {/* Request Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Request Details"
        maxWidth="max-w-4xl"
      >
        {selectedRequest && (
          <div className="space-y-6">
            {/* Request Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Employer Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedRequest.employerName}</p>
                  <p><span className="font-medium">Company:</span> {selectedRequest.companyName}</p>
                  <p><span className="font-medium">Email:</span> {selectedRequest.employerContact.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedRequest.employerContact.phone}</p>
                </div>
                <div className="flex items-center space-x-3 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContactEmployer(selectedRequest.employerContact, 'email')}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContactEmployer(selectedRequest.employerContact, 'phone')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Candidate Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedRequest.candidateName}</p>
                  <p><span className="font-medium">Position:</span> {selectedRequest.position}</p>
                  <p><span className="font-medium">Daily Rate:</span> {selectedRequest.dailyRate.toLocaleString()} RWF</p>
                  <p><span className="font-medium">Monthly Rate:</span> {selectedRequest.monthlyRate.toLocaleString()} RWF</p>
                </div>
                <div className="mt-4">
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(selectedRequest.status)}
                  >
                    {selectedRequest.status}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={getPriorityColor(selectedRequest.priority)}
                  >
                    {selectedRequest.priority}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Request Message */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Employer Message</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{selectedRequest.message}</p>
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Admin Notes</h3>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about this request..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows="4"
              />
            </div>

            {/* Request Timeline */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Request Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Request Submitted</p>
                    <p className="text-xs text-gray-500">{new Date(selectedRequest.date).toLocaleString()}</p>
                  </div>
                </div>
                {selectedRequest.lastContactDate && (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Last Contact</p>
                      <p className="text-xs text-gray-500">{new Date(selectedRequest.lastContactDate).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
              {selectedRequest.status !== 'completed' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentAction('approve');
                      setShowActionModal(true);
                      setShowDetailsModal(false);
                    }}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    Approve Request
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setCurrentAction('complete');
                      setShowActionModal(true);
                      setShowDetailsModal(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Mark Completed
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title={`${currentAction === 'approve' ? 'Approve' : currentAction === 'reject' ? 'Reject' : 'Complete'} Request`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to {currentAction} the request from{' '}
            <span className="font-medium text-gray-900">{selectedRequest?.employerName}</span>?
          </p>
          
          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowActionModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant={currentAction === 'reject' ? 'danger' : 'primary'}
              onClick={() => {
                const newStatus = currentAction === 'approve' ? 'in_progress' : 
                                 currentAction === 'reject' ? 'rejected' : 'completed';
                handleStatusUpdate(newStatus);
              }}
            >
              {currentAction === 'approve' ? 'Approve' : 
               currentAction === 'reject' ? 'Reject' : 'Complete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployerRequestsPage; 