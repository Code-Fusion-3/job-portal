import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import Card from '../ui/Card';

// Static data moved from mockData.js
const featuresData = [
  {
    id: 1,
    title: 'Find Skilled Workers',
    description: 'Connect with reliable, experienced workers for your home and business needs.',
    icon: '👥',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50',
    iconColor: 'bg-blue-100'
  },
  {
    id: 2,
    title: 'Verified Profiles',
    description: 'All workers are verified with background checks and references.',
    icon: '✅',
    borderColor: 'border-green-200',
    bgColor: 'bg-green-50',
    iconColor: 'bg-green-100'
  },
  {
    id: 3,
    title: 'Secure Payments',
    description: 'Safe and secure payment processing for all transactions.',
    icon: '🔒',
    borderColor: 'border-purple-200',
    bgColor: 'bg-purple-50',
    iconColor: 'bg-purple-100'
  },
  {
    id: 4,
    title: '24/7 Support',
    description: 'Round-the-clock customer support to help you find the right worker.',
    icon: '🛟',
    borderColor: 'border-orange-200',
    bgColor: 'bg-orange-50',
    iconColor: 'bg-orange-100'
  }
];

const Features = () => {
  const { t } = useTranslation();

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

  const renderIcon = (iconName) => {
    // Since we're using emoji icons, just return the emoji as text
    return <span className="text-2xl">{iconName}</span>;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('features.title', 'Why Choose Our Platform')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('features.subtitle', 'Discover the advantages that make us the preferred choice for connecting talent with opportunity')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {featuresData.map((feature) => (
            <motion.div
              key={feature.id}
              variants={cardVariants}
              className={`group relative p-8 rounded-2xl border-2 ${feature.borderColor} ${feature.bgColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-2 feature-card`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-16 h-16 ${feature.iconColor} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {renderIcon(feature.icon)}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t(`features.${feature.id}.title`, feature.title)}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {t(`features.${feature.id}.description`, feature.description)}
              </p>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features; 