import React from 'react';
import { motion } from 'motion/react';
import defaultProfileImage from '../../assets/defaultProfileImage.jpeg';

const ProfileImage = ({ 
  src = defaultProfileImage,
  alt = "Profile",
  size = "md", // xs, sm, md, lg, xl
  variant = "default", // default, rounded, circle, square
  className = "",
  showBorder = false,
  borderColor = "border-gray-200",
  showShadow = false,
  isClickable = false,
  onClick = null,
  loading = "lazy",
  ...props 
}) => {
  // Size classes
  const sizeClasses = {
    xs: "w-8 h-8",
    sm: "w-12 h-12", 
    md: "w-16 h-16",
    lg: "w-20 h-20",
    xl: "w-24 h-24",
    "2xl": "w-32 h-32",
    "3xl": "w-40 h-40"
  };

  // Variant classes
  const variantClasses = {
    default: "rounded-lg",
    rounded: "rounded-xl",
    circle: "rounded-full",
    square: "rounded-none"
  };

  // Border classes
  const borderClasses = showBorder ? `border-2 ${borderColor}` : "";

  // Shadow classes
  const shadowClasses = showShadow ? "shadow-md" : "";

  // Base classes
  const baseClasses = `
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    ${borderClasses} 
    ${shadowClasses} 
    object-cover 
    bg-gray-100
    ${className}
  `.trim();

  // Clickable styles
  const clickableClasses = isClickable ? "cursor-pointer hover:scale-105 transition-transform duration-200" : "";

  const ImageComponent = (
    <img
      src={src}
      alt={alt}
      className={`${baseClasses} ${clickableClasses}`}
      loading={loading}
      {...props}
    />
  );

  // If clickable, wrap with motion.div for better interaction
  if (isClickable && onClick) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="inline-block"
      >
        {ImageComponent}
      </motion.div>
    );
  }

  return ImageComponent;
};

export default ProfileImage; 