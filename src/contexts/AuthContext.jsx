import { createContext, useContext, useState, useEffect } from 'react';

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
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('jobPortalUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data based on role
      let mockUser;
      
      if (role === 'admin') {
        mockUser = {
          id: 'admin-1',
          email: email,
          role: 'admin',
          name: 'Admin User',
          avatar: null,
          permissions: ['manage_jobseekers', 'view_requests', 'send_messages']
        };
      } else {
        // Job seeker login
        mockUser = {
          id: 'jobseeker-1',
          email: email,
          role: 'jobseeker',
          name: 'John Doe',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          profile: {
            title: 'Software Engineer',
            experience: 3,
            location: 'Kigali, Rwanda',
            skills: ['React', 'Node.js', 'Python'],
            bio: 'Passionate software engineer with 3 years of experience.'
          }
        };
      }
      
      // Store user in localStorage
      localStorage.setItem('jobPortalUser', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('jobPortalUser');
    setUser(null);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('jobPortalUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    logout,
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