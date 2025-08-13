import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Star, 
  Users, 
  Eye,
  Briefcase,
  Calendar,
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react';
import { jobSeekerService } from '../api/index.js';
import { usePublicCategories } from '../api/hooks/useCategories.js';
import { usePublicJobSeekers } from '../api/hooks/useJobSeekers.js';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProfileImage from '../components/ui/ProfileImage';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import jobseekerBackground from '../assets/jobseekerBackground.png';
import { filterJobSeekers, sortJobSeekers, maskName, formatExperienceDisplay } from '../utils/helpers';
import useDebounce from '../hooks/useDebounce';
import { useNavigate } from 'react-router-dom';

// Professional filter options from JobSeekersPage.jsx
const filterOptions = {
  experienceLevel: [
    { value: '', label: 'All Experience Levels' },
    { value: 'no_experience', label: 'No Experience (0 years)' },
    { value: 'beginner', label: 'Beginner (1-2 years)' },
    { value: 'intermediate', label: 'Intermediate (3-5 years)' },
    { value: 'experienced', label: 'Experienced (6-10 years)' },
    { value: 'expert', label: 'Expert (10+ years)' }
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
  sortBy: [
    'Most Recent',
    'Highest Rated',
    'Most Experienced',
    'Name A-Z',
    'Lowest Rate',
    'Highest Rate'
  ]
};

const JobSeekers = () => {
  const { t } = useTranslation();
  const [jobSeekers, setJobSeekers] = useState([]);
  const [filteredSeekers, setFilteredSeekers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Use the public categories hook for dynamic job categories
  const { categories: jobCategories, loading: loadingCategories, error: categoriesError } = usePublicCategories();

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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
    } else if (categoriesError) {
      // Fallback to static categories if API fails
      filterOptions.category = [
        { value: '', label: 'All Categories' },
        { value: 'domestic', label: 'Domestic' },
        { value: 'care', label: 'Care' },
        { value: 'maintenance', label: 'Maintenance' },
        { value: 'food', label: 'Food' },
        { value: 'transport', label: 'Transport' },
        { value: 'sales', label: 'Sales' }
      ];
    }
    
    // Debug: Log current filter options
    console.log('🔍 Current Filter Options:', {
      experienceLevel: filterOptions.experienceLevel,
      category: filterOptions.category,
      location: filterOptions.location,
      gender: filterOptions.gender
    });
  }, [jobCategories, categoriesError]);

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedLocation) count++;
    if (selectedCategory) count++;
    if (selectedExperienceLevel) count++;
    if (selectedGender) count++;
    return count;
  };

  // Use the public job seekers hook
  const { 
    jobSeekers: publicJobSeekers, 
    loading: jobSeekersLoading, 
    error: jobSeekersError 
  } = usePublicJobSeekers({ 
    autoFetch: true, 
    itemsPerPage: 50 
  });

  // Update local state when public data changes
  useEffect(() => {
    if (publicJobSeekers && publicJobSeekers.length > 0) {
      setJobSeekers(publicJobSeekers);
      setFilteredSeekers(publicJobSeekers);
    } else if (jobSeekersError) {
      // Set empty arrays if there's an error
      setJobSeekers([]);
      setFilteredSeekers([]);
    } else if (!publicJobSeekers || publicJobSeekers.length === 0) {
      // If no data from API, use sample data for testing
      const sampleData = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          location: 'kigali',
          city: 'Kigali',
          gender: 'Male',
          experienceLevel: 'intermediate',
          skills: 'House Cleaning, Laundry, Cooking',
          experience: '3 years in domestic services',
          jobCategory: { name_en: 'Domestic' },
          createdAt: new Date('2024-01-15')
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          location: 'butare',
          city: 'Butare',
          gender: 'Female',
          experienceLevel: 'experienced',
          skills: 'Childcare, Elderly Care, First Aid',
          experience: '7 years in care services',
          jobCategory: { name_en: 'Care' },
          createdAt: new Date('2024-01-10')
        },
        {
          id: 3,
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike.johnson@example.com',
          location: 'gisenyi',
          city: 'Gisenyi',
          gender: 'Male',
          experienceLevel: 'beginner',
          skills: 'Gardening, Basic Repairs',
          experience: '1 year in maintenance',
          jobCategory: { name_en: 'Maintenance' },
          createdAt: new Date('2024-01-20')
        }
      ];
      setJobSeekers(sampleData);
      setFilteredSeekers(sampleData);
    }
  }, [publicJobSeekers, jobSeekersError]);

  // Apply filters and search
  useEffect(() => {
    if (!jobSeekers || jobSeekers.length === 0) {
      setFilteredSeekers([]);
      return;
    }

    console.log('🔍 Applying filters:', {
      searchTerm,
      selectedExperienceLevel,
      selectedCategory,
      selectedLocation,
      selectedGender,
      sortBy,
      totalJobSeekers: jobSeekers.length
    });


    let filtered = jobSeekers.filter(seeker => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        // Try different possible name field structures
        const firstName = seeker.firstName || seeker.profile?.firstName || seeker.user?.firstName || '';
        const lastName = seeker.lastName || seeker.profile?.lastName || seeker.user?.lastName || '';
        const name = `${firstName} ${lastName}`.toLowerCase();
        
        // Try different possible skills field structures
        const skills = (seeker.skills || seeker.profile?.skills || seeker.user?.skills || '').toLowerCase();
        
        // Try different possible location field structures
        const location = (seeker.location || seeker.profile?.location || seeker.city || '').toLowerCase();
        
        if (!name.includes(searchLower) && !skills.includes(searchLower) && !location.includes(searchLower)) {
          return false;
        }
      }

      // Experience level filter
      if (selectedExperienceLevel) {
        const seekerExperienceLevel = seeker.experienceLevel || seeker.profile?.experienceLevel || seeker.user?.experienceLevel;
        console.log('🔍 Experience Filter Debug:', {
          seeker: `${seeker.firstName} ${seeker.lastName}`,
          seekerExperienceLevel,
          selectedExperienceLevel,
          matches: seekerExperienceLevel === selectedExperienceLevel
        });
        if (seekerExperienceLevel !== selectedExperienceLevel) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory) {
        const seekerCategory = seeker.jobCategory?.name_en || 
                              seeker.profile?.jobCategory?.name_en || 
                              seeker.user?.jobCategory?.name_en ||
                              seeker.category;
        if (seekerCategory?.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Location filter
      if (selectedLocation) {
        const seekerLocation = seeker.location || seeker.profile?.location || seeker.city || '';
        if (seekerLocation.toLowerCase() !== selectedLocation.toLowerCase()) {
          return false;
        }
      }

      // Gender filter
      if (selectedGender) {
        const seekerGender = seeker.gender || seeker.profile?.gender || seeker.user?.gender;
        if (seekerGender !== selectedGender) {
          return false;
        }
      }

      return true;
    });

    // Apply sorting
    if (sortBy === 'Most Recent') {
      filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'Name A-Z') {
      filtered.sort((a, b) => {
        const aFirstName = a.firstName || a.profile?.firstName || a.user?.firstName || '';
        const aLastName = a.lastName || a.profile?.lastName || a.user?.lastName || '';
        const bFirstName = b.firstName || b.profile?.firstName || b.user?.firstName || '';
        const bLastName = b.lastName || b.profile?.lastName || b.user?.lastName || '';
        return (aFirstName + ' ' + aLastName).localeCompare(bFirstName + ' ' + bLastName);
      });
    } else if (sortBy === 'Most Experienced') {
      filtered.sort((a, b) => {
        const getExperienceValue = (level) => {
          switch(level) {
            case 'expert': return 5;
            case 'experienced': return 4;
            case 'intermediate': return 3;
            case 'beginner': return 2;
            case 'no_experience': return 1;
            default: return 0;
          }
        };
        const aLevel = a.experienceLevel || a.profile?.experienceLevel || a.user?.experienceLevel;
        const bLevel = b.experienceLevel || b.profile?.experienceLevel || b.user?.experienceLevel;
        return getExperienceValue(bLevel) - getExperienceValue(aLevel);
      });
    }

    console.log('🔍 Filtered results:', filtered.length);
    setFilteredSeekers(filtered);
  }, [jobSeekers, searchTerm, selectedExperienceLevel, selectedCategory, selectedLocation, selectedGender, sortBy]);



  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedCategory('');
    setSelectedExperienceLevel('');
    setSelectedGender('');
    setSortBy('Most Recent');
  };

  const handleViewProfile = (seeker) => {
    navigate(`/view-profile/${seeker.id}`);
  };

  const handleFavorite = (seekerId) => {
    // Implement favorite functionality
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (jobSeekersLoading) {
    return (
      <div className="min-h-screen relative">
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${jobseekerBackground})` }}
        />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-white/80">Loading job seekers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (jobSeekersError) {
    return (
      <div className="min-h-screen relative">
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${jobseekerBackground})` }}
        />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 font-medium">Error Loading Job Seekers</span>
              </div>
              <p className="text-red-600 mb-4">{jobSeekersError}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${jobseekerBackground})` }}
      />
      
      <Header />
      
      {/* Page Header */}
      <div className="relative z-10 mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              {t('jobSeekers.pageTitle', 'All Job Seekers')}
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              {t('jobSeekers.pageSubtitle', 'Discover reliable workers for domestic, care, maintenance, and other essential services')}
            </p>
          </motion.div>
        </div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-8"
        >
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t('jobSeekers.searchPlaceholder', 'Search by name, title, or skills...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 text-gray-900 placeholder-gray-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
              </Button>
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="flex items-center gap-2"
              >
                {viewMode === 'grid' ? <Briefcase className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                {viewMode === 'grid' ? 'List' : 'Grid'}
              </Button>
              {getActiveFiltersCount() > 0 && (
              <Button
                variant="outline"
                onClick={clearFilters}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <Eye className="w-4 h-4" />
                  Clear All
              </Button>
              )}
            </div>
          </div>

          {/* Professional Filters */}
          {showFilters && (
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Experience Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('jobSeekers.filters.experienceLevel', 'Experience Level')}
                  </label>
                  <select
                    value={selectedExperienceLevel}
                    onChange={(e) => setSelectedExperienceLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('jobSeekers.filters.category', 'Category')}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                    disabled={loadingCategories}
                  >
                    {loadingCategories ? (
                      <option>Loading categories...</option>
                    ) : categoriesError ? (
                      <option>Error loading categories</option>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('jobSeekers.filters.location', 'Location')}
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('jobSeekers.filters.gender', 'Gender')}
                  </label>
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  >
                    {filterOptions.gender.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('jobSeekers.filters.sortBy', 'Sort By')}
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  >
                    {filterOptions.sortBy.map(sort => (
                      <option key={sort} value={sort}>{sort}</option>
                    ))}
                  </select>
                </div>
                  </div>
                </div>

          )}
        </motion.div>

        {/* Fallback Categories Warning */}
        {categoriesError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-700 font-medium">Using fallback categories</span>
            </div>
            <p className="text-yellow-600 text-sm mt-1">
              Unable to load categories from server. Using default categories for filtering.
            </p>
          </motion.div>
        )}

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 mb-6">
            <div className="text-xs text-gray-500 space-y-1">
              <div>Debug: Total: {jobSeekers.length} | Filtered: {filteredSeekers.length} | Active Filters: {getActiveFiltersCount()}</div>
              <div>Search: "{searchTerm}" | Filters: {JSON.stringify({ selectedLocation, selectedCategory, selectedExperienceLevel, selectedGender })}</div>
              <div>Categories: {jobCategories?.length || 0} | Categories Loading: {loadingCategories} | Categories Error: {categoriesError || 'None'}</div>
              <div>Job Seekers Loading: {jobSeekersLoading} | Job Seekers Error: {jobSeekersError || 'None'}</div>
              <div className="pt-2 space-y-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    console.log('🔍 Current Job Seekers:', jobSeekers);
                    console.log('🔍 Current Filters:', { searchTerm, selectedLocation, selectedCategory, selectedExperienceLevel, selectedGender, sortBy });
                  }}
                >
                  Log Data to Console
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    console.log('🔍 Testing Experience Filter:');
                    jobSeekers.forEach(seeker => {
                      const exp = seeker.experienceLevel || seeker.profile?.experienceLevel || seeker.user?.experienceLevel;
                      console.log(`${seeker.firstName} ${seeker.lastName}: experienceLevel = "${exp}"`);
                    });
                  }}
                >
                  Test Experience Filter
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    console.log('🔍 Testing Experience Filter Logic:');
                    setSelectedExperienceLevel('intermediate');
                    console.log('Set experience level to "intermediate"');
                  }}
                >
                  Test: Set Intermediate
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Total Job Seekers</p>
            <p className="text-2xl font-bold text-gray-900">{jobSeekers.length}</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Search Results</p>
            <p className="text-2xl font-bold text-gray-900">{filteredSeekers.length}</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Filter className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Active Filters</p>
            <p className="text-2xl font-bold text-gray-900">{getActiveFiltersCount()}</p>
          </div>
        </motion.div>

        {/* No Results State */}
        {filteredSeekers.length === 0 && getActiveFiltersCount() > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8 mb-8 text-center"
          >
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters to find more job seekers.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </motion.div>
        )}

        {/* No Job Seekers Available */}
        {filteredSeekers.length === 0 && getActiveFiltersCount() === 0 && jobSeekers.length === 0 && !jobSeekersLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8 mb-8 text-center"
          >
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No job seekers available</h3>
            <p className="text-gray-600 mb-4">
              There are currently no job seekers registered in the system.
            </p>
          </motion.div>
        )}

        {/* Job Seekers Grid/List */}
        {filteredSeekers.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
            }
          >
            {filteredSeekers.map((seeker, index) => {
      
              return (
                <motion.div
                  key={seeker.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="h-[380px] bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden group">
                    <div className="h-full flex flex-col">
                      {/* Header Section */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start justify-between mb-4">
                                                     <div className="flex items-center">
                             <div className="mr-4">
                               <ProfileImage 
                                 size="lg"
                                 variant="rounded"
                                 showBorder={true}
                                 borderColor="border-blue-200"
                                 showShadow={true}
                               />
                             </div>
                            <div className="flex-1">
                                                         <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                              {maskName(seeker.firstName || seeker.profile?.firstName || seeker.user?.firstName || 'Unknown')} {maskName(seeker.lastName || seeker.profile?.lastName || seeker.user?.lastName || '')}
                           </h3>
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                                   {seeker.jobCategory?.name_en || seeker.profile?.jobCategory?.name_en || seeker.user?.jobCategory?.name_en || seeker.category || 'No Category'}
                                </span>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                                                     <button
                             onClick={() => handleViewProfile(seeker)}
                             className="px-3 py-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium"
                           >
                             <Eye className="w-4 h-4" />
                             View Profile
                           </button>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="px-6 flex-1 space-y-4">
                                                 {(seeker.location || seeker.profile?.location || seeker.city) && (
                          <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                             <span className="font-medium">
                               {seeker.location || seeker.profile?.location || seeker.city}
                               {seeker.city && seeker.city !== (seeker.location || seeker.profile?.location) && `, ${seeker.city}`}
                             </span>
                          </div>
                        )}

                                                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
                           <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1 block">Experience</span>
                           <p className="text-sm text-gray-700 font-medium">
                             {formatExperienceDisplay(seeker.experience || seeker.profile?.experience || seeker.user?.experience || 'Not specified')}
                           </p>
                         </div>

                         {(seeker.skills || seeker.profile?.skills || seeker.user?.skills) && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-1.5">
                               {(seeker.skills || seeker.profile?.skills || seeker.user?.skills || '')
                                 .split(',')
                                 .slice(0, 4)
                                 .map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                                  {skill.trim()}
                                </span>
                              ))}
                               {(seeker.skills || seeker.profile?.skills || seeker.user?.skills || '')
                                 .split(',').length > 4 && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
                                     +{(seeker.skills || seeker.profile?.skills || seeker.user?.skills || '').split(',').length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white/60" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {t('jobSeekers.noResults.title', 'No job seekers found')}
              </h3>
              <p className="text-white/70 mb-4">
                {t('jobSeekers.noResults.message', 'Try adjusting your search criteria or filters')}
              </p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center gap-2 mx-auto"
              >
                <Eye className="w-4 h-4" />
                {t('jobSeekers.noResults.clearFilters', 'Clear All Filters')}
              </Button>
            </div>
          </motion.div>
        )}
      </main>
      
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default JobSeekers; 