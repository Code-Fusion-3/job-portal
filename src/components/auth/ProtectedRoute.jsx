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
    // Add a small delay to ensure auth context is properly initialized
    const timer = setTimeout(() => {
      setIsCheckingSession(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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
    console.log('🔒 Access denied: User not authenticated');
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location, reason: 'not_authenticated' }} 
        replace 
      />
    );
  }

  // Check role requirements if specified
  if (requiredRole && user?.role !== requiredRole) {
    console.log(`🔒 Access denied: User role ${user?.role} does not match required role ${requiredRole}`);
    
    // Redirect to appropriate dashboard based on user role
    const dashboardPath = user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/jobseeker';
    
    return (
      <Navigate 
        to={dashboardPath} 
        state={{ from: location, reason: 'insufficient_permissions' }} 
        replace 
      />
    );
  }

  // User is authenticated and has required permissions
  return children;
};

export default ProtectedRoute; 