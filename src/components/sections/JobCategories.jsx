import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, Users } from 'lucide-react';
import { usePublicCategories } from '../../api/hooks/useCategories.js';
import LoadingSpinner from '../ui/LoadingSpinner';

const JobCategories = () => {
  const { t } = useTranslation();
  const { categories, loading, error } = usePublicCategories();

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Loading job categories...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !categories || categories.length === 0) {
    return null; // Don't show section if there's an error or no categories
  }

  // Limit to first 8 categories for homepage display
  const displayCategories = categories.slice(0, 8);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            {t('jobCategories.title', 'Browse Job Categories')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            {t('jobCategories.subtitle', 'Find skilled workers across various job categories. Click on any category to explore available workers.')}
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {displayCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                to={`/job-seekers?category=${encodeURIComponent(category.name_en.toLowerCase())}`}
                className="group block"
              >
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 h-full">
                  {/* Category Icon */}
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 group-hover:bg-blue-200 transition-colors">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>

                  {/* Category Name */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name_en}
                  </h3>
                  
                  {/* Kinyarwanda Name */}
                  <p className="text-sm text-gray-500 mb-3">
                    {category.name_rw}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center text-sm text-blue-600 group-hover:text-blue-700">
                    <span>View Workers</span>
                    <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Show More Button */}
        {categories.length > 8 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Link
              to="/job-seekers"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Users className="h-5 w-5 mr-2" />
              View All Categories & Workers
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center justify-center space-x-8 bg-white rounded-lg px-8 py-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
              <p className="text-sm text-gray-600">Job Categories</p>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center hidden">
              <p className="text-2xl font-bold text-green-600">100+</p>
              <p className="text-sm text-gray-600">Skilled Workers</p>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">24/7</p>
              <p className="text-sm text-gray-600">Available Support</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JobCategories;
