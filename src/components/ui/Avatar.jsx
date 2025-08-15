import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Avatar = ({ 
  src, 
  alt, 
  size = 'md',
  fallback = null,
  fallbackSrc = null, // optional image src to use when remote src fails
  className = '',
  ...props 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [triedLoad, setTriedLoad] = useState(false);
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
    // Only render image if we successfully preloaded it
    if (src && imageLoaded) {
      return (
        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-full object-cover"
        />
      );
    }

    // If we attempted to load a remote image but it failed, and a fallbackSrc was provided,
    // render the fallback image (this mirrors the onError behaviour used elsewhere in the app).
    if (src && triedLoad && !imageLoaded && fallbackSrc) {
      return (
        <img
          src={fallbackSrc}
          alt={alt}
          className="w-full h-full rounded-full object-cover"
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
  
  // Attempt to preload the image so we can detect load failures before rendering
  useEffect(() => {
    let mounted = true;
    setImageLoaded(false);
    setTriedLoad(false);
    if (!src) return;
    try {
      const img = new Image();
      // try anonymous CORS to improve chances when backend allows it
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (mounted) {
          setImageLoaded(true);
          setTriedLoad(true);
        }
      };
      img.onerror = () => {
        if (mounted) {
          setImageLoaded(false);
          setTriedLoad(true);
        }
      };
      img.src = src;
    } catch (err) {
      if (mounted) setTriedLoad(true);
    }
    return () => { mounted = false; };
  }, [src]);

  return (
    <motion.div
      className={classes}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {renderContent()}
    </motion.div>
  );
};

export default Avatar; 