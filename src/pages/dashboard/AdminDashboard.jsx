import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  MessageSquare, 
  Briefcase, 
  AlertCircle,
  Home,
  BarChart3,
  Shield,
  Filter,
  Search,
  Mail,
  Phone,
  Eye
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
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
import { jobSeekersData } from '../../data/mockData';
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

  // Redirect if no user
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

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

  const handleUpdateRequestStatus = (requestId, newStatus, notes) => {
    // In a real app, this would update the database
    console.log(`Updating request ${requestId} to status: ${newStatus}`);
    console.log('Admin notes:', notes);
    
    // Close modal
    setShowRequestModal(false);
    setSelectedRequest(null);
    setAdminNotes('');
    
    // Show success message
    alert(`Request ${newStatus === 'completed' ? 'marked as completed' : 'status updated'} successfully!`);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    // Implement search functionality
  };

  const handleFilter = () => {
    // Implement filter functionality
    console.log('Filter clicked');
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Mock data for lower-skilled worker platform
  const stats = [
    {
      title: 'Total Job Seekers',
      value: '847',
      change: '+23',
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Active lower-skilled workers'
    },
    {
      title: 'Pending Requests',
      value: '23',
      change: '+5',
      changeType: 'increase',
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Employer requests to review'
    },
    {
      title: 'Active Categories',
      value: '6',
      change: '+1',
      changeType: 'increase',
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Domestic, Care, Food, Maintenance, Sales, Transport'
    }
  ];

  const recentRequests = [
    {
      id: 1,
      employerName: 'Mrs. Uwimana',
      companyName: 'Private Household',
      candidateName: 'Francine Mukamana',
      position: 'Housemaid',
      status: 'pending',
      priority: 'high',
      date: '2 hours ago',
      dailyRate: 5000,
      monthlyRate: 120000,
      message: 'Need reliable housemaid for daily cleaning and cooking...',
      employerContact: {
        email: 'uwimana@email.com',
        phone: '+250 788 111 111'
      },
      adminNotes: '',
      lastContactDate: null,
      isCompleted: false
    },
    {
      id: 2,
      employerName: 'Mr. Ndayisaba',
      companyName: 'Hotel Rwanda',
      candidateName: 'Jean Pierre Ndayisaba',
      position: 'Driver',
      status: 'in_progress',
      priority: 'medium',
      date: '1 day ago',
      dailyRate: 6000,
      monthlyRate: 150000,
      message: 'Looking for experienced driver for hotel transportation...',
      employerContact: {
        email: 'ndayisaba@hotelrwanda.com',
        phone: '+250 788 222 222'
      },
      adminNotes: 'Called employer - interested in proceeding. Waiting for final confirmation.',
      lastContactDate: '2024-01-15T14:30:00Z',
      isCompleted: false
    },
    {
      id: 3,
      employerName: 'Mrs. Mukamana',
      companyName: 'Private Household',
      candidateName: 'Marie Claire Uwineza',
      position: 'Babysitter',
      status: 'completed',
      priority: 'low',
      date: '2 days ago',
      dailyRate: 4000,
      monthlyRate: 100000,
      message: 'Need caring babysitter for 2 children aged 3 and 5...',
      employerContact: {
        email: 'mukamana@email.com',
        phone: '+250 788 333 333'
      },
      adminNotes: 'Deal completed successfully. Employer hired the candidate.',
      lastContactDate: '2024-01-14T16:45:00Z',
      isCompleted: true
    }
  ];

  const recentJobSeekers = jobSeekersData.slice(0, 5).map(seeker => ({
    id: seeker.id,
    name: seeker.name,
    title: seeker.title,
    location: seeker.location,
    experience: seeker.experience,
    status: 'active',
    avatar: seeker.avatar,
    dailyRate: seeker.dailyRate,
    monthlyRate: seeker.monthlyRate,
    category: seeker.category
  }));

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'jobseekers', label: 'Job Seekers', icon: Users },
    { id: 'requests', label: 'Employer Requests', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Shield }
  ];

  // Show loading if user is not loaded
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sticky Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigationItems={navigationItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Header */}
        <AdminHeader
          activeTab={activeTab}
          navigationItems={navigationItems}
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSidebarToggle={handleSidebarToggle}
        />

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <StatCard
                    key={stat.title}
                    {...stat}
                    index={index}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Employer Requests */}
                <Card className="rounded-lg shadow-md p-4 md:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Employer Requests</h2>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="min-h-[44px] rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      View All
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {recentRequests.map((request) => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        onContactEmployer={handleContactEmployer}
                        onViewDetails={handleRequestAction}
                        getStatusColor={getStatusColor}
                        getPriorityColor={getPriorityColor}
                      />
                    ))}
                  </div>
                </Card>

                {/* Recent Job Seekers */}
                <Card className="rounded-lg shadow-md p-4 md:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Job Seekers</h2>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="min-h-[44px] rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      View All
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {recentJobSeekers.map((jobSeeker) => (
                      <JobSeekerCard
                        key={jobSeeker.id}
                        jobSeeker={jobSeeker}
                        onViewDetails={(seeker) => console.log('View job seeker:', seeker)}
                        getCategoryColor={getCategoryColor}
                      />
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Job Seekers Page */}
          {activeTab === 'jobseekers' && (
            <JobSeekersPage />
          )}

          {/* Employer Requests Page */}
          {activeTab === 'requests' && (
            <EmployerRequestsPage />
          )}

          {/* Reports Page */}
          {activeTab === 'reports' && (
            <ReportsPage />
          )}

          {/* Settings Page */}
          {activeTab === 'settings' && (
            <SettingsPage />
          )}

          {/* Other tabs content */}
          {!['dashboard', 'jobseekers', 'requests', 'reports', 'settings'].includes(activeTab) && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {navigationItems.find(item => item.id === activeTab)?.label} Coming Soon
                </h3>
                <p className="text-gray-600">This feature is under development.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Request Processing Modal */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Process Request"
        maxWidth="max-w-full"
        maxHeight="max-h-full"
        padding="p-4"
      >
        {selectedRequest && (
          <>
            {/* Request Details */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Employer Information</h3>
                  <p className="text-sm text-gray-600">{selectedRequest.employerName}</p>
                  <p className="text-sm text-gray-600">{selectedRequest.companyName}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="min-h-[44px] rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onClick={() => handleContactEmployer(selectedRequest.employerContact, 'email')}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="min-h-[44px] rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onClick={() => handleContactEmployer(selectedRequest.employerContact, 'phone')}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Candidate Information</h3>
                  <p className="text-sm text-gray-600">{selectedRequest.candidateName}</p>
                  <p className="text-sm text-gray-600">{selectedRequest.position}</p>
                  <p className="text-sm text-gray-600">
                    Daily Rate: {selectedRequest.dailyRate.toLocaleString()} RWF
                  </p>
                  <p className="text-sm text-gray-600">
                    Monthly Rate: {selectedRequest.monthlyRate.toLocaleString()} RWF
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Employer Message</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedRequest.message}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Admin Notes</h3>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about your contact with the employer..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows="4"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowRequestModal(false)}
                className="min-h-[44px] rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                Cancel
              </Button>
              
              {selectedRequest.status !== 'completed' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleUpdateRequestStatus(selectedRequest.id, 'in_progress', adminNotes)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50 min-h-[44px] rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    Mark In Progress
                  </Button>
                  
                  <Button
                    variant="primary"
                    onClick={() => handleUpdateRequestStatus(selectedRequest.id, 'completed', adminNotes)}
                    className="bg-green-600 hover:bg-green-700 min-h-[44px] rounded-lg transition-all focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    Mark Completed
                  </Button>
                </>
              )}
              
              {selectedRequest.status === 'completed' && (
                <Button
                  variant="outline"
                  onClick={() => handleUpdateRequestStatus(selectedRequest.id, 'in_progress', adminNotes)}
                  className="text-orange-600 border-orange-200 hover:bg-orange-50 min-h-[44px] rounded-lg transition-all focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  Reopen Request
                </Button>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard; 