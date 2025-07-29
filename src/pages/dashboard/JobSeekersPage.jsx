import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Plus
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import SearchFilter from '../../components/ui/SearchFilter';
import StatsGrid from '../../components/ui/StatsGrid';
import Modal from '../../components/ui/Modal';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AddJobSeekerForm from '../../components/forms/AddJobSeekerForm';
import { 
  jobSeekersData, 
  jobCategories, 
  skillsData, 
  educationLevels, 
  availabilityOptions 
} from '../../data/mockData';
import { 
  getStatusColor, 
  getCategoryColor, 
  formatCurrency, 
  formatDate 
} from '../../utils/adminHelpers';

const JobSeekersPage = () => {
  const { t } = useTranslation();
  const [jobSeekers, setJobSeekers] = useState([]);
  const [filteredJobSeekers, setFilteredJobSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    dailyRateRange: '',
    monthlyRateRange: '',
    availability: '',
    education: '',
    skills: []
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedJobSeeker, setSelectedJobSeeker] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAddingJobSeeker, setIsAddingJobSeeker] = useState(false);

  // Load job seekers data
  useEffect(() => {
    const loadJobSeekers = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setJobSeekers(jobSeekersData);
        setFilteredJobSeekers(jobSeekersData);
        setLoading(false);
      }, 500);
    };

    loadJobSeekers();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...jobSeekers];

    // Search
    if (searchTerm) {
      filtered = filtered.filter(seeker =>
        seeker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seeker.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seeker.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(seeker => seeker.category === filters.category);
    }

    // Daily rate filter
    if (filters.dailyRateRange) {
      const [min, max] = filters.dailyRateRange.split('-').map(Number);
      filtered = filtered.filter(seeker => 
        seeker.dailyRate >= min && seeker.dailyRate <= max
      );
    }

    // Monthly rate filter
    if (filters.monthlyRateRange) {
      const [min, max] = filters.monthlyRateRange.split('-').map(Number);
      filtered = filtered.filter(seeker => 
        seeker.monthlyRate >= min && seeker.monthlyRate <= max
      );
    }

    // Availability filter
    if (filters.availability) {
      filtered = filtered.filter(seeker => seeker.availability === filters.availability);
    }

    // Education filter
    if (filters.education) {
      filtered = filtered.filter(seeker => seeker.education === filters.education);
    }

    // Skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter(seeker =>
        filters.skills.some(skill => seeker.skills.includes(skill))
      );
    }

    setFilteredJobSeekers(filtered);
  }, [jobSeekers, searchTerm, filters]);

  // Stats data
  const stats = [
    {
      title: 'Total Job Seekers',
      value: jobSeekers.length.toString(),
      change: '+12',
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Active profiles'
    },
    {
      title: 'New This Month',
      value: '8',
      change: '+3',
      changeType: 'increase',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Recent registrations'
    },
    {
      title: 'Available Now',
      value: jobSeekers.filter(seeker => seeker.availability === 'Available').length.toString(),
      change: '+2',
      changeType: 'increase',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Ready to work'
    },
    {
      title: 'Average Daily Rate',
      value: `${Math.round(jobSeekers.reduce((sum, seeker) => sum + (seeker.dailyRate || 0), 0) / Math.max(jobSeekers.length, 1)).toLocaleString()} RWF`,
      change: '+500',
      changeType: 'increase',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Market rate'
    }
  ];

  // Table columns
  const columns = [
    {
      key: 'avatar',
      label: '',
      render: (seeker) => (
        <Avatar 
          src={seeker.avatar} 
          alt={seeker.name} 
          size="sm"
          fallback={seeker.name}
        />
      )
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true
    },
    {
      key: 'title',
      label: 'Title',
      render: (seeker) => (
        <div>
          <p className="font-medium text-gray-900">{seeker.title}</p>
          <Badge 
            variant="outline" 
            className={getCategoryColor(seeker.category)}
          >
            {seeker.category}
          </Badge>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true
    },
    {
      key: 'experience',
      label: 'Experience',
      render: (seeker) => `${seeker.experience} years`,
      sortable: true
    },
    {
      key: 'dailyRate',
      label: 'Daily Rate',
      render: (seeker) => {
        if (!seeker.dailyRate || isNaN(seeker.dailyRate)) {
          return 'Rate not specified';
        }
        return formatCurrency(seeker.dailyRate);
      },
      sortable: true
    },
    {
      key: 'availability',
      label: 'Status',
      render: (seeker) => (
        <Badge 
          variant={seeker.availability === 'Available' ? 'success' : 'warning'}
        >
          {seeker.availability}
        </Badge>
      )
    }
  ];

  // Action buttons for each row
  const actionButtons = [
    {
      key: 'view',
      label: 'View Details',
      icon: Eye,
      variant: 'ghost'
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: Edit,
      variant: 'ghost'
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: Trash2,
      variant: 'ghost',
      className: 'text-red-600 hover:text-red-800'
    }
  ];

  // Search and filter handlers
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      dailyRateRange: '',
      monthlyRateRange: '',
      availability: '',
      education: '',
      skills: []
    });
    setSearchTerm('');
  };

  // Row action handler
  const handleRowAction = (action, jobSeeker) => {
    switch (action) {
      case 'view':
        setSelectedJobSeeker(jobSeeker);
        setShowDetailsModal(true);
        break;
      case 'edit':
        // TODO: Implement edit functionality
        console.log('Edit job seeker:', jobSeeker);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${jobSeeker.name}?`)) {
          setJobSeekers(prev => prev.filter(seeker => seeker.id !== jobSeeker.id));
        }
        break;
      default:
        break;
    }
  };

  // Status change handler
  const handleStatusChange = (newStatus) => {
    if (selectedJobSeeker) {
      setJobSeekers(prev => 
        prev.map(seeker => 
          seeker.id === selectedJobSeeker.id 
            ? { ...seeker, availability: newStatus }
            : seeker
        )
      );
      setSelectedJobSeeker(prev => ({ ...prev, availability: newStatus }));
    }
  };

  // Add job seeker handler
  const handleAddJobSeeker = async (jobSeekerData) => {
    setIsAddingJobSeeker(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add to job seekers list
      setJobSeekers(prev => [jobSeekerData, ...prev]);
      
      // Close modal
      setShowAddModal(false);
      
      // Show success message (you can implement a toast notification here)
      console.log('Basic profile created successfully:', jobSeekerData.name);
      console.log('Job seeker should complete their full profile through the Update Profile page.');
    } catch (error) {
      console.error('Error adding job seeker:', error);
    } finally {
      setIsAddingJobSeeker(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading job seekers..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <StatsGrid stats={stats} />

      {/* Search and Filters */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filters={[
          {
            key: 'category',
            value: filters.category,
            placeholder: 'Category',
            options: jobCategories.map(cat => ({ value: cat.id, label: cat.name }))
          },
          {
            key: 'dailyRateRange',
            value: filters.dailyRateRange,
            placeholder: 'Daily Rate',
            options: [
              { value: '0-3000', label: '0 - 3,000 RWF' },
              { value: '3000-5000', label: '3,000 - 5,000 RWF' },
              { value: '5000-8000', label: '5,000 - 8,000 RWF' },
              { value: '8000+', label: '8,000+ RWF' }
            ]
          },
          {
            key: 'monthlyRateRange',
            value: filters.monthlyRateRange,
            placeholder: 'Monthly Rate',
            options: [
              { value: '0-80000', label: '0 - 80,000 RWF' },
              { value: '80000-120000', label: '80,000 - 120,000 RWF' },
              { value: '120000-180000', label: '120,000 - 180,000 RWF' },
              { value: '180000+', label: '180,000+ RWF' }
            ]
          },
          {
            key: 'availability',
            value: filters.availability,
            placeholder: 'Availability',
            options: availabilityOptions.map(opt => ({ value: opt.id, label: opt.name }))
          },
          {
            key: 'education',
            value: filters.education,
            placeholder: 'Education',
            options: educationLevels.map(level => ({ value: level.id, label: level.name }))
          }
        ]}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Job Seekers Table */}
      <Card className="rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Job Seekers ({filteredJobSeekers.length})
            </h2>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                Export Data
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setShowAddModal(true)}
                className="min-h-[44px] rounded-lg transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <Plus className="w-4 h-4 mr-2" />
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
                  <p className="text-gray-900">{selectedJobSeeker.dailyRate ? selectedJobSeeker.dailyRate.toLocaleString() : 'Not specified'} RWF</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Monthly Rate:</span>
                  <p className="text-gray-900">{selectedJobSeeker.monthlyRate ? selectedJobSeeker.monthlyRate.toLocaleString() : 'Not specified'} RWF</p>
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
                {selectedJobSeeker.contact.linkedin && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">LinkedIn:</span>
                    <p className="text-gray-900">{selectedJobSeeker.contact.linkedin}</p>
                  </div>
                )}
              </div>
            </div>

            {/* References */}
            {selectedJobSeeker.references && selectedJobSeeker.references.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">References</h4>
                <div className="space-y-3">
                  {selectedJobSeeker.references.map((reference, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">{reference.name}</p>
                      <p className="text-sm text-gray-600">{reference.phone}</p>
                      <p className="text-sm text-gray-500">{reference.relationship}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
                className="min-h-[44px] rounded-lg transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => handleRowAction('edit', selectedJobSeeker)}
                className="min-h-[44px] rounded-lg transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Job Seeker Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Job Seeker"
        maxWidth="max-w-md"
      >
        <AddJobSeekerForm
          onSubmit={handleAddJobSeeker}
          onCancel={() => setShowAddModal(false)}
          isLoading={isAddingJobSeeker}
        />
      </Modal>
    </div>
  );
};

export default JobSeekersPage; 