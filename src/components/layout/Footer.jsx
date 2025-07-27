import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram 
} from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  const footerLinks = [
    {
      title: t('footer.quickLinks'),
      links: [
        { name: t('nav.home'), href: '#home' },
        { name: t('nav.register'), href: '#register' },
        { name: t('nav.login'), href: '#login' },
        { name: t('nav.viewJobSeekers'), href: '#job-seekers' },
      ],
    },
    {
      title: t('footer.contact'),
      links: [
        { name: 'info@jobportal.rw', href: 'mailto:info@jobportal.rw', icon: Mail },
        { name: '+250 788 123 456', href: 'tel:+250788123456', icon: Phone },
        { name: 'Kigali, Rwanda', href: '#', icon: MapPin },
      ],
    },
    {
      title: t('footer.legal'),
      links: [
        { name: t('footer.privacy'), href: '#privacy' },
        { name: t('footer.terms'), href: '#terms' },
        { name: t('footer.cookies'), href: '#cookies' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <motion.div 
              className="flex items-center mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <span className="ml-3 text-2xl font-bold">JobPortal</span>
            </motion.div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {t('footer.description')}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-6 text-white">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <motion.a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                      whileHover={{ x: 4 }}
                    >
                      {link.icon && (
                        <link.icon 
                          size={16} 
                          className="mr-2 group-hover:text-blue-400 transition-colors duration-200" 
                        />
                      )}
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <motion.a
                href="#privacy"
                className="hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
              >
                Privacy Policy
              </motion.a>
              <motion.a
                href="#terms"
                className="hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
              >
                Terms of Service
              </motion.a>
              <motion.a
                href="#cookies"
                className="hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
              >
                Cookie Policy
              </motion.a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-200 z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>
    </footer>
  );
};

export default Footer; 