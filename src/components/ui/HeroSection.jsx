import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = ({ 
  icon: Icon, 
  title, 
  description, 
  className = "" 
}) => {
  return (
    <div className={`relative mt-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          {Icon && (
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Icon className="w-8 h-8 text-white" />
              </div>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            {title}
          </h1>
          {description && (
            <p className="text-xl text-white/95 max-w-2xl mx-auto drop-shadow-md">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;