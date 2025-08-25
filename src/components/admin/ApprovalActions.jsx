import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import {
  extractProfileId,
  validateProfileId,
  getApprovalStatus,
  canApproveProfile,
  canRejectProfile,
  logProfileOperation
} from '../../api/utils/profileUtils';

const ApprovalActions = ({ 
  profileId, 
  currentStatus, 
  onApprovalChange, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState(null);

  // Validate profile ID
  const validProfileId = validateProfileId(profileId) ? profileId : null;
  
  // Get actual status from props or use utility function
  const actualStatus = currentStatus || 'pending';

  // Determine available actions based on current status using utility functions
  const getAvailableActions = (status) => {
    // Create a mock profile object for utility functions
    const mockProfile = { id: validProfileId, approvalStatus: status };
    
    const actions = [];
    if (canApproveProfile(mockProfile)) {
      actions.push('approve');
    }
    if (canRejectProfile(mockProfile)) {
      actions.push('reject');
    }
    
    return actions;
  };

  const availableActions = getAvailableActions(actualStatus);

  const handleAction = async (action) => {
    if (disabled || isLoading || !validProfileId) return;

    // Log operation for debugging
    logProfileOperation(action, { id: validProfileId }, {
      component: 'ApprovalActions',
      currentStatus: actualStatus
    });

    setIsLoading(true);
    setActionType(action);

    try {
      if (action === 'approve') {
        await onApprovalChange('approved');
      } else if (action === 'reject') {
        // For rejection, we'll need a reason, so we'll call the parent handler
        // which should open a rejection reason modal
        await onApprovalChange('rejected');
      }
    } catch (error) {
      console.error(`❌ Error performing ${action} action:`, error);
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  };

  const getActionButton = (action) => {
    const isCurrentAction = actionType === action;
    const isDisabled = disabled || isLoading || !validProfileId;

    const buttonConfig = {
      approve: {
        variant: 'primary',
        icon: CheckCircle,
        label: 'Approve',
        color: 'text-green-600',
        bgColor: 'bg-green-50 hover:bg-green-100'
      },
      reject: {
        variant: 'danger',
        icon: XCircle,
        label: 'Reject',
        color: 'text-red-600',
        bgColor: 'bg-red-50 hover:bg-red-100'
      }
    };

    const config = buttonConfig[action];
    const IconComponent = config.icon;

    return (
      <Button
        key={action}
        variant={config.variant}
        size="sm"
        onClick={() => handleAction(action)}
        disabled={isDisabled}
        className={`min-w-[100px] ${config.bgColor} ${config.color} border ${config.color.replace('text-', 'border-')} hover:${config.bgColor}`}
        aria-label={`${config.label} profile ${validProfileId || 'unknown'}`}
        title={`${config.label} this profile`}
        {...props}
      >
        {isLoading && isCurrentAction ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />
        ) : (
          <IconComponent className="w-4 h-4 mr-2" aria-hidden="true" />
        )}
        {isLoading && isCurrentAction ? `${action === 'approve' ? 'Approving' : 'Rejecting'}...` : config.label}
      </Button>
    );
  };

  if (availableActions.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <StatusBadge status={currentStatus} size="sm" />
        <span className="text-sm text-gray-500">No actions available</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Current Status Display */}
      <StatusBadge status={actualStatus} size="sm" />
      
      {/* Action Buttons */}
      <div className="flex gap-2">
        {availableActions.map(action => getActionButton(action))}
      </div>
    </div>
  );
};

export default ApprovalActions;
