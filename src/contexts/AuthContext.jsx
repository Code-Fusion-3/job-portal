import { createContext, useContext, useState, useEffect } from 'react';
import { authApi, userService, API_CONFIG, getAuthToken, isTokenExpired, clearAuthTokens, handleError } from '../api/index.js';

const AuthContext = createContext();

export { AuthContext };
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setError(null);
        
        // Check if we have a valid token
        const token = getAuthToken();
        if (token && !isTokenExpired()) {
          // Fetch user data from backend
          const result = await userService.getCurrentUser();
          if (result.success) {
            setUser(result.data);
          } else {
            // Token is invalid or user not found
            console.warn('Token validation failed:', result.error);
            await logout();
          }
        } else {
          // No valid token, clear any stale data
          clearAuthTokens();
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setError('Failed to verify authentication status');
        // Clear all auth data on error
        clearAuthTokens();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password, role) => {
    setLoading(true);
    setError(null);
    
    try {
  
      
      let loginResult;
      
      if (role === 'admin') {
        loginResult = await authApi.loginAdmin({ email, password });
      } else {
        loginResult = await authApi.loginJobSeeker({ email, password });
      }

      

      // Login successful, now fetch user data from backend
      const userResult = await userService.getCurrentUser();
      
      
      if (userResult.success) {
        setUser(userResult.data);
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

  const logout = async () => {
    try {
      // Call logout API
      await authApi.logout();
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear all auth data
      clearAuthTokens();
      setUser(null);
      setError(null);
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
        // Update local user state with new data
        setUser(result.data);
        return { success: true, user: result.data };
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
      return { success: true, ...result };
    } catch (error) {
      const apiError = handleError(error, { context: 'refresh_token' });
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
        return { success: true, user: result.data };
      } else {
        setError(result.error);
        return { 
          success: false, 
          error: result.error,
          errorType: result.errorType 
        };
      }
    } catch (error) {
      const apiError = handleError(error, { context: 'refresh_user_data' });
      setError(apiError.userMessage);
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
    login,
    logout,
    register,
    updateProfile,
    changePassword,
    refreshToken,
    refreshUserData,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isJobSeeker: user?.role === 'jobseeker',
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 