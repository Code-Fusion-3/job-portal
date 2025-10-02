import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
      hasUser: !!user,
      isAuthenticated,
      sessionValid: user?.sessionValid,
      currentPath: location.pathname,
      requiredRole
    });
    
    // If this is an employer route and we have employer data in localStorage,
    // it might be a state sync issue - try to recover
    if (requiredRole === 'employer') {
      const storedEmployer = localStorage.getItem('employer_user');
      if (storedEmployer) {
        try {
          const employerData = JSON.parse(storedEmployer);
          console.log('Found stored employer data, attempting recovery...', employerData);
          
          // Set a small delay to allow state to update
          const timer = setTimeout(() => {
            window.location.reload();
          }, 100);
          
          return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Restoring your session...</p>
              </div>
            </div>
          );
        } catch (e) {
          console.error('Error parsing stored employer data:', e);
          localStorage.removeItem('employer_user');
        }
      }
    }
    
    return (
      <Navigate 
        to={redirectTo} 
        state={{ 
          from: location, 
          reason: 'not_authenticated',
          message: requiredRole ? `Please log in as ${requiredRole} to access this page` : 'Please log in to access this page'
        }} 
        replace 
      />
    );
  }

  // Check role requirements if specified
  if (requiredRole && user) {
    // More robust role checking to handle state synchronization issues
    const userRole = user.role || user.user?.role || (user.data ? user.data.role : null);
    console.log('🔍 Role check:', { userRole, requiredRole, user });
    
    // Special handling for employer role
    if (requiredRole === 'employer') {
      const storedEmployer = localStorage.getItem('employer_user');
      if (!storedEmployer) {
        console.log('No stored employer data found, forcing re-authentication');
        localStorage.removeItem('job_portal_token');
        return <Navigate to="/employer/login" state={{ from: location }} replace />;
      }
    }
    
    if (userRole !== requiredRole) {
      console.log(`Role mismatch: User is ${userRole} but ${requiredRole} is required`);
      
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
      
      // If the user is already on the correct path but still getting redirected,
      // it might be a state sync issue - force a reload
      if (location.pathname === dashboardPath) {
        console.log('Already on correct dashboard, forcing reload...');
        window.location.reload();
        return null;
      }
      
      return (
        <Navigate 
          to={dashboardPath} 
          state={{ 
            from: location, 
            reason: 'insufficient_permissions',
            message: `You don't have permission to access this page. Redirecting to your dashboard.`
          }} 
          replace 
        />
      );
    }
  }

  // User is authenticated and has required permissions
  return children;
};

export default ProtectedRoute; 