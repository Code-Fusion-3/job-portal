import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../api/hooks/useAuth.js';
import { isTokenExpired, clearAuthTokens } from '../../api/config/apiConfig.js';

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/admin',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/forgot-password',
  '/reset-password',
  '/job-seekers'
];

// Helper function to check if current route is public
const isPublicRoute = (pathname) => {
  // Check exact matches first
  if (PUBLIC_ROUTES.includes(pathname)) {
    return true;
  }
  
  // Check dynamic public routes
  if (pathname.startsWith('/view-profile/')) {
    return true;
  }
  
  if (pathname.startsWith('/employer-request/')) {
    return true;
  }
  
  return false;
};

const SessionMonitor = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const sessionCheckInterval = useRef(null);
  const tokenCheckInterval = useRef(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Don't start monitoring if we're on a public route
    if (isPublicRoute(location.pathname)) {
      // Clear any existing intervals for public routes
      if (sessionCheckInterval.current) {
        clearInterval(sessionCheckInterval.current);
        sessionCheckInterval.current = null;
      }
      if (tokenCheckInterval.current) {
        clearInterval(tokenCheckInterval.current);
        tokenCheckInterval.current = null;
      }
      isInitialized.current = false;
      return;
    }
    
    // Don't start monitoring until we have a user and are not on login/register pages
    if (!isAuthenticated || !user || location.pathname === '/login' || location.pathname === '/register') {
      // Clear any existing intervals
      if (sessionCheckInterval.current) {
        clearInterval(sessionCheckInterval.current);
        sessionCheckInterval.current = null;
      }
      if (tokenCheckInterval.current) {
        clearInterval(tokenCheckInterval.current);
        tokenCheckInterval.current = null;
      }
      isInitialized.current = false;
      return;
    }

    // Only initialize once
    if (isInitialized.current) {
      return;
    }

    // Temporarily disable aggressive session checking to avoid login interference
    // Only check token expiration for now
    // sessionCheckInterval.current = setInterval(() => {
    //   checkSession();
    // }, 30000);

    // Check token expiration every minute
    tokenCheckInterval.current = setInterval(() => {
      checkTokenExpiration();
    }, 60000);

    // Initial check after a delay to avoid interfering with login
    const initialCheckTimer = setTimeout(() => {
      // checkSession();
      checkTokenExpiration();
    }, 5000); // Wait 5 seconds after login

    isInitialized.current = true;

    return () => {
      if (sessionCheckInterval.current) {
        clearInterval(sessionCheckInterval.current);
        sessionCheckInterval.current = null;
      }
      if (tokenCheckInterval.current) {
        clearInterval(tokenCheckInterval.current);
        tokenCheckInterval.current = null;
      }
      clearTimeout(initialCheckTimer);
      isInitialized.current = false;
    };
  }, [isAuthenticated, user, location.pathname]);

  const checkSession = async () => {
    // Don't check if we're on public routes
    if (isPublicRoute(location.pathname)) {
      return;
    }
    
    // Don't check if we're on login/register pages
    if (location.pathname === '/login' || location.pathname === '/register') {
      return;
    }

    try {
      // Use the getCurrentUser endpoint instead of a specific verify endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('job_portal_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn('Session verification failed, logging out...');
        await handleSessionExpired();
      }
    } catch (error) {
      console.error('Session check error:', error);
      // Don't logout on network errors, only on auth errors
      // Only logout if it's a 401 or 403 error
      if (error.response?.status === 401 || error.response?.status === 403) {
        await handleSessionExpired();
      }
    }
  };

  const checkTokenExpiration = () => {
    // Don't check if we're on public routes
    if (isPublicRoute(location.pathname)) {
      return;
    }
    
    // Don't check if we're on login/register pages
    if (location.pathname === '/login' || location.pathname === '/register') {
      return;
    }

    if (isTokenExpired()) {
      console.warn('Token expired, logging out...');
      handleSessionExpired();
    }
  };

  const handleSessionExpired = async () => {
    try {
      // Clear all auth data
      clearAuthTokens();
      
      // Call logout to clean up any server-side session
      await logout();
      
      // Only redirect if we're not already on login page and not on a public route
      if (location.pathname !== '/login' && !isPublicRoute(location.pathname)) {
        navigate('/login', { 
          state: { 
            message: 'Your session has expired. Please log in again.',
            type: 'warning'
          },
          replace: true 
        });
      }
    } catch (error) {
      console.error('Error during session expiration handling:', error);
      // Force redirect even if logout fails
      if (location.pathname !== '/login' && !isPublicRoute(location.pathname)) {
        navigate('/login', { 
          state: { 
            message: 'Your session has expired. Please log in again.',
            type: 'warning'
          },
          replace: true 
        });
      }
    }
  };

  // This component doesn't render anything
  return null;
};

export default SessionMonitor; 