import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  MessageSquare, 
  BarChart3, 
  Settings,
  LogOut,
  Bell,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
  TrendingDown,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Home,
  Shield,
  Mail,
  Phone,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { adminService } from '../../api/services/adminService.js';
import { useAdminJobSeekers } from '../../api/hooks/useJobSeekers.js';
import API_CONFIG from '../../api/config/apiConfig.js';
import { useAdminRequests } from '../../api/hooks/useRequests.js';
import { useAdminCategories } from '../../api/hooks/useCategories.js';
import { useLiveUpdates } from '../../contexts/LiveUpdateContext';
import LiveStatusIndicator from '../../components/ui/LiveStatusIndicator';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatCard from '../../components/ui/StatCard';
import RequestCard from '../../components/ui/RequestCard';
import JobSeekerCard from '../../components/ui/JobSeekerCard';
import Modal from '../../components/ui/Modal';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminHeader from '../../components/layout/AdminHeader';
import JobSeekersPage from './JobSeekersPage';
import EmployerRequestsPage from './EmployerRequestsPage';
import ReportsPage from './ReportsPage';
import TableReportsPage from './TableReportsPage';
import ContactMessagesPage from './ContactMessagesPage';
import SettingsPage from './SettingsPage';
import JobCategoriesPage from './JobCategoriesPage';
import PaymentMethodsPage from './PaymentMethodsPage';
import AdminProfileManagement from './AdminProfileManagement';

import { 
  getStatusColor, 
  getPriorityColor, 
  getCategoryColor, 
  handleContactEmployer 
} from '../../utils/adminHelpers';
// Charts are now handled in ReportsPage

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Live updates
  const { 
    liveData, 
    lastUpdate, 
    isConnected, 
    manualRefresh,
    addNotification 
  } = useLiveUpdates();
  
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestStatusFilter, setRequestStatusFilter] = useState('all');
  
  // Individual loading states for better UX
  const [statsLoading, setStatsLoading] = useState(false);
  const [jobSeekersLocalLoading, setJobSeekersLocalLoading] = useState(false);
  const [requestsLocalLoading, setRequestsLocalLoading] = useState(false);
  const [categoriesLocalLoading, setCategoriesLocalLoading] = useState(false);

  // Custom hooks for data management
  const {
    jobSeekers: recentJobSeekers,
    loading: jobSeekersLoading,
    error: jobSeekersError,
    fetchJobSeekers
  } = useAdminJobSeekers({ 
    autoFetch: false,
    itemsPerPage: 5 
  });

  const {
    requests: recentRequests,
    loading: requestsLoading,
    error: requestsError,
    fetchRequests
  } = useAdminRequests({ 
    autoFetch: false 
  });

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    fetchCategories
  } = useAdminCategories({ 
    autoFetch: false 
  });

  // Load dashboard data with retry mechanism
  const loadDashboardData = async (retryCount = 0) => {
    const maxRetries = 2;
    
    try {
      setLoading(true);
      setError(null);

      // Load data sequentially to avoid overwhelming the backend
      // console.log(`🔄 Loading dashboard data sequentially... (attempt ${retryCount + 1})`);

      // 1. First load dashboard statistics (most important)
      try {
        setStatsLoading(true);
        // console.log('📊 Loading dashboard statistics...');
        const statsResult = await adminService.getDashboardStats();
        if (statsResult.success) {
          setDashboardStats(statsResult.data);
          // console.log('✅ Dashboard statistics loaded');
        } else {
          // console.warn('⚠️ Failed to load dashboard statistics');
        }
      } catch (error) {
        // console.error('❌ Error loading dashboard statistics:', error);
      } finally {
        setStatsLoading(false);
      }

      // 2. Load job seekers data
      try {
        setJobSeekersLocalLoading(true);
        // console.log('👥 Loading job seekers data...');
        await fetchJobSeekers();
        // console.log('✅ Job seekers data loaded');
      } catch (error) {
        // console.error('❌ Error loading job seekers:', error);
      } finally {
        setJobSeekersLocalLoading(false);
      }

      // 3. Load employer requests
      try {
        setRequestsLocalLoading(true);
        // console.log('📝 Loading employer requests...');
        await fetchRequests();
        // console.log('✅ Employer requests loaded');
      } catch (error) {
        // console.error('❌ Error loading employer requests:', error);
      } finally {
        setRequestsLocalLoading(false);
      }

      // 4. Load job categories
      try {
        setCategoriesLocalLoading(true);
        // console.log('🏷️ Loading job categories...');
        await fetchCategories();
        // console.log('✅ Job categories loaded');
      } catch (error) {
        // console.error('❌ Error loading job categories:', error);
      } finally {
        setCategoriesLocalLoading(false);
      }

      // console.log('✅ Dashboard data loading completed');

    } catch (error) {
      // console.error('❌ Critical error in dashboard loading:', error);
      
      // Retry logic for critical errors
      if (retryCount < maxRetries) {
        // console.log(`🔄 Retrying dashboard load... (${retryCount + 1}/${maxRetries})`);
        setTimeout(() => {
          loadDashboardData(retryCount + 1);
        }, 2000 * (retryCount + 1)); // Exponential backoff
        return;
      }
      
      setError('Failed to load dashboard data after multiple attempts. Please refresh the page.');
      addNotification({
        message: 'Dashboard failed to load. Please refresh.',
        type: 'error',
        duration: 10000
      });
    } finally {
      setLoading(false);
    }
  };

  // Refresh dashboard data
  const refreshDashboardData = async () => {
    try {
      setLoading(true);
      await loadDashboardData();
      addNotification({
        message: 'Dashboard refreshed successfully',
        type: 'success',
        duration: 3000
      });
    } catch (error) {
      setError('Failed to refresh dashboard data');
      addNotification({
        message: 'Failed to refresh dashboard',
        type: 'error',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle live data updates
  useEffect(() => {
    if (liveData.dashboard) {
      setDashboardStats(liveData.dashboard);
    }
    if (liveData.requests) {
      // Update requests if live data is available
      // This would need to be integrated with the useAdminRequests hook
    }
    if (liveData.jobSeekers) {
      // Update job seekers if live data is available
      // This would need to be integrated with the useAdminJobSeekers hook
    }
  }, [liveData]);

  // Event handlers
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRequestAction = (request) => {
    setSelectedRequest(request);
    setAdminNotes(request.adminNotes || '');
    setShowRequestModal(true);
  };

  const handleUpdateRequestStatus = async (requestId, newStatus, notes) => {
    try {
      const result = await adminService.updateRequestStatus(requestId, {
        status: newStatus,
        adminNotes: notes
      });
      
      if (result.success) {
        // Refresh requests data
        await fetchRequests();
        
        // Close modal
        setShowRequestModal(false);
        setSelectedRequest(null);
        setAdminNotes('');
        
        // Show success message
        addNotification({
          message: `Request ${newStatus === 'completed' ? 'marked as completed' : 'status updated'} successfully!`,
          type: 'success',
          duration: 5000
        });
      } else {
        addNotification({
          message: `Error: ${result.error}`,
          type: 'error',
          duration: 5000
        });
      }
    } catch (error) {
      addNotification({
        message: 'Failed to update request status',
        type: 'error',
        duration: 5000
      });
      // console.error('Request update error:', error);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleFilter = () => {
    // Filter functionality
  };

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading Dashboard..." />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Dashboard Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadDashboardData} className="w-full">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Render dashboard content
  const renderDashboardContent = () => {
    const stats = dashboardStats || {};
    const dashboardStatsData = stats.data || stats; // Handle both nested and direct response

 
    // Extract skills from job seekers for top skills calculation
    const extractSkillsFromJobSeekers = (jobSeekers) => {
      if (!Array.isArray(jobSeekers)) return [];
      
      const skillCounts = {};
      jobSeekers.forEach(jobSeeker => {
        if (jobSeeker.profile?.skills) {
          const skills = jobSeeker.profile.skills.split(',').map(skill => skill.trim());
          skills.forEach(skill => {
            skillCounts[skill] = (skillCounts[skill] || 0) + 1;
          });
        }
      });
      
      return Object.entries(skillCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    };

    // Calculate trends
    const calculateTrend = (currentValue, previousValue = 0) => {
      if (previousValue === 0) {
        return currentValue > 0 ? { change: '+100%', changeType: 'increase' } : { change: '0%', changeType: 'neutral' };
      }
      const percentageChange = ((currentValue - previousValue) / previousValue) * 100;
      const change = percentageChange >= 0 ? `+${Math.round(percentageChange)}%` : `${Math.round(percentageChange)}%`;
      const changeType = percentageChange > 0 ? 'increase' : percentageChange < 0 ? 'decrease' : 'neutral';
      return { change, changeType };
    };

    const getRecentTrend = (data, days = 7) => {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - days * 2 * 24 * 60 * 60 * 1000);

      const recentCount = data.filter(item => new Date(item.createdAt) >= weekAgo).length;
      const previousCount = data.filter(item => {
        const date = new Date(item.createdAt);
        return date >= twoWeeksAgo && date < weekAgo;
      }).length;

      return calculateTrend(recentCount, previousCount);
    };

    // Calculate trends for dashboard cards
    const jobSeekersTrend = getRecentTrend(recentJobSeekers || []);
    const requestsTrend = getRecentTrend(recentRequests || []);
    const pendingTrend = calculateTrend(
      (recentRequests || []).filter(r => r.status === 'pending').length,
      Math.max(1, Math.floor((recentRequests || []).filter(r => r.status === 'pending').length * 0.8))
    );
    const categoriesTrend = calculateTrend(
      dashboardStatsData.overview?.totalCategories || dashboardStatsData.totalCategories || 0,
      Math.max(1, Math.floor((dashboardStatsData.overview?.totalCategories || dashboardStatsData.totalCategories || 0) * 0.9))
    );

    // Extract top skills
    const topSkills = extractSkillsFromJobSeekers(recentJobSeekers || []);

    return (
      <div className="space-y-6">
        {/* Live Status Indicator */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={refreshDashboardData}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                loading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </div>
              )}
            </button>
            <LiveStatusIndicator
              isConnected={isConnected}
              lastUpdate={lastUpdate}
              onRefresh={manualRefresh}
              className="text-xs"
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 ">
          <StatCard
            title="Total Job Seekers"
            value={dashboardStatsData.overview?.totalJobSeekers || dashboardStatsData.totalJobSeekers || 0}
            icon={Users}
            change={jobSeekersTrend.change}
            changeType={jobSeekersTrend.changeType}
            color="text-blue-600"
            bgColor="bg-blue-100"
            description="Active job seekers"
            index={0}
            trendPeriod="7 days"
            loading={statsLoading}
          />
          
          <StatCard
            title="Employer Requests"
            value={dashboardStatsData.overview?.totalEmployerRequests || dashboardStatsData.totalEmployerRequests || 0}
            icon={MessageSquare}
            change={requestsTrend.change}
            changeType={requestsTrend.changeType}
            color="text-green-600"
            bgColor="bg-green-100"
            description="Total requests"
            index={1}
            trendPeriod="7 days"
            loading={requestsLocalLoading}
          />
          
          <StatCard
            title="Pending Requests"
            value={dashboardStatsData.overview?.pendingEmployerRequests || dashboardStatsData.pendingEmployerRequests || 0}
            icon={Clock}
            change={pendingTrend.change}
            changeType={pendingTrend.changeType}
            color="text-orange-600"
            bgColor="bg-orange-100"
            description="Awaiting review"
            index={2}
            trendPeriod="7 days"
            loading={requestsLocalLoading}
          />
          
          <StatCard
            title="Categories"
            value={dashboardStatsData.overview?.totalCategories || dashboardStatsData.totalCategories || 0}
            icon={Briefcase}
            change={categoriesTrend.change}
            changeType={categoriesTrend.changeType}
            color="text-purple-600"
            bgColor="bg-purple-100"
            description="Job categories"
            index={3}
            showTrend={false}
            loading={categoriesLocalLoading}
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Job Seekers */}
          <Card title="Latest Job Seekers" subtitle="Most recently registered candidates (showing latest 5)">
            {jobSeekersLoading ? (
              <LoadingSpinner size="md" text="Loading job seekers..." />
            ) : (dashboardStatsData.recentActivity?.recentJobSeekers || recentJobSeekers || []).length > 0 ? (
              <div className="space-y-3">
                {(dashboardStatsData.recentActivity?.recentJobSeekers || recentJobSeekers || [])
                  .slice(0, 5) // Limit to 5 to prevent duplicates
                  .map((jobSeeker, index) => {
                  // Dashboard API sometimes returns minimal objects (id, name, skills).
                  // Try to find a fuller record from the hook `recentJobSeekers` if available.
                  const fullRecord = (recentJobSeekers || []).find(s => s.id === jobSeeker.id) || jobSeeker;
                  const avatarPath = fullRecord?.profile?.photo || fullRecord?.avatar || fullRecord?.photo || null;
                  const resolvePhotoUrl = (path) => {
                    if (!path) return null;
                    if (/^https?:\/\//i.test(path)) return path;
                    return `${API_CONFIG.BASE_URL}/${path.replace(/^\//, '')}`;
                  };
                  const avatarUrl = resolvePhotoUrl(avatarPath);

                  return (
                    <JobSeekerCard
                      key={jobSeeker.id || index}
                      jobSeeker={{
                        id: jobSeeker.id,
                        name: jobSeeker.name || `${jobSeeker?.profile?.firstName || ''} ${jobSeeker?.profile?.lastName || ''}`.trim() || 'Unknown',
                        title: 'Job Seeker',
                        category: jobSeeker.skills?.split(',')[0] || 'General', // Use first skill as category
                        avatar: avatarUrl,
                        location: jobSeeker.location || jobSeeker?.profile?.location || 'Unknown',
                        dailyRate: jobSeeker.dailyRate,
                        monthlyRate: jobSeeker.monthlyRate
                      }}
                      onViewDetails={handleRequestAction}
                      getCategoryColor={getCategoryColor}
                      compact={true}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No recent job seekers</p>
              </div>
            )}
          </Card>

          {/* Recent Requests */}
          <Card title="Latest Employer Requests" subtitle="Most recent job requests with candidate details (showing latest 5)">
            <div className="mb-3">
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => setRequestStatusFilter('all')}
                  className={`px-2 py-1 text-xs font-medium rounded-full border transition-colors ${
                    requestStatusFilter === 'all'
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setRequestStatusFilter('pending')}
                  className={`px-2 py-1 text-xs font-medium rounded-full border transition-colors ${
                    requestStatusFilter === 'pending'
                      ? 'bg-orange-100 text-orange-800 border-orange-200'
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setRequestStatusFilter('in_progress')}
                  className={`px-2 py-1 text-xs font-medium rounded-full border transition-colors ${
                    requestStatusFilter === 'in_progress'
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setRequestStatusFilter('approved')}
                  className={`px-2 py-1 text-xs font-medium rounded-full border transition-colors ${
                    requestStatusFilter === 'approved'
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setRequestStatusFilter('completed')}
                  className={`px-2 py-1 text-xs font-medium rounded-full border transition-colors ${
                    requestStatusFilter === 'completed'
                      ? 'bg-purple-100 text-purple-800 border-purple-200'
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
            
            {requestsLoading ? (
              <LoadingSpinner size="md" text="Loading requests..." />
            ) : (recentRequests || []).length > 0 ? (
              <div className="space-y-3">
                {(() => {
                  const allRequests = (recentRequests || []);
                  
                  const filteredRequests = allRequests
                    .filter(request => {
                      if (requestStatusFilter === 'all') return true;
                      // Handle different status formats
                      const requestStatus = request.status?.toLowerCase() || 'pending';
                      const filterStatus = requestStatusFilter.toLowerCase();
                      return requestStatus === filterStatus;
                    })
                    .slice(0, 5);

                  if (filteredRequests.length === 0 && requestStatusFilter !== 'all') {
                    return (
                      <div className="text-center py-6 text-gray-500">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No {requestStatusFilter} requests found</p>
                      </div>
                    );
                  }

                  return filteredRequests.map((request, index) => (
                    <RequestCard
                      key={request.id || index}
                      request={{
                        ...request,
                        companyName: request.companyName || 'Individual Employer', // Better default
                        status: request.status || 'pending',
                        priority: request.priority || 'normal',
                        selectedUser: request.selectedUser || null,
                        requestedCandidate: request.requestedCandidate || null
                      }}
                      onContactEmployer={handleContactEmployer}
                      onViewDetails={handleRequestAction}
                      getStatusColor={getStatusColor}
                      getPriorityColor={getPriorityColor}
                      compact={true}
                    />
                  ));
                })()}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No recent requests</p>
              </div>
            )}
          </Card>
        </div>


      </div>
    );
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardContent();
      case 'job-seekers':
        return <JobSeekersPage />;
              case 'requests':
          return <EmployerRequestsPage />;
        case 'contact-messages':
          return <ContactMessagesPage />;
        case 'categories':
          return <JobCategoriesPage />;
      case 'reports-statistics':
        return <ReportsPage />;
      case 'reports-tables':
        return <TableReportsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'payment-methods':
        return <PaymentMethodsPage />;
      case 'profile':
        return <AdminProfileManagement />;
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader
        user={user}
        onLogout={handleLogout}
        onSearch={handleSearch}
        onFilter={handleFilter}
        searchTerm={searchTerm}
        onRefresh={refreshDashboardData}
      />

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          navigationItems={[
            { id: 'dashboard', label: 'Dashboard', icon: 'Home' },
            { id: 'job-seekers', label: 'Job Seekers', icon: 'Users' },
                    { id: 'requests', label: 'Employer Requests', icon: 'MessageSquare' },
        { id: 'contact-messages', label: 'Contact Messages', icon: 'Mail' },
        { id: 'categories', label: 'Categories', icon: 'Briefcase' },
            { 
              id: 'reports', 
              label: 'Reports', 
              icon: 'BarChart3',
              subItems: [
                { id: 'reports-statistics', label: 'Statistics Reports' },
                { id: 'reports-tables', label: 'Table Reports' }
              ]
            },
            { id: 'settings', label: 'Settings', icon: 'Settings' },
            { id: 'payment-methods', label: 'Payment Methods', icon: 'CreditCard' },
            { id: 'profile', label: 'Profile', icon: 'Shield' }
          ]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-0' : 'ml-0'}`}>
          <div className="p-4 lg:p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && selectedRequest && (
        <Modal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          title="Update Request Status"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedRequest.status}
                onChange={(e) => setSelectedRequest({
                  ...selectedRequest,
                  status: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Add notes about this request..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowRequestModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleUpdateRequestStatus(
                  selectedRequest.id,
                  selectedRequest.status,
                  adminNotes
                )}
                className="bg-red-600 hover:bg-red-700"
              >
                Update Status
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard; 