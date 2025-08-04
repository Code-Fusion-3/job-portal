import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setIsLanguageOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && 
          menuRef.current && 
          !menuRef.current.contains(event.target) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    // Close language dropdown when clicking outside
    const handleLanguageClickOutside = (event) => {
      if (isLanguageOpen && 
          !event.target.closest('.language-dropdown')) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousedown', handleLanguageClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleLanguageClickOutside);
    };
  }, [isMenuOpen, isLanguageOpen]);

  const navItems = [
    { key: 'nav.home', href: '/', isExternal: false },
    { key: 'nav.jobSeekers', href: '/job-seekers', isExternal: false },
    { key: 'nav.contact', href: '/contact', isExternal: false },
    { key: 'nav.about', href: '/about', isExternal: false },
  ];

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-20 backdrop-blur-md border-b border-white border-opacity-20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <span className="ml-2 text-xl font-bold text-white">JobPortal</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.isExternal ? (
                <motion.a
                  key={item.key}
                  href={item.href}
                  className="text-white hover:text-red-400 transition-colors duration-200 font-medium"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t(item.key)}
                </motion.a>
              ) : (
                <motion.div
                  key={item.key}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.href}
                    className={`transition-colors duration-200 font-medium ${
                      location.pathname === item.href
                        ? 'text-red-400'
                        : 'text-white hover:text-red-400'
                    }`}
                  >
                    {t(item.key)}
                  </Link>
                </motion.div>
              )
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Language Switcher */}
            <div className="relative language-dropdown">
              <motion.button
                className="flex items-center space-x-1 text-white hover:text-red-400 transition-colors duration-200"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe size={18} />
                <span className="font-medium">{i18n.language === 'en' ? 'EN' : 'RW'}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isLanguageOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {isLanguageOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => toggleLanguage('en')}
                    >
                      English
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => toggleLanguage('rw')}
                    >
                      Kinyarwanda
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button as="div" variant="ghost" size="sm" className="text-white hover:text-red-400 hover:bg-white hover:bg-opacity-20">
                  {t('nav.login')}
                </Button>
              </Link>
              <Link to="/register">
                <Button as="div" variant="primary" size="sm" className="bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700">
                  {t('nav.register')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            ref={buttonRef}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              className="md:hidden border-t border-white border-opacity-20 py-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  item.isExternal ? (
                    <motion.a
                      key={item.key}
                      href={item.href}
                      className="text-white hover:text-red-400 transition-colors duration-200 font-medium"
                      whileHover={{ x: 4 }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t(item.key)}
                    </motion.a>
                  ) : (
                    <motion.div
                      key={item.key}
                      whileHover={{ x: 4 }}
                    >
                      <Link
                        to={item.href}
                        className={`transition-colors duration-200 font-medium ${
                          location.pathname === item.href
                            ? 'text-red-400'
                            : 'text-white hover:text-red-400'
                        }`}
                        onClick={() => {
                          setIsMenuOpen(false);
                        }}
                      >
                        {t(item.key)}
                      </Link>
                    </motion.div>
                  )
                ))}
                <div className="pt-4 border-t border-white border-opacity-20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white text-opacity-70">{t('nav.language')}</span>
                    <div className="flex space-x-2">
                      <button
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                          i18n.language === 'en' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                        }`}
                        onClick={() => toggleLanguage('en')}
                      >
                        EN
                      </button>
                      <button
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                          i18n.language === 'rw' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                        }`}
                        onClick={() => toggleLanguage('rw')}
                      >
                        RW
                      </button>
                    </div>
                  </div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header; 