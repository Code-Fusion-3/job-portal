import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Target, Users, Shield, Award, TrendingUp, Heart } from 'lucide-react';

const AboutUs = () => {
  const { t } = useTranslation();

  const stats = [
    { number: "10,000+", label: t('about.stats.jobSeekers'), icon: Users },
    { number: "500+", label: t('about.stats.companies'), icon: Target },
    { number: "95%", label: t('about.stats.successRate'), icon: TrendingUp },
    { number: "5+", label: t('about.stats.experience'), icon: Award }
  ];

  const values = [
    {
      icon: Heart,
      title: t('about.values.passion.title'),
      description: t('about.values.passion.desc')
    },
    {
      icon: Shield,
      title: t('about.values.trust.title'),
      description: t('about.values.trust.desc')
    },
    {
      icon: Target,
      title: t('about.values.excellence.title'),
      description: t('about.values.excellence.desc')
    },
    {
      icon: Users,
      title: t('about.values.community.title'),
      description: t('about.values.community.desc')
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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

  return (
    <section id="about" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            {t('about.title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('about.subtitle')}
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
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-semibold mb-4">{t('about.mission.title')}</h3>
            <p className="text-gray-300 leading-relaxed">
              {t('about.mission.desc')}
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-semibold mb-4">{t('about.vision.title')}</h3>
            <p className="text-gray-300 leading-relaxed">
              {t('about.vision.desc')}
            </p>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center floating-stat"
            >
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-red-400 mb-2 counter" data-target={stat.number.replace(/\D/g, '')}>
                {stat.number}
              </div>
              <div className="text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Values */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300"
            >
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-3">{value.title}</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs; 