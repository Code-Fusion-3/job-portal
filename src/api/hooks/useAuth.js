/**
 * Custom Authentication Hook
 * Provides a clean interface for authentication operations
 */

import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext.jsx';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Export individual hooks for specific functionality
export const useLogin = () => {
  const { login, loading, error } = useContext(AuthContext);
  return { login, loading, error };
};

export const useLogout = () => {
  const { logout, loading } = useContext(AuthContext);
  return { logout, loading };
};

export const useRegister = () => {
  const { register, loading, error } = useContext(AuthContext);
  return { register, loading, error };
};

export const useProfile = () => {
  const { user, updateProfile, changePassword, refreshUserData, loading, error } = useContext(AuthContext);
  return { 
    user, 
    updateProfile, 
    changePassword, 
    refreshUserData, 
    loading, 
    error 
  };
};

export const useAuthStatus = () => {
  const { user, loading, isAuthenticated, isAdmin, isJobSeeker } = useContext(AuthContext);
  return { 
    user, 
    loading, 
    isAuthenticated, 
    isAdmin, 
    isJobSeeker 
  };
}; 