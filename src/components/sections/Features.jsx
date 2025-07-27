import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  UserCheck, 
  Building2, 
  Shield, 
  Zap, 
  Globe, 
  MessageSquare 
} from 'lucide-react';

const Features = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: UserCheck,
      title: t('features.jobSeekers.title'),
      description: t('features.jobSeekers.desc'),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      icon: Building2,
      title: t('features.employers.title'),
      description: t('features.employers.desc'),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      icon: Shield,
      title: t('features.privacy.title'),
      description: t('features.privacy.desc'),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      icon: Zap,
      title: 'Fast & Efficient',
      description: 'Quick matching and streamlined processes for better results',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      icon: Globe,
      title: 'Bilingual Support',
      description: 'Full support for English and Kinyarwanda languages',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
    {
      icon: MessageSquare,
      title: 'Direct Communication',
      description: 'Seamless messaging between employers and candidates',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
    },
  ];

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
    hidden: { opacity: 0, y: 50 },
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h2
            variants={cardVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            {t('features.title')}
          </motion.h2>
          <motion.p
            variants={cardVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {t('features.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`group relative p-8 rounded-2xl border-2 ${feature.borderColor} ${feature.bgColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-2 feature-card`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl" />
              
              {/* Icon */}
              <div className="relative z-10">
                <motion.div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 5 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-200">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Experience the Difference?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of professionals who have already discovered their dream opportunities through our platform.
            </p>
            <motion.button
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features; 