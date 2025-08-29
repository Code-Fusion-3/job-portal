import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Filter,
  Search,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../api/hooks/useAuth.js';
import { useApprovalManagement } from '../../api/hooks/useApprovalManagement.js';
import {
  extractProfileId,
  validateProfileId,
  getApprovalStatus,
  canApproveProfile,
  canRejectProfile,
  getProfileDisplayName
} from '../../api/utils/profileUtils';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import ApprovalActions from '../../components/admin/ApprovalActions';
import RejectionReasonModal from '../../components/admin/RejectionReasonModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ApprovalErrorBoundary from '../../components/ui/ApprovalErrorBoundary';
import { 
  ApprovalSpinner, 
  ApprovalQueueSkeleton, 
  ApprovalStatsLoading,
  RetryIndicator 
} from '../../components/ui/ApprovalLoadingStates';

const ApprovalQueue = () => {
  const { user } = useAuth();
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Approval management hook with optimizations
  const {
    pendingProfiles,
    approvedProfiles,
    rejectedProfiles,
    loading,
    error,
    retryCount,
    approveProfile,
    rejectProfile,
    fetchProfilesByStatus,
    currentPage,
    pagination,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
    clearError,
    hasError,
    isRetrying
  } = useApprovalManagement({
    autoFetch: true,
    itemsPerPage: 20
  });

  // Performance optimization: Memoize profile operations
  const profileOperations = useMemo(() => ({
    approve: approveProfile,
    reject: rejectProfile
  }), [approveProfile, rejectProfile]);

  // Memoize profile counts for statistics
  const profileCounts = useMemo(() => ({
    pending: pendingProfiles.length,
    approved: approvedProfiles.length,
    rejected: rejectedProfiles.length
  }), [pendingProfiles.length, approvedProfiles.length, rejectedProfiles.length]);

  // Auto-hide notifications
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

    // Handle approval changes with enhanced validation and logging
  const handleApprovalChange = useCallback(async (profileId, newStatus, reason = null) => {
    try {
      // Validate profile ID
      if (!validateProfileId(profileId)) {
        const error = `Invalid profile ID provided: ${profileId}`;
        setErrorMessage(error);
        setShowError(true);
        console.error('❌ handleApprovalChange validation error:', error);
        return;
      }

      let result;

      if (newStatus === 'approved') {
        result = await profileOperations.approve(profileId);
      } else if (newStatus === 'rejected') {
        if (!reason) {
          setErrorMessage('Rejection reason is required');
          setShowError(true);
          return;
        }
        result = await profileOperations.reject(profileId, reason);
      }

      if (result && result.success) {
        setSuccessMessage(result.message || `Profile ${newStatus} successfully`);
        setShowSuccess(true);
        clearError(); // Clear any previous errors
      } else if (result) {
        setErrorMessage(result.error || `Failed to ${newStatus} profile`);
        setShowError(true);
      }
    } catch (error) {
      setErrorMessage(`Failed to ${newStatus} profile`);
      setShowError(true);
      console.error(`❌ Approval change error:`, error);
    }
  }, [profileOperations, clearError]);

  // Handle rejection modal with validation
  const handleRejectionRequest = (profile) => {
    if (!profile) {
      console.error('❌ handleRejectionRequest: No profile provided');
      return;
    }

    const profileId = extractProfileId(profile);
    if (!profileId) {
      console.error('❌ handleRejectionRequest: Could not extract profile ID from profile:', profile);
      setErrorMessage('Error: Could not determine profile ID. Please try again.');
      setShowError(true);
      return;
    }

    setSelectedProfile(profile);
    setShowRejectionModal(true);
  };

  const handleRejectionSubmit = async (reason) => {
    if (selectedProfile) {
      const profileId = extractProfileId(selectedProfile);
      if (profileId) {
        await handleApprovalChange(profileId, 'rejected', reason);
        setShowRejectionModal(false);
        setSelectedProfile(null);
      } else {
        setErrorMessage('Error: Could not determine profile ID for rejection');
        setShowError(true);
        console.error('❌ handleRejectionSubmit: Could not extract profile ID from selectedProfile:', selectedProfile);
      }
    }
  };

  // Memoized profile utility functions for performance using new utilities
  const getProfileName = useCallback((profile) => {
    return getProfileDisplayName(profile);
  }, []);

  const getProfilePhoto = useCallback((profile) => {
    const photoPath = profile.profile?.photo || profile.photo;
    if (photoPath) {
      if (/^https?:\/\//i.test(photoPath)) {
        return photoPath;
      }
      return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${photoPath.replace(/^\//, '')}`;
    }
    return null;
  }, []);

  const getProfileInitials = useCallback((profile) => {
    const firstName = profile.profile?.firstName || profile.firstName || '';
    const lastName = profile.profile?.lastName || profile.lastName || '';
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${first}${last}` || 'U';
  }, []);

  // Optimized refresh handler
  const handleRefresh = useCallback(async () => {
    clearError();
    await fetchProfilesByStatus('pending', 1);
  }, [clearError, fetchProfilesByStatus]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <ApprovalErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Approval Queue</h1>
            <p className="text-gray-600">
              Review and approve pending job seeker profiles
            </p>
            {isRetrying && (
              <p className="text-sm text-yellow-600 mt-1">
                Retrying operation... (Attempt {retryCount})
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

      {/* Success Notification */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700">{successMessage}</span>
          </div>
        </motion.div>
      )}

      {/* Error Notification */}
      {showError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{errorMessage}</span>
          </div>
        </motion.div>
      )}

      {/* Statistics Cards */}
      {loading && pendingProfiles.length === 0 && approvedProfiles.length === 0 && rejectedProfiles.length === 0 ? (
        <ApprovalStatsLoading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-600">{profileCounts.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved Today</p>
                  <p className="text-3xl font-bold text-green-600">{profileCounts.approved}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected Today</p>
                  <p className="text-3xl font-bold text-red-600">{profileCounts.rejected}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Pending Profiles */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Pending Profiles ({pendingProfiles.length})
            </h2>
            <StatusBadge status="pending" size="lg" />
          </div>

                    {/* Add retry indicator for retry attempts */}
          {hasError && retryCount > 0 && (
            <RetryIndicator 
              retryCount={retryCount}
              onRetry={handleRefresh}
              className="mb-6"
            />
          )}

          {loading && pendingProfiles.length === 0 ? (
            <ApprovalQueueSkeleton count={5} />
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700">Error: {error}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Retry
                </Button>
                <Button
                  onClick={clearError}
                  variant="ghost"
                  size="sm"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          ) : pendingProfiles.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending profiles</h3>
              <p className="text-gray-600">All job seeker profiles have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingProfiles.map((profile) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    {/* Profile Info */}
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {getProfilePhoto(profile) ? (
                          <img
                            src={getProfilePhoto(profile)}
                            alt={getProfileName(profile)}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full flex items-center justify-center bg-gray-300 text-lg font-semibold text-white" style={{ display: getProfilePhoto(profile) ? 'none' : 'flex' }}>
                          {getProfileInitials(profile)}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getProfileName(profile)}
                        </h3>
                        <p className="text-sm text-gray-600">{profile.email || 'No email'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {profile.profile?.location || 'No location'}
                          </span>
                          {profile.profile?.experienceLevel && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-xs text-gray-500 capitalize">
                                {profile.profile.experienceLevel.replace('_', ' ')}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Approval Actions */}
                    <div className="flex items-center gap-3">
                      <StatusBadge status="pending" size="sm" />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            const profileId = extractProfileId(profile);
                            if (profileId) {
                              handleApprovalChange(profileId, 'approved');
                            } else {
                              setErrorMessage('Error: Could not determine profile ID for approval');
                              setShowError(true);
                            }
                          }}
                          variant="primary"
                          size="sm"
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleRejectionRequest(profile)}
                          variant="danger"
                          size="sm"
                          disabled={loading}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {pagination.totalPages} ({pagination.total} total profiles)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={prevPage}
                  disabled={!hasPrevPage || loading}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <Button
                  onClick={nextPage}
                  disabled={!hasNextPage || loading}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Rejection Reason Modal */}
      <RejectionReasonModal
        isOpen={showRejectionModal}
        onClose={() => {
          setShowRejectionModal(false);
          setSelectedProfile(null);
        }}
        onSubmit={handleRejectionSubmit}
        profileName={selectedProfile ? getProfileName(selectedProfile) : 'this profile'}
      />
      </div>
    </ApprovalErrorBoundary>
  );
};

export default ApprovalQueue;
