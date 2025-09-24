import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { footerConfig, getBottomBarLinks } from '../../data/footerData';

// Minimal Footer Component
const MinimalFooter = ({ 
  showSocialLinks = false,
  showBackToTop = false,
  className = '',
  ...props 
}) => {
  const { t } = useTranslation();
  const bottomBarLinks = getBottomBarLinks(t);

  return (
    <footer className={`bg-gray-800 text-white ${className}`} {...props}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Company Info */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <span className="ml-2 text-lg font-bold">Brazi Connect Portal</span>
          </div>

          {/* Social Links (Optional) */}
          {showSocialLinks && (
            <div className="flex space-x-3">
              {footerConfig.socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center ${social.color} transition-all duration-200`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
          )}

          {/* Bottom Bar Links */}
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            {bottomBarLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="hover:text-white transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-center text-gray-400 text-sm">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default MinimalFooter; 