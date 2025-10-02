import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Building2, AlertCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import PasswordInput from '../components/ui/PasswordInput';
import FormCheckbox from '../components/ui/FormCheckbox';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/ui/HeroSection';
// Fallback background image if the specified one is not found
const defaultBackground = 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80';

const EmployerLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [sessionMessage, setSessionMessage] = useState('');
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

  // Check for session expiration message
  useEffect(() => {
    if (location.state?.message) {
      setSessionMessage(location.state.message);
      // Clear the message from location state
      navigate(location.pathname, { replace: true });
    } else if (location.search.includes('session=expired')) {
      setSessionMessage('Your session has expired. Please log in again.');
      // Clear the URL parameter
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.search, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      setErrors({});
      
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
          
          // Store remember me preference
          if (formData.rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          } else {
            localStorage.removeItem('rememberMe');
          }
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
          <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-700 text-lg font-medium">Logging you in...</p>
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
        
        setErrors({ general: errorMessage });
        
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
      
      setErrors({ general: errorMessage });
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
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${defaultBackground})` }}
    >
      <Header />
      
      {/* Hero Section */}
      <HeroSection 
        title={t('employerLogin.title', 'Employer Portal')}
        description={t('employerLogin.subtitle', 'Access your employer dashboard to manage requests and payments')}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 relative"
          >
            {/* Debug mode indicator */}
            {isDebugMode && (
              <div className="absolute -top-3 -right-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                DEBUG
              </div>
            )}
            
            {/* Debug info */}
            {debugInfo && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm mb-6"
              >
                {debugInfo}
              </motion.div>
            )}
            
            {/* Session Expiration Message */}
            {sessionMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6"
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <span className="text-yellow-800 text-sm">{sessionMessage}</span>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {errors.general && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
              >
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{errors.general}</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                type="email"
                id="email"
                name="email"
                label="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                error={errors.email}
                icon={Mail}
                required
              />

              <PasswordInput
                id="password"
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                error={errors.password}
                showPassword={showPassword}
                onTogglePassword={togglePasswordVisibility}
                required
              />

              <div className="flex items-center justify-between">
                <FormCheckbox
                  id="rememberMe"
                  name="rememberMe"
                  label="Remember me"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg"
                disabled={isLoading || authLoading}
              >
                {isLoading || authLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </Button>

              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                  </div>
                </div>
                
                <Link
                  to="/employer-request"
                  className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 border border-blue-200 rounded-lg hover:bg-blue-50"
                >
                  Request Employer Account
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EmployerLogin;
