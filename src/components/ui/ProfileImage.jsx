import React from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import defaultProfileImage from '../../assets/defaultProfileImage.jpeg';

/**
 * ProfileImage Component with Privacy Controls
 * 
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {string} size - Size variant: xs, sm, md, lg, xl, 2xl, 3xl
 * @param {string} variant - Shape variant: default, rounded, circle, square
 * @param {string} className - Additional CSS classes
 * @param {boolean} showBorder - Whether to show border
 * @param {string} borderColor - Border color classes
 * @param {boolean} showShadow - Whether to show shadow
 * @param {boolean} isClickable - Whether image is clickable
 * @param {function} onClick - Click handler function
 * @param {string} loading - Loading attribute
 * @param {boolean} isPrivate - Whether to apply privacy blur and show hover message (default: true)
 * @param {string} blurIntensity - Blur intensity: xs, sm, md, lg, xl
 * @param {object} props - Additional props passed to img element
 */

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
  isPrivate = true, // New prop to control privacy blur
  blurIntensity = "lg", // xs, sm, md, lg, xl for blur intensity
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

  // Privacy blur classes
  const blurIntensityClasses = {
    xs: "filter blur-sm",
    sm: "filter blur-md", 
    md: "filter blur-lg",
    lg: "filter blur-xl",
    xl: "filter blur-2xl"
  };
  const privacyClasses = isPrivate ? blurIntensityClasses[blurIntensity] || blurIntensityClasses.lg : "";

  // Base classes
  const baseClasses = `
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    ${borderClasses} 
    ${shadowClasses} 
    ${privacyClasses}
    object-cover 
    bg-gray-100
    ${className}
  `.trim();

  // Clickable styles
  const clickableClasses = isClickable ? "cursor-pointer hover:scale-105 transition-transform duration-200" : "";

  // Privacy hover effect - keep blur and show message
  const privacyHoverClasses = isPrivate ? "transition-all duration-300" : "";

  const ImageComponent = (
    <img
      src={src}
      alt={alt}
      className={`${baseClasses} ${clickableClasses} ${privacyHoverClasses}`}
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
        className="inline-block relative group"
      >
        {ImageComponent}
        {isPrivate && (
          <>
            <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1 shadow-lg">
              <EyeOff className="w-3 h-3" />
            </div>
                    {/* Hover message overlay */}
            <div className="absolute inset-0 bg-black/70 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-center text-white p-3">
                <EyeOff className="w-4 h-4 mx-auto mb-1 text-blue-300" />
                <p className="text-xs font-medium leading-tight">Contact admin to<br/>view full profile</p>
              </div>
            </div>
          </>
        )}
      </motion.div>
    );
  }

  // Add privacy indicator for non-clickable images
  if (isPrivate) {
    return (
      <div className="inline-block relative group">
        {ImageComponent}
        <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1 shadow-lg">
          <EyeOff className="w-3 h-3" />
        </div>
        {/* Hover message overlay */}
        <div className="absolute inset-0 bg-black/70 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-center text-white p-3">
            <EyeOff className="w-4 h-4 mx-auto mb-1 text-blue-300" />
            <p className="text-xs font-medium leading-tight">Contact admin to<br/>view full profile</p>
          </div>
        </div>
      </div>
    );
  }

  return ImageComponent;
};

export default ProfileImage; 