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
import ProfileImage from '../components/ui/ProfileImage';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import jobseekerBackground from '../assets/jobseekerBackground.png';
import { filterJobSeekers, sortJobSeekers, maskName, formatExperienceDisplay } from '../utils/helpers';
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
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
                             {maskName(seeker.firstName)} {maskName(seeker.lastName)}
                           </h3>
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                                  {seeker.jobCategory?.name_en || 'No Category'}
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
                        {seeker.location && (
                          <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                            <span className="font-medium">{seeker.location}, {seeker.city}</span>
                          </div>
                        )}

                                                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
                           <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1 block">Experience</span>
                           <p className="text-sm text-gray-700 font-medium">{formatExperienceDisplay(seeker.experience)}</p>
                         </div>

                        {seeker.skills && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {seeker.skills.split(',').slice(0, 4).map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                                  {skill.trim()}
                                </span>
                              ))}
                              {seeker.skills.split(',').length > 4 && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
                                  +{seeker.skills.split(',').length - 4} more
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