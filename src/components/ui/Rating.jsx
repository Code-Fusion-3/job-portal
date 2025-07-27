import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const Rating = ({ 
  value, 
  max = 5, 
  size = 'md',
  showValue = false,
  readonly = false,
  onChange,
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };
  
  const baseClasses = 'flex items-center gap-1';
  const classes = `${baseClasses} ${className}`;
  
  const handleClick = (starValue) => {
    if (!readonly && onChange) {
      onChange(starValue);
    }
  };
  
  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= max; i++) {
      const isFilled = i <= value;
      const isHalf = i === Math.ceil(value) && value % 1 !== 0;
      
      stars.push(
        <motion.div
          key={i}
          className={`cursor-pointer ${readonly ? 'cursor-default' : ''}`}
          onClick={() => handleClick(i)}
          whileHover={!readonly ? { scale: 1.2 } : {}}
          whileTap={!readonly ? { scale: 0.9 } : {}}
        >
          <Star
            className={`${sizes[size]} ${
              isFilled 
                ? 'text-yellow-400 fill-current' 
                : isHalf 
                  ? 'text-yellow-400 fill-current opacity-50' 
                  : 'text-gray-300'
            }`}
          />
        </motion.div>
      );
    }
    
    return stars;
  };
  
  return (
    <div className={classes} {...props}>
      {renderStars()}
      {showValue && (
        <span className="text-sm text-gray-600 ml-2">
          {value.toFixed(1)}/{max}
        </span>
      )}
    </div>
  );
};

export default Rating; 