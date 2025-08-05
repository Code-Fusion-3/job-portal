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
  AlertCircle,
  CheckCircle
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

const experienceLevels = [
  { value: 'no_experience', label: 'No Experience (0 years)', description: 'New to the workforce' },
  { value: 'beginner', label: 'Beginner (1-2 years)', description: 'Some basic experience' },
  { value: 'intermediate', label: 'Intermediate (3-5 years)', description: 'Moderate experience' },
  { value: 'experienced', label: 'Experienced (6-10 years)', description: 'Significant experience' },
  { value: 'expert', label: 'Expert (10+ years)', description: 'Extensive experience' }
];

const JobSeekersPage = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  // State management
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedJobSeeker, setSelectedJobSeeker] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [jobCategories, setJobCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  // Fetch job categories from backend
  useEffect(() => {
    const fetchJobCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetch('http://localhost:3000/categories/admin', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('job_portal_token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          // Handle the correct data structure with categories array
          const categories = data.categories || data || [];
          setJobCategories(categories);
        } else {
          console.error('Failed to fetch job categories');
        }
      } catch (error) {
        console.error('Error fetching job categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchJobCategories();
  }, []);

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

  // Debug logging
  useEffect(() => {
    // Removed excessive logging
  }, [user, isAuthenticated, authLoading, jobSeekers, allJobSeekers, loading, error, totalItems, currentPage, totalPages]);

  // Check authentication
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        // console.log('❌ User not authenticated');
      } else if (user?.role !== 'admin') {
        // console.log('❌ User is not admin, role:', user?.role);
      } else {
        // console.log('✅ User is authenticated as admin');
      }
    }
  }, [authLoading, isAuthenticated, user]);

  // Auto-hide success message
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Auto-hide error message
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

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
        setSuccessMessage('Job seeker created successfully!');
        setShowSuccess(true);
      } else {
        setErrorMessage(`Error: ${result.error}`);
        setShowError(true);
      }
    } catch (error) {
      setErrorMessage('Failed to create job seeker');
      setShowError(true);
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
        setSuccessMessage('Job seeker updated successfully!');
        setShowSuccess(true);
      } else {
        setErrorMessage(`Error: ${result.error}`);
        setShowError(true);
      }
    } catch (error) {
      setErrorMessage('Failed to update job seeker');
      setShowError(true);
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
        setSuccessMessage('Job seeker deleted successfully!');
        setShowSuccess(true);
      } else {
        setErrorMessage(`Error: ${result.error}`);
        setShowError(true);
      }
    } catch (error) {
      setErrorMessage('Failed to delete job seeker');
      setShowError(true);
      console.error('Delete job seeker error:', error);
    }
  };

  // Show authentication error if user is not authenticated
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">You must be logged in to access this page.</span>
        </div>
        <Button 
          onClick={() => window.location.href = '/login'}
          className="mt-2"
          variant="outline"
          size="sm"
        >
          Go to Login
        </Button>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          <span className="text-yellow-700">You must be an admin to access this page.</span>
        </div>
        <Button 
          onClick={() => window.location.href = '/dashboard/jobseeker'}
          className="mt-2"
          variant="outline"
          size="sm"
        >
          Go to Job Seeker Dashboard
        </Button>
      </div>
    );
  }

  // Table columns configuration
  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (jobSeeker) => {
        if (!jobSeeker) return <div className="text-gray-500">No data</div>;
        
        // Properly access nested profile data
        const firstName = jobSeeker.profile?.firstName || jobSeeker.firstName || 'Unknown';
        const lastName = jobSeeker.profile?.lastName || jobSeeker.lastName || '';
        const email = jobSeeker.email || 'No email';
        
        return (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="font-medium">
                {firstName} {lastName}
              </div>
              <div className="text-sm text-gray-500">{email}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'location',
      label: 'Location',
      render: (jobSeeker) => {
        if (!jobSeeker) return <div className="text-gray-500">No data</div>;
        
        // Properly access nested profile data
        const location = jobSeeker.profile?.location || jobSeeker.location || 'Not specified';
        
        return (
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{location}</span>
          </div>
        );
      }
    },
    {
      key: 'skills',
      label: 'Skills',
      render: (jobSeeker) => {
        if (!jobSeeker) return <div className="text-gray-500">No data</div>;
        
        // Properly access nested profile data
        const skills = jobSeeker.profile?.skills || jobSeeker.skills || '';
        const skillsArray = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(s => s);
        
        return (
          <div className="flex flex-wrap gap-1">
            {skillsArray.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" size="sm">
                {skill}
              </Badge>
            ))}
            {skillsArray.length > 3 && (
              <Badge variant="outline" size="sm">
                +{skillsArray.length - 3} more
              </Badge>
            )}
          </div>
        );
      }
    },
    {
      key: 'education',
      label: 'Education',
      render: (jobSeeker) => {
        if (!jobSeeker) return <div className="text-gray-500">No data</div>;
        
        // Properly access nested profile data
        const educationLevel = jobSeeker.profile?.educationLevel || 'Not specified';
        const availability = jobSeeker.profile?.availability || 'Not specified';
        
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <GraduationCap className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{educationLevel}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{availability}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'experience',
      label: 'Experience',
      render: (jobSeeker) => {
        if (!jobSeeker) return <div className="text-gray-500">No data</div>;
        
        // Properly access nested profile data
        const experienceLevel = jobSeeker.profile?.experienceLevel || 'Not specified';
        
        const getExperienceLabel = (level) => {
          switch(level) {
            case 'no_experience': return 'No Experience';
            case 'beginner': return 'Beginner (1-2 years)';
            case 'intermediate': return 'Intermediate (3-5 years)';
            case 'experienced': return 'Experienced (6-10 years)';
            case 'expert': return 'Expert (10+ years)';
            default: return level;
          }
        };
        
        return (
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{getExperienceLabel(experienceLevel)}</span>
          </div>
        );
      }
    },
    {
      key: 'contactNumber',
      label: 'Contact',
      render: (jobSeeker) => {
        if (!jobSeeker) return <div className="text-gray-500">No data</div>;
        
        // Properly access nested profile data
        const contactNumber = jobSeeker.profile?.contactNumber || jobSeeker.contactNumber || 'Not provided';
        
        return (
          <div className="flex items-center space-x-1">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{contactNumber}</span>
          </div>
        );
      }
    },
    {
      key: 'gender',
      label: 'Gender',
      render: (jobSeeker) => {
        if (!jobSeeker) return <div className="text-gray-500">No data</div>;
        
        // Properly access nested profile data
        const gender = jobSeeker.profile?.gender || jobSeeker.gender || 'Not specified';
        
        return (
          <Badge 
            variant={gender === 'Male' ? 'primary' : gender === 'Female' ? 'secondary' : 'outline'}
            size="sm"
          >
            {gender}
          </Badge>
        );
      }
    },
    {
      key: 'createdAt',
      label: 'Registered',
      render: (jobSeeker) => {
        if (!jobSeeker) return <div className="text-gray-500">No data</div>;
        
        const date = jobSeeker.createdAt;
        
        return (
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{date ? new Date(date).toLocaleDateString() : 'Invalid Date'}</span>
          </div>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (jobSeeker) => {
        if (!jobSeeker) return <div className="text-gray-500">No actions</div>;
        
        return (
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
        );
      }
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

  // Debug: Log the first job seeker to see the structure
  if (jobSeekers.length > 0) {
    // console.log('🔍 First job seeker data:', jobSeekers[0]);
    // console.log('🔍 First job seeker profile:', jobSeekers[0]?.profile);
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

      {/* Success Notification */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700">{successMessage}</span>
          </div>
        </motion.div>
      )}

      {/* Error Notification */}
      {showError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{errorMessage}</span>
          </div>
        </motion.div>
      )}

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
        <>
          <AddJobSeekerForm
            isOpen={showAddForm}
            onClose={() => setShowAddForm(false)}
            onSubmit={handleAddJobSeeker}
            educationLevels={educationLevels}
            availabilityOptions={availabilityOptions}
            skillsData={skillsData}
            languageLevels={languageLevels}
            jobCategories={jobCategories}
            isEdit={false}
          />
        </>
      )}

      {/* Edit Job Seeker Modal */}
      {showEditModal && selectedJobSeeker && (
        <>
          {(() => {
            const initialData = {
              firstName: selectedJobSeeker.profile?.firstName || selectedJobSeeker.firstName || '',
              lastName: selectedJobSeeker.profile?.lastName || selectedJobSeeker.lastName || '',
              email: selectedJobSeeker.email || '',
              contactNumber: selectedJobSeeker.profile?.contactNumber || selectedJobSeeker.contactNumber || '',
              description: selectedJobSeeker.profile?.description || selectedJobSeeker.description || '',
              skills: selectedJobSeeker.profile?.skills || selectedJobSeeker.skills || '',
              gender: selectedJobSeeker.profile?.gender || selectedJobSeeker.gender || '',
              dateOfBirth: selectedJobSeeker.profile?.dateOfBirth ? 
                new Date(selectedJobSeeker.profile.dateOfBirth).toISOString().split('T')[0] : '',
              idNumber: selectedJobSeeker.profile?.idNumber || '',
              maritalStatus: selectedJobSeeker.profile?.maritalStatus || '',
              location: selectedJobSeeker.profile?.location || selectedJobSeeker.location || '',
              city: selectedJobSeeker.profile?.city || '',
              country: selectedJobSeeker.profile?.country || 'Rwanda',
              references: selectedJobSeeker.profile?.references || '',
              experience: selectedJobSeeker.profile?.experience || selectedJobSeeker.experience || '',
              experienceLevel: selectedJobSeeker.profile?.experienceLevel || '',
              monthlyRate: selectedJobSeeker.profile?.monthlyRate ? selectedJobSeeker.profile.monthlyRate.toString() : '',
              jobCategoryId: selectedJobSeeker.profile?.jobCategoryId ? selectedJobSeeker.profile.jobCategoryId.toString() : '',
              jobCategoryName: selectedJobSeeker.profile?.jobCategory?.name_en || '',
              educationLevel: selectedJobSeeker.profile?.educationLevel || '',
              availability: selectedJobSeeker.profile?.availability || '',
              languages: selectedJobSeeker.profile?.languages || '',
              certifications: selectedJobSeeker.profile?.certifications || ''
            };
            return (
              <AddJobSeekerForm
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSubmit={handleUpdateJobSeeker}
                educationLevels={educationLevels}
                availabilityOptions={availabilityOptions}
                skillsData={skillsData}
                languageLevels={languageLevels}
                jobCategories={jobCategories}
                initialData={initialData}
                isEdit={true}
              />
            );
          })()}
        </>
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
                <p className="mt-1 text-gray-900">
                  {selectedJobSeeker.profile?.firstName || selectedJobSeeker.firstName || 'Unknown'} {' '}
                  {selectedJobSeeker.profile?.lastName || selectedJobSeeker.lastName || ''}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{selectedJobSeeker.email || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-gray-900">{selectedJobSeeker.profile?.contactNumber || selectedJobSeeker.contactNumber || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="mt-1 text-gray-900">{selectedJobSeeker.profile?.location || selectedJobSeeker.location || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <p className="mt-1 text-gray-900">{selectedJobSeeker.profile?.gender || selectedJobSeeker.gender || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Registered</label>
                <p className="mt-1 text-gray-900">
                  {selectedJobSeeker.createdAt ? new Date(selectedJobSeeker.createdAt).toLocaleDateString() : 'Not available'}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              <div className="flex flex-wrap gap-2">
                {(selectedJobSeeker.profile?.skills || selectedJobSeeker.skills || '')
                  .split(',')
                  .map((skill, index) => skill.trim())
                  .filter(skill => skill)
                  .map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="mt-1 text-gray-900">{selectedJobSeeker.profile?.description || selectedJobSeeker.description || 'No description provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Experience Level</label>
                <p className="mt-1 text-gray-900">
                  {(() => {
                    const level = selectedJobSeeker.profile?.experienceLevel;
                    switch(level) {
                      case 'no_experience': return 'No Experience (0 years)';
                      case 'beginner': return 'Beginner (1-2 years)';
                      case 'intermediate': return 'Intermediate (3-5 years)';
                      case 'experienced': return 'Experienced (6-10 years)';
                      case 'expert': return 'Expert (10+ years)';
                      default: return 'Not specified';
                    }
                  })()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Experience Details</label>
                <p className="mt-1 text-gray-900">{selectedJobSeeker.profile?.experience || selectedJobSeeker.experience || 'Not specified'}</p>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <p className="mt-1 text-gray-900">{selectedJobSeeker.profile?.city || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <p className="mt-1 text-gray-900">{selectedJobSeeker.profile?.country || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Category</label>
                <p className="mt-1 text-gray-900">
                  {selectedJobSeeker.profile?.jobCategory?.name_en || 
                   selectedJobSeeker.profile?.jobCategoryId || 
                   'Not specified'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Monthly Rate</label>
                <p className="mt-1 text-gray-900">
                  {selectedJobSeeker.profile?.monthlyRate ? 
                    `${selectedJobSeeker.profile.monthlyRate} RWF` : 
                    'Not specified'
                  }
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Education Level</label>
                <p className="mt-1 text-gray-900">{selectedJobSeeker.profile?.educationLevel || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Availability</label>
                <p className="mt-1 text-gray-900">{selectedJobSeeker.profile?.availability || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                <p className="mt-1 text-gray-900">{selectedJobSeeker.profile?.maritalStatus || 'Not specified'}</p>
              </div>
            </div>

            {/* Languages and Certifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Languages</label>
                <p className="mt-1 text-gray-900">{selectedJobSeeker.profile?.languages || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Certifications</label>
                <p className="mt-1 text-gray-900">{selectedJobSeeker.profile?.certifications || 'Not specified'}</p>
              </div>
            </div>

            {/* References */}
            {selectedJobSeeker.profile?.references && (
              <div>
                <label className="block text-sm font-medium text-gray-700">References</label>
                <p className="mt-1 text-gray-900">{selectedJobSeeker.profile.references}</p>
              </div>
            )}

            {/* ID Number */}
            {selectedJobSeeker.profile?.idNumber && (
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Number</label>
                <p className="mt-1 text-gray-900">{selectedJobSeeker.profile.idNumber}</p>
              </div>
            )}

            {/* Date of Birth */}
            {selectedJobSeeker.profile?.dateOfBirth && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <p className="mt-1 text-gray-900">
                  {new Date(selectedJobSeeker.profile.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
            )}
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
              Are you sure you want to delete{' '}
              {selectedJobSeeker.profile?.firstName || selectedJobSeeker.firstName || 'Unknown'} {' '}
              {selectedJobSeeker.profile?.lastName || selectedJobSeeker.lastName || ''}?
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