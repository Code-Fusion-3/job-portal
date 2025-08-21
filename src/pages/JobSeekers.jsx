import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  MapPin, 
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

const JobSeekers = () => {
  const { t } = useTranslation();
  
  // Professional filter options - moved inside component where t function is available
  const filterOptions = {
    experienceLevel: [
      { value: '', label: t('jobSeekers.filters.allExperienceLevels', 'All Experience Levels') },
      { value: 'no_experience', label: t('jobSeekers.filters.noExperience', 'No Experience (0 years)') },
      { value: 'beginner', label: t('jobSeekers.filters.beginner', 'Beginner (1-2 years)') },
      { value: 'intermediate', label: t('jobSeekers.filters.intermediate', 'Intermediate (3-5 years)') },
      { value: 'experienced', label: t('jobSeekers.filters.experienced', 'Experienced (6-10 years)') },
      { value: 'expert', label: t('jobSeekers.filters.expert', 'Expert (10+ years)') }
    ],
    category: [
      { value: '', label: t('jobSeekers.filters.allCategories', 'All Categories') }
      // Will be populated dynamically from jobCategories
    ],
    location: [
      { value: '', label: t('jobSeekers.filters.allLocations', 'All Locations') },
      { value: 'kigali', label: t('jobSeekers.filters.kigali', 'Kigali') },
      { value: 'butare', label: t('jobSeekers.filters.butare', 'Butare') },
      { value: 'gisenyi', label: t('jobSeekers.filters.gisenyi', 'Gisenyi') },
      { value: 'ruhengeri', label: t('jobSeekers.filters.ruhengeri', 'Ruhengeri') },
      { value: 'kibuye', label: t('jobSeekers.filters.kibuye', 'Kibuye') },
      { value: 'cyangugu', label: t('jobSeekers.filters.cyangugu', 'Cyangugu') },
      { value: 'kibungo', label: t('jobSeekers.filters.kibungo', 'Kibungo') },
      { value: 'rwamagana', label: t('jobSeekers.filters.rwamagana', 'Rwamagana') }
    ],
    gender: [
      { value: '', label: t('jobSeekers.filters.allGenders', 'All Genders') },
      { value: 'Male', label: t('jobSeekers.filters.male', 'Male') },
      { value: 'Female', label: t('jobSeekers.filters.female', 'Female') },
      { value: 'Other', label: t('jobSeekers.filters.other', 'Other') }
    ],
    sortBy: [
      t('jobSeekers.filters.mostRecent', 'Most Recent'),
      t('jobSeekers.filters.highestRated', 'Highest Rated'),
      t('jobSeekers.filters.mostExperienced', 'Most Experienced'),
      t('jobSeekers.filters.name', 'Name A-Z'),
      t('jobSeekers.filters.lowestRate', 'Lowest Rate'),
      t('jobSeekers.filters.highestRate', 'Highest Rate')
    ]
  };

  const [jobSeekers, setJobSeekers] = useState([]);
  const [filteredSeekers, setFilteredSeekers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
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
        { value: '', label: t('jobSeekers.filters.allCategories', 'All Categories') },
        ...jobCategories.map(cat => ({
          value: cat.name_en.toLowerCase(),
          label: cat.name_en
        }))
      ];
      // Update the filterOptions.category dynamically
      filterOptions.category = categoryOptions;
    } else if (categoriesError) {
      // Handle categories API error gracefully without fallback data
      filterOptions.category = [
        { value: '', label: t('jobSeekers.filters.allCategories', 'All Categories') }
      ];
      // Clear any selected category when API fails
      setSelectedCategory('');
    }
    
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
      // If no data from API, set empty arrays to show "no user found"
      setJobSeekers([]);
      setFilteredSeekers([]);
    }
  }, [publicJobSeekers, jobSeekersError]);

  // Apply filters and search
  useEffect(() => {
    if (!jobSeekers || jobSeekers.length === 0) {
      setFilteredSeekers([]);
      return;
    }

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
            <p className="text-white/80">{t('jobSeekers.loading.approvedSeekers', 'Loading approved job seekers...')}</p>
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
                <span className="text-red-700 font-medium">{t('jobSeekers.errors.loadingJobSeekers', 'Error Loading Job Seekers')}</span>
              </div>
              <p className="text-red-600 mb-4">{jobSeekersError}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                {t('jobSeekers.errors.tryAgain', 'Try Again')}
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
                {t('jobSeekers.filters.filters', 'Filters')} {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
              </Button>
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="flex items-center gap-2"
              >
                {viewMode === 'grid' ? <Briefcase className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                {viewMode === 'grid' ? t('jobSeekers.filters.list', 'List') : t('jobSeekers.filters.grid', 'Grid')}
              </Button>
              {getActiveFiltersCount() > 0 && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <Eye className="w-4 h-4" />
                  {t('jobSeekers.filters.clearAll', 'Clear All')}
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
                      <option>{t('jobSeekers.loading.categories', 'Loading categories...')}</option>
                    ) : categoriesError ? (
                      <option>{t('jobSeekers.errors.categoriesLoad', 'Error loading categories')}</option>
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

        {/* Categories Error Message */}
        {categoriesError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 font-medium">{t('jobSeekers.errors.categoriesLoad', 'Unable to load job categories')}</span>
            </div>
            <p className="text-red-600 text-sm mt-1">
              {t('jobSeekers.errors.categoriesUnavailable', 'There was an error loading job categories. Category filtering is temporarily unavailable.')}
            </p>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">{t('jobSeekers.stats.totalJobSeekers', 'Total Job Seekers')}</p>
            <p className="text-2xl font-bold text-gray-900">{jobSeekers.length}</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">{t('jobSeekers.stats.searchResults', 'Search Results')}</p>
            <p className="text-2xl font-bold text-gray-900">{filteredSeekers.length}</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Filter className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">{t('jobSeekers.stats.activeFilters', 'Active Filters')}</p>
            <p className="text-2xl font-bold text-gray-900">{getActiveFiltersCount()}</p>
          </div>
        </div>

        {/* No Results State */}
        {filteredSeekers.length === 0 && getActiveFiltersCount() > 0 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8 mb-8 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('jobSeekers.noResults.noResultsFound', 'No results found')}</h3>
            <p className="text-gray-600 mb-4">
              {t('jobSeekers.noResults.adjustCriteria', 'Try adjusting your search criteria or filters to find more job seekers.')}
            </p>
            <Button onClick={clearFilters} variant="outline">
              {t('jobSeekers.noResults.clearFilters', 'Clear All Filters')}
            </Button>
          </div>
        )}

        {/* No Job Seekers Available */}
        {filteredSeekers.length === 0 && getActiveFiltersCount() === 0 && jobSeekers.length === 0 && !jobSeekersLoading && (
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8 mb-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('jobSeekers.noResults.noApprovedSeekers', 'No approved job seekers available')}</h3>
            <p className="text-gray-600 mb-4">
              {t('jobSeekers.noResults.noProfilesAvailable', 'There are currently no approved job seeker profiles available for public viewing. New registrations are being reviewed by our team.')}
            </p>
            <div className="text-sm text-blue-600 bg-blue-50 rounded-lg p-3 mt-4 max-w-md mx-auto">
              {t('jobSeekers.noResults.profilesReviewed', '💡 Job seeker profiles are reviewed and approved to ensure quality and authenticity.')}
            </div>
          </div>
        )}

        {/* Job Seekers Grid/List */}
        {filteredSeekers.length > 0 ? (
          <div
            className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
            }
          >
            {filteredSeekers.map((seeker, index) => {
              return (
                <div key={seeker.id}>
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
                                {maskName(seeker.firstName || seeker.profile?.firstName || seeker.user?.firstName || t('jobSeekers.card.unknown', 'Unknown'))} {maskName(seeker.lastName || seeker.profile?.lastName || seeker.user?.lastName || '')}
                              </h3>
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                                  {seeker.jobCategory?.name_en || seeker.profile?.jobCategory?.name_en || seeker.user?.jobCategory?.name_en || seeker.category || t('jobSeekers.card.noCategory', 'No Category')}
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
                            {t('jobSeekers.actions.viewProfile', 'View Profile')}
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
                          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1 block">{t('jobSeekers.card.experienceLevel', 'Experience Level')} *</span>
                          <p className="text-sm text-gray-700 font-medium">
                            {seeker.experienceLevel || seeker.profile?.experienceLevel || seeker.user?.experienceLevel || t('jobSeekers.card.notSpecified', 'Not specified')}
                          </p>
                        </div>

                        {(seeker.skills || seeker.profile?.skills || seeker.user?.skills) && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('jobSeekers.card.skills', 'Skills')}</h4>
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
                                    +{(seeker.skills || seeker.profile?.skills || seeker.user?.skills || '').split(',').length - 4} {t('jobSeekers.card.more', 'more')}
                                  </span>
                                )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
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
          </div>
        )}
      </main>
      
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default JobSeekers; 
