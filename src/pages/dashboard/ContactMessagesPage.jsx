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

const ContactMessagesPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [replyData, setReplyData] = useState({
    subject: '',
    message: ''
  });

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

  useEffect(() => {
    fetchMessages({
      searchTerm,
      status: statusFilter,
      category: categoryFilter
    });
  }, [searchTerm, statusFilter, categoryFilter]);

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
    
    if (!replyData.subject.trim() || !replyData.message.trim()) {
      alert('Please fill in both subject and message');
      return;
    }

    const result = await respondToMessage(selectedMessage.id, replyData);
    
    if (result.success) {
      alert('Response sent successfully!');
      setShowReplyModal(false);
      setReplyData({ subject: '', message: '' });
      setSelectedMessage(null);
    } else {
      alert(`Failed to send response: ${result.error}`);
    }
  };

  const handleConfirmDelete = async () => {
    const result = await deleteMessage(selectedMessage.id);
    
    if (result.success) {
      alert('Message deleted successfully!');
      setShowDeleteModal(false);
      setSelectedMessage(null);
    } else {
      alert(`Failed to delete message: ${result.error}`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <Badge variant="warning">New</Badge>;
      case 'read':
        return <Badge variant="info">Read</Badge>;
      case 'replied':
        return <Badge variant="success">Replied</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
            {new Date(item.submittedAt).toLocaleDateString()}
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
      onClick: () => handleReply(message),
      variant: 'primary'
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: Trash2,
      onClick: () => handleDelete(message),
      variant: 'danger'
    }
  ];

  const handleRowAction = (action, message) => {
    switch (action) {
      case 'view':
        handleViewMessage(message);
        break;
      case 'reply':
        handleReply(message);
        break;
      case 'delete':
        handleDelete(message);
        break;
      default:
        break;
    }
  };

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
          <Button onClick={refreshMessages} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
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
          <p className="text-sm text-blue-600 mt-1">⚠️ Currently using mock data - Backend integration pending</p>
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
                <p className="text-sm font-medium text-gray-600">New Messages</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.new || 0}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Replied</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.replied || 0}</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
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
          
          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setCategoryFilter('');
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

      {/* Messages Table */}
      <Card className="p-6">
        <DataTable
          columns={columns}
          data={messages}
          pagination={true}
          itemsPerPage={15}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          actionButtons={getActionButtons}
          onRowAction={handleRowAction}
          className="w-full"
        />
      </Card>

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
                  {new Date(selectedMessage.submittedAt).toLocaleString()}
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
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <Reply className="w-4 h-4 mr-2" />
              Send Reply
            </Button>
          </div>
        </form>
      </Modal>

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