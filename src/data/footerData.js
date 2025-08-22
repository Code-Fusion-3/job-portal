import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram 
} from 'lucide-react';

// Footer configuration data
export const footerConfig = {
  company: {
    name: 'JobPortal',
    description: 'footer.description', // Translation key
    logo: {
      text: 'J',
      gradient: 'from-red-600 to-red-700'
    }
  },
  
  // Social media links
  socialLinks: [
    { 
      icon: Facebook, 
      href: 'https://facebook.com/jobportal', 
      label: 'Facebook',
      color: 'hover:bg-blue-600'
    },
    { 
      icon: Twitter, 
      href: 'https://twitter.com/jobportal', 
      label: 'Twitter',
      color: 'hover:bg-blue-400'
    },
    { 
      icon: Linkedin, 
      href: 'https://linkedin.com/company/jobportal', 
      label: 'LinkedIn',
      color: 'hover:bg-blue-700'
    },
    { 
      icon: Instagram, 
      href: 'https://instagram.com/jobportal', 
      label: 'Instagram',
      color: 'hover:bg-pink-600'
    },
  ],

  // Footer sections configuration
  sections: [
    {
      key: 'quickLinks',
      titleKey: 'footer.quickLinks',
      links: [
        { nameKey: 'nav.home', href: '/', icon: null },
        { nameKey: 'nav.jobSeekers', href: '/job-seekers', icon: null },
        { nameKey: 'nav.about', href: '/about', icon: null },
        { nameKey: 'nav.adminInfo', href: '/admin-info', icon: null },
        { nameKey: 'nav.contact', href: '/contact', icon: null },
      ],
    },
    {
      key: 'contact',
      titleKey: 'footer.contact',
      links: [
        { 
          name: 'info@jobportal.rw', 
          href: 'mailto:info@jobportal.rw', 
          icon: Mail,
          isExternal: true 
        },
        { 
          name: '+250 788 123 456', 
          href: 'tel:+250788123456', 
          icon: Phone,
          isExternal: true 
        },
        { 
          name: 'Kigali, Rwanda', 
          href: '#', 
          icon: MapPin 
        },
      ],
    },
    {
      key: 'legal',
      titleKey: 'footer.legal',
      links: [
        { nameKey: 'footer.privacy', href: '/privacy', icon: null },
        { nameKey: 'footer.terms', href: '/terms', icon: null },
      ],
    },
  ],

  // Footer variants configuration
  variants: {
    default: {
      background: 'bg-gray-900',
      container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16',
      grid: 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8',
      companySpan: 'col-span-2 md:col-span-1 lg:col-span-1'
    },
    minimal: {
      background: 'bg-gray-800',
      container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8',
      grid: 'grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6',
      companySpan: 'col-span-2 md:col-span-1 lg:col-span-1'
    },
    extended: {
      background: 'bg-gray-900',
      container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20',
      grid: 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8',
      companySpan: 'col-span-2 md:col-span-1 lg:col-span-2'
    }
  },

  // Bottom bar links
  bottomBarLinks: [
    { nameKey: 'footer.privacy', href: '/privacy' },
    { nameKey: 'footer.terms', href: '/terms' },
  ],

  // Back to top button configuration
  backToTop: {
    position: 'fixed bottom-8 right-8',
    size: 'w-12 h-12',
    gradient: 'from-red-600 to-red-700',
    zIndex: 'z-50'
  }
};

// Helper function to get footer sections with translations
export const getFooterSections = (t) => {
  return footerConfig.sections.map(section => ({
    ...section,
    title: t(section.titleKey),
    links: section.links.map(link => ({
      ...link,
      name: link.nameKey ? t(link.nameKey) : link.name
    }))
  }));
};

// Helper function to get social links with custom colors
export const getSocialLinks = () => {
  return footerConfig.socialLinks;
};

// Helper function to get bottom bar links with translations
export const getBottomBarLinks = (t) => {
  return footerConfig.bottomBarLinks.map(link => ({
    ...link,
    name: t(link.nameKey)
  }));
}; 