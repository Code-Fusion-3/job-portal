import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronUp, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  footerConfig, 
  getFooterSections, 
  getSocialLinks, 
  getBottomBarLinks 
} from '../../data/footerData';

// Reusable Footer Section Component
const FooterSection = ({ title, children, className = '' }) => (
  <div className={`text-center sm:text-left ${className}`}>
    <h3 className="text-lg font-semibold mb-6 text-white">
      {title}
    </h3>
    {children}
  </div>
);

// Reusable Footer Link Component
const FooterLink = ({ href, icon: Icon, children, isExternal = false, className = '' }) => {
  const linkContent = (
    <motion.div
      className={`text-gray-400 hover:text-white transition-colors duration-200 flex items-center group ${className}`}
      whileHover={{ x: 4 }}
    >
      {Icon && (
        <Icon 
          size={16} 
          className="mr-2 group-hover:text-blue-400 transition-colors duration-200 flex-shrink-0" 
        />
      )}
      <span className="flex-1">{children}</span>
      {isExternal && (
        <ExternalLink 
          size={12} 
          className="ml-1 group-hover:text-blue-400 transition-colors duration-200 flex-shrink-0" 
        />
      )}
    </motion.div>
  );

  if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) {
    return (
      <a 
        href={href} 
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="block"
      >
        {linkContent}
      </a>
    );
  }

  if (href.startsWith('/')) {
    return (
      <Link to={href} className="block">
        {linkContent}
      </Link>
    );
  }

  return (
    <a href={href} className="block">
      {linkContent}
    </a>
  );
};

// Reusable Social Media Link Component
const SocialLink = ({ icon: Icon, href, label, color = 'hover:bg-blue-600', className = '' }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center ${color} transition-all duration-200 ${className}`}
    whileHover={{ scale: 1.1, rotate: 5 }}
    whileTap={{ scale: 0.9 }}
    aria-label={label}
  >
    <Icon size={20} />
  </motion.a>
);

// Reusable Company Logo Component
const CompanyLogo = ({ className = '', config = footerConfig.company }) => (
  <motion.div 
    className={`flex items-center ${className}`}
    whileHover={{ scale: 1.05 }}
  >
    <div className={`w-10 h-10 bg-gradient-to-r ${config.logo.gradient} rounded-lg flex items-center justify-center`}>
      <span className="text-white font-bold text-xl">{config.logo.text}</span>
    </div>
    <span className="ml-3 text-2xl font-bold">{config.name}</span>
  </motion.div>
);

// Reusable Back to Top Button Component
const BackToTopButton = ({ className = '', config = footerConfig.backToTop }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.button
      className={`${config.position} ${config.size} bg-gradient-to-r ${config.gradient} rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-200 ${config.zIndex} ${className}`}
      onClick={scrollToTop}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      aria-label="Back to top"
    >
      <ChevronUp size={24} />
    </motion.button>
  );
};

// Main Footer Component
const Footer = ({ 
  variant = 'default', // 'default', 'minimal', 'extended'
  showBackToTop = true,
  className = '',
  customConfig = null,
  ...props 
}) => {
  const { t } = useTranslation();
  
  // Use custom config if provided, otherwise use default
  const config = customConfig || footerConfig;
  const variantConfig = config.variants[variant] || config.variants.default;
  
  // Get footer data with translations
  const footerSections = getFooterSections(t);
  const socialLinks = getSocialLinks();
  const bottomBarLinks = getBottomBarLinks(t);

  return (
    <footer className={`${variantConfig.background} text-white ${className}`} {...props}>
      {/* Main Footer Content */}
      <div className={variantConfig.container}>
        <div className={variantConfig.grid}>
          {/* Company Info */}
          <div className={`${variantConfig.companySpan} text-center sm:text-left`}>
            <CompanyLogo className="mb-6" config={config.company} />
            <p className="text-gray-400 mb-6 leading-relaxed text-sm sm:text-base">
              {t(config.company.description)}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 justify-center sm:justify-start">
              {socialLinks.map((social, index) => (
                <SocialLink
                  key={index}
                  icon={social.icon}
                  href={social.href}
                  label={social.label}
                  color={social.color}
                />
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <FooterSection key={index} title={section.title}>
              <ul className="space-y-3 sm:space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <FooterLink
                      href={link.href}
                      icon={link.icon}
                      isExternal={link.isExternal}
                    >
                      {link.name}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </FooterSection>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              {bottomBarLinks.map((link, index) => (
                <FooterLink key={index} href={link.href} className="!text-sm">
                  {link.name}
                </FooterLink>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && <BackToTopButton config={config.backToTop} />}
    </footer>
  );
};

// Export individual components for reuse
export { FooterSection, FooterLink, SocialLink, CompanyLogo, BackToTopButton };

export default Footer; 