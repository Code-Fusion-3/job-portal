import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import JobSeekerCard from './JobSeekerCard';
import { jobSeekersData } from '../../data/mockData';

const LatestJobSeekers = () => {
  const { t } = useTranslation();

  // Get first 4 job seekers for the homepage
  const latestJobSeekers = jobSeekersData.slice(0, 4);

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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {latestJobSeekers.map((seeker) => (
            <motion.div
              key={seeker.id}
              variants={cardVariants}
            >
              <JobSeekerCard
                seeker={seeker}
                variant="compact"
                onViewProfile={handleViewProfile}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link to="/job-seekers">
            <Button as="div" variant="outline" size="lg" className="group">
              {t('jobSeekers.viewMore')}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestJobSeekers; 