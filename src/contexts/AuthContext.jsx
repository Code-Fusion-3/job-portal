import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, userService, API_CONFIG, getAuthToken, isTokenExpired, clearAuthTokens, handleError } from '../api/index.js';

// Create and export the context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionValid, setSessionValid] = useState(false);

  // Define logout function first
  const logout = useCallback(async () => {
    try {
      // Call logout API
      await authApi.logout();
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear all auth data
      clearAuthTokens();
      localStorage.removeItem('employer_user'); // Clear employer user data
      setUser(null);
      setError(null);
      setSessionValid(false);
    }
  }, []);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setError(null);
        
        // Don't check authentication if we're on the login page
        if (window.location.pathname === '/employer/login' || window.location.pathname === '/login') {
          // console.log('🔍 On login page, skipping authentication check');
          setLoading(false);
          return;
        }
        
        // Check if we have a valid token
        const token = getAuthToken();
        
        if (token && !isTokenExpired()) {
          // Check if this is an employer token by looking at stored user data
          const storedUser = localStorage.getItem('employer_user');
          if (storedUser) {
            try {
              const employerUser = JSON.parse(storedUser);
              if (employerUser.role === 'employer') {
                setUser(employerUser);
                setSessionValid(true);
                setLoading(false);
                return;
              }
            } catch (e) {
              // Invalid stored data, continue with normal flow
            }
          }
          
          // Fetch user data from backend for non-employer users
          const result = await userService.getCurrentUser();
          
          if (result.success) {
            setUser(result.data);
            setSessionValid(true);
          } else {
            // Token is invalid or user not found
            console.warn('❌ AuthContext: Token validation failed:', result.error);
            await logout();
          }
        } else {
          // No valid token, clear any stale data
          clearAuthTokens();
          setSessionValid(false);
        }
      } catch (error) {
        console.error('💥 AuthContext: Error checking authentication:', error);
        setError('Failed to verify authentication status');
        // Clear all auth data on error
        clearAuthTokens();
        setSessionValid(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [logout]);

  // Session monitoring effect
  useEffect(() => {
    if (!sessionValid || !user) return;

    // Add a delay before starting session monitoring to avoid interfering with login
    const sessionCheckDelay = setTimeout(() => {
      const sessionCheckInterval = setInterval(async () => {
        try {
          // Only check if we're not on login/register pages
          if (window.location.pathname === '/login' || window.location.pathname === '/register') {
            return;
          }
          
          // Skip session checks for employers since they don't have a profile endpoint
          if (user.role === 'employer') {
            return;
          }
          
          const result = await userService.getCurrentUser();
          if (!result.success) {
            console.warn('Session check failed, logging out...');
            await logout();
          }
        } catch (error) {
          console.error('Session check error:', error);
          // Don't logout on network errors
        }
      }, 120000); // Check every 2 minutes instead of every minute

      return () => clearInterval(sessionCheckInterval);
    }, 15000); // Wait 15 seconds after successful authentication

    return () => clearTimeout(sessionCheckDelay);
  }, [sessionValid, user, logout]);

  const login = async (email, password, role) => {
    setLoading(true);
    setError(null);
    
    try {
      let loginResult;
      
      try {
        if (role === 'admin') {
          loginResult = await authApi.loginAdmin({ email, password });
        } else if (role === 'employer') {
          console.log('Initiating employer login for:', email);
          loginResult = await authApi.loginEmployer({ email, password });
          console.log('Employer login result:', loginResult);
          
          // If we got here, the API call didn't throw, but we still need to check for errors in the response
          if (loginResult && loginResult.error) {
            console.error('Employer login API returned error:', loginResult.error);
            return { success: false, error: loginResult.error };
          }
        } else {
          loginResult = await authApi.loginJobSeeker({ email, password });
        }
      } catch (apiError) {
        console.error('Login API error:', apiError);
        
        // Default error message
        let errorMessage = 'An error occurred during login. Please try again.';
        
        // Handle different types of errors
        if (apiError.response) {
          // Server responded with an error status code
          if (apiError.response.status === 401) {
            errorMessage = 'Invalid email or password. Please try again.';
          } else if (apiError.response.status === 400) {
            errorMessage = 'Invalid request. Please check your input.';
          } else if (apiError.response.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          } else if (apiError.response.data?.message) {
            errorMessage = apiError.response.data.message;
          }
        } else if (apiError.request) {
          // Request was made but no response received
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        } else if (apiError.message) {
          // Error setting up the request
          if (apiError.message.includes('Network Error')) {
            errorMessage = 'Network error. Please check your internet connection.';
          } else if (apiError.message.includes('timeout')) {
            errorMessage = 'Request timed out. Please try again.';
          } else {
            errorMessage = apiError.message;
          }
        }
        
        return { 
          success: false, 
          error: errorMessage,
          status: apiError.response?.status || 500
        };
      }

      // For employers, use the login response data directly
      if (role === 'employer') {
        console.log('Processing employer login response...');
        
        // Check if login was successful by looking for a token in the response
        if (loginResult && loginResult.token) {
          console.log('Login successful, processing employer data...');
          
          // Create a user object from the employer login response
          const employerUser = {
            id: loginResult.employer?.id,
            email: loginResult.employer?.email || email, // Fallback to email from login if not in response
            name: loginResult.employer?.name,
            role: 'employer',
            employerAccount: loginResult.employer || { email } // Ensure we always have at least the email
          };
          
          console.log('Employer user object created:', employerUser);
          
          try {
            // Store employer user data in localStorage for persistence
            localStorage.setItem('employer_user', JSON.stringify(employerUser));
            
            // Set the state synchronously
            setUser(employerUser);
            setSessionValid(true);
            
            console.log('Auth state updated, user should be authenticated now');
            
            // Small delay to ensure state updates are processed
            await new Promise(resolve => setTimeout(resolve, 150));
            
            return { 
              success: true, 
              user: employerUser,
              token: loginResult.token
            };
          } catch (storageError) {
            console.error('Error storing auth data:', storageError);
            throw new Error('Failed to store authentication data');
          }
        } else {
          console.error('No token in employer login response:', loginResult);
          
          // Clear authentication state on failed login
          setUser(null);
          setSessionValid(false);
          clearAuthTokens();
          localStorage.removeItem('employer_user');

          // Return the actual error from backend or a default message
          const errorMessage = loginResult?.error || 'Login failed. Invalid email or password.';
          return { 
            success: false, 
            error: errorMessage 
          };
        }
      }

      // For other roles, fetch user data from backend
      const userResult = await userService.getCurrentUser();
      
      if (userResult.success) {
        setUser(userResult.data);
        setSessionValid(true);
        return { success: true, user: userResult.data };
      } else {
        // Login succeeded but couldn't fetch user data
        console.warn('⚠️ Login succeeded but user fetch failed:', userResult.error);
        setError(userResult.error || 'Failed to fetch user profile');
        return { 
          success: false, 
          error: userResult.error || 'Failed to fetch user profile',
          errorType: userResult.errorType 
        };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      const apiError = handleError(error, { 
        context: 'login', 
        email, 
        role 
      });
      
      // setError(apiError.userMessage);
      return { 
        success: false, 
        error: apiError.userMessage,
        errorType: apiError.type 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData, photo = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const registerResult = await authApi.registerJobSeeker(userData, photo);
      
      // Registration successful, now fetch user data from backend
      const userResult = await userService.getCurrentUser();
      if (userResult.success) {
        setUser(userResult.data);
        setSessionValid(true);
        return { success: true, user: userResult.data };
      } else {
        // Registration succeeded but couldn't fetch user data
        setError(userResult.error || 'Failed to fetch user profile');
        return { 
          success: false, 
          error: userResult.error || 'Failed to fetch user profile',
          errorType: userResult.errorType 
        };
      }
    } catch (error) {
      const apiError = handleError(error, { 
        context: 'register', 
        email: userData.email 
      });
      
      setError(apiError.userMessage);
      return { 
        success: false, 
        error: apiError.userMessage,
        errorType: apiError.type 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData, photo = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await userService.updateProfile(profileData, photo);
      if (result.success) {
        // Profile updated successfully, but we need to fetch fresh user data
        // because the update response doesn't contain the full user object with role
        
        // Fetch current user data to maintain proper user object structure
        const userResult = await userService.getCurrentUser();
        if (userResult.success) {
          setUser(userResult.data);
          return { success: true, user: userResult.data };
        } else {
          // Profile update succeeded but user fetch failed - keep existing user data
          console.warn('⚠️ AuthContext: Profile updated but failed to fetch fresh user data:', userResult.error);
          return { success: true, user: user };
        }
      } else {
        setError(result.error);
        return { 
          success: false, 
          error: result.error,
          errorType: result.errorType 
        };
      }
    } catch (error) {
      const apiError = handleError(error, { context: 'update_profile' });
      setError(apiError.userMessage);
      return { 
        success: false, 
        error: apiError.userMessage,
        errorType: apiError.type 
      };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await userService.changePassword(passwordData);
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { 
          success: false, 
          error: result.error,
          errorType: result.errorType 
        };
      }
    } catch (error) {
      const apiError = handleError(error, { context: 'change_password' });
      setError(apiError.userMessage);
      return { 
        success: false, 
        error: apiError.userMessage,
        errorType: apiError.type 
      };
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const result = await authApi.refreshToken();
      if (result.success) {
        setSessionValid(true);
      }
      return { success: true, ...result };
    } catch (error) {
      const apiError = handleError(error, { context: 'refresh_token' });
      setSessionValid(false);
      return { 
        success: false, 
        error: apiError.userMessage,
        errorType: apiError.type 
      };
    }
  };

  const refreshUserData = async () => {
    try {
      const result = await userService.getCurrentUser();
      if (result.success) {
        setUser(result.data);
        setSessionValid(true);
        return { success: true, user: result.data };
      } else {
        setError(result.error);
        setSessionValid(false);
        return { 
          success: false, 
          error: result.error,
          errorType: result.errorType 
        };
      }
    } catch (error) {
      const apiError = handleError(error, { context: 'refresh_user_data' });
      setError(apiError.userMessage);
      setSessionValid(false);
      return { 
        success: false, 
        error: apiError.userMessage,
        errorType: apiError.type 
      };
    }
  };

  const value = {
    user,
    loading,
    error,
    sessionValid,
    login,
    logout,
    register,
    updateProfile,
    changePassword,
    refreshToken,
    refreshUserData,
    isAuthenticated: !!user && sessionValid,
    isAdmin: user?.role === 'admin',
    isJobSeeker: user?.role === 'jobseeker',
    isEmployer: user?.role === 'employer',
    clearError: () => setError(null)
  };

  // Debug logging for authentication state
  // console.log('🔐 AuthContext Debug:', {
  //   user: user,
  //   sessionValid: sessionValid,
  //   isAuthenticated: !!user && sessionValid,
  //   userRole: user?.role,
  //   userExists: !!user,
  //   sessionValidValue: sessionValid
  // });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the custom hook before the provider
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the provider as default
export default AuthProvider;