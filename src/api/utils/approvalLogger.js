/**
 * Approval Logger Utility
 * Comprehensive logging for approval operations with different log levels and structured data
 */

// Log levels
export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  CRITICAL: 4
};

// Current log level (can be configured via environment variable)
const CURRENT_LOG_LEVEL = parseInt(process.env.REACT_APP_LOG_LEVEL || '1', 10);

// Log level names for display
const LOG_LEVEL_NAMES = {
  [LOG_LEVELS.DEBUG]: 'DEBUG',
  [LOG_LEVELS.INFO]: 'INFO',
  [LOG_LEVELS.WARN]: 'WARN',
  [LOG_LEVELS.ERROR]: 'ERROR',
  [LOG_LEVELS.CRITICAL]: 'CRITICAL'
};

// Emoji indicators for different log levels
const LOG_EMOJIS = {
  [LOG_LEVELS.DEBUG]: '🔍',
  [LOG_LEVELS.INFO]: 'ℹ️',
  [LOG_LEVELS.WARN]: '⚠️',
  [LOG_LEVELS.ERROR]: '❌',
  [LOG_LEVELS.CRITICAL]: '🚨'
};

/**
 * Check if a log level should be displayed
 * @param {number} level - Log level to check
 * @returns {boolean} True if should be displayed
 */
const shouldLog = (level) => {
  return level >= CURRENT_LOG_LEVEL;
};

/**
 * Format timestamp for logging
 * @returns {string} Formatted timestamp
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Format log message with consistent structure
 * @param {number} level - Log level
 * @param {string} component - Component name
 * @param {string} operation - Operation being performed
 * @param {string} message - Log message
 * @param {Object} data - Additional data to log
 * @returns {string} Formatted log message
 */
const formatLogMessage = (level, component, operation, message, data = {}) => {
  const emoji = LOG_EMOJIS[level];
  const levelName = LOG_LEVEL_NAMES[level];
  const timestamp = getTimestamp();
  
  let logMessage = `${emoji} [${timestamp}] [${levelName}] [${component}] ${operation}: ${message}`;
  
  if (Object.keys(data).length > 0) {
    logMessage += ` | Data: ${JSON.stringify(data, null, 2)}`;
  }
  
  return logMessage;
};

/**
 * Log approval operation start
 * @param {string} component - Component name
 * @param {string} operation - Operation name
 * @param {Object} profileData - Profile data being operated on
 * @param {Object} additionalData - Additional context data
 */
export const logApprovalStart = (component, operation, profileData = {}, additionalData = {}) => {
  if (!shouldLog(LOG_LEVELS.INFO)) return;
  
  const data = {
    profileId: profileData.id || profileData.profile?.id || 'unknown',
    profileName: profileData.profile?.firstName || profileData.firstName || 'unknown',
    operation,
    timestamp: getTimestamp(),
    ...additionalData
  };
  
  const message = formatLogMessage(LOG_LEVELS.INFO, component, operation, 'Operation started', data);
  // console.log(message);
  
  // Store in session storage for debugging
  storeLogEntry('approval_start', data);
};

/**
 * Log approval operation success
 * @param {string} component - Component name
 * @param {string} operation - Operation name
 * @param {Object} profileData - Profile data that was operated on
 * @param {Object} result - Operation result
 * @param {Object} additionalData - Additional context data
 */
export const logApprovalSuccess = (component, operation, profileData = {}, result = {}, additionalData = {}) => {
  if (!shouldLog(LOG_LEVELS.INFO)) return;
  
  const data = {
    profileId: profileData.id || profileData.profile?.id || 'unknown',
    profileName: profileData.profile?.firstName || profileData.firstName || 'unknown',
    operation,
    result: result.success ? 'success' : 'failed',
    message: result.message || 'Operation completed',
    timestamp: getTimestamp(),
    ...additionalData
  };
  
  const message = formatLogMessage(LOG_LEVELS.INFO, component, operation, 'Operation completed successfully', data);
  // console.log(message);
  
  // Store in session storage for debugging
  storeLogEntry('approval_success', data);
};

/**
 * Log approval operation error
 * @param {string} component - Component name
 * @param {string} operation - Operation name
 * @param {Object} profileData - Profile data that was being operated on
 * @param {Error|Object} error - Error that occurred
 * @param {Object} additionalData - Additional context data
 */
export const logApprovalError = (component, operation, profileData = {}, error = {}, additionalData = {}) => {
  if (!shouldLog(LOG_LEVELS.ERROR)) return;
  
  const data = {
    profileId: profileData.id || profileData.profile?.id || 'unknown',
    profileName: profileData.profile?.firstName || profileData.firstName || 'unknown',
    operation,
    errorMessage: error.message || error.toString(),
    errorStack: error.stack,
    timestamp: getTimestamp(),
    ...additionalData
  };
  
  const message = formatLogMessage(LOG_LEVELS.ERROR, component, operation, 'Operation failed', data);
  console.error(message);
  
  // Store in session storage for debugging
  storeLogEntry('approval_error', data);
};

/**
 * Log approval operation warning
 * @param {string} component - Component name
 * @param {string} operation - Operation name
 * @param {string} message - Warning message
 * @param {Object} profileData - Profile data related to warning
 * @param {Object} additionalData - Additional context data
 */
export const logApprovalWarning = (component, operation, message, profileData = {}, additionalData = {}) => {
  if (!shouldLog(LOG_LEVELS.WARN)) return;
  
  const data = {
    profileId: profileData.id || profileData.profile?.id || 'unknown',
    profileName: profileData.profile?.firstName || profileData.firstName || 'unknown',
    operation,
    warningMessage: message,
    timestamp: getTimestamp(),
    ...additionalData
  };
  
  const logMessage = formatLogMessage(LOG_LEVELS.WARN, component, operation, `Warning: ${message}`, data);
  console.warn(logMessage);
  
  // Store in session storage for debugging
  storeLogEntry('approval_warning', data);
};

/**
 * Log approval operation debug information
 * @param {string} component - Component name
 * @param {string} operation - Operation name
 * @param {string} message - Debug message
 * @param {Object} data - Debug data
 */
export const logApprovalDebug = (component, operation, message, data = {}) => {
  if (!shouldLog(LOG_LEVELS.DEBUG)) return;
  
  const debugData = {
    operation,
    timestamp: getTimestamp(),
    ...data
  };
  
  const logMessage = formatLogMessage(LOG_LEVELS.DEBUG, component, operation, message, debugData);
  console.debug(logMessage);
  
  // Store in session storage for debugging
  storeLogEntry('approval_debug', debugData);
};

/**
 * Log profile state change
 * @param {string} component - Component name
 * @param {Object} profileData - Profile data
 * @param {string} oldStatus - Previous status
 * @param {string} newStatus - New status
 * @param {Object} additionalData - Additional context data
 */
export const logProfileStatusChange = (component, profileData, oldStatus, newStatus, additionalData = {}) => {
  if (!shouldLog(LOG_LEVELS.INFO)) return;
  
  const data = {
    profileId: profileData.id || profileData.profile?.id || 'unknown',
    profileName: profileData.profile?.firstName || profileData.firstName || 'unknown',
    oldStatus,
    newStatus,
    timestamp: getTimestamp(),
    ...additionalData
  };
  
  const message = formatLogMessage(LOG_LEVELS.INFO, component, 'status_change', `Profile status changed from ${oldStatus} to ${newStatus}`, data);
  // console.log(message);
  
  // Store in session storage for debugging
  storeLogEntry('profile_status_change', data);
};

/**
 * Log API call details
 * @param {string} component - Component name
 * @param {string} operation - Operation name
 * @param {string} endpoint - API endpoint
 * @param {Object} requestData - Request data
 * @param {Object} responseData - Response data
 * @param {number} duration - Request duration in ms
 */
export const logApiCall = (component, operation, endpoint, requestData = {}, responseData = {}, duration = 0) => {
  if (!shouldLog(LOG_LEVELS.DEBUG)) return;
  
  const data = {
    endpoint,
    requestData: sanitizeData(requestData),
    responseData: sanitizeData(responseData),
    duration: `${duration}ms`,
    timestamp: getTimestamp()
  };
  
  const message = formatLogMessage(LOG_LEVELS.DEBUG, component, operation, `API call to ${endpoint}`, data);
  console.debug(message);
  
  // Store in session storage for debugging
  storeLogEntry('api_call', data);
};

/**
 * Sanitize sensitive data before logging
 * @param {Object} data - Data to sanitize
 * @returns {Object} Sanitized data
 */
const sanitizeData = (data) => {
  if (!data || typeof data !== 'object') return data;
  
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
  const sanitized = { ...data };
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

/**
 * Store log entry in session storage for debugging
 * @param {string} type - Log entry type
 * @param {Object} data - Log data
 */
const storeLogEntry = (type, data) => {
  try {
    const storageKey = 'approval_logs';
    const existingLogs = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
    
    const logEntry = {
      id: Date.now(),
      type,
      timestamp: getTimestamp(),
      data
    };
    
    // Keep only last 100 log entries
    existingLogs.push(logEntry);
    if (existingLogs.length > 100) {
      existingLogs.shift();
    }
    
    sessionStorage.setItem(storageKey, JSON.stringify(existingLogs));
  } catch (error) {
    // Silently fail if storage is not available
    console.warn('Failed to store log entry:', error);
  }
};

/**
 * Get all stored log entries
 * @returns {Array} Array of log entries
 */
export const getStoredLogs = () => {
  try {
    const storageKey = 'approval_logs';
    return JSON.parse(sessionStorage.getItem(storageKey) || '[]');
  } catch (error) {
    console.warn('Failed to retrieve stored logs:', error);
    return [];
  }
};

/**
 * Clear stored log entries
 */
export const clearStoredLogs = () => {
  try {
    const storageKey = 'approval_logs';
    sessionStorage.removeItem(storageKey);
  } catch (error) {
    console.warn('Failed to clear stored logs:', error);
  }
};

/**
 * Export logs as JSON file
 */
export const exportLogs = () => {
  try {
    const logs = getStoredLogs();
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `approval-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Failed to export logs:', error);
  }
};

/**
 * Log performance metrics
 * @param {string} component - Component name
 * @param {string} operation - Operation name
 * @param {number} startTime - Start time from performance.now()
 * @param {Object} additionalData - Additional performance data
 */
export const logPerformance = (component, operation, startTime, additionalData = {}) => {
  if (!shouldLog(LOG_LEVELS.DEBUG)) return;
  
  const duration = performance.now() - startTime;
  const data = {
    duration: `${duration.toFixed(2)}ms`,
    timestamp: getTimestamp(),
    ...additionalData
  };
  
  const message = formatLogMessage(LOG_LEVELS.DEBUG, component, operation, `Performance: ${duration.toFixed(2)}ms`, data);
  console.debug(message);
  
  // Store in session storage for debugging
  storeLogEntry('performance', data);
};

/**
 * Create a performance timer
 * @param {string} component - Component name
 * @param {string} operation - Operation name
 * @returns {Function} Function to call when operation completes
 */
export const createPerformanceTimer = (component, operation) => {
  const startTime = performance.now();
  
  return (additionalData = {}) => {
    logPerformance(component, operation, startTime, additionalData);
  };
};

export default {
  logApprovalStart,
  logApprovalSuccess,
  logApprovalError,
  logApprovalWarning,
  logApprovalDebug,
  logProfileStatusChange,
  logApiCall,
  getStoredLogs,
  clearStoredLogs,
  exportLogs,
  createPerformanceTimer
};
