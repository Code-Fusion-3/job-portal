import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminPaymentReview = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setPayments([
        {
          id: 1,
          employerName: 'Tech Solutions Ltd',
          candidateName: 'J*** D***',
          paymentType: 'photo_access',
          amount: 5000,
          status: 'pending',
          confirmationName: 'John Smith',
          confirmationPhone: '0788123456',
          transferAmount: 5000,
          transferDate: '2024-01-25',
          priority: 'high'
        },
        {
          id: 2,
          employerName: 'Digital Innovations',
          candidateName: 'M*** K***',
          paymentType: 'full_details',
          amount: 10000,
          status: 'confirmed',
          confirmationName: 'Mary Johnson',
          confirmationPhone: '0788765432',
          transferAmount: 10000,
          transferDate: '2024-01-24',
          priority: 'normal'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
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

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesSearch = 
      payment.employerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.candidateName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApprovePayment = async (paymentId) => {
    try {
      setPayments(prev => prev.map(p => 
        p.id === paymentId ? { ...p, status: 'approved' } : p
      ));
      toast.success('Payment approved successfully!');
    } catch (error) {
      toast.error('Failed to approve payment');
    }
  };

  const handleRejectPayment = async (paymentId) => {
    try {
      setPayments(prev => prev.map(p => 
        p.id === paymentId ? { ...p, status: 'rejected' } : p
      ));
      toast.success('Payment rejected successfully!');
    } catch (error) {
      toast.error('Failed to reject payment');
    }
  };

  const stats = [
    {
      title: 'Pending Review',
      value: payments.filter(p => p.status === 'pending').length,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Confirmed Today',
      value: payments.filter(p => p.status === 'confirmed').length,
      icon: CheckCircle,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Revenue',
      value: `${payments.filter(p => p.status === 'approved').reduce((sum, p) => sum + p.amount, 0).toLocaleString()} RWF`,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'High Priority',
      value: payments.filter(p => p.priority === 'high' && p.status === 'pending').length,
      icon: AlertCircle,
      color: 'bg-red-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading payment review dashboard...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Payment Review</h1>
              <p className="text-gray-600 mt-1">Review and approve employer payment confirmations</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
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
                  placeholder="Search employers or candidates..."
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
                <option value="pending">Pending Review</option>
                <option value="confirmed">Confirmed</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Filter className="h-4 w-4" />
              <span>{filteredPayments.length} of {payments.length} payments</span>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Payment Confirmations</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employer & Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confirmation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {payment.employerName}
                        </div>
                        <div className="text-sm text-gray-600">
                          Candidate: {payment.candidateName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {payment.amount.toLocaleString()} RWF
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.paymentType === 'photo_access' ? 'Photo Access' : 'Full Details'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {payment.confirmationName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.confirmationPhone}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.transferAmount.toLocaleString()} RWF
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(payment.priority)}`}>
                        {payment.priority.charAt(0).toUpperCase() + payment.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 text-xs flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>Details</span>
                        </button>
                        {payment.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => handleApprovePayment(payment.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectPayment(payment.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters.'
                : 'No payment confirmations to review at the moment.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentReview;
