import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircle, 
  TrendingUp, 
  Calendar,
  User,
  Building,
  Star,
  FileText,
  Download,
  Eye
} from 'lucide-react';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import SearchFilter from '../../components/ui/SearchFilter';
import StatsGrid from '../../components/ui/StatsGrid';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import { getCategoryColor } from '../../utils/adminHelpers';

const PlacementsPage = () => {
  const { t } = useTranslation();
  
  // State management
  const [placements, setPlacements] = useState([]);
  const [filteredPlacements, setFilteredPlacements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Mock data for placements
  const mockPlacements = [
    {
      id: 1,
      jobSeekerName: 'Francine Mukamana',
      jobSeekerAvatar: 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=150&h=150&fit=crop&crop=face',
      employerName: 'Mrs. Uwimana',
      companyName: 'Private Household',
      position: 'Housemaid',
      status: 'active',
      placementDate: '2024-01-10T09:00:00Z',
      startDate: '2024-01-15T08:00:00Z',
      duration: 'Ongoing',
      dailyRate: 5000,
      monthlyRate: 120000,
      category: 'domestic',
      employerRating: 4.8,
      jobSeekerRating: 4.9,
      employerFeedback: 'Excellent work ethic and very reliable. Highly recommended.',
      jobSeekerFeedback: 'Great working environment and fair treatment.',
      followUpDate: '2024-02-15T10:00:00Z',
      isCompleted: false
    },
    {
      id: 2,
      jobSeekerName: 'Marie Claire Uwineza',
      jobSeekerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      employerName: 'Mrs. Mukamana',
      companyName: 'Private Household',
      position: 'Babysitter',
      status: 'completed',
      placementDate: '2023-12-15T14:30:00Z',
      startDate: '2023-12-20T08:00:00Z',
      duration: '3 months',
      dailyRate: 4000,
      monthlyRate: 100000,
      category: 'care',
      employerRating: 4.7,
      jobSeekerRating: 4.8,
      employerFeedback: 'Very caring and patient with children. Excellent communication skills.',
      jobSeekerFeedback: 'Wonderful family to work for. Children are well-behaved.',
      followUpDate: '2024-03-20T10:00:00Z',
      isCompleted: true
    },
    {
      id: 3,
      jobSeekerName: 'Jean Pierre Ndayisaba',
      jobSeekerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      employerName: 'Mr. Ndayisaba',
      companyName: 'Hotel Rwanda',
      position: 'Driver',
      status: 'active',
      placementDate: '2024-01-05T11:15:00Z',
      startDate: '2024-01-12T07:00:00Z',
      duration: 'Ongoing',
      dailyRate: 6000,
      monthlyRate: 150000,
      category: 'transport',
      employerRating: 4.6,
      jobSeekerRating: 4.7,
      employerFeedback: 'Safe driver with good knowledge of Kigali roads. Punctual and professional.',
      jobSeekerFeedback: 'Professional work environment with good benefits.',
      followUpDate: '2024-02-12T10:00:00Z',
      isCompleted: false
    },
    {
      id: 4,
      jobSeekerName: 'Emmanuel Niyonshuti',
      jobSeekerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      employerName: 'Mrs. Nshuti',
      companyName: 'Private Household',
      position: 'Gardener',
      status: 'active',
      placementDate: '2024-01-08T16:45:00Z',
      startDate: '2024-01-18T07:00:00Z',
      duration: 'Ongoing',
      dailyRate: 5500,
      monthlyRate: 140000,
      category: 'maintenance',
      employerRating: 4.9,
      jobSeekerRating: 4.8,
      employerFeedback: 'Excellent gardening skills. Very knowledgeable about plants and landscaping.',
      jobSeekerFeedback: 'Beautiful property to work on. Employer is very appreciative.',
      followUpDate: '2024-02-18T10:00:00Z',
      isCompleted: false
    },
    {
      id: 5,
      jobSeekerName: 'Sarah Mukamana',
      jobSeekerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      employerName: 'Mr. Uwimana',
      companyName: 'Restaurant Kigali',
      position: 'Cook',
      status: 'completed',
      placementDate: '2023-11-20T10:30:00Z',
      startDate: '2023-11-25T06:00:00Z',
      duration: '2 months',
      dailyRate: 7000,
      monthlyRate: 180000,
      category: 'food',
      employerRating: 4.5,
      jobSeekerRating: 4.6,
      employerFeedback: 'Good cooking skills and fast learner. Adapted well to restaurant environment.',
      jobSeekerFeedback: 'Busy but rewarding work. Good team environment.',
      followUpDate: '2024-01-25T10:00:00Z',
      isCompleted: true
    }
  ];

  // Load placements data
  useEffect(() => {
    setPlacements(mockPlacements);
    setFilteredPlacements(mockPlacements);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = placements;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(placement =>
        placement.jobSeekerName.toLowerCase().includes(searchLower) ||
        placement.employerName.toLowerCase().includes(searchLower) ||
        placement.position.toLowerCase().includes(searchLower) ||
        placement.companyName.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(placement => placement.status === statusFilter);
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(placement => placement.category === categoryFilter);
    }

    // Date filter
    if (dateFilter) {
      const today = new Date();
      const filterDate = new Date(placement.placementDate);
      
      switch (dateFilter) {
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(placement => 
            new Date(placement.placementDate) >= weekAgo
          );
          break;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(placement => 
            new Date(placement.placementDate) >= monthAgo
          );
          break;
        case 'quarter':
          const quarterAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(placement => 
            new Date(placement.placementDate) >= quarterAgo
          );
          break;
        default:
          break;
      }
    }

    setFilteredPlacements(filtered);
  }, [placements, searchTerm, statusFilter, categoryFilter, dateFilter]);

  // Statistics calculation
  const activePlacements = placements.filter(p => p.status === 'active').length;
  const completedPlacements = placements.filter(p => p.status === 'completed').length;
  const avgRating = placements.length > 0 
    ? (placements.reduce((sum, p) => sum + p.employerRating, 0) / placements.length).toFixed(1)
    : '0.0';

  const stats = [
    {
      title: 'Total Placements',
      value: placements.length.toString(),
      change: '+8',
      changeType: 'increase',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'All successful placements'
    },
    {
      title: 'Active Placements',
      value: activePlacements.toString(),
      change: '+3',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Currently ongoing'
    },
    {
      title: 'Completed Placements',
      value: completedPlacements.toString(),
      change: '+5',
      changeType: 'increase',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Successfully completed'
    },
    {
      title: 'Average Rating',
      value: avgRating,
      change: '+0.2',
      changeType: 'increase',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Employer satisfaction'
    }
  ];

  // Table columns configuration
  const columns = [
    {
      key: 'jobSeekerInfo',
      label: 'Job Seeker',
      sortable: false,
      render: (value, item) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            src={item.jobSeekerAvatar} 
            alt={item.jobSeekerName} 
            size="sm"
            fallback={item.jobSeekerName}
          />
          <div>
            <div className="font-medium text-gray-900">{item.jobSeekerName}</div>
            <div className="text-sm text-gray-500">{item.position}</div>
          </div>
        </div>
      )
    },
    {
      key: 'employerInfo',
      label: 'Employer',
      sortable: false,
      render: (value, item) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <Building className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{item.employerName}</div>
            <div className="text-sm text-gray-500">{item.companyName}</div>
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
      badgeColor: getCategoryColor
    },
    {
      key: 'monthlyRate',
      label: 'Monthly Rate',
      sortable: true,
      type: 'currency'
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      type: 'badge',
      badgeColor: (status) => {
        switch (status) {
          case 'active': return 'text-green-600 bg-green-50 border-green-200';
          case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
          case 'terminated': return 'text-red-600 bg-red-50 border-red-200';
          default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
      }
    },
    {
      key: 'employerRating',
      label: 'Rating',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'placementDate',
      label: 'Placement Date',
      sortable: true,
      type: 'date'
    }
  ];

  // Filter options
  const filters = [
    {
      key: 'status',
      label: 'Status',
      placeholder: 'All Status',
      value: statusFilter,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'terminated', label: 'Terminated' }
      ]
    },
    {
      key: 'category',
      label: 'Category',
      placeholder: 'All Categories',
      value: categoryFilter,
      options: [
        { value: 'domestic', label: 'Domestic & Household' },
        { value: 'care', label: 'Care Services' },
        { value: 'food', label: 'Food & Hospitality' },
        { value: 'maintenance', label: 'Maintenance & Services' },
        { value: 'transport', label: 'Transportation' }
      ]
    },
    {
      key: 'date',
      label: 'Date Range',
      placeholder: 'All Time',
      value: dateFilter,
      options: [
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'quarter', label: 'This Quarter' }
      ]
    }
  ];

  // Event handlers
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (key, value) => {
    switch (key) {
      case 'status':
        setStatusFilter(value);
        break;
      case 'category':
        setCategoryFilter(value);
        break;
      case 'date':
        setDateFilter(value);
        break;
      default:
        break;
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCategoryFilter('');
    setDateFilter('');
  };

  const handleRowAction = (action, placement) => {
    setSelectedPlacement(placement);
    
    switch (action) {
      case 'view':
        setShowDetailsModal(true);
        break;
      case 'export':
        // Handle export action
        console.log('Export placement:', placement);
        break;
      default:
        break;
    }
  };

  // Action buttons for table
  const actionButtons = [
    {
      key: 'view',
      icon: <Eye className="w-4 h-4" />,
      title: 'View Details',
      className: 'text-blue-600 hover:bg-blue-50'
    },
    {
      key: 'export',
      icon: <Download className="w-4 h-4" />,
      title: 'Export',
      className: 'text-green-600 hover:bg-green-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Placements Management</h1>
        <p className="text-gray-600">Track successful job placements and performance</p>
      </div>

      {/* Statistics */}
      <StatsGrid stats={stats} />

      {/* Search and Filters */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        placeholder="Search placements by job seeker, employer, or position..."
      />

      {/* Placements Table */}
      <Card className="p-0">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Placements ({filteredPlacements.length})
            </h2>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="primary" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
        
        <DataTable
          columns={columns}
          data={filteredPlacements}
          onRowAction={handleRowAction}
          actionButtons={actionButtons}
          pagination={true}
          itemsPerPage={10}
          className="rounded-none"
        />
      </Card>

      {/* Placement Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Placement Details"
        maxWidth="max-w-4xl"
      >
        {selectedPlacement && (
          <div className="space-y-6">
            {/* Placement Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Job Seeker Information</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar 
                    src={selectedPlacement.jobSeekerAvatar} 
                    alt={selectedPlacement.jobSeekerName} 
                    size="lg"
                    fallback={selectedPlacement.jobSeekerName}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{selectedPlacement.jobSeekerName}</p>
                    <p className="text-gray-600">{selectedPlacement.position}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p><span className="font-medium">Daily Rate:</span> {selectedPlacement.dailyRate.toLocaleString()} RWF</p>
                  <p><span className="font-medium">Monthly Rate:</span> {selectedPlacement.monthlyRate.toLocaleString()} RWF</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Employer Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedPlacement.employerName}</p>
                  <p><span className="font-medium">Company:</span> {selectedPlacement.companyName}</p>
                  <p><span className="font-medium">Category:</span> 
                    <Badge 
                      variant="outline" 
                      className={getCategoryColor(selectedPlacement.category)}
                    >
                      {selectedPlacement.category}
                    </Badge>
                  </p>
                  <p><span className="font-medium">Status:</span> 
                    <Badge 
                      variant="outline" 
                      className={selectedPlacement.status === 'active' ? 'text-green-600 bg-green-50 border-green-200' : 'text-blue-600 bg-blue-50 border-blue-200'}
                    >
                      {selectedPlacement.status}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Placement Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Placement Created</p>
                    <p className="text-xs text-gray-500">{new Date(selectedPlacement.placementDate).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Work Started</p>
                    <p className="text-xs text-gray-500">{new Date(selectedPlacement.startDate).toLocaleString()}</p>
                  </div>
                </div>
                {selectedPlacement.followUpDate && (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Follow-up Scheduled</p>
                      <p className="text-xs text-gray-500">{new Date(selectedPlacement.followUpDate).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Employer Feedback</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(selectedPlacement.employerRating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{selectedPlacement.employerRating}</span>
                  </div>
                  <p className="text-gray-700">{selectedPlacement.employerFeedback}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Job Seeker Feedback</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(selectedPlacement.jobSeekerRating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{selectedPlacement.jobSeekerRating}</span>
                  </div>
                  <p className="text-gray-700">{selectedPlacement.jobSeekerFeedback}</p>
                </div>
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
              <Button
                variant="outline"
                onClick={() => {
                  // Handle follow-up action
                  console.log('Schedule follow-up for:', selectedPlacement.id);
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Follow-up
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // Handle export action
                  console.log('Export placement details:', selectedPlacement.id);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Details
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PlacementsPage; 