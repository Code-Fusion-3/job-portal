import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../api/hooks/useAuth.js';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  redirectTo = '/login',
  showLoading = true 
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  


  useEffect(() => {
    // Wait for AuthContext to finish loading user data
    if (!loading && user) {
      // User is loaded, we can proceed with route protection
      const timer = setTimeout(() => {
        setIsCheckingSession(false);
      }, 50);
      return () => clearTimeout(timer);
    } else if (!loading && !user) {
      // AuthContext finished loading but no user found
      setIsCheckingSession(false);
    }
    // If still loading, keep checking session true
  }, [loading, user]);

  // Show loading spinner while checking authentication
  if (loading || isCheckingSession) {
    return showLoading ? (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    ) : null;
  }

  // User is not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location, reason: 'not_authenticated' }} 
        replace 
      />
    );
  }

  // Check role requirements if specified
  if (requiredRole && user) {
    // More robust role checking to handle state synchronization issues
    const userRole = user.role || user.user?.role || (user.data ? user.data.role : null);
    
  
    
    if (userRole !== requiredRole) {
      
      // If we have a valid user but role mismatch, redirect to appropriate dashboard
      const dashboardPath = userRole === 'admin' ? '/dashboard/admin' : '/dashboard/jobseeker';
      
      return (
        <Navigate 
          to={dashboardPath} 
          state={{ from: location, reason: 'insufficient_permissions' }} 
          replace 
        />
      );
    }
  }

  // User is authenticated and has required permissions
  return children;
};

export default ProtectedRoute; 