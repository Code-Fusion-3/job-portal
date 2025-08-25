import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Calendar,
  X,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import Button from './Button';

const ApprovalSuccessFeedback = ({
  isVisible = false,
  onClose = null,
  operation = 'completed',
  profileData = null,
  message = '',
  details = {},
  autoHide = true,
  autoHideDelay = 5000,
  className = '',
  ...props
}) => {
  const [isVisibleState, setIsVisibleState] = useState(isVisible);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    setIsVisibleState(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (autoHide && isVisibleState && autoHideDelay > 0) {
      const timer = setTimeout(() => {
        setIsVisibleState(false);
        if (onClose) onClose();
      }, autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [autoHide, isVisibleState, autoHideDelay, onClose]);

  const handleClose = () => {
    setIsVisibleState(false);
    if (onClose) onClose();
  };

  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const getOperationIcon = () => {
    switch (operation) {
      case 'approved':
        return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' };
      case 'rejected':
        return { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' };
      case 'pending':
        return { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
      default:
        return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' };
    }
  };

  const getOperationTitle = () => {
    switch (operation) {
      case 'approved':
        return 'Profile Approved Successfully';
      case 'rejected':
        return 'Profile Rejected';
      case 'pending':
        return 'Profile Status Updated';
      default:
        return 'Operation Completed';
    }
  };

  const getOperationDescription = () => {
    switch (operation) {
      case 'approved':
        return 'The job seeker profile has been approved and is now visible to employers.';
      case 'rejected':
        return 'The job seeker profile has been rejected with the provided reason.';
      case 'pending':
        return 'The profile status has been updated and is now pending review.';
      default:
        return 'The requested operation has been completed successfully.';
    }
  };

  const iconConfig = getOperationIcon();
  const IconComponent = iconConfig.icon;

  if (!isVisibleState) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{ 
          duration: 0.4, 
          ease: [0.4, 0, 0.2, 1],
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className={`fixed top-4 right-4 z-50 max-w-md w-full ${className}`}
        {...props}
      >
        <div className="bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${iconConfig.bgColor} flex items-center justify-center`}>
                  <IconComponent className={`w-5 h-5 ${iconConfig.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getOperationTitle()}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getOperationDescription()}
                  </p>
                </div>
              </div>
              
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {/* Success Message */}
            {message && (
              <div className="mb-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {message}
                </p>
              </div>
            )}

            {/* Profile Information */}
            {profileData && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Profile Details</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  {profileData.name && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Name:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-medium">{profileData.name}</span>
                        <button
                          onClick={() => copyToClipboard(profileData.name, 'name')}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copy name"
                        >
                          {copiedField === 'name' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {profileData.email && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Email:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-medium">{profileData.email}</span>
                        <button
                          onClick={() => copyToClipboard(profileData.email, 'email')}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copy email"
                        >
                          {copiedField === 'email' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {profileData.id && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Profile ID:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-mono text-xs">{profileData.id}</span>
                        <button
                          onClick={() => copyToClipboard(profileData.id.toString(), 'id')}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copy ID"
                        >
                          {copiedField === 'id' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Details */}
            {Object.keys(details).length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Operation Details</span>
                </div>
                
                <div className="space-y-1 text-sm">
                  {Object.entries(details).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-blue-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-blue-900 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                {autoHide && `Auto-hiding in ${Math.ceil(autoHideDelay / 1000)}s`}
              </div>
              
              <div className="flex gap-2">
                {profileData?.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Navigate to profile view
                      window.open(`/admin/profiles/${profileData.id}`, '_blank');
                    }}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Profile
                  </Button>
                )}
                
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleClose}
                >
                  Got it
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ApprovalSuccessFeedback;
