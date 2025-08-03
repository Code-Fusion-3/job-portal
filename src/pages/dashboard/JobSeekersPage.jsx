import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  Clock,
  GraduationCap,
  Languages,
  Award,
  AlertCircle
} from 'lucide-react';
import { useAdminJobSeekers } from '../../api/hooks/useJobSeekers.js';
import { useAuth } from '../../api/hooks/useAuth.js';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import DataTable from '../../components/ui/DataTable';
import SearchFilter from '../../components/ui/SearchFilter';
import AddJobSeekerForm from '../../components/forms/AddJobSeekerForm';
import Pagination from '../../components/ui/Pagination';
import { formatCurrency } from '../../utils/adminHelpers';
import Modal from '../../components/ui/Modal';

// Static data for form options
const educationLevels = [
  { id: 'none', name: 'No Formal Education', description: 'Learned through experience' },
  { id: 'primary', name: 'Primary School', description: 'Basic education completed' },
  { id: 'secondary', name: 'Secondary School', description: 'High school education' },
  { id: 'vocational', name: 'Vocational Training', description: 'Trade or skill training' },
  { id: 'bachelor', name: 'Bachelor\'s Degree', description: 'University degree' },
  { id: 'master', name: 'Master\'s Degree', description: 'Advanced university degree' },
  { id: 'phd', name: 'PhD/Doctorate', description: 'Highest academic degree' }
];

const availabilityOptions = [
  { id: 'fulltime', name: 'Full Time', description: 'Available for full-time work' },
  { id: 'parttime', name: 'Part Time', description: 'Available for part-time work' },
  { id: 'flexible', name: 'Flexible', description: 'Flexible schedule available' },
  { id: 'weekends', name: 'Weekends Only', description: 'Available on weekends' },
  { id: 'evenings', name: 'Evenings Only', description: 'Available in evenings' },
  { id: 'oncall', name: 'On Call', description: 'Available when needed' }
];

const skillsData = [
  // Domestic Skills
  "House Cleaning", "Laundry", "Ironing", "Cooking", "Meal Preparation", "Kitchen Management",
  "Childcare", "Elderly Care", "Pet Care", "First Aid", "Safety", "Educational Activities",
  
  // Maintenance Skills
  "Gardening", "Landscaping", "Plant Care", "Basic Repairs", "Plumbing", "Electrical",
  "Carpentry", "Painting", "Security Monitoring", "Access Control", "Patrol",
  
  // Transportation Skills
  "Safe Driving", "Vehicle Maintenance", "Route Planning", "GPS Navigation",
  "Defensive Driving", "Passenger Safety",
  
  // Hospitality Skills
  "Food Service", "Table Setting", "Order Taking", "Cash Handling", "Customer Service",
  "Bartending", "Food Delivery",
  
  // Sales Skills
  "Sales", "Inventory Management", "Negotiation", "Product Knowledge", "Market Knowledge",
  
  // Language Skills
  "Kinyarwanda", "English", "French", "Swahili", "Basic Communication", "Translation"
];

const languageLevels = [
  { id: 'basic', name: 'Basic', description: 'Can understand and speak basic phrases' },
  { id: 'conversational', name: 'Conversational', description: 'Can hold basic conversations' },
  { id: 'fluent', name: 'Fluent', description: 'Can speak and understand well' },
  { id: 'native', name: 'Native', description: 'Native speaker level' }
];

// Job categories for the form
const jobCategories = [
  { id: 1, name: 'Software Developer' },
  { id: 2, name: 'Housemaid' },
  { id: 3, name: 'Gardener' },
  { id: 4, name: 'Driver' },
  { id: 5, name: 'Cook' },
  { id: 6, name: 'Security Guard' }
];

const JobSeekersPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // State management
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedJobSeeker, setSelectedJobSeeker] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Use the custom hook for job seekers management
  const {
    jobSeekers,
    allJobSeekers,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    searchTerm,
    filters,
    sortBy,
    sortOrder,
    fetchJobSeekers,
    createJobSeeker,
    updateJobSeeker,
    deleteJobSeeker,
    setSearchTerm,
    setFilters,
    setSortBy,
    setSortOrder,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
    pageInfo
  } = useAdminJobSeekers({
    autoFetch: true,
    itemsPerPage: 10
  });

  // Handle search change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      gender: '',
      location: '',
      skills: '',
      experienceLevel: '',
      availability: ''
    });
    setSearchTerm('');
  };

  // Handle row actions
  const handleRowAction = (action, jobSeeker) => {
    switch (action) {
      case 'view':
        setSelectedJobSeeker(jobSeeker);
        setShowDetailsModal(true);
        break;
      case 'edit':
        setSelectedJobSeeker(jobSeeker);
        setShowEditModal(true);
        break;
      case 'delete':
        setSelectedJobSeeker(jobSeeker);
        setShowDeleteModal(true);
        break;
      default:
        break;
    }
  };

  // Handle status change
  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    // You can add status-based filtering here
  };

  // Handle add job seeker
  const handleAddJobSeeker = async (jobSeekerData) => {
    try {
      const result = await createJobSeeker(jobSeekerData);
      if (result.success) {
        setShowAddForm(false);
        alert('Job seeker created successfully!');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to create job seeker');
      console.error('Create job seeker error:', error);
    }
  };

  // Handle update job seeker
  const handleUpdateJobSeeker = async (jobSeekerData) => {
    if (!selectedJobSeeker) return;
    
    try {
      const result = await updateJobSeeker(selectedJobSeeker.id, jobSeekerData);
      if (result.success) {
        setShowEditModal(false);
        setSelectedJobSeeker(null);
        alert('Job seeker updated successfully!');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to update job seeker');
      console.error('Update job seeker error:', error);
    }
  };

  // Handle delete job seeker
  const handleDeleteJobSeeker = async () => {
    if (!selectedJobSeeker) return;
    
    try {
      const result = await deleteJobSeeker(selectedJobSeeker.id);
      if (result.success) {
        setShowDeleteModal(false);
        setSelectedJobSeeker(null);
        alert('Job seeker deleted successfully!');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to delete job seeker');
      console.error('Delete job seeker error:', error);
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (jobSeeker) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <div className="font-medium">{jobSeeker.firstName} {jobSeeker.lastName}</div>
            <div className="text-sm text-gray-500">{jobSeeker.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (jobSeeker) => (
        <div className="flex items-center space-x-1">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{jobSeeker.location || 'Not specified'}</span>
        </div>
      )
    },
    {
      key: 'skills',
      label: 'Skills',
      render: (jobSeeker) => (
        <div className="flex flex-wrap gap-1">
          {jobSeeker.skills?.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="secondary" size="sm">
              {skill}
            </Badge>
          ))}
          {jobSeeker.skills?.length > 3 && (
            <Badge variant="outline" size="sm">
              +{jobSeeker.skills.length - 3} more
            </Badge>
          )}
        </div>
      )
    },
    {
      key: 'dailyRate',
      label: 'Daily Rate',
      render: (jobSeeker) => (
        <div className="flex items-center space-x-1">
          <DollarSign className="w-4 h-4 text-green-500" />
          <span>{formatCurrency(jobSeeker.dailyRate || 0)}</span>
        </div>
      )
    },
    {
      key: 'availability',
      label: 'Availability',
      render: (jobSeeker) => (
        <Badge 
          variant={jobSeeker.availability === 'Immediate' ? 'success' : 'warning'}
          size="sm"
        >
          {jobSeeker.availability || 'Not specified'}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'Registered',
      render: (jobSeeker) => (
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{new Date(jobSeeker.createdAt).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (jobSeeker) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRowAction('view', jobSeeker)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRowAction('edit', jobSeeker)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRowAction('delete', jobSeeker)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  // Render loading state
  if (loading && jobSeekers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading job seekers..." />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">Error: {error}</span>
        </div>
        <Button 
          onClick={fetchJobSeekers}
          className="mt-2"
          variant="outline"
          size="sm"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Seekers Management</h1>
          <p className="text-gray-600">
            Manage all registered job seekers ({totalItems} total)
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Job Seeker
        </Button>
      </div>

      {/* Search and Filters */}
      <Pagination
        pagination={{
          currentPage,
          totalPages,
          totalItems,
          searchTerm,
          filters,
          sortBy,
          sortOrder,
          setSearchTerm,
          setFilters,
          setSortBy,
          setSortOrder,
          goToPage,
          nextPage,
          prevPage,
          hasNextPage,
          hasPrevPage,
          pageInfo
        }}
        onSearch={handleSearchChange}
        onFilter={handleFilterChange}
        searchPlaceholder="Search job seekers..."
        showSearch={true}
        showFilters={true}
        showSort={true}
      />

      {/* Job Seekers Table */}
      <Card>
        <DataTable
          data={jobSeekers}
          columns={columns}
          loading={loading}
          emptyMessage="No job seekers found"
        />
      </Card>

      {/* Add Job Seeker Modal */}
      {showAddForm && (
        <AddJobSeekerForm
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddJobSeeker}
          educationLevels={educationLevels}
          availabilityOptions={availabilityOptions}
          skillsData={skillsData}
          languageLevels={languageLevels}
          jobCategories={jobCategories}
        />
      )}

      {/* Job Seeker Details Modal */}
      {showDetailsModal && selectedJobSeeker && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Job Seeker Details"
          size="lg"
        >
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1">{selectedJobSeeker.firstName} {selectedJobSeeker.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1">{selectedJobSeeker.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1">{selectedJobSeeker.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="mt-1">{selectedJobSeeker.location || 'Not specified'}</p>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              <div className="flex flex-wrap gap-2">
                {selectedJobSeeker.skills?.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Daily Rate</label>
                <p className="mt-1">{formatCurrency(selectedJobSeeker.dailyRate || 0)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Availability</label>
                <p className="mt-1">{selectedJobSeeker.availability || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedJobSeeker && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Job Seeker"
        >
          <div className="space-y-4">
            <p>
              Are you sure you want to delete {selectedJobSeeker.firstName} {selectedJobSeeker.lastName}?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteJobSeeker}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default JobSeekersPage; 