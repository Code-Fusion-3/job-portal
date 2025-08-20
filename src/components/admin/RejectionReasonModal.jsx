import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, XCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const RejectionReasonModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  profileName = 'this profile',
  className = '',
  ...props 
}) => {
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation rules
  const validationRules = {
    reason: {
      required: true,
      minLength: 10,
      maxLength: 500
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!reason.trim()) {
      newErrors.reason = 'Rejection reason is required';
    } else if (reason.trim().length < validationRules.reason.minLength) {
      newErrors.reason = `Rejection reason must be at least ${validationRules.reason.minLength} characters`;
    } else if (reason.trim().length > validationRules.reason.maxLength) {
      newErrors.reason = `Rejection reason must be no more than ${validationRules.reason.maxLength} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(reason.trim());
      handleClose();
    } catch (error) {
      console.error('Error submitting rejection reason:', error);
      setErrors({ general: 'Failed to submit rejection reason. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle close
  const handleClose = () => {
    setReason('');
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setReason('');
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Character count
  const characterCount = reason.length;
  const isOverLimit = characterCount > validationRules.reason.maxLength;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Reject Profile: ${profileName}`}
      maxWidth="max-w-lg"
      showCloseButton={true}
      {...props}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Warning Message */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <p className="font-medium">Rejecting this profile will:</p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Hide the profile from public view</li>
                <li>Send a notification to the job seeker</li>
                <li>Require re-approval if the profile is updated</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Rejection Reason Input */}
        <div className="space-y-2">
          <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700">
            Rejection Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            id="rejectionReason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a clear reason for rejecting this profile. This will be shared with the job seeker."
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none ${
              errors.reason ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
            } ${isOverLimit ? 'border-red-300' : ''}`}
            rows={4}
            maxLength={validationRules.reason.maxLength}
            disabled={isSubmitting}
          />
          
          {/* Character Count */}
          <div className="flex justify-between items-center text-sm">
            <span className={`${isOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
              {characterCount} / {validationRules.reason.maxLength} characters
            </span>
            {errors.reason && (
              <span className="text-red-600 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                {errors.reason}
              </span>
            )}
          </div>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {errors.general}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="danger"
            disabled={isSubmitting || !reason.trim() || isOverLimit}
            className="min-w-[100px]"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                />
                Rejecting...
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 mr-2" />
                Reject Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RejectionReasonModal;
