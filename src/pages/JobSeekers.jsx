import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  Grid3X3,
  List,
  X
} from 'lucide-react';
import Button from '../components/ui/Button';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import JobSeekerCard from '../components/sections/JobSeekerCard';
import Badge from '../components/ui/Badge';
import ChromeGrid from '../components/ui/chrome-grid';
import { jobSeekersData, filterOptions, skillsData } from '../data/mockData';
import { filterJobSeekers, sortJobSeekers } from '../utils/helpers';
import useDebounce from '../hooks/useDebounce';

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setJobSeekers(jobSeekersData);
      setFilteredSeekers(jobSeekersData);
      setLoading(false);
    };

    loadJobSeekers();
  }, []);

  // Apply filters and search
  useEffect(() => {
    const filters = {
      searchTerm: debouncedSearchTerm,
      location: selectedLocation,
      category: selectedCategory,
      experience: selectedExperience,
      dailyRateRange: selectedDailyRateRange,
      monthlyRateRange: selectedMonthlyRateRange,
      availability: selectedAvailability,
      education: selectedEducation,
      skills: selectedSkills
    };

    let filtered = filterJobSeekers(jobSeekers, filters);
    filtered = sortJobSeekers(filtered, sortBy);
    setFilteredSeekers(filtered);
  }, [jobSeekers, debouncedSearchTerm, selectedLocation, selectedCategory, selectedExperience, selectedDailyRateRange, selectedMonthlyRateRange, selectedAvailability, selectedEducation, selectedSkills, sortBy]);

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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/80">Loading job seekers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <ChromeGrid />
      <Header />
      
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
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                {viewMode === 'grid' ? 'List' : 'Grid'}
              </Button>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
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
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-white/80">
            {filteredSeekers.length} {t('jobSeekers.results', 'results')}
          </p>
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
            {filteredSeekers.map((seeker) => (
              <motion.div
                key={seeker.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <JobSeekerCard
                  seeker={seeker}
                  variant={viewMode === 'list' ? 'detailed' : 'compact'}
                  onViewProfile={handleViewProfile}
                  onFavorite={handleFavorite}
                />
              </motion.div>
            ))}
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
                <X className="w-4 h-4" />
                {t('jobSeekers.noResults.clearFilters', 'Clear All Filters')}
              </Button>
            </div>
          </motion.div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default JobSeekers; 