/**
 * Profile Utilities
 * Standardized functions for handling profile data and IDs
 */

/**
 * Extract profile ID from job seeker object
 * Handles both data structures: jobSeeker.id and jobSeeker.profile.id
 * @param {Object} jobSeeker - Job seeker object
 * @returns {number|null} Profile ID or null if not found
 */
export const extractProfileId = (jobSeeker) => {
  if (!jobSeeker) {
    console.warn('extractProfileId: No job seeker object provided');
    return null;
  }

  // Prioritize profile.id over user.id for approval operations
  // Backend returns: { id: 3, profile: { id: 2 } }
  // We want profile.id (2) for approval operations, not user.id (3)
  const profileId = jobSeeker.profile?.id || jobSeeker.profileId || jobSeeker.id;
  
  if (!profileId) {
    console.warn('extractProfileId: No profile ID found in job seeker object:', jobSeeker);
    return null;
  }

  // Ensure it's a number
  const numericId = parseInt(profileId, 10);
  if (isNaN(numericId)) {
    console.error('extractProfileId: Invalid profile ID format:', profileId);
    return null;
  }

  return numericId;
};

/**
 * Validate profile ID before API operations
 * @param {number} profileId - Profile ID to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const validateProfileId = (profileId) => {
  if (!profileId) {
    console.warn('validateProfileId: No profile ID provided');
    return false;
  }

  if (typeof profileId !== 'number' || isNaN(profileId)) {
    console.error('validateProfileId: Invalid profile ID type:', typeof profileId, profileId);
    return false;
  }

  if (profileId <= 0) {
    console.error('validateProfileId: Profile ID must be positive:', profileId);
    return false;
  }

  return true;
};

/**
 * Get approval status from job seeker object
 * @param {Object} jobSeeker - Job seeker object
 * @returns {string} Approval status (pending, approved, rejected)
 */
export const getApprovalStatus = (jobSeeker) => {
  if (!jobSeeker) {
    return 'pending';
  }

  // Try to get approval status from different possible locations
  const status = jobSeeker.approvalStatus || 
                 jobSeeker.profile?.approvalStatus || 
                 'pending';

  // Validate status
  const validStatuses = ['pending', 'approved', 'rejected'];
  if (!validStatuses.includes(status)) {
    console.warn('getApprovalStatus: Invalid status found:', status, 'defaulting to pending');
    return 'pending';
  }

  return status;
};

/**
 * Check if profile can be approved
 * @param {Object} jobSeeker - Job seeker object
 * @returns {boolean} True if can be approved
 */
export const canApproveProfile = (jobSeeker) => {
  const status = getApprovalStatus(jobSeeker);
  return status === 'pending' || status === 'rejected';
};

/**
 * Check if profile can be rejected
 * @param {Object} jobSeeker - Job seeker object
 * @returns {boolean} True if can be rejected
 */
export const canRejectProfile = (jobSeeker) => {
  const status = getApprovalStatus(jobSeeker);
  return status === 'pending' || status === 'approved';
};

/**
 * Get profile display name
 * @param {Object} jobSeeker - Job seeker object
 * @returns {string} Display name
 */
export const getProfileDisplayName = (jobSeeker) => {
  if (!jobSeeker) {
    return 'Unknown Profile';
  }

  const firstName = jobSeeker.profile?.firstName || jobSeeker.firstName || '';
  const lastName = jobSeeker.profile?.lastName || jobSeeker.lastName || '';
  
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || 'Unnamed Profile';
};

/**
 * Create standardized error message for profile operations
 * @param {string} operation - Operation that failed
 * @param {string} reason - Reason for failure
 * @param {Object} jobSeeker - Job seeker object (optional)
 * @returns {string} User-friendly error message
 */
export const createProfileErrorMessage = (operation, reason, jobSeeker = null) => {
  let message = `Failed to ${operation}`;
  
  if (jobSeeker) {
    const displayName = getProfileDisplayName(jobSeeker);
    message += ` for ${displayName}`;
  }
  
  if (reason) {
    message += `: ${reason}`;
  }
  
  return message;
};
