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
  Mail
} from 'lucide-react';
import { jobSeekerService } from '../api/index.js';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ChromeGrid from '../components/ui/chrome-grid';
import { filterJobSeekers, sortJobSeekers } from '../utils/helpers';
import useDebounce from '../hooks/useDebounce';

// Static data moved from mockData.js
const filterOptions = {
  categories: [
    'All Categories',
    'Domestic',
    'Care',
    'Maintenance',
    'Food',
    'Transport',
    'Sales'
  ],
  locations: [
    'All Locations',
    'Kigali',
    'Butare',
    'Gitarama',
    'Ruhengeri',
    'Gisenyi',
    'Cyangugu',
    'Kibuye',
    'Kibungo'
  ],
  experience: [
    'All Experience',
    'Entry Level',
    '1-2 years',
    '3-5 years',
    '5+ years'
  ],
  education: [
    'All Education',
    'No Formal Education',
    'Primary School',
    'Secondary School',
    'Vocational Training',
    'Bachelor\'s Degree',
    'Master\'s Degree'
  ],
  availability: [
    'All Availability',
    'Full Time',
    'Part Time',
    'Flexible',
    'Weekends Only',
    'Evenings Only',
    'On Call'
  ],
  dailyRateRange: [
    'All Rates',
    'Under 3,000 RWF',
    '3,000 - 5,000 RWF',
    '5,000 - 8,000 RWF',
    '8,000 - 12,000 RWF',
    'Over 12,000 RWF'
  ],
  monthlyRateRange: [
    'All Monthly Rates',
    'Under 80,000 RWF',
    '80,000 - 120,000 RWF',
    '120,000 - 180,000 RWF',
    '180,000 - 250,000 RWF',
    'Over 250,000 RWF'
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
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedDailyRateRange, setSelectedDailyRateRange] = useState('');
  const [selectedMonthlyRateRange, setSelectedMonthlyRateRange] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedEducation, setSelectedEducation] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [sortBy, setSortBy] = useState('Most Recent');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Load job seekers data
  useEffect(() => {
    const loadJobSeekers = async () => {
      setLoading(true);
      try {
        const result = await jobSeekerService.getLatestJobSeekers(50); // Get more job seekers for the full page
        console.log('JobSeekers API Response:', result);
        
        if (result.success) {
          console.log('JobSeekers Data:', result.data);
          setJobSeekers(result.data || []);
          setFilteredSeekers(result.data || []);
        } else {
          console.error("Error fetching job seekers:", result.error);
        }
      } catch (error) {
        console.error("Error fetching job seekers:", error);
        // Optionally set an error state
      } finally {
        setLoading(false);
      }
    };

    loadJobSeekers();
  }, []);

  // Apply filters and search
  useEffect(() => {
    // Temporarily disable filtering to debug data issues
    console.log('JobSeekers raw data:', jobSeekers);
    setFilteredSeekers(jobSeekers);
    
    // TODO: Re-enable filtering once data structure is confirmed
    // const filters = {
    //   searchTerm: debouncedSearchTerm,
    //   location: selectedLocation,
    //   category: selectedCategory,
    //   experience: selectedExperience,
    //   dailyRateRange: selectedDailyRateRange,
    //   monthlyRateRange: selectedMonthlyRateRange,
    //   availability: selectedAvailability,
    //   education: selectedEducation,
    //   skills: selectedSkills
    // };

    // let filtered = filterJobSeekers(jobSeekers, filters);
    // filtered = sortJobSeekers(filtered, sortBy);
    // setFilteredSeekers(filtered);
  }, [jobSeekers]); // Only depend on jobSeekers, not all the filter states

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedCategory('');
    setSelectedExperience('');
    setSelectedDailyRateRange('');
    setSelectedMonthlyRateRange('');
    setSelectedAvailability('');
    setSelectedEducation('');
    setSelectedSkills([]);
    setSortBy('Most Recent');
  };

  const handleViewProfile = (seeker) => {
    // Navigate to detailed profile page
    window.location.href = `/job-seekers#${seeker.id}`;
  };

  const handleFavorite = (seekerId) => {
    // Implement favorite functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <ChromeGrid />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-white/80">Loading job seekers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <ChromeGrid />
      {/* Header is removed as per new_code, assuming it's handled elsewhere or not needed */}
      
      {/* Page Header */}
      <div className="relative z-10 mt-16">
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

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-8"
        >
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
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
                Filters
              </Button>
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="flex items-center gap-2"
              >
                {viewMode === 'grid' ? <Briefcase className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                {viewMode === 'grid' ? 'List' : 'Grid'}
              </Button>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </div>

          {/* Filters */}
          {/* AnimatePresence is removed as per new_code, assuming it's not needed */}
          {showFilters && (
            <div
              className="border-t pt-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    {filterOptions.locations.map(location => (
                      <option key={location} value={location === 'All Locations' ? '' : location}>
                        {location}
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
                  >
                    {filterOptions.categories.map(category => (
                      <option key={category} value={category === 'All Categories' ? '' : category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Experience Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('jobSeekers.filters.experience', 'Experience')}
                  </label>
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  >
                    {filterOptions.experience.map(exp => (
                      <option key={exp} value={exp === 'All Experience' ? '' : exp}>
                        {exp}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Daily Rate Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('jobSeekers.filters.dailyRate', 'Daily Rate')}
                  </label>
                  <select
                    value={selectedDailyRateRange}
                    onChange={(e) => setSelectedDailyRateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  >
                    {filterOptions.dailyRateRange.map(rate => (
                      <option key={rate} value={rate === 'All Rates' ? '' : rate}>
                        {rate}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Monthly Rate Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('jobSeekers.filters.monthlyRate', 'Monthly Rate')}
                  </label>
                  <select
                    value={selectedMonthlyRateRange}
                    onChange={(e) => setSelectedMonthlyRateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  >
                    {filterOptions.monthlyRateRange.map(rate => (
                      <option key={rate} value={rate === 'All Monthly Rates' ? '' : rate}>
                        {rate}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Availability Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('jobSeekers.filters.availability', 'Availability')}
                  </label>
                  <select
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  >
                    {filterOptions.availability.map(availability => (
                      <option key={availability} value={availability === 'All Availability' ? '' : availability}>
                        {availability}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Education Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('jobSeekers.filters.education', 'Education')}
                  </label>
                  <select
                    value={selectedEducation}
                    onChange={(e) => setSelectedEducation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  >
                    {filterOptions.education.map(education => (
                      <option key={education} value={education === 'All Education' ? '' : education}>
                        {education}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
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

                {/* Skills Filter */}
                <div className="lg:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('jobSeekers.filters.skills', 'Skills')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Python', 'Node.js', 'UI/UX', 'Data Science'].map(skill => (
                      <Badge
                        key={skill}
                        variant={selectedSkills.includes(skill) ? 'primary' : 'outline'}
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-white/80">
            {filteredSeekers.length} {t('jobSeekers.results', 'results')}
          </p>
        </div>

        {/* Debug Section - Temporary */}
        <div className="mb-6 p-4 bg-white/10 rounded-lg">
          <h3 className="text-white font-bold mb-2">Debug Info:</h3>
          <p className="text-white/80 text-sm">Total Job Seekers: {jobSeekers.length}</p>
          <p className="text-white/80 text-sm">Filtered Job Seekers: {filteredSeekers.length}</p>
          <p className="text-white/80 text-sm">Loading: {loading ? 'Yes' : 'No'}</p>
          {filteredSeekers.length > 0 && (
            <div className="mt-2">
              <p className="text-white/80 text-sm">First Job Seeker Data:</p>
              <pre className="text-white/60 text-xs bg-black/20 p-2 rounded mt-1 overflow-auto">
                {JSON.stringify(filteredSeekers[0], null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Debug Section - Temporary */}
        <div className="mb-6 p-4 bg-white/10 rounded-lg">
          <h3 className="text-white font-bold mb-2">Debug Info:</h3>
          <p className="text-white/80 text-sm">Total Job Seekers: {jobSeekers.length}</p>
          <p className="text-white/80 text-sm">Filtered Job Seekers: {filteredSeekers.length}</p>
          <p className="text-white/80 text-sm">Loading: {loading ? 'Yes' : 'No'}</p>
          {filteredSeekers.length > 0 && (
            <div className="mt-2">
              <p className="text-white/80 text-sm">First Job Seeker Data:</p>
              <pre className="text-white/60 text-xs bg-black/20 p-2 rounded mt-1 overflow-auto">
                {JSON.stringify(filteredSeekers[0], null, 2)}
              </pre>
            </div>
          )}
        </div>

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
              console.log(`Rendering seeker ${index}:`, seeker);
              return (
                <motion.div
                  key={seeker.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-white"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Briefcase className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {seeker.firstName} {seeker.lastName}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {seeker.jobCategory?.name_en || 'No Category'}
                      </p>
                      {seeker.location && (
                        <div className="flex items-center text-gray-500 text-sm mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          {seeker.location}, {seeker.city}, {seeker.country}
                        </div>
                      )}
                      {seeker.experience && (
                        <div className="flex items-center text-gray-500 text-sm mb-2">
                          <Calendar className="w-4 h-4 mr-1" />
                          {seeker.experience}
                        </div>
                      )}
                      {seeker.skills && (
                        <div className="flex items-center text-gray-500 text-sm">
                          <Users className="w-4 h-4 mr-1" />
                          {seeker.skills}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleViewProfile(seeker)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Profile
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleFavorite(seeker.id)}
                        className="flex items-center gap-2"
                      >
                        <Star className="w-4 h-4" />
                        Favorite
                      </Button>
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
      
      {/* Footer is removed as per new_code, assuming it's handled elsewhere or not needed */}
    </div>
  );
};

export default JobSeekers; 