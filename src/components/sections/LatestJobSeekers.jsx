import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, Eye } from 'lucide-react';
import { jobSeekerService } from '../../api/services/jobSeekerService.js';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import { maskName, formatExperienceDisplay } from '../../utils/helpers';
import defaultProfileImage from '../../assets/defaultProfileImage.jpeg';

const LatestJobSeekers = () => {
  const { t } = useTranslation();
  const [jobSeekers, setJobSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    const fetchJobSeekers = async () => {
      try {
        setLoading(true);
        const result = await jobSeekerService.getLatestJobSeekers(pagination.limit);
        
        if (result.success) {
          setJobSeekers(result.data || []);
          setPagination(result.pagination || {});
        } else {
          setError(new Error(result.error || 'Failed to fetch job seekers'));
        }
      } catch (err) {
        setError(err);
        console.error("Error fetching job seekers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobSeekers();
    const interval = setInterval(fetchJobSeekers, 30000); // Fetch every 30 seconds
    return () => clearInterval(interval);
  }, [pagination.limit]);

  // Calculate pagination for frontend display
  const totalItems = jobSeekers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobSeekers = jobSeekers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  const getSkillsArray = (skills) => {
    if (!skills) return [];
    return skills.split(',').map(skill => skill.trim()).filter(skill => skill);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const handleViewProfile = (seeker) => {
    // Navigate to detailed profile page
    window.location.href = `/job-seekers#${seeker.id}`;
  };

  if (loading && !jobSeekers.length) {
    return (
      <section id="job-seekers" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="job-seekers" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-red-500">Error: {error.message}</p>
        </div>
      </section>
    );
  }

  if (!jobSeekers.length) {
    return (
      <section id="job-seekers" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600">No job seekers found.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="job-seekers" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('jobSeekers.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('jobSeekers.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {currentJobSeekers.map((seeker) => (
            <motion.div
              key={seeker.id}
              variants={cardVariants}
            >
                             <Card className="h-[380px] bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden group">
                <div className="h-full flex flex-col">
                  {/* Header Section */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                                             <div className="flex items-center">
                         <div className="w-14 h-14 rounded-xl overflow-hidden mr-4 shadow-lg">
                           <img 
                             src={defaultProfileImage} 
                             alt="Profile" 
                             className="w-full h-full object-cover"
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
                          {seeker.skills.split(',').slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                              {skill.trim()}
                            </span>
                          ))}
                          {seeker.skills.split(',').length > 3 && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
                              +{seeker.skills.split(',').length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center items-center space-x-2 mb-8"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </motion.div>
        )}

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <button
            onClick={() => window.location.href = '/job-seekers'}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            {t('jobSeekers.viewMore', 'View All Job Seekers')}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestJobSeekers; 