import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Card = forwardRef(({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  animation = true,
  ...props 
}, ref) => {
  const baseClasses = 'bg-white rounded-xl shadow-lg transition-all duration-300 overflow-hidden';
  
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
      {children}
    </Component>
  );
});

Card.displayName = 'Card';

export default Card; 