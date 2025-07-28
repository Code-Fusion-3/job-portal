import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Eye, 
  Edit, 
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import SearchFilter from '../../components/ui/SearchFilter';
import StatsGrid from '../../components/ui/StatsGrid';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import { jobSeekersData } from '../../data/mockData';
import { getCategoryColor } from '../../utils/adminHelpers';

const JobSeekersPage = () => {
  const { t } = useTranslation();
  
  // State management
  const [jobSeekers, setJobSeekers] = useState([]);
  const [filteredJobSeekers, setFilteredJobSeekers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobSeeker, setSelectedJobSeeker] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Load job seekers data
  useEffect(() => {
    // In a real app, this would be an API call
    const mockData = jobSeekersData.map(seeker => ({
      ...seeker,
      status: 'active', // Mock status
      lastUpdated: new Date().toISOString(),
      profileCompletion: Math.floor(Math.random() * 30) + 70 // Mock completion percentage
    }));
    setJobSeekers(mockData);
    setFilteredJobSeekers(mockData);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = jobSeekers;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(seeker =>
        seeker.name.toLowerCase().includes(searchLower) ||
        seeker.title.toLowerCase().includes(searchLower) ||
        seeker.location.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(seeker => seeker.category === categoryFilter);
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(seeker => seeker.status === statusFilter);
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(seeker => seeker.location.includes(locationFilter));
    }

    setFilteredJobSeekers(filtered);
  }, [jobSeekers, searchTerm, categoryFilter, statusFilter, locationFilter]);

  // Statistics calculation
  const stats = [
    {
      title: 'Total Job Seekers',
      value: jobSeekers.length.toString(),
      change: '+12',
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'All registered job seekers'
    },
    {
      title: 'Active Profiles',
      value: jobSeekers.filter(s => s.status === 'active').length.toString(),
      change: '+8',
      changeType: 'increase',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Currently active profiles'
    },
    {
      title: 'Pending Approval',
      value: jobSeekers.filter(s => s.status === 'pending').length.toString(),
      change: '+3',
      changeType: 'increase',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Awaiting admin approval'
    },
    {
      title: 'Suspended',
      value: jobSeekers.filter(s => s.status === 'suspended').length.toString(),
      change: '-1',
      changeType: 'decrease',
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Temporarily suspended'
    }
  ];

  // Table columns configuration
  const columns = [
    {
      key: 'avatar',
      label: 'Profile',
      sortable: false,
      render: (value, item) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            src={item.avatar} 
            alt={item.name} 
            size="sm"
            fallback={item.name}
          />
          <div>
            <div className="font-medium text-gray-900">{item.name}</div>
            <div className="text-sm text-gray-500">{item.title}</div>
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
      key: 'location',
      label: 'Location',
      sortable: true,
      searchable: true
    },
    {
      key: 'experience',
      label: 'Experience',
      sortable: true,
      render: (value) => `${value} years`
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
      badgeColor: (status) => {
        switch (status) {
          case 'active': return 'text-green-600 bg-green-50 border-green-200';
          case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200';
          case 'suspended': return 'text-red-600 bg-red-50 border-red-200';
          default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
      }
    },
    {
      key: 'profileCompletion',
      label: 'Profile',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600">{value}%</span>
        </div>
      )
    },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      sortable: true,
      type: 'date'
    }
  ];

  // Filter options
  const filters = [
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
        { value: 'sales', label: 'Sales & Retail' },
        { value: 'transport', label: 'Transportation' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      placeholder: 'All Status',
      value: statusFilter,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'pending', label: 'Pending' },
        { value: 'suspended', label: 'Suspended' }
      ]
    },
    {
      key: 'location',
      label: 'Location',
      placeholder: 'All Locations',
      value: locationFilter,
      options: [
        { value: 'Kigali', label: 'Kigali' },
        { value: 'Butare', label: 'Butare' },
        { value: 'Gisenyi', label: 'Gisenyi' }
      ]
    }
  ];

  // Event handlers
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (key, value) => {
    switch (key) {
      case 'category':
        setCategoryFilter(value);
        break;
      case 'status':
        setStatusFilter(value);
        break;
      case 'location':
        setLocationFilter(value);
        break;
      default:
        break;
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStatusFilter('');
    setLocationFilter('');
  };

  const handleRowAction = (action, jobSeeker) => {
    setSelectedJobSeeker(jobSeeker);
    setCurrentAction(action);
    
    switch (action) {
      case 'view':
        setShowDetailsModal(true);
        break;
      case 'edit':
        // Handle edit action
        console.log('Edit job seeker:', jobSeeker);
        break;
      case 'approve':
      case 'suspend':
        setShowActionModal(true);
        break;
      default:
        break;
    }
  };

  const handleStatusChange = (newStatus) => {
    if (selectedJobSeeker) {
      // In a real app, this would be an API call
      setJobSeekers(prev => 
        prev.map(seeker => 
          seeker.id === selectedJobSeeker.id 
            ? { ...seeker, status: newStatus }
            : seeker
        )
      );
      setShowActionModal(false);
      setSelectedJobSeeker(null);
      setCurrentAction(null);
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
      key: 'edit',
      icon: <Edit className="w-4 h-4" />,
      title: 'Edit Profile',
      className: 'text-green-600 hover:bg-green-50'
    },
    {
      key: 'approve',
      icon: <CheckCircle className="w-4 h-4" />,
      title: 'Approve',
      className: 'text-green-600 hover:bg-green-50'
    },
    {
      key: 'suspend',
      icon: <XCircle className="w-4 h-4" />,
      title: 'Suspend',
      className: 'text-red-600 hover:bg-red-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Job Seekers Management</h1>
        <p className="text-gray-600">Manage all job seekers in the platform</p>
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
        placeholder="Search job seekers by name, title, or location..."
      />

      {/* Job Seekers Table */}
      <Card className="p-0">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Job Seekers ({filteredJobSeekers.length})
            </h2>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                Export Data
              </Button>
              <Button variant="primary" size="sm">
                Add Job Seeker
              </Button>
            </div>
          </div>
        </div>
        
        <DataTable
          columns={columns}
          data={filteredJobSeekers}
          onRowAction={handleRowAction}
          actionButtons={actionButtons}
          pagination={true}
          itemsPerPage={10}
          className="rounded-none"
        />
      </Card>

      {/* Job Seeker Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Job Seeker Details"
        maxWidth="max-w-4xl"
      >
        {selectedJobSeeker && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <Avatar 
                  src={selectedJobSeeker.avatar} 
                  alt={selectedJobSeeker.name} 
                  size="xl"
                  fallback={selectedJobSeeker.name}
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedJobSeeker.name}</h3>
                  <p className="text-gray-600">{selectedJobSeeker.title}</p>
                  <Badge 
                    variant="outline" 
                    className={getCategoryColor(selectedJobSeeker.category)}
                  >
                    {selectedJobSeeker.category}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Location:</span>
                  <p className="text-gray-900">{selectedJobSeeker.location}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Experience:</span>
                  <p className="text-gray-900">{selectedJobSeeker.experience} years</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Daily Rate:</span>
                  <p className="text-gray-900">{selectedJobSeeker.dailyRate.toLocaleString()} RWF</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Monthly Rate:</span>
                  <p className="text-gray-900">{selectedJobSeeker.monthlyRate.toLocaleString()} RWF</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {selectedJobSeeker.skills.map((skill, index) => (
                  <Badge key={index} variant="primary" size="sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Bio</h4>
              <p className="text-gray-700">{selectedJobSeeker.bio}</p>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <p className="text-gray-900">{selectedJobSeeker.contact.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Phone:</span>
                  <p className="text-gray-900">{selectedJobSeeker.contact.phone}</p>
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
                variant="primary"
                onClick={() => {
                  setShowDetailsModal(false);
                  // Handle edit action
                }}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title={`${currentAction === 'approve' ? 'Approve' : 'Suspend'} Job Seeker`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to {currentAction === 'approve' ? 'approve' : 'suspend'} 
            <span className="font-medium text-gray-900"> {selectedJobSeeker?.name}</span>?
          </p>
          
          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowActionModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant={currentAction === 'approve' ? 'primary' : 'danger'}
              onClick={() => handleStatusChange(currentAction === 'approve' ? 'active' : 'suspended')}
            >
              {currentAction === 'approve' ? 'Approve' : 'Suspend'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobSeekersPage; 