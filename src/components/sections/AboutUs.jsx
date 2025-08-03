import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import Card from '../ui/Card';

// Static data moved from mockData.js
const statsData = [
  { 
    id: 1,
    label: 'Active Workers', 
    number: '500+',
    icon: '👥'
  },
  { 
    id: 2,
    label: 'Happy Clients', 
    number: '1000+',
    icon: '😊'
  },
  { 
    id: 3,
    label: 'Cities Covered', 
    number: '10+',
    icon: '🏙️'
  },
  { 
    id: 4,
    label: 'Years Experience', 
    number: '5+',
    icon: '⭐'
  }
];

const valuesData = [
  {
    id: 1,
    title: 'Reliability',
    description: 'We ensure all workers are dependable and trustworthy.',
    icon: '🤝'
  },
  {
    id: 2,
    title: 'Quality',
    description: 'High standards for all services and worker qualifications.',
    icon: '✨'
  },
  {
    id: 3,
    title: 'Transparency',
    description: 'Clear pricing and honest communication throughout.',
    icon: '🔍'
  },
  {
    id: 4,
    title: 'Innovation',
    description: 'Continuously improving our platform and services.',
    icon: '🚀'
  }
];

const AboutUs = () => {
  const { t } = useTranslation();

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
    <section id="about" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            {safeTranslate('about.title', 'About Us')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {safeTranslate('about.subtitle', 'Connecting talent with opportunity across Rwanda through innovative technology and personalized service.')}
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-4">
                {t('about.mission.title', 'Our Mission')}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t('about.mission.description', 'To bridge the gap between talented professionals and forward-thinking organizations, fostering economic growth and career development across Rwanda.')}
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-4">
                {t('about.vision.title', 'Our Vision')}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t('about.vision.description', 'To become the leading platform for talent acquisition and career advancement in East Africa, empowering individuals and organizations to achieve their full potential.')}
              </p>
            </div>
          </motion.div>
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
                {stat.number}
              </div>
              <div className="text-gray-300">{t(`about.stats.${stat.id}.label`, stat.label)}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Core Values */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-3xl font-bold mb-12">
            {t('about.values.title', 'Our Core Values')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valuesData.map((value) => (
              <motion.div
                key={value.id}
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-colors duration-300"
              >
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {renderIcon(value.icon)}
                </div>
                <h4 className="text-xl font-semibold mb-3">
                  {t(`about.values.${value.id}.title`, value.title)}
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {t(`about.values.${value.id}.description`, value.description)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs; 