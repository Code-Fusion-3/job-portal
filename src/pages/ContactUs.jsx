import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Header from '../components/layout/Header';
import ContactUs from '../components/sections/ContactUs';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorBoundary from '../components/ui/ErrorBoundary';

const ContactUsPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate content loading and ensure proper rendering
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-16 flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" text="Loading Contact Us..." />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <main className="pt-16">
        <ErrorBoundary>
          <ContactUs />
        </ErrorBoundary>
      </main>
      <Footer />
    </motion.div>
  );
};

export default ContactUsPage; 