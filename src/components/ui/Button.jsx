import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  as = 'button',
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white focus:ring-gray-500 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500',
    ghost: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl',
    red: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl',
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  // Extract Framer Motion props and other props
  const { 
    whileHover, 
    whileTap, 
    onClick,
    disabled,
    type,
    ...otherProps 
  } = props;
  
  // Handle different component types properly
  if (as === 'button') {
    return (
      <motion.button
        ref={ref}
        className={classes}
        whileHover={whileHover || { scale: 1.02 }}
        whileTap={whileTap || { scale: 0.98 }}
        onClick={onClick}
        disabled={disabled}
        type={type || 'button'}
        {...otherProps}
      >
        {children}
      </motion.button>
    );
  }
  
  // For Link components and other custom components
  const Component = as;
  return (
    <Component
      ref={ref}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...otherProps}
    >
      {children}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button; 