import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '',
  removable = false,
  onRemove,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-colors duration-200';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    primary: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    secondary: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    success: 'bg-green-100 text-green-800 hover:bg-green-200',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    danger: 'bg-red-100 text-red-800 hover:bg-red-200',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <motion.span
      className={classes}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          type="button"
        >
          ×
        </button>
      )}
    </motion.span>
  );
};

export default Badge; 