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
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const EmployerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for development (replace with API calls)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRequests([
        {
          id: 1,
          candidateName: 'J*** D***',
          skills: 'React, Node.js, MySQL',
          experience: '3 years',
          status: 'payment_required',
          priority: 'high',
          createdAt: '2024-01-15',
          paymentAmount: 5000,
          paymentType: 'photo_access',
          progress: 60
        },
        {
          id: 2,
          candidateName: 'M*** K***',
          skills: 'Python, Django, PostgreSQL',
          experience: '5 years',
          status: 'approved',
          priority: 'normal',
          createdAt: '2024-01-10',
          paymentAmount: 10000,
          paymentType: 'full_details',
          progress: 100
        },
        {
          id: 3,
          candidateName: 'A*** R***',
          skills: 'Vue.js, Laravel, MongoDB',
          experience: '2 years',
          status: 'pending',
          priority: 'low',
          createdAt: '2024-01-20',
          paymentAmount: null,
          paymentType: null,
          progress: 20
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'payment_required': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'payment_confirmed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredRequests = requests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesSearch = request.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.skills.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handlePaymentRequest = (requestId) => {
    toast.success('Payment request sent to admin!');
    // API call to request payment
  };

  const handlePaymentConfirmation = (requestId) => {
    setSelectedRequest(requests.find(r => r.id === requestId));
    // Open payment confirmation modal
  };

  const stats = [
    {
      title: 'Total Requests',
      value: requests.length,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Pending Payments',
      value: requests.filter(r => r.status === 'payment_required').length,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Approved Requests',
      value: requests.filter(r => r.status === 'approved').length,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Active Candidates',
      value: requests.filter(r => r.status === 'approved').length,
      icon: Users,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'positive'
    }
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your job seeker requests and payments</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
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
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
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
                <option value="payment_required">Payment Required</option>
                <option value="payment_confirmed">Payment Confirmed</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Filter className="h-4 w-4" />
              <span>{filteredRequests.length} of {requests.length} requests</span>
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
                {filteredRequests.map((request) => (
                  <motion.tr
                    key={request.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.candidateName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Requested {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{request.skills}</div>
                      <div className="text-sm text-gray-500">{request.experience}</div>
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
                            className={`h-2 rounded-full ${getProgressColor(request.progress)}`}
                            style={{ width: `${request.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{request.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {request.status === 'payment_required' && (
                          <button
                            onClick={() => handlePaymentConfirmation(request.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs transition-colors"
                          >
                            Confirm Payment
                          </button>
                        )}
                        {request.status === 'pending' && (
                          <button
                            onClick={() => handlePaymentRequest(request.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs transition-colors"
                          >
                            Request Payment
                          </button>
                        )}
                        <button className="text-blue-600 hover:text-blue-900 text-xs">
                          View Details
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
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
    </div>
  );
};

export default EmployerDashboard;
