import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Briefcase, MapPin, Calendar, Eye } from 'lucide-react';
import { jobSeekerService } from '../../api/services/jobSeekerService.js';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';

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
              <Card className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {seeker.firstName} {seeker.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {seeker.jobCategory?.name_en || 'No Category'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewProfile(seeker)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {seeker.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{seeker.location}, {seeker.city}, {seeker.country}</span>
                    </div>
                  )}

                  {seeker.experience && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Experience:</span> {seeker.experience}
                    </div>
                  )}

                  {seeker.skills && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Skills:</span> {seeker.skills}
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Member since {formatDate(seeker.memberSince)}</span>
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