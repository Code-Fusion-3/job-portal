import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  User, 
  Eye, 
  Heart,
  Star,
  Mail,
  Phone,
  Globe,
  Calendar,
  BookOpen,
  Award
} from 'lucide-react';
import Button from '../components/ui/Button';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const JobSeekers = () => {
  console.log('JobSeekers component rendered');
  
  const { t } = useTranslation();
  const [jobSeekers, setJobSeekers] = useState([]);
  const [filteredSeekers, setFilteredSeekers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [loading, setLoading] = useState(true);

  // Mock data for job seekers
  const mockJobSeekers = [
    {
      id: 1,
      name: "Alice Uwimana",
      title: "Senior Software Engineer",
      location: "Kigali, Rwanda",
      experience: "5 years",
      skills: ["React", "Node.js", "Python", "TypeScript", "MongoDB"],
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 4.8,
      hourlyRate: "$25-35",
      availability: "Full-time",
      education: "Bachelor's in Computer Science",
      languages: ["English", "Kinyarwanda", "French"],
      description: "Experienced software engineer with expertise in full-stack development and cloud technologies.",
      contact: {
        email: "alice.uwimana@email.com",
        phone: "+250 788 123 456",
        linkedin: "linkedin.com/in/alice-uwimana"
      },
      recentProjects: ["E-commerce Platform", "Mobile Banking App", "HR Management System"]
    },
    {
      id: 2,
      name: "Jean Pierre Ndayisaba",
      title: "Data Scientist",
      location: "Kigali, Rwanda",
      experience: "7 years",
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow", "AWS"],
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      hourlyRate: "$30-45",
      availability: "Full-time",
      education: "Master's in Data Science",
      languages: ["English", "Kinyarwanda"],
      description: "Passionate data scientist specializing in machine learning and predictive analytics.",
      contact: {
        email: "jean.ndayisaba@email.com",
        phone: "+250 789 234 567",
        linkedin: "linkedin.com/in/jean-ndayisaba"
      },
      recentProjects: ["Customer Segmentation Model", "Sales Prediction System", "Fraud Detection Algorithm"]
    },
    {
      id: 3,
      name: "Marie Claire Uwineza",
      title: "UX/UI Designer",
      location: "Kigali, Rwanda",
      experience: "4 years",
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research", "Design Systems"],
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 4.7,
      hourlyRate: "$20-30",
      availability: "Part-time",
      education: "Bachelor's in Design",
      languages: ["English", "Kinyarwanda", "French"],
      description: "Creative UX/UI designer focused on creating intuitive and beautiful user experiences.",
      contact: {
        email: "marie.uwineza@email.com",
        phone: "+250 787 345 678",
        linkedin: "linkedin.com/in/marie-uwineza"
      },
      recentProjects: ["Banking App Redesign", "E-commerce Website", "Healthcare Platform"]
    },
    {
      id: 4,
      name: "Emmanuel Niyonshuti",
      title: "Product Manager",
      location: "Kigali, Rwanda",
      experience: "6 years",
      skills: ["Agile", "Product Strategy", "Analytics", "User Research", "Roadmapping"],
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 4.6,
      hourlyRate: "$35-50",
      availability: "Full-time",
      education: "MBA in Business Administration",
      languages: ["English", "Kinyarwanda"],
      description: "Strategic product manager with a track record of launching successful digital products.",
      contact: {
        email: "emmanuel.niyonshuti@email.com",
        phone: "+250 786 456 789",
        linkedin: "linkedin.com/in/emmanuel-niyonshuti"
      },
      recentProjects: ["Fintech Platform", "EdTech Solution", "Logistics Management System"]
    },
    {
      id: 5,
      name: "Grace Mukamana",
      title: "DevOps Engineer",
      location: "Kigali, Rwanda",
      experience: "3 years",
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      rating: 4.5,
      hourlyRate: "$25-40",
      availability: "Full-time",
      education: "Bachelor's in Information Technology",
      languages: ["English", "Kinyarwanda"],
      description: "DevOps engineer passionate about automation and cloud infrastructure.",
      contact: {
        email: "grace.mukamana@email.com",
        phone: "+250 785 567 890",
        linkedin: "linkedin.com/in/grace-mukamana"
      },
      recentProjects: ["Microservices Architecture", "Cloud Migration", "Automated Deployment Pipeline"]
    },
    {
      id: 6,
      name: "David Kwizera",
      title: "Frontend Developer",
      location: "Kigali, Rwanda",
      experience: "2 years",
      skills: ["React", "Vue.js", "JavaScript", "CSS", "HTML"],
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 4.3,
      hourlyRate: "$15-25",
      availability: "Full-time",
      education: "Self-taught",
      languages: ["English", "Kinyarwanda"],
      description: "Frontend developer with a passion for creating responsive and accessible web applications.",
      contact: {
        email: "david.kwizera@email.com",
        phone: "+250 784 678 901",
        linkedin: "linkedin.com/in/david-kwizera"
      },
      recentProjects: ["E-commerce Frontend", "Dashboard Application", "Portfolio Website"]
    }
  ];

  // Filter options
  const locations = ["Kigali, Rwanda", "Huye, Rwanda", "Musanze, Rwanda", "Rubavu, Rwanda"];
  const experienceLevels = ["Entry Level", "1-3 years", "3-5 years", "5+ years"];
  const allSkills = ["React", "Node.js", "Python", "JavaScript", "TypeScript", "MongoDB", "SQL", "AWS", "Docker", "Figma", "Adobe XD", "Machine Learning", "Agile", "Product Strategy"];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJobSeekers(mockJobSeekers);
      setFilteredSeekers(mockJobSeekers);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = jobSeekers;

    // Search by name, title, or skills
    if (searchTerm) {
      filtered = filtered.filter(seeker =>
        seeker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seeker.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seeker.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter(seeker => seeker.location === selectedLocation);
    }

    // Filter by experience
    if (selectedExperience) {
      filtered = filtered.filter(seeker => {
        const years = parseInt(seeker.experience);
        switch (selectedExperience) {
          case "Entry Level": return years <= 1;
          case "1-3 years": return years >= 1 && years <= 3;
          case "3-5 years": return years >= 3 && years <= 5;
          case "5+ years": return years >= 5;
          default: return true;
        }
      });
    }

    // Filter by skills
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(seeker =>
        selectedSkills.some(skill => seeker.skills.includes(skill))
      );
    }

    // Sort results
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'experience':
        filtered.sort((a, b) => parseInt(b.experience) - parseInt(a.experience));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // recent
        filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredSeekers(filtered);
  }, [jobSeekers, searchTerm, selectedLocation, selectedExperience, selectedSkills, sortBy]);

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
    setSelectedExperience('');
    setSelectedSkills([]);
    setSortBy('recent');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job seekers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('jobSeekers.pageTitle', 'All Job Seekers')}
            </h1>
            <p className="text-gray-600">
              {t('jobSeekers.pageSubtitle', 'Discover talented professionals ready to contribute to your organization')}
            </p>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border p-6 mb-8"
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="flex items-center gap-2"
              >
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </Button>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('jobSeekers.filters.location', 'Location')}
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">{t('jobSeekers.filters.allLocations', 'All Locations')}</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">{t('jobSeekers.filters.allExperience', 'All Experience')}</option>
                {experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="recent">{t('jobSeekers.filters.mostRecent', 'Most Recent')}</option>
                <option value="rating">{t('jobSeekers.filters.highestRated', 'Highest Rated')}</option>
                <option value="experience">{t('jobSeekers.filters.mostExperienced', 'Most Experienced')}</option>
                <option value="name">{t('jobSeekers.filters.name', 'Name A-Z')}</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <p className="text-sm text-gray-600">
                {filteredSeekers.length} {t('jobSeekers.results', 'results')}
              </p>
            </div>
          </div>

          {/* Skills Filter */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('jobSeekers.filters.skills', 'Skills')}
            </label>
            <div className="flex flex-wrap gap-2">
              {allSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedSkills.includes(skill)
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filteredSeekers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <User size={64} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('jobSeekers.noResults.title', 'No job seekers found')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('jobSeekers.noResults.message', 'Try adjusting your search criteria or filters')}
              </p>
              <Button onClick={clearFilters}>
                {t('jobSeekers.noResults.clearFilters', 'Clear All Filters')}
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              <AnimatePresence>
                {filteredSeekers.map((seeker, index) => (
                  <motion.div
                    key={seeker.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Job Seeker Card Content */}
                    <div className={viewMode === 'list' ? 'flex-1 p-6' : 'p-6'}>
                      {/* Header */}
                      <div className={viewMode === 'list' ? 'flex items-start gap-4' : ''}>
                        <img
                          src={seeker.avatar}
                          alt={seeker.name}
                          className={`rounded-full object-cover ${
                            viewMode === 'list' ? 'w-16 h-16' : 'w-20 h-20 mx-auto mb-4'
                          }`}
                        />
                        <div className={viewMode === 'list' ? 'flex-1' : 'text-center'}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {seeker.name}
                          </h3>
                          <p className="text-gray-600 mb-2">{seeker.title}</p>
                          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin size={16} />
                              {seeker.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase size={16} />
                              {seeker.experience}
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="flex items-center gap-1">
                              <Star size={16} className="text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{seeker.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">{seeker.hourlyRate}/hr</span>
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {seeker.skills.slice(0, 3).map(skill => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {seeker.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              +{seeker.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button variant="primary" size="sm" className="flex-1">
                          <Eye size={16} className="mr-1" />
                          {t('jobSeekers.actions.viewProfile', 'View Profile')}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Heart size={16} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default JobSeekers; 