import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Home,
  Shield,
  Mail,
  Phone
} from 'lucide-react';
import { useAuth } from '../../api/hooks/useAuth.js';
import { adminService } from '../../api/services/adminService.js';
import { useAdminJobSeekers } from '../../api/hooks/useJobSeekers.js';
import { useAdminRequests } from '../../api/hooks/useRequests.js';
import { useAdminCategories } from '../../api/hooks/useCategories.js';
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
import SettingsPage from './SettingsPage';
import JobCategoriesPage from './JobCategoriesPage';
import TestAdminIntegration from './TestAdminIntegration';
import TestAdminDashboard from './TestAdminDashboard';
import TestLocalBackend from './TestLocalBackend';
import { 
  getStatusColor, 
  getPriorityColor, 
  getCategoryColor, 
  handleContactEmployer 
} from '../../utils/adminHelpers';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
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

  // Redirect if no user or not admin
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Load dashboard statistics
        const statsResult = await adminService.getDashboardStats();
        if (statsResult.success) {
          setDashboardStats(statsResult.data);
        } else {
          setError(statsResult.error || 'Failed to load dashboard statistics');
        }

        // Load recent data
        await Promise.all([
          fetchJobSeekers(),
          fetchRequests(),
          fetchCategories()
        ]);
      } catch (error) {
        setError('Failed to load dashboard data');
        console.error('Dashboard loading error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      loadDashboardData();
    }
  }, [user, fetchJobSeekers, fetchRequests, fetchCategories]);

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
        alert(`Request ${newStatus === 'completed' ? 'marked as completed' : 'status updated'} successfully!`);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to update request status');
      console.error('Request update error:', error);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleFilter = () => {
    // Filter functionality
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Render dashboard content
  const renderDashboardContent = () => {
    // Show loading state if still loading
    if (loading) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Show error state if there's an error
    if (error) {
      return (
        <div className="space-y-6">
          <Card>
            <div className="text-center py-8">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    // Get dashboard data with fallbacks
    const stats = dashboardStats?.overview || {};
    const trends = dashboardStats?.trends || {};
    
    // Extract skills from job seekers data
    const extractSkillsFromJobSeekers = (jobSeekers) => {
      const skillCounts = {};
      
      jobSeekers.forEach(jobSeeker => {
        if (jobSeeker.profile?.skills) {
          const skills = jobSeeker.profile.skills.split(',').map(skill => skill.trim());
          skills.forEach(skill => {
            if (skill && skill.length > 0) {
              skillCounts[skill] = (skillCounts[skill] || 0) + 1;
            }
          });
        }
      });
      
      // Convert to array and sort by count
      const skillsArray = Object.entries(skillCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5 skills
      
      console.log('Skills extracted:', skillsArray);
      return skillsArray;
    };
    
    // Get skills from actual job seekers data or use fallback
    const actualSkills = recentJobSeekers.length > 0 
      ? extractSkillsFromJobSeekers(recentJobSeekers)
      : [];
    
    // If no skills extracted, use sample data for demonstration
    const sampleJobSeekers = [
      {
        id: 1,
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          skills: 'JavaScript, React, Node.js',
          location: 'Kigali, Rwanda'
        }
      },
      {
        id: 2,
        profile: {
          firstName: 'Jane',
          lastName: 'Smith',
          skills: 'Python, Django, PostgreSQL',
          location: 'Huye, Rwanda'
        }
      },
      {
        id: 3,
        profile: {
          firstName: 'Bob',
          lastName: 'Johnson',
          skills: 'JavaScript, React, TypeScript',
          location: 'Musanze, Rwanda'
        }
      }
    ];
    
    const sampleSkills = extractSkillsFromJobSeekers(sampleJobSeekers);
    
    // Mock data for demonstration when API doesn't return data
    const mockStats = {
      totalJobSeekers: stats.totalJobSeekers || 9,
      totalEmployerRequests: stats.totalEmployerRequests || 0,
      pendingEmployerRequests: stats.pendingEmployerRequests || 0,
      totalCategories: stats.totalCategories || 8
    };

    const mockTrends = {
      topSkills: actualSkills.length > 0 ? actualSkills : (sampleSkills.length > 0 ? sampleSkills : (Array.isArray(trends.topSkills) ? trends.topSkills : [
        { name: 'Housekeeping', count: 15 },
        { name: 'Cooking', count: 12 },
        { name: 'Childcare', count: 10 },
        { name: 'Gardening', count: 8 },
        { name: 'Cleaning', count: 6 }
      ])),
      monthlyRegistrations: Array.isArray(trends.monthlyRegistrations) ? trends.monthlyRegistrations : [
        { month: 'Jan', count: 5 },
        { month: 'Feb', count: 8 },
        { month: 'Mar', count: 12 },
        { month: 'Apr', count: 9 },
        { month: 'May', count: 15 },
        { month: 'Jun', count: 11 }
      ]
    };
    
    // Debug logging
    console.log('Recent Job Seekers:', recentJobSeekers);
    console.log('Extracted Skills:', actualSkills);
    console.log('Sample Skills:', sampleSkills);
    console.log('API Trends:', trends);
    console.log('Final Top Skills:', mockTrends.topSkills);

    return (
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Job Seekers"
            value={mockStats.totalJobSeekers}
            icon={Users}
            change="+12%"
            changeType="increase"
            color="text-blue-600"
            bgColor="bg-blue-100"
            description="Active job seekers"
            index={0}
          />
          <StatCard
            title="Employer Requests"
            value={mockStats.totalEmployerRequests}
            icon={MessageSquare}
            change="+8%"
            changeType="increase"
            color="text-green-600"
            bgColor="bg-green-100"
            description="Total requests"
            index={1}
          />
          <StatCard
            title="Pending Requests"
            value={mockStats.pendingEmployerRequests}
            icon={AlertCircle}
            change="-5%"
            changeType="decrease"
            color="text-yellow-600"
            bgColor="bg-yellow-100"
            description="Awaiting review"
            index={2}
          />
          <StatCard
            title="Categories"
            value={mockStats.totalCategories}
            icon={Briefcase}
            change="+3%"
            changeType="increase"
            color="text-purple-600"
            bgColor="bg-purple-100"
            description="Job categories"
            index={3}
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Job Seekers */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Job Seekers</h3>
              <Button variant="outline" size="sm" onClick={() => setActiveTab('job-seekers')}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {jobSeekersLoading ? (
                <LoadingSpinner size="sm" text="Loading job seekers..." />
              ) : recentJobSeekers.length > 0 ? (
                recentJobSeekers.slice(0, 3).map((jobSeeker) => {
                  // Map API response to expected format
                  const mappedJobSeeker = {
                    id: jobSeeker.id,
                    name: jobSeeker.profile ? `${jobSeeker.profile.firstName} ${jobSeeker.profile.lastName}` : jobSeeker.email,
                    title: jobSeeker.profile?.skills ? jobSeeker.profile.skills.split(',')[0] : 'Job Seeker',
                    category: jobSeeker.profile?.skills ? jobSeeker.profile.skills.split(',')[0] : 'General',
                    location: jobSeeker.profile?.location || 'Location not specified',
                    experience: jobSeeker.profile?.experience || 0,
                    avatar: jobSeeker.profile?.avatar || null,
                    email: jobSeeker.email,
                    role: jobSeeker.role,
                    createdAt: jobSeeker.createdAt,
                    // Additional profile data
                    skills: jobSeeker.profile?.skills || '',
                    gender: jobSeeker.profile?.gender || '',
                    contactNumber: jobSeeker.profile?.contactNumber || '',
                    // Mock rates for demonstration
                    dailyRate: 15000,
                    monthlyRate: 300000
                  };
                  
                  return (
                    <JobSeekerCard
                      key={jobSeeker.id}
                      jobSeeker={mappedJobSeeker}
                      compact={true}
                      getCategoryColor={getCategoryColor}
                    />
                  );
                })
              ) : (
                <div className="space-y-3">
                  {/* Mock job seekers for demonstration */}
                  {[
                    {
                      id: 1,
                      name: 'Alice Johnson',
                      title: 'Housekeeper',
                      category: 'domestic',
                      location: 'Kigali',
                      experience: 3,
                      avatar: null
                    },
                    {
                      id: 2,
                      name: 'Bob Smith',
                      title: 'Chef',
                      category: 'food',
                      location: 'Huye',
                      experience: 5,
                      avatar: null
                    },
                    {
                      id: 3,
                      name: 'Carol Davis',
                      title: 'Nanny',
                      category: 'care',
                      location: 'Musanze',
                      experience: 2,
                      avatar: null
                    }
                  ].map((jobSeeker) => (
                    <JobSeekerCard
                      key={jobSeeker.id}
                      jobSeeker={jobSeeker}
                      compact={true}
                      getCategoryColor={getCategoryColor}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Recent Requests */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Requests</h3>
              <Button variant="outline" size="sm" onClick={() => setActiveTab('requests')}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {requestsLoading ? (
                <LoadingSpinner size="sm" text="Loading requests..." />
              ) : recentRequests.length > 0 ? (
                recentRequests.slice(0, 3).map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onAction={handleRequestAction}
                    compact={true}
                    getStatusColor={getStatusColor}
                    getPriorityColor={getPriorityColor}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">📝</div>
                  <p className="text-gray-500">No recent requests</p>
                  <p className="text-sm text-gray-400 mt-1">New employer requests will appear here</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Analytics Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Registrations Chart */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Monthly Registrations</h4>
              <div className="h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-blue-600 text-2xl font-bold mb-1">
                    {Array.isArray(mockTrends.monthlyRegistrations) 
                      ? mockTrends.monthlyRegistrations.reduce((sum, item) => sum + (item.count || 0), 0)
                      : 0
                    }
                  </div>
                  <div className="text-blue-600 text-sm">Total Registrations</div>
                  <div className="text-blue-500 text-xs mt-1">
                    {Array.isArray(mockTrends.monthlyRegistrations) 
                      ? mockTrends.monthlyRegistrations.length 
                      : 0
                    } months tracked
                  </div>
                </div>
              </div>
            </div>

            {/* Top Skills */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Top Skills</h4>
              <div className="space-y-2">
                {Array.isArray(mockTrends.topSkills) ? mockTrends.topSkills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-600">{skill.name || 'Unknown'}</span>
                    <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded-full">
                      {skill.count || 0}
                    </span>
                  </div>
                )) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>No skills data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
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
      case 'categories':
        return <JobCategoriesPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'test':
        return <TestAdminIntegration />;
      case 'test-dashboard':
        return <TestAdminDashboard />;
      case 'test-backend':
        return <TestLocalBackend />;
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
        onSidebarToggle={handleSidebarToggle}
        searchTerm={searchTerm}
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
            { id: 'categories', label: 'Categories', icon: 'Briefcase' },
            { id: 'reports', label: 'Reports', icon: 'BarChart3' },
            { id: 'settings', label: 'Settings', icon: 'Settings' },
            { id: 'test', label: 'Integration Test', icon: 'TestTube' },
            { id: 'test-backend', label: 'Backend Test', icon: 'Server' }
          ]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="p-6">
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
                variant="outline"
                onClick={() => setShowRequestModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleUpdateRequestStatus(
                  selectedRequest.id,
                  selectedRequest.status,
                  adminNotes
                )}
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