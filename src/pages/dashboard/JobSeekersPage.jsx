import React, { useState, useEffect, useMemo } from 'react';
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
  CheckCircle,
  Briefcase
} from 'lucide-react';
import { useAdminJobSeekers } from '../../api/hooks/useJobSeekers.js';
import { useAuth } from '../../api/hooks/useAuth.js';
import { useAdminCategories } from '../../api/hooks/useCategories.js';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import DataTable from '../../components/ui/DataTable';
import SearchFilter from '../../components/ui/SearchFilter';
import AddJobSeekerForm from '../../components/forms/AddJobSeekerForm';

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

// Filter options for professional filtering
const filterOptions = {
  experienceLevel: [
    { value: '', label: 'All Experience Levels' },
    ...experienceLevels
  ],
  category: [
    { value: '', label: 'All Categories' }
    // Will be populated dynamically from jobCategories
  ],
  location: [
    { value: '', label: 'All Locations' },
    { value: 'kigali', label: 'Kigali' },
    { value: 'butare', label: 'Butare' },
    { value: 'gisenyi', label: 'Gisenyi' },
    { value: 'ruhengeri', label: 'Ruhengeri' },
    { value: 'kibuye', label: 'Kibuye' },
    { value: 'cyangugu', label: 'Cyangugu' },
    { value: 'kibungo', label: 'Kibungo' },
    { value: 'rwamagana', label: 'Rwamagana' }
  ],
  gender: [
    { value: '', label: 'All Genders' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ]
};

const JobSeekersPage = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  // State management
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedJobSeeker, setSelectedJobSeeker] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  
  // Professional filter states
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [localFilters, setLocalFilters] = useState({
    experienceLevel: '',
    category: '',
    location: '',
    gender: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Use the categories hook for dynamic job categories
  const { categories: jobCategories, loading: loadingCategories, error: categoriesError } = useAdminCategories();
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  // Categories are automatically loaded by the useAdminCategories hook

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

  // Professional filter handlers
  const handleLocalSearchChange = (value) => {
    setLocalSearchTerm(value);
    setIsSearching(true);
    // Debounce search
    setTimeout(() => setIsSearching(false), 300);
  };

  const handleLocalFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllLocalFilters = () => {
    setLocalFilters({
      experienceLevel: '',
      category: '',
      location: '',
      gender: ''
    });
    setLocalSearchTerm('');
  };

  // Filtered data using local filters
  const filteredData = useMemo(() => {
    if (!jobSeekers || jobSeekers.length === 0) return [];

    return jobSeekers.filter(jobSeeker => {
      // Search term filter
      if (localSearchTerm) {
        const searchLower = localSearchTerm.toLowerCase();
        const name = `${jobSeeker.profile?.firstName || jobSeeker.firstName || ''} ${jobSeeker.profile?.lastName || jobSeeker.lastName || ''}`.toLowerCase();
        const email = (jobSeeker.email || '').toLowerCase();
        const skills = (jobSeeker.profile?.skills || jobSeeker.skills || '').toLowerCase();
        const location = (jobSeeker.profile?.location || jobSeeker.location || '').toLowerCase();
        
        if (!name.includes(searchLower) && !email.includes(searchLower) && 
            !skills.includes(searchLower) && !location.includes(searchLower)) {
          return false;
        }
      }

      // Experience level filter
      if (localFilters.experienceLevel && jobSeeker.profile?.experienceLevel !== localFilters.experienceLevel) {
        return false;
      }

      // Category filter
      if (localFilters.category && jobSeeker.profile?.jobCategory?.name_en?.toLowerCase() !== localFilters.category.toLowerCase()) {
        return false;
      }

      // Location filter
      if (localFilters.location && (jobSeeker.profile?.location || jobSeeker.location || '').toLowerCase() !== localFilters.location.toLowerCase()) {
        return false;
      }

      // Gender filter
      if (localFilters.gender && jobSeeker.profile?.gender !== localFilters.gender) {
        return false;
      }

      return true;
    });
  }, [jobSeekers, localSearchTerm, localFilters]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (localSearchTerm) count++;
    Object.values(localFilters).forEach(value => {
      if (value) count++;
    });
    return count;
  }, [localSearchTerm, localFilters]);

  // Update category filter options when jobCategories change
  useEffect(() => {
    if (jobCategories && jobCategories.length > 0) {
      const categoryOptions = [
        { value: '', label: 'All Categories' },
        ...jobCategories.map(cat => ({
          value: cat.name_en.toLowerCase(),
          label: cat.name_en
        }))
      ];
      // Update the filterOptions.category dynamically
      filterOptions.category = categoryOptions;
    }
  }, [jobCategories]);

  // Handle row actions
  const handleRowAction = (action, jobSeeker) => {
    switch (action) {
      case 'openActions':
        setSelectedJobSeeker(jobSeeker);
        setShowActionModal(true);
        break;
      case 'view':
        setSelectedJobSeeker(jobSeeker);
        setShowDetailsModal(true);
        setShowActionModal(false);
        break;
      case 'edit':
        setSelectedJobSeeker(jobSeeker);
        setShowEditModal(true);
        setShowActionModal(false);
        break;
      case 'delete':
        setSelectedJobSeeker(jobSeeker);
        setShowDeleteModal(true);
        setShowActionModal(false);
        break;
      default:
        break;
    }
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

  // Action buttons for DataTable
  const getActionButtons = (jobSeeker) => [
    {
      key: 'openActions',
      title: 'Actions',
      icon: MoreHorizontal,
      className: 'text-gray-600 hover:bg-gray-50'
    }
  ];

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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Job Seekers</p>
              <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Filters</p>
              <p className="text-2xl font-bold text-gray-900">{activeFiltersCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Filter className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{jobCategories?.length || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Search Results</p>
              <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email, skills, or location..."
                value={localSearchTerm}
                onChange={(e) => handleLocalSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
            
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
            
            {activeFiltersCount > 0 && (
              <Button
                onClick={clearAllLocalFilters}
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Filter Controls */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              {/* Experience Level Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select
                  value={localFilters.experienceLevel}
                  onChange={(e) => handleLocalFilterChange('experienceLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {filterOptions.experienceLevel.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={localFilters.category}
                  onChange={(e) => handleLocalFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loadingCategories}
                >
                  {loadingCategories ? (
                    <option>Loading categories...</option>
                  ) : (
                    filterOptions.category.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={localFilters.location}
                  onChange={(e) => handleLocalFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {filterOptions.location.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={localFilters.gender}
                  onChange={(e) => handleLocalFilterChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {filterOptions.gender.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Debug Info (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-1">
                <div>Debug: Total: {jobSeekers.length} | Filtered: {filteredData.length} | Active Filters: {activeFiltersCount}</div>
                <div>Search: "{localSearchTerm}" | Filters: {JSON.stringify(localFilters)}</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* No Results State */}
      {filteredData.length === 0 && (localSearchTerm || Object.values(localFilters).some(v => v)) && (
        <Card className="p-8 text-center">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or filters to find more job seekers.
          </p>
          <Button onClick={clearAllLocalFilters} variant="outline">
            Clear All Filters
          </Button>
        </Card>
      )}

      {/* Job Seekers Table */}
      <Card>
        <DataTable
          data={filteredData}
          columns={columns}
          loading={loading}
          emptyMessage="No job seekers found"
          actionButtons={getActionButtons}
          onRowAction={handleRowAction}
          pagination={true}
          itemsPerPage={15}
          searchTerm={localSearchTerm}
          onSearchChange={handleLocalSearchChange}
          showSearch={false}
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

      {/* Action Modal */}
      {showActionModal && selectedJobSeeker && (
        <Modal
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
          title={`Actions for ${selectedJobSeeker.profile?.firstName || selectedJobSeeker.firstName || 'Unknown'} ${selectedJobSeeker.profile?.lastName || selectedJobSeeker.lastName || ''}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-3">
            <button
              onClick={() => handleRowAction('view', selectedJobSeeker)}
              className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              <Eye className="w-5 h-5 text-blue-600" />
              <span className="text-gray-900">View Details</span>
            </button>
            
            <button
              onClick={() => handleRowAction('edit', selectedJobSeeker)}
              className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-green-50 transition-colors duration-200"
            >
              <Edit className="w-5 h-5 text-green-600" />
              <span className="text-gray-900">Edit Job Seeker</span>
            </button>
            
            <button
              onClick={() => handleRowAction('delete', selectedJobSeeker)}
              className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-red-50 transition-colors duration-200"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
              <span className="text-gray-900">Delete Job Seeker</span>
            </button>
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