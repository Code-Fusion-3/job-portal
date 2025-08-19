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
  Briefcase,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { useAdminJobSeekers } from '../../api/hooks/useJobSeekers.js';
import { useAuth } from '../../api/hooks/useAuth.js';
import { useAdminCategories } from '../../api/hooks/useCategories.js';
import { useApprovalManagement } from '../../api/hooks/useApprovalManagement.js';
import API_CONFIG from '../../api/config/apiConfig.js';
import defaultProfileImage from '../../assets/defaultProfileImage.jpeg';
import ProfileImage from '../../components/ui/ProfileImage';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import StatusBadge from '../../components/ui/StatusBadge';

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
  ],
  approvalStatus: [
    { value: '', label: 'All Approval Statuses' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
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
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  
  // Professional filter states
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [localFilters, setLocalFilters] = useState({
    experienceLevel: '',
    category: '',
    location: '',
    gender: '',
    approvalStatus: '' // Add approval status filter
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

  // Approval management hook
  const {
    pendingProfiles,
    approvedProfiles,
    rejectedProfiles,
    loading: approvalLoading,
    error: approvalError,
    approveProfile,
    rejectProfile,
    bulkApprove,
    bulkReject,
    fetchProfilesByStatus
  } = useApprovalManagement({
    autoFetch: false,
    itemsPerPage: 10
  });

  useEffect(() => {
    if (!user) {
      return;
    }
    
    if (user.role !== 'admin') {
      return;
    }
    
    fetchJobSeekers();
  }, [user, fetchJobSeekers]);

  // Fetch approval data when component mounts
  useEffect(() => {
    if (user && user.role === 'admin') {
      // Fetch profiles by status to populate the statistics
      const fetchApprovalData = async () => {
        try {
          await Promise.all([
            fetchProfilesByStatus('pending', 1),
            fetchProfilesByStatus('approved', 1),
            fetchProfilesByStatus('rejected', 1)
          ]);
        } catch (error) {
          console.error('Error fetching approval data:', error);
        }
      };
      
      fetchApprovalData();
    }
  }, [user, fetchProfilesByStatus]);

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
      gender: '',
      approvalStatus: ''
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

      // Approval status filter
      if (localFilters.approvalStatus) {
        const profileApprovalStatus = jobSeeker.profile?.approvalStatus || jobSeeker.approvalStatus || 'pending';
        if (profileApprovalStatus !== localFilters.approvalStatus) {
          return false;
        }
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

  // Handle manual refresh
  const handleManualRefresh = async () => {
    try {
      setSuccessMessage('Refreshing data...');
      setShowSuccess(true);
      
      // Refresh both job seekers and approval data
      await Promise.all([
        fetchJobSeekers(),
        fetchProfilesByStatus('pending', 1),
        fetchProfilesByStatus('approved', 1),
        fetchProfilesByStatus('rejected', 1)
      ]);
      
      setSuccessMessage('Data refreshed successfully!');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to refresh data');
      setShowError(true);
      console.error('Manual refresh error:', error);
    }
  };

  // Handle card filter clicks
  const handleCardFilter = (filterType) => {
    switch (filterType) {
      case 'total':
        // Show all profiles - clear approval status filter
        setLocalFilters(prev => ({ ...prev, approvalStatus: '' }));
        break;
      case 'pending':
        // Filter to show only pending profiles
        setLocalFilters(prev => ({ ...prev, approvalStatus: 'pending' }));
        break;
      case 'approved':
        // Filter to show only approved profiles
        setLocalFilters(prev => ({ ...prev, approvalStatus: 'approved' }));
        break;
      case 'rejected':
        // Filter to show only rejected profiles
        setLocalFilters(prev => ({ ...prev, approvalStatus: 'rejected' }));
        break;
      case 'clear':
        // Clear all filters
        clearAllLocalFilters();
        break;
      default:
        break;
    }
  };

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
      case 'approve':
        handleApprovalChange(jobSeeker.id, 'approved');
        setShowActionModal(false);
        break;
      case 'reject':
        // For rejection, we need to show a rejection reason modal
        setSelectedJobSeeker(jobSeeker);
        setShowRejectionModal(true);
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
  const handleAddJobSeeker = async (jobSeekerData, photoFile = null) => {
    try {
      const result = await createJobSeeker(jobSeekerData, photoFile);
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
  const handleUpdateJobSeeker = async (jobSeekerData, photoFile = null) => {
    if (!selectedJobSeeker) return;
    
    try {
      const result = await updateJobSeeker(selectedJobSeeker.id, jobSeekerData, photoFile);
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

  // Handle approval changes
  const handleApprovalChange = async (profileId, newStatus, reason = null) => {
    try {
      let result;
      
      if (newStatus === 'approved') {
        result = await approveProfile(profileId);
      } else if (newStatus === 'rejected') {
        if (!reason) {
          setErrorMessage('Rejection reason is required');
          setShowError(true);
          return;
        }
        result = await rejectProfile(profileId, reason);
      }
      
      if (result && result.success) {
        setSuccessMessage(result.message || `Profile ${newStatus} successfully - refreshing data...`);
        setShowSuccess(true);
        
        try {
          // Refresh the job seekers list to show updated status
          await fetchJobSeekers();
          
          // Refresh approval data to update statistics
          await Promise.all([
            fetchProfilesByStatus('pending', 1),
            fetchProfilesByStatus('approved', 1),
            fetchProfilesByStatus('rejected', 1)
          ]);
          
          // Update success message to indicate refresh completed
          setSuccessMessage(result.message || `Profile ${newStatus} successfully - data refreshed!`);
          
          // Clear selected job seeker to close any open modals
          setSelectedJobSeeker(null);
        } catch (refreshError) {
          console.error('Error refreshing data after approval change:', refreshError);
          setErrorMessage('Action completed but failed to refresh data. Please refresh the page manually.');
          setShowError(true);
        }
      } else if (result) {
        setErrorMessage(result.error || `Failed to ${newStatus} profile`);
        setShowError(true);
      }
    } catch (error) {
      setErrorMessage(`Failed to ${newStatus} profile`);
      setShowError(true);
      console.error(`Approval change error:`, error);
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
      label: 'joobseekr details',
      render: (jobSeeker) => {
        if (!jobSeeker) return <div className="text-gray-500">No data</div>;
        
        // Properly access nested profile data
        const firstName = jobSeeker.profile?.firstName || jobSeeker.firstName || 'Unknown';
        const lastName = jobSeeker.profile?.lastName || jobSeeker.lastName || '';
        const email = jobSeeker.email || 'No email';
  const contactNumber = jobSeeker.profile?.contactNumber || jobSeeker.contactNumber || 'No phone';
  const gender = jobSeeker.profile?.gender || jobSeeker.gender || 'Not specified';
        
        // Resolve photo URL: backend stores relative path like "uploads/profiles/..."
        const photoPath = jobSeeker.profile?.photo || jobSeeker.photo || null;
        const resolvePhotoUrl = (path) => {
          if (!path) return null;
          if (/^https?:\/\//i.test(path)) return path;
          return `${API_CONFIG.BASE_URL}/${path.replace(/^\//, '')}`;
        };

        const photoUrl = resolvePhotoUrl(photoPath);
        const getInitials = (f, l) => {
          const a = (f || '').trim();
          const b = (l || '').trim();
          const first = a ? a.charAt(0).toUpperCase() : '';
          const last = b ? b.charAt(0).toUpperCase() : '';
          return `${first}${last}` || ((a || b) ? (a || b).charAt(0).toUpperCase() : '');
        };

        return (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={`${firstName} ${lastName}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = defaultProfileImage; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-sm font-semibold text-white">
                  {getInitials(firstName, lastName)}
                </div>
              )}
            </div>
            <div>
              <div className="font-medium">
                {firstName} {lastName}
              </div>
              <div className="text-sm text-gray-500">{contactNumber} {gender ? <>• {gender}</> : null}</div>
              <div className="text-lg text-gray-400">{email}</div>
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
      key: 'approvalStatus',
      label: 'Approval Status',
      render: (jobSeeker) => {
        if (!jobSeeker) return <div className="text-gray-500">No data</div>;
        
        // Get approval status from the profile or user object
        const approvalStatus = jobSeeker.profile?.approvalStatus || jobSeeker.approvalStatus || 'pending';
        
        return (
          <StatusBadge status={approvalStatus} size="sm" />
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
    // Debug logging removed for production
  }

  return (
    <div className="space-y-6">
      {selectedJobSeeker && (
        // Avatar
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {(function(){
              const photoPath = selectedJobSeeker?.profile?.photo || selectedJobSeeker?.photo || null;
              const photoUrl = photoPath && (/^https?:\/\//i.test(photoPath) ? photoPath : `${API_CONFIG.BASE_URL}/${photoPath.replace(/^\//, '')}`);
              if (photoUrl) {
                return (
                  <img
                    src={photoUrl}
                    alt={`${selectedJobSeeker?.profile?.firstName || ''} ${selectedJobSeeker?.profile?.lastName || ''}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = defaultProfileImage; }}
                  />
                );
              }

              const initials = ((selectedJobSeeker?.profile?.firstName || selectedJobSeeker?.firstName || '').charAt(0) || '') + ((selectedJobSeeker?.profile?.lastName || selectedJobSeeker?.lastName || '').charAt(0) || '');
              return (
                <div className="w-full h-full flex items-center justify-center bg-gray-400 text-2xl font-semibold text-white">
                  {initials.toUpperCase() || 'U'}
                </div>
              );
            })()}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{selectedJobSeeker?.profile?.firstName || selectedJobSeeker?.firstName || 'Unknown'} {selectedJobSeeker?.profile?.lastName || selectedJobSeeker?.lastName || ''}</h3>
            <p className="text-sm text-gray-500">{selectedJobSeeker?.email || 'Not provided'}</p>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Seekers Management</h1>
          <p className="text-gray-600">
            Manage all registered job seekers ({totalItems} total)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleManualRefresh}
            variant="outline"
            disabled={loading || approvalLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${(loading || approvalLoading) ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Job Seeker
        </Button>
        </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Total Job Seekers Card - Click to show all profiles */}
        <Card 
          className={`p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 ${
            !localFilters.approvalStatus 
              ? 'border-blue-400 bg-blue-50 shadow-lg' 
              : 'hover:border-blue-300'
          }`}
          onClick={() => handleCardFilter('total')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Job Seekers</p>
              <p className="text-2xl font-bold text-gray-900">{jobSeekers.length}</p>
              <p className="text-xs text-gray-500">
                {localFilters.approvalStatus ? `${filteredData.length} currently showing` : 'All profiles visible'}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-600 font-medium">
            {!localFilters.approvalStatus ? '✓ Showing all profiles' : 'Click to show all profiles'}
          </div>
        </Card>

        {/* Pending Review Card - Click to filter pending profiles */}
        <Card 
          className={`p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 ${
            localFilters.approvalStatus === 'pending' 
              ? 'border-yellow-400 bg-yellow-50' 
              : 'hover:border-yellow-300'
          }`}
          onClick={() => handleCardFilter('pending')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{pendingProfiles.length}</p>
              <p className="text-xs text-gray-500">
                {localFilters.approvalStatus === 'pending' ? `${filteredData.length} currently showing` : 'Click to filter pending profiles'}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-yellow-600 font-medium">
            {localFilters.approvalStatus === 'pending' ? '✓ Active filter' : 'Click to filter pending'}
          </div>
        </Card>

        {/* Approved Card - Click to filter approved profiles */}
        <Card 
          className={`p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 ${
            localFilters.approvalStatus === 'approved' 
              ? 'border-green-400 bg-green-50' 
              : 'hover:border-green-300'
          }`}
          onClick={() => handleCardFilter('approved')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{approvedProfiles.length}</p>
              <p className="text-xs text-gray-500">
                {localFilters.approvalStatus === 'approved' ? `${filteredData.length} currently showing` : 'Click to filter approved profiles'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-green-600 font-medium">
            {localFilters.approvalStatus === 'approved' ? '✓ Active filter' : 'Click to filter approved'}
          </div>
        </Card>

        {/* Rejected Card - Click to filter rejected profiles */}
        <Card 
          className={`p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 ${
            localFilters.approvalStatus === 'rejected' 
              ? 'border-red-400 bg-red-50' 
              : 'hover:border-red-300'
          }`}
          onClick={() => handleCardFilter('rejected')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{rejectedProfiles.length}</p>
              <p className="text-xs text-gray-500">
                {localFilters.approvalStatus === 'rejected' ? `${filteredData.length} currently showing` : 'Click to filter rejected profiles'}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-red-600 font-medium">
            {localFilters.approvalStatus === 'rejected' ? '✓ Active filter' : 'Click to filter rejected'}
          </div>
        </Card>

        {/* Active Filters Card - Click to clear all filters */}
        <Card 
          className={`p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 ${
            activeFiltersCount > 0 
              ? 'border-purple-400 bg-purple-50' 
              : 'hover:border-purple-300'
          }`}
          onClick={() => handleCardFilter('clear')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Filters</p>
              <p className="text-2xl font-bold text-gray-900">{activeFiltersCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Filter className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-purple-600 font-medium">
            {activeFiltersCount > 0 ? 'Click to clear all filters' : 'No active filters'}
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

              {/* Approval Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Approval Status</label>
                <select
                  value={localFilters.approvalStatus}
                  onChange={(e) => handleLocalFilterChange('approvalStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {filterOptions.approvalStatus.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
              ,
              // include resolved photo URL so the edit form can show existing image preview
              photo: (() => {
                const photoPath = selectedJobSeeker?.profile?.photo || selectedJobSeeker?.photo || null;
                return photoPath ? (/^https?:\/\//i.test(photoPath) ? photoPath : `${API_CONFIG.BASE_URL}/${photoPath.replace(/^\//, '')}`) : null;
              })()
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

            {/* Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Photo</label>
              <div className="mt-2">
                {(function(){
                  const photoPath = selectedJobSeeker?.profile?.photo || selectedJobSeeker?.photo || null;
                  const photoUrl = photoPath ? (/^https?:\/\//i.test(photoPath) ? photoPath : `${API_CONFIG.BASE_URL}/${photoPath.replace(/^\//, '')}`) : defaultProfileImage;
                  return (
                    <ProfileImage
                      src={photoUrl}
                      alt={`${selectedJobSeeker?.profile?.firstName || ''} ${selectedJobSeeker?.profile?.lastName || ''}`}
                      size="xl"
                      variant="rounded"
                      isPrivate={false}
                    />
                  );
                })()}
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
                    `${selectedJobSeeker.profile.monthlyRate} frw` : 
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
            
            {/* Approval Actions - Only show if profile is not already approved */}
            {selectedJobSeeker && (selectedJobSeeker.profile?.approvalStatus || selectedJobSeeker.approvalStatus) !== 'approved' && (
              <button
                onClick={() => handleRowAction('approve', selectedJobSeeker)}
                className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-green-50 transition-colors duration-200"
              >
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-900">Approve Profile</span>
              </button>
            )}
            
            {/* Reject Action - Show for pending and approved profiles */}
            {selectedJobSeeker && (selectedJobSeeker.profile?.approvalStatus || selectedJobSeeker.approvalStatus) !== 'rejected' && (
              <button
                onClick={() => handleRowAction('reject', selectedJobSeeker)}
                className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-red-50 transition-colors duration-200"
              >
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-gray-900">Reject Profile</span>
              </button>
            )}
            
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

      {/* Rejection Reason Modal */}
      {showRejectionModal && selectedJobSeeker && (
        <Modal
          isOpen={showRejectionModal}
          onClose={() => setShowRejectionModal(false)}
          title={`Reject Profile - ${selectedJobSeeker.profile?.firstName || selectedJobSeeker.firstName || 'Unknown'} ${selectedJobSeeker.profile?.lastName || selectedJobSeeker.lastName || ''}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Please provide a reason for rejecting this profile. This will help the job seeker understand why their profile was not approved.
            </p>
            <textarea
              placeholder="Enter rejection reason (minimum 10 characters)..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              rows={4}
              minLength={10}
              maxLength={500}
              id="rejectionReason"
            />
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowRejectionModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  const reason = document.getElementById('rejectionReason').value.trim();
                  if (reason.length >= 10) {
                    handleApprovalChange(selectedJobSeeker.id, 'rejected', reason);
                    setShowRejectionModal(false);
                  } else {
                    alert('Please provide a rejection reason (minimum 10 characters)');
                  }
                }}
              >
                Reject Profile
              </Button>
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