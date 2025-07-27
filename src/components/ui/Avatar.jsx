import { motion } from 'framer-motion';

const Avatar = ({ 
  src, 
  alt, 
  size = 'md',
  fallback = null,
  className = '',
  ...props 
}) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24'
  };
  
  const baseClasses = 'rounded-full object-cover bg-gray-200 flex items-center justify-center';
  const classes = `${baseClasses} ${sizes[size]} ${className}`;
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const renderContent = () => {
    if (src) {
      return (
        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }
    
    if (fallback) {
      return (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
          {getInitials(fallback)}
        </div>
      );
    }
    
    return (
      <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
        <svg className="w-1/2 h-1/2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </div>
    );
  };
  
  return (
    <motion.div
      className={classes}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {renderContent()}
      {src && (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold" style={{ display: 'none' }}>
          {getInitials(alt || 'User')}
        </div>
      )}
    </motion.div>
  );
};

export default Avatar; 