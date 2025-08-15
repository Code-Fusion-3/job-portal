import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Mail, 
  Search, 
  Filter, 
  Eye, 
  Reply, 
  Trash2, 
  RefreshCw,
  MessageSquare,
  Clock,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useContactMessages } from '../../api/hooks/useContactMessages';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import DataTable from '../../components/ui/DataTable';
import toast, { Toaster } from 'react-hot-toast';

const ContactMessagesPage = () => {
  const { t } = useTranslation();
  // Search removed
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [replyData, setReplyData] = useState({
    subject: '',
    message: ''
  });
  const [replyLoading, setReplyLoading] = useState(false);

  const {
    messages,
    loading,
    error,
    pagination,
    statistics,
    fetchMessages,
    respondToMessage,
    markAsRead,
    deleteMessage,
    fetchStatistics,
    refreshMessages
  } = useContactMessages({
    autoFetch: true,
    itemsPerPage: 15
  });

// Frontend filtering, searching, and pagination
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 15;

// Map backend date field to table expected field
const mappedMessages = Array.isArray(messages)
  ? messages.map(msg => ({
      ...msg,
      createdAt: msg.createdAt || '',
    }))
  : [];

// Apply frontend filters only (search removed)
const filteredMessages = mappedMessages.filter(msg => {
  const matchesStatus = !statusFilter || msg.status === statusFilter;
  const matchesCategory = !categoryFilter || msg.category === categoryFilter;
  const matchesPriority = !priorityFilter || msg.priority === priorityFilter;
  return matchesStatus && matchesCategory && matchesPriority;
});

// Pagination
const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
const paginatedMessages = filteredMessages.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

// Action menu for ... button
const handleRowAction = (action, message) => {
  setSelectedMessage(message);
  setShowViewModal(true);
};

  useEffect(() => {
    fetchMessages({
      status: statusFilter,
      category: categoryFilter,
      priority: priorityFilter
    });
  }, [statusFilter, categoryFilter, priorityFilter]);

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    setShowViewModal(true);
    
    // Mark as read if not already read
    if (!message.isRead) {
      await markAsRead(message.id);
    }
  };

  const handleReply = (message) => {
    setSelectedMessage(message);
    setReplyData({
      subject: `Re: ${message.subject}`,
      message: ''
    });
    setShowReplyModal(true);
  };

  const handleDelete = (message) => {
    setSelectedMessage(message);
    setShowDeleteModal(true);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    const token = localStorage.getItem('job_portal_token');
    if (!token) {
      toast.error('You are not logged in. Please log in again.');
      // Redirect to login page
      window.location.href = '/login';
      return;
    }
    
    if (!replyData.subject.trim() || !replyData.message.trim()) {
      toast.error('Please fill in both subject and message');
      return;
    }
    if (selectedMessage && selectedMessage.status === 'responded') {
      toast.error('This message has already been responded to. You cannot reply again.');
      setShowReplyModal(false);
      return;
    }
    
    setReplyLoading(true);
    try {
      const result = await respondToMessage(selectedMessage.id, replyData);
      
      if (result.success) {
        toast.success('Response sent successfully!');
        setShowReplyModal(false);
        setReplyData({ subject: '', message: '' });
        setSelectedMessage(null);
      } else {
        toast.error(result.error || 'Failed to send response');
      }
    } catch (err) {
      toast.error('Failed to send response. Please try again.');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    const result = await deleteMessage(selectedMessage.id);
    
    if (result.success) {
      toast.success('Message deleted successfully!');
      setShowDeleteModal(false);
      setSelectedMessage(null);
    } else {
      toast.error('Failed to delete message');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'unread':
        return <Badge variant="warning">Unread</Badge>;
      case 'read':
        return <Badge variant="info">Read</Badge>;
      case 'responded':
        return <Badge variant="success">Responded</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      case 'normal':
        return <Badge variant="info">Normal</Badge>;
      case 'high':
        return <Badge variant="warning">High</Badge>;
      case 'urgent':
        return <Badge variant="danger">Urgent</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'general':
        return <Badge variant="info">General</Badge>;
      case 'support':
        return <Badge variant="warning">Support</Badge>;
      case 'feedback':
        return <Badge variant="success">Feedback</Badge>;
      case 'complaint':
        return <Badge variant="danger">Complaint</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Name', 
      sortable: true,
      render: (item) => (
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{item.name}</span>
        </div>
      )
    },
    { 
      key: 'email', 
      label: 'Email', 
      sortable: true,
      render: (item) => (
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-gray-500" />
          <span className="text-sm">{item.email}</span>
        </div>
      )
    },
    { 
      key: 'subject', 
      label: 'Subject', 
      sortable: true,
      render: (item) => (
        <div className="max-w-xs truncate" title={item.subject}>
          {item.subject}
        </div>
      )
    },
    { 
      key: 'category', 
      label: 'Category', 
      sortable: true,
      render: (item) => getCategoryBadge(item.category)
    },
    { 
      key: 'priority', 
      label: 'Priority', 
      sortable: true,
      render: (item) => getPriorityBadge(item.priority)
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (item) => getStatusBadge(item.status)
    },
    { 
      key: 'submittedAt', 
      label: 'Date', 
      sortable: true,
      render: (item) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>
      )
    }
  ];

  const getActionButtons = (message) => [
    {
      key: 'view',
      label: 'View',
      icon: Eye,
      onClick: () => handleViewMessage(message),
      variant: 'outline'
    },
    {
      key: 'reply',
      label: 'Reply',
      icon: Reply,
      onClick: () => {
        if (message.status === 'responded') {
          toast.error('This message has already been responded to.');
        } else {
          handleReply(message);
        }
      },
      variant: 'primary',
      disabled: message.status === 'responded'
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: Trash2,
      onClick: () => handleDelete(message),
      variant: 'danger'
    }
  ];


  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading contact messages..." />
      </div>
    );
  }

  if (error && messages.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Contact Messages</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Authentication Issue:</strong> This error usually means you need to log in again or your session has expired.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button onClick={refreshMessages} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button 
              onClick={() => window.location.href = '/login'} 
              variant="primary"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-600">Manage and respond to contact form submissions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={refreshMessages}
            variant="outline"
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.total || 0}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.unread || 0}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">{statistics.responded || 0}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Archived</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.archived || 0}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="responded">Responded</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="general">General</option>
              <option value="support">Support</option>
              <option value="feedback">Feedback</option>
              <option value="complaint">Complaint</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <Button
              onClick={() => {
                setStatusFilter('');
                setCategoryFilter('');
                setPriorityFilter('');
              }}
              variant="outline"
              className="w-full"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

    <DataTable
  columns={columns}
  data={paginatedMessages}
  pagination={true}
  itemsPerPage={itemsPerPage}
  actionButtons={getActionButtons}
  onRowAction={handleRowAction}
  className="w-full"
/>
{totalPages > 1 && (
  <div className="flex justify-between items-center mt-4">
    <Button
      variant="outline"
      size="sm"
      onClick={() => setCurrentPage(currentPage - 1)}
      disabled={currentPage === 1}
    >
      Previous
    </Button>
    <span className="text-sm text-gray-700">
      Page {currentPage} of {totalPages}
    </span>
    <Button
      variant="outline"
      size="sm"
      onClick={() => setCurrentPage(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      Next
    </Button>
  </div>
)}

      {/* View Message Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="View Message"
        maxWidth="max-w-2xl"
      >
        {selectedMessage && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{selectedMessage.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{selectedMessage.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <p className="text-gray-900">{selectedMessage.subject}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div>{getCategoryBadge(selectedMessage.category)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div>{getStatusBadge(selectedMessage.status)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <p className="text-gray-900">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => {
                  setShowViewModal(false);
                  handleReply(selectedMessage);
                }}
                variant="primary"
              >
                <Reply className="w-4 h-4 mr-2" />
                Reply
              </Button>
              <Button
                onClick={() => setShowViewModal(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reply Modal */}
      <Modal
        isOpen={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        title="Reply to Message"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleReplySubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={replyData.subject}
              onChange={(e) => setReplyData(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={replyData.message}
              onChange={(e) => setReplyData(prev => ({ ...prev, message: e.target.value }))}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Type your response..."
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => setShowReplyModal(false)}
              variant="outline"
              disabled={replyLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={replyLoading}>
              {replyLoading ? (
                <span className="flex items-center"><LoadingSpinner size="sm" className="mr-2" />Sending...</span>
              ) : (
                <><Reply className="w-4 h-4 mr-2" />Send Reply</>
              )}
            </Button>
          </div>
        </form>
      </Modal>
      <Toaster position="top-right" />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Message"
        maxWidth="max-w-md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Message</h3>
            <p className="text-gray-600">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              onClick={() => setShowDeleteModal(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="danger"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContactMessagesPage; 