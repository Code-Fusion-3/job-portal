import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const DashboardAnalytics = ({ type = 'employer', data = {} }) => {
  // Mock data for development (replace with API data)
  const mockData = {
    employer: {
      totalRequests: 12,
      pendingPayments: 3,
      approvedRequests: 8,
      totalSpent: 45000,
      monthlyTrend: [8, 12, 15, 10, 18, 22, 25],
      statusDistribution: [
        { label: 'Pending', value: 2, color: 'bg-yellow-500' },
        { label: 'Payment Required', value: 3, color: 'bg-blue-500' },
        { label: 'Approved', value: 8, color: 'bg-green-500' },
        { label: 'Completed', value: 1, color: 'bg-gray-500' }
      ],
      recentActivity: [
        { action: 'Payment confirmed', time: '2 hours ago', status: 'success' },
        { action: 'Request submitted', time: '1 day ago', status: 'info' },
        { action: 'Access granted', time: '3 days ago', status: 'success' }
      ]
    },
    admin: {
      totalRequests: 156,
      pendingReview: 23,
      totalRevenue: 1250000,
      monthlyRevenue: [450000, 520000, 480000, 610000, 580000, 720000, 680000],
      requestTrends: [45, 52, 48, 61, 58, 72, 68],
      topEmployers: [
        { name: 'Tech Solutions Ltd', requests: 15, revenue: 120000 },
        { name: 'Digital Innovations', requests: 12, revenue: 98000 },
        { name: 'Startup Ventures', requests: 10, revenue: 85000 }
      ]
    }
  };

  const currentData = data || mockData[type];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'info': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const renderEmployerAnalytics = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{currentData.totalRequests}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12% from last month</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">{currentData.pendingPayments}</p>
              <div className="flex items-center mt-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm text-yellow-600">Requires attention</span>
              </div>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Requests</p>
              <p className="text-2xl font-bold text-gray-900">{currentData.approvedRequests}</p>
              <div className="flex items-center mt-2">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">Active candidates</span>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentData.totalSpent)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+8% from last month</span>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts and Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Requests</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-48 flex items-end justify-between space-x-2">
            {currentData.monthlyTrend.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(value / Math.max(...currentData.monthlyTrend)) * 100}%` }}
                />
                <span className="text-xs text-gray-500 mt-2">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Request volume over the last 7 months</p>
          </div>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Request Status</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {currentData.statusDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <Activity className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {currentData.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
              <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                {getStatusIcon(activity.status)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderAdminAnalytics = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{currentData.totalRequests}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+15% from last month</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{currentData.pendingReview}</p>
              <div className="flex items-center mt-2">
                <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm text-yellow-600">Requires attention</span>
              </div>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentData.totalRevenue)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+22% from last month</span>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">87%</p>
              <div className="flex items-center mt-2">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+5% from last month</span>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
          <TrendingUp className="h-5 w-5 text-green-500" />
        </div>
        <div className="h-48 flex items-end justify-between space-x-2">
          {currentData.monthlyRevenue.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-green-500 rounded-t"
                style={{ height: `${(value / Math.max(...currentData.monthlyRevenue)) * 100}%` }}
              />
              <span className="text-xs text-gray-500 mt-2">{formatCurrency(value)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Revenue growth over the last 7 months</p>
        </div>
      </motion.div>

      {/* Top Employers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Employers</h3>
        <div className="space-y-3">
          {currentData.topEmployers.map((employer, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{employer.name}</p>
                  <p className="text-xs text-gray-500">{employer.requests} requests</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{formatCurrency(employer.revenue)}</p>
                <p className="text-xs text-gray-500">Revenue</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-6">
      {type === 'employer' ? renderEmployerAnalytics() : renderAdminAnalytics()}
    </div>
  );
};

export default DashboardAnalytics;
