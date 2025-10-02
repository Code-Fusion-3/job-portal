import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext.jsx';

const EmployerLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Add debug mode state
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  // Toggle debug mode with Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setIsDebugMode(prev => !prev);
        setDebugInfo(prev => prev ? '' : 'Debug mode enabled. Check console for details.');
        console.log(`Debug mode ${isDebugMode ? 'disabled' : 'enabled'}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDebugMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      if (isDebugMode) {
        console.group('🔍 Employer Login Debug');
        console.log('Email:', formData.email);
        console.log('Password length:', formData.password.length);
        console.log('Login attempt at:', new Date().toISOString());
      }
      
      // Clear any existing auth data before new login attempt
      localStorage.removeItem('employer_user');
      localStorage.removeItem('job_portal_token');
      
      const result = await login(formData.email, formData.password, 'employer');
      
      if (isDebugMode) {
        console.log('Login result:', result);
      }
      
      if (result && result.success) {
        if (isDebugMode) {
          console.log('✅ Login successful');
          console.log('User data:', result.user);
          console.groupEnd();
        }
        
        // Store the token if it's in the result
        if (result.token) {
          localStorage.setItem('job_portal_token', result.token);
        }
        
        // Add a small delay to ensure state is updated before navigation
        setTimeout(() => {
          if (isDebugMode) {
            console.log('🔀 Redirecting to employer dashboard...');
          }
          // Force a full page reload to ensure all auth state is properly loaded
          window.location.href = '/dashboard/employer';
        }, 200);
        
        // Show a temporary loading state
        return (
          <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-700">Logging you in...</p>
              {isDebugMode && (
                <p className="text-sm text-gray-500 mt-2">Debug: Authentication successful</p>
              )}
            </div>
          </div>
        );
      } else {
        // Login failed - show error from backend or default message
        let errorMessage = 'Login failed. Please check your credentials.';
        
        // Enhanced error handling
        if (result?.error) {
          if (result.error.includes('401') || result.error.includes('Unauthorized')) {
            errorMessage = 'Invalid email or password. Please try again.';
          } else if (result.error.includes('Network Error')) {
            errorMessage = 'Unable to connect to the server. Please check your internet connection.';
          } else if (result.error.includes('timeout')) {
            errorMessage = 'Request timed out. Please try again.';
          } else {
            errorMessage = result.error;
          }
        }
        
        if (isDebugMode) {
          console.error('❌ Login failed:', result?.error || 'Unknown error');
          console.groupEnd();
        }
        
        setError(errorMessage);
        
        // Clear any stored auth data on failed login
        localStorage.removeItem('employer_user');
        localStorage.removeItem('job_portal_token');
      }
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data?.error || err.response.statusText || 'Server error occurred';
        if (isDebugMode) {
          console.error('Server response:', err.response);
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
        if (isDebugMode) {
          console.error('No response received. Request:', err.request);
        }
      } else if (err.message) {
        // Something happened in setting up the request
        errorMessage = err.message;
      }
      
      if (isDebugMode) {
        console.error('❌ Unexpected error:', err);
        console.groupEnd();
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      
      if (isDebugMode) {
        console.log('Login attempt completed at:', new Date().toISOString());
        console.groupEnd();
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl relative">
        {/* Debug mode indicator */}
        {isDebugMode && (
          <div className="absolute -top-3 -right-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            DEBUG
          </div>
        )}
        
        <div className="text-center">
          <Building2 className="mx-auto h-16 w-16 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t('employerLogin.title', 'Employer Login')}
            {isDebugMode && ' (Debug Mode)'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('employerLogin.subtitle', 'Access your employer dashboard')}
          </p>
          
          {/* Debug info */}
          {debugInfo && (
            <div className="mt-2 p-2 bg-blue-50 text-blue-700 text-sm rounded">
              {debugInfo}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Loading State Display */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm text-center"
          >
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Logging in...
            </div>
          </motion.div>
        )}

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || authLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading || authLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Login to Dashboard'
              )}
            </Button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center space-y-3">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Forgot your password?
            </Link>
            
            <div className="text-sm text-gray-600">
              Don't have an employer account?{' '}
              <Link
                to="/employer-request"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Submit a request
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <Link to="/contact" className="text-blue-600 hover:text-blue-800 transition-colors">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployerLogin;
