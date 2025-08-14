import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useStatistics } from '../../api/hooks/useStatistics.js';

// Base stats configuration with translation keys and icons
const getStatsData = (statistics) => [
  { 
    id: 1,
    translationKey: 'statistics.activeWorkers',
    number: statistics?.activeWorkers ? `${statistics.activeWorkers}+` : '500+',
    icon: '👥',
    isLoading: !statistics
  },
  { 
    id: 2,
    translationKey: 'statistics.happyClients',
    number: '1000+',
    icon: '😊',
    isLoading: false
  },
  { 
    id: 3,
    translationKey: 'statistics.citiesCovered',
    number: statistics?.citiesCovered ? `${statistics.citiesCovered}+` : '10+',
    icon: '🏙️',
    isLoading: !statistics
  },
  { 
    id: 4,
    translationKey: 'statistics.yearsExperience',
    number: '5+',
    icon: '⭐',
    isLoading: false
  }
];

const Statistics = () => {
  const { t } = useTranslation();
  const { statistics, loading: statsLoading, error: statsError } = useStatistics();
  
  // Get dynamic stats data
  const statsData = getStatsData(statistics);
  console.log('🎯 Generated stats data:', statsData);

  // Error handling for translation
  const safeTranslate = (key, fallback) => {
    try {
      return t(key, fallback);
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
      return fallback;
    }
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

  const itemVariants = {
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

  const renderIcon = (iconName) => {
    // Since we're using emoji icons, just return the emoji as text
    return <span className="text-2xl">{iconName}</span>;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            {safeTranslate('statistics.title', 'Platform Statistics')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {safeTranslate('statistics.subtitle', 'Discover the impact we\'ve made in connecting talent with opportunity across Rwanda.')}
          </p>
          
          {/* Error Display */}
          {statsError && (
            <div className="mt-4 p-3 bg-red-600/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">
                {statsError} - Showing default values
              </p>
            </div>
          )}
        </motion.div>

        {/* Statistics */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              className="text-center floating-stat"
            >
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {renderIcon(stat.icon)}
              </div>
              <div className="text-3xl font-bold text-red-400 mb-2 counter" data-target={stat.number.replace(/\D/g, '')}>
                {stat.isLoading && statsLoading ? (
                  <div className="animate-pulse bg-red-300 h-8 w-16 rounded"></div>
                ) : (
                  stat.number
                )}
              </div>
              <div className="text-gray-300">
                {safeTranslate(stat.translationKey, stat.translationKey)}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Statistics; 