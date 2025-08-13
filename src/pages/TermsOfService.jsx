import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FileText, CheckCircle, AlertTriangle, Users, Shield, Handshake, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/ui/HeroSection';
import jobseekerBackground from '../assets/jobseekerBackground.png';

const TermsOfService = () => {
  const { t } = useTranslation();

  const sections = [
    {
      icon: Users,
      title: t('termsOfService.sections.acceptanceOfTerms.title'),
      content: t('termsOfService.sections.acceptanceOfTerms.items', { returnObjects: true })
    },
    {
      icon: Shield,
      title: t('termsOfService.sections.userAccounts.title'),
      content: t('termsOfService.sections.userAccounts.items', { returnObjects: true })
    },
    {
      icon: Handshake,
      title: t('termsOfService.sections.acceptableUse.title'),
      content: t('termsOfService.sections.acceptableUse.items', { returnObjects: true })
    },
    {
      icon: CheckCircle,
      title: t('termsOfService.sections.jobSeekerObligations.title'),
      content: t('termsOfService.sections.jobSeekerObligations.items', { returnObjects: true })
    },
    {
      icon: AlertTriangle,
      title: t('termsOfService.sections.prohibitedActivities.title'),
      content: t('termsOfService.sections.prohibitedActivities.items', { returnObjects: true })
    },
    {
      icon: FileText,
      title: t('termsOfService.sections.intellectualProperty.title'),
      content: t('termsOfService.sections.intellectualProperty.items', { returnObjects: true })
    },
    {
      icon: Shield,
      title: t('termsOfService.sections.limitationOfLiability.title'),
      content: t('termsOfService.sections.limitationOfLiability.items', { returnObjects: true })
    },
    {
      icon: Handshake,
      title: t('termsOfService.sections.termination.title'),
      content: t('termsOfService.sections.termination.items', { returnObjects: true })
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
        icon={FileText}
        title={t('termsOfService.title')}
        description={t('termsOfService.subtitle')}
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
              {t('termsOfService.backToHome')}
            </Link>
          </div>

          {/* Introduction */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('termsOfService.introduction.title')}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {t('termsOfService.introduction.description')}
            </p>
            <p className="text-gray-600">
              <strong>{t('termsOfService.introduction.lastUpdated')}:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Terms Sections */}
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

          {/* Governing Law */}
          <div className="mt-16 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {t('termsOfService.governingLaw.title')}
            </h3>
            <p className="text-gray-700 mb-4">
              {t('termsOfService.governingLaw.description')}
            </p>
          </div>

          {/* Contact Information */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {t('termsOfService.contact.title')}
            </h3>
            <p className="text-gray-700 mb-4">
              {t('termsOfService.contact.description')}
            </p>
            <div className="space-y-2 text-gray-600">
              <p><strong>{t('termsOfService.contact.email')}:</strong> {t('termsOfService.contact.emailValue')}</p>
              <p><strong>{t('termsOfService.contact.phone')}:</strong> {t('termsOfService.contact.phoneValue')}</p>
              <p><strong>{t('termsOfService.contact.address')}:</strong> {t('termsOfService.contact.addressValue')}</p>
            </div>
          </div>

          {/* Important Notice */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>{t('termsOfService.important.title')}:</strong> {t('termsOfService.important.description')}
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;
