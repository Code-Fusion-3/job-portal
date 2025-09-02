/**
 * useAuth Hook
 * Re-exports the useAuth hook from AuthContext for compatibility
 */

import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext.jsx';

// Re-export the main useAuth hook
export { useAuth } from '../../contexts/AuthContext.jsx';

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