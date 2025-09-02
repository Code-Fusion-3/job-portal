import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
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
      }, 200); // Increased delay to ensure state is fully updated
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
    console.log('🔒 REDIRECTING: User not authenticated', {
      user: user,
      isAuthenticated: isAuthenticated,
      sessionValid: user?.sessionValid
    });
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
      let dashboardPath;
      if (userRole === 'admin') {
        dashboardPath = '/dashboard/admin';
      } else if (userRole === 'employer') {
        dashboardPath = '/dashboard/employer';
      } else if (userRole === 'jobseeker') {
        dashboardPath = '/dashboard/jobseeker';
      } else {
        dashboardPath = '/login';
      }
      
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