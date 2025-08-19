import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const StatusBadge = ({ 
  status, 
  showIcon = true, 
  size = 'md',
  className = '',
  ...props 
}) => {
  // Validate status prop
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    console.warn(`Invalid status: ${status}. Must be one of: pending, approved, rejected`);
    return null;
  }

  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-colors duration-200 border';
  
  const statusConfig = {
    pending: {
      label: 'Awaiting Review',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: Clock,
      iconColor: 'text-gray-600'
    },
    approved: {
      label: 'Publicly Visible',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    rejected: {
      label: 'Rejected',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: XCircle,
      iconColor: 'text-red-600'
    }
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const currentConfig = statusConfig[status];
  const IconComponent = currentConfig.icon;
  
  const classes = `${baseClasses} ${currentConfig.color} ${sizes[size]} ${className}`;

  return (
    <motion.span
      className={classes}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      role="status"
      aria-label={`Approval status: ${currentConfig.label}`}
      {...props}
    >
      {showIcon && (
        <IconComponent 
          className={`w-4 h-4 ${currentConfig.iconColor}`} 
          aria-hidden="true"
        />
      )}
      <span>{currentConfig.label}</span>
    </motion.span>
  );
};

export default StatusBadge;
