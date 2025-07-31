import { createContext, useContext, useState, useEffect } from 'react';
import { authApi, API_CONFIG, getAuthToken, isTokenExpired, handleError } from '../api/index.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have a valid token
        const token = getAuthToken();
        if (token && !isTokenExpired()) {
          // Try to get user info from token or stored data
          const storedUser = localStorage.getItem('jobPortalUser');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // TODO: Call API to get user info
            // For now, we'll use mock data
            setUser({
              id: 'jobseeker-1',
              email: 'user@example.com',
              role: 'jobseeker',
              name: 'John Doe',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
              profile: {
                title: 'Housemaid',
                category: 'domestic',
                subcategory: 'Housemaid',
                experience: 3,
                location: 'Kigali, Rwanda',
                dailyRate: 5000,
                monthlyRate: 120000,
                availability: 'Available',
                education: 'Secondary School',
                languages: ['Kinyarwanda', 'English'],
                skills: ['House Cleaning', 'Laundry', 'Cooking', 'Childcare'],
                bio: 'Experienced housemaid with 3 years of experience in household management. Skilled in cleaning, cooking, and childcare. Reliable and trustworthy.',
                contact: {
                  email: 'user@example.com',
                  phone: '+250 789 123 456',
                  linkedin: null
                },
                certifications: [],
                references: []
              }
            });
          }
        } else {
          // Clear invalid tokens
          localStorage.removeItem(API_CONFIG.AUTH_CONFIG.tokenKey);
          localStorage.removeItem(API_CONFIG.AUTH_CONFIG.refreshTokenKey);
          localStorage.removeItem(API_CONFIG.AUTH_CONFIG.tokenExpiryKey);
          localStorage.removeItem('jobPortalUser');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Clear all auth data on error
        localStorage.removeItem(API_CONFIG.AUTH_CONFIG.tokenKey);
        localStorage.removeItem(API_CONFIG.AUTH_CONFIG.refreshTokenKey);
        localStorage.removeItem(API_CONFIG.AUTH_CONFIG.tokenExpiryKey);
        localStorage.removeItem('jobPortalUser');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password, role) => {
    setLoading(true);
    
    try {
      let loginResult;
      
      if (role === 'admin') {
        loginResult = await authApi.loginAdmin({ email, password });
      } else {
        loginResult = await authApi.loginJobSeeker({ email, password });
      }

      // Create user object from API response
      const user = {
        id: loginResult.user?.id || `user-${Date.now()}`,
        email: email,
        role: role,
        name: loginResult.user?.name || email.split('@')[0],
        avatar: loginResult.user?.avatar || null,
        ...loginResult.user, // Include any additional user data from API
      };

      // Store user in localStorage
      localStorage.setItem('jobPortalUser', JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      const apiError = handleError(error, { 
        context: 'login', 
        email, 
        role 
      });
      
      return { 
        success: false, 
        error: apiError.userMessage || 'Login failed',
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
      localStorage.removeItem(API_CONFIG.AUTH_CONFIG.tokenKey);
      localStorage.removeItem(API_CONFIG.AUTH_CONFIG.refreshTokenKey);
      localStorage.removeItem(API_CONFIG.AUTH_CONFIG.tokenExpiryKey);
      localStorage.removeItem('jobPortalUser');
      setUser(null);
    }
  };

  const register = async (userData, photo = null) => {
    setLoading(true);
    
    try {
      const registerResult = await authApi.registerJobSeeker(userData, photo);
      
      // Create user object from API response
      const user = {
        id: registerResult.user?.id || `user-${Date.now()}`,
        email: userData.email,
        role: 'jobseeker',
        name: userData.firstName + ' ' + userData.lastName,
        avatar: registerResult.user?.avatar || null,
        ...registerResult.user, // Include any additional user data from API
      };

      // Store user in localStorage
      localStorage.setItem('jobPortalUser', JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      const apiError = handleError(error, { 
        context: 'register', 
        email: userData.email 
      });
      
      return { 
        success: false, 
        error: apiError.userMessage || 'Registration failed',
        errorType: apiError.type 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('jobPortalUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const refreshToken = async () => {
    try {
      const result = await authApi.refreshToken();
      return { success: true, ...result };
    } catch (error) {
      const apiError = handleError(error, { context: 'refresh_token' });
      return { 
        success: false, 
        error: apiError.userMessage || 'Token refresh failed',
        errorType: apiError.type 
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    refreshToken,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isJobSeeker: user?.role === 'jobseeker'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 