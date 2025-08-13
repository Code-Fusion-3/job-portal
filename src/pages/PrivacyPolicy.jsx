import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Eye, Database, Users, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/ui/HeroSection';
import jobseekerBackground from '../assets/jobseekerBackground.png';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  const sections = [
    {
      icon: Shield,
      title: t('privacyPolicy.sections.informationWeCollect.title'),
      content: t('privacyPolicy.sections.informationWeCollect.items', { returnObjects: true })
    },
    {
      icon: Lock,
      title: t('privacyPolicy.sections.howWeUse.title'),
      content: t('privacyPolicy.sections.howWeUse.items', { returnObjects: true })
    },
    {
      icon: Eye,
      title: t('privacyPolicy.sections.informationSharing.title'),
      content: t('privacyPolicy.sections.informationSharing.items', { returnObjects: true })
    },
    {
      icon: Database,
      title: t('privacyPolicy.sections.dataSecurity.title'),
      content: t('privacyPolicy.sections.dataSecurity.items', { returnObjects: true })
    },
    {
      icon: Users,
      title: t('privacyPolicy.sections.yourRights.title'),
      content: t('privacyPolicy.sections.yourRights.items', { returnObjects: true })
    },
    {
      icon: FileText,
      title: t('privacyPolicy.sections.dataRetention.title'),
      content: t('privacyPolicy.sections.dataRetention.items', { returnObjects: true })
    }
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${jobseekerBackground})` }}
    >
      <Header />
      
      {/* Hero Section */}
      <HeroSection 
        icon={Shield}
        title={t('privacyPolicy.title')}
        description={t('privacyPolicy.subtitle')}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20"
        >
          {/* Back Button */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
                             <ArrowLeft className="w-4 h-4 mr-2" />
               {t('privacyPolicy.backToHome')}
            </Link>
          </div>

          {/* Introduction */}
          <div className="mb-12">
                         <h2 className="text-3xl font-bold text-gray-900 mb-6">
               {t('privacyPolicy.introduction.title')}
             </h2>
             <p className="text-lg text-gray-700 leading-relaxed mb-6">
               {t('privacyPolicy.introduction.description')}
             </p>
             <p className="text-gray-600">
               <strong>{t('privacyPolicy.introduction.lastUpdated')}:</strong> {new Date().toLocaleDateString('en-US', { 
                 year: 'numeric', 
                 month: 'long', 
                 day: 'numeric' 
               })}
             </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="border-l-4 border-blue-500 pl-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Information */}
                     <div className="mt-16 p-6 bg-gray-50 rounded-xl">
             <h3 className="text-xl font-semibold text-gray-900 mb-4">
               {t('privacyPolicy.contact.title')}
             </h3>
             <p className="text-gray-700 mb-4">
               {t('privacyPolicy.contact.description')}
             </p>
             <div className="space-y-2 text-gray-600">
               <p><strong>{t('privacyPolicy.contact.email')}:</strong> {t('privacyPolicy.contact.emailValue')}</p>
               <p><strong>{t('privacyPolicy.contact.phone')}:</strong> {t('privacyPolicy.contact.phoneValue')}</p>
               <p><strong>{t('privacyPolicy.contact.address')}:</strong> {t('privacyPolicy.contact.addressValue')}</p>
             </div>
           </div>

                     {/* Updates Notice */}
           <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
             <p className="text-blue-800 text-sm">
               <strong>{t('privacyPolicy.updates.title')}:</strong> {t('privacyPolicy.updates.description')}
             </p>
           </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
