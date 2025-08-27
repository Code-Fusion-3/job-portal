import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import { useAuth } from '../api/hooks/useAuth';

const EmployerLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, loading: authLoading, error: authError, user, isAuthenticated, sessionValid } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState({});
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Track navigation attempts
  useEffect(() => {
    console.log('🔍 EmployerLogin: Page loaded/rendered');
    
    // Block any unwanted redirects
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      if (isLoggingIn) {
        console.log('🔒 BLOCKED pushState during login:', args);
        return;
      }
      return originalPushState.apply(this, args);
    };
    
    history.replaceState = function(...args) {
      if (isLoggingIn) {
        console.log('🔒 BLOCKED replaceState during login:', args);
        return;
      }
      return originalReplaceState.apply(this, args);
    };
    
    return () => {
      console.log('🔍 EmployerLogin: Page unmounting');
      // Restore original functions
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [isLoggingIn]);

  // Debug logging
  console.log('🔍 EmployerLogin Debug:', {
    user: user,
    isAuthenticated: isAuthenticated,
    sessionValid: sessionValid,
    authLoading: authLoading,
    authError: authError
  });

  // Update debug info whenever auth state changes
  useEffect(() => {
    setDebugInfo({
      user: user,
      isAuthenticated: isAuthenticated,
      sessionValid: sessionValid,
      authLoading: authLoading,
      authError: authError,
      timestamp: new Date().toISOString()
    });
  }, [user, isAuthenticated, sessionValid, authLoading, authError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔍 Form submission started');
    
    try {
      setIsLoggingIn(true); // Block navigation during login
      setIsLoading(true);
      setError('');
      setLoginAttempted(true);

      console.log('🔍 Attempting employer login with:', formData);
      
      // UI/UX: Add a 3-second delay to simulate loading for better visual feedback
      setIsLoading(true);
      const result = await login(formData.email, formData.password, 'employer');
      // await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second timeout for UI effect
      console.log('🔍 Login result:', result);
      setIsLoading(false);

      // BLOCK NAVIGATION - Show result on page instead
      if (result.success) {
        console.log('✅ Employer login successful:', result.user);
        setError(''); // Clear any previous errors
        // Now allow navigation to dashboard
        setDebugInfo(prev => ({
          ...prev,
          loginResult: result,
          loginSuccess: true,
          message: 'Login successful! Redirecting to dashboard...'
        }));
        
        // Add a small delay to show success message, then redirect
        setTimeout(() => {
          console.log('🔍 Allowing navigation to dashboard');
          setIsLoggingIn(false); // Allow navigation
          navigate('/dashboard/employer');
        }, 1500);
      } else {
        console.log('❌ Login failed, staying on page');
        console.error('❌ Employer login failed:', result.error);
        setError(result.error || 'Login failed. Please try again.');
        setDebugInfo(prev => ({
          ...prev,
          loginResult: result,
          loginSuccess: false,
          error: result.error,
          message: 'Login failed. Please check your credentials and try again.'
        }));
        
        // Clear any stored auth data on failed login
        localStorage.removeItem('employer_user');
        localStorage.removeItem('job_portal_token');
        
        // Allow navigation after failed login
        setIsLoggingIn(false);
      }
    } catch (err) {
      console.log('❌ Login error caught, staying on page');
      console.error('❌ Login error:', err);
      setError('Network error. Please check your connection and try again.');
      setDebugInfo(prev => ({
        ...prev,
        loginError: err,
        error: 'Network error'
      }));
      
      // Allow navigation after error
      setIsLoggingIn(false);
    } finally {
      console.log('🔍 Login process completed');
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Building2 className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Employer Login
          </h1>
          <p className="text-gray-600">
            Access your employer dashboard to manage requests and payments
          </p>
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

        {/* Success Message Display */}
        {debugInfo.loginSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm"
          >
            {debugInfo.message}
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

        {/* Debug Information */}
        {loginAttempted && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md text-sm text-gray-800">
            <h3 className="font-semibold mb-2">Login Debug Info:</h3>
            <pre className="whitespace-pre-wrap break-words">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}

        {/* Real-time Authentication State */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold mb-2 text-blue-800">🔍 Real-time Auth State:</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><strong>User:</strong> {user ? '✅ Set' : '❌ Not Set'}</div>
            <div><strong>isAuthenticated:</strong> {isAuthenticated ? '✅ True' : '❌ False'}</div>
            <div><strong>sessionValid:</strong> {sessionValid ? '✅ True' : '❌ False'}</div>
            <div><strong>authLoading:</strong> {authLoading ? '✅ True' : '❌ False'}</div>
            <div><strong>User Role:</strong> {user?.role || 'None'}</div>
            <div><strong>User ID:</strong> {user?.id || 'None'}</div>
          </div>
          {user && (
            <div className="mt-2 p-2 bg-white rounded border">
              <strong>User Object:</strong>
              <pre className="text-xs mt-1">{JSON.stringify(user, null, 2)}</pre>
            </div>
          )}
          
          {/* Manual Navigation Test */}
          <div className="mt-3 space-y-2">
            <button
              onClick={() => {
                console.log('🧪 Current auth state before navigation:', {
                  user: user,
                  isAuthenticated: isAuthenticated,
                  sessionValid: sessionValid,
                  authLoading: authLoading
                });
                navigate('/dashboard/employer');
              }}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
            >
              🧪 Test Navigation to Dashboard
            </button>
            <button
              onClick={() => {
                console.log('🧪 Force navigation with current state:', {
                  user: user,
                  isAuthenticated: isAuthenticated,
                  sessionValid: sessionValid
                });
                window.location.href = '/dashboard/employer';
              }}
              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 ml-2"
            >
              🧪 Force Navigation (window.location)
            </button>
            <button
              onClick={() => {
                console.log('🧪 Check localStorage:', {
                  employer_user: localStorage.getItem('employer_user'),
                  token: localStorage.getItem('job_portal_token')
                });
              }}
              className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 ml-2"
            >
              🧪 Check localStorage
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmployerLogin;
