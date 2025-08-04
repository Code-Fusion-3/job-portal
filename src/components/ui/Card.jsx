import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Card = forwardRef(({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  animation = true,
  title,
  subtitle,
  ...props 
}, ref) => {
  const baseClasses = 'bg-white rounded-xl shadow-lg transition-all duration-300 overflow-hidden flex flex-col';
  
  const variants = {
    default: 'hover:shadow-xl',
    elevated: 'shadow-xl hover:shadow-2xl',
    outlined: 'border-2 border-gray-200 hover:border-gray-300',
    flat: 'shadow-none hover:shadow-md'
  };
  
  const hoverClasses = hover ? variants[variant] : '';
  const classes = `${baseClasses} ${hoverClasses} ${className}`;
  
  const Component = animation ? motion.div : 'div';
  
  return (
    <Component
      ref={ref}
      className={classes}
      whileHover={animation && hover ? { y: -4, scale: 1.02 } : {}}
      whileTap={animation ? { scale: 0.98 } : {}}
      {...props}
    >
      {(title || subtitle) && (
        <div className="p-6 pb-4 border-b border-gray-100">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className={title || subtitle ? 'p-6 pt-4' : 'p-6'}>
        {children}
      </div>
    </Component>
  );
});

Card.displayName = 'Card';

export default Card; 