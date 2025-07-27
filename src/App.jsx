import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './components/layout/Header';
import Hero from './components/sections/Hero';
import Features from './components/sections/Features';
import LatestJobSeekers from './components/sections/LatestJobSeekers';
import AboutUs from './components/sections/AboutUs';
import ContactUs from './components/sections/ContactUs';
import Footer from './components/layout/Footer';
import { useScrollAnimations } from './hooks/useScrollAnimations';
import './App.css';

function App() {
  const { containerRef } = useScrollAnimations();

  // Smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <main className="w-full">
        <Hero />
        <Features />
        <LatestJobSeekers />
        <AboutUs />
        <ContactUs />
      </main>
      <Footer />
    </motion.div>
  );
}

export default App;
