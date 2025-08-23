import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Shield, 
  Users, 
  Award, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  CheckCircle,
  Star,
  TrendingUp,
  Heart
} from 'lucide-react';
import Card from '../components/ui/Card';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const AdminInfo = () => {
  const { t } = useTranslation();

  const adminStats = [
    {
      icon: Users,
      value: '500+',
      label: 'admin.stats.jobSeekers',
      color: 'text-blue-600'
    },
    {
      icon: Award,
      value: '98%',
      label: 'admin.stats.successRate',
      color: 'text-green-600'
    },
    {
      icon: Globe,
      value: '50+',
      label: 'admin.stats.companies',
      color: 'text-purple-600'
    },
    {
      icon: TrendingUp,
      value: '5+',
      label: 'admin.stats.yearsExperience',
      color: 'text-orange-600'
    }
  ];

  const adminFeatures = [
    {
      icon: Shield,
      title: 'admin.features.security.title',
      description: 'admin.features.security.description',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Users,
      title: 'admin.features.management.title',
      description: 'admin.features.management.description',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Award,
      title: 'admin.features.quality.title',
      description: 'admin.features.quality.description',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Clock,
      title: 'admin.features.support.title',
      description: 'admin.features.support.description',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: 'admin.contact.email',
      value: 'admin@jobportal.rw',
      href: 'mailto:admin@jobportal.rw'
    },
    {
      icon: Phone,
      label: 'admin.contact.phone',
      value: '+250 788 123 456',
      href: 'tel:+250788123456'
    },
    {
      icon: MapPin,
      label: 'admin.contact.address',
      value: 'Kigali, Rwanda',
      href: '#'
    },
    {
      icon: Clock,
      label: 'admin.contact.hours',
      value: 'Mon-Fri: 8:00 AM - 6:00 PM',
      href: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('admin.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('admin.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="py-16 bg-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('admin.stats.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('admin.stats.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {adminStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 ${stat.color}`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{t(stat.label)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-16 bg-gray-50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('admin.features.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('admin.features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
              >
                <Card className="h-full p-6 text-center hover:shadow-lg transition-shadow duration-300">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${feature.color}`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {t(feature.title)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t(feature.description)}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Mission & Vision Section */}
      <motion.section 
        className="py-16 bg-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('admin.mission.title')}
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {t('admin.mission.description')}
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-6">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('admin.vision.title')}
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {t('admin.vision.description')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        className="py-16 bg-gray-900 text-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t('admin.contact.title')}
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t('admin.contact.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((contact, index) => (
              <motion.div
                key={contact.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.0 + index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                  <contact.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t(contact.label)}</h3>
                <a 
                  href={contact.href}
                  className="text-blue-300 hover:text-white transition-colors duration-200"
                >
                  {contact.value}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.4 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            {t('admin.cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('admin.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => window.location.href = '/contact'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {t('admin.cta.contact')}
            </motion.button>
            <motion.button
              onClick={() => window.location.href = '/job-seekers'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              {t('admin.cta.learnMore')}
            </motion.button>
          </div>
        </div>
      </motion.section>
      
      <Footer />
    </div>
  );
};

export default AdminInfo;
