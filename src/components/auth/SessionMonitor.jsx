import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../api/hooks/useAuth.js';
import { isTokenExpired, clearAuthTokens } from '../../api/config/apiConfig.js';

const SessionMonitor = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const sessionCheckInterval = useRef(null);
  const tokenCheckInterval = useRef(null);
  const isInitialized = useRef(false);

  useEffect(() => {
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
      
      // Only redirect if we're not already on login page
      if (location.pathname !== '/login') {
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
      if (location.pathname !== '/login') {
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