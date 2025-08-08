import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Shield, ArrowRight, AlertTriangle, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '../api/hooks/useAuth.js';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import PasswordInput from '../components/ui/PasswordInput';
import FormCheckbox from '../components/ui/FormCheckbox';
import FormLayout from '../components/ui/FormLayout';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import jobseekerBackground from '../assets/jobseekerBackground.png';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    identifier: '', // can be email or phone
    password: '',
    rememberMe: false
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [sessionMessage, setSessionMessage] = useState('');

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
    if (!formData.identifier) {
      newErrors.identifier = t('login.errors.identifierRequired', 'Email or phone number is required');
    } else {
      // Check if it's an email or phone
      const isEmail = /\S+@\S+\.\S+/.test(formData.identifier);
      const isPhone = /^\+?\d{10,15}$/.test(formData.identifier);
      if (!isEmail && !isPhone) {
        newErrors.identifier = t('login.errors.identifierInvalid', 'Enter a valid email or phone number');
      }
    }
    if (!formData.password) {
      newErrors.password = t('login.errors.passwordRequired', 'Password is required');
    } else if (formData.password.length < 6) {
      newErrors.password = t('login.errors.passwordLength', 'Password must be at least 6 characters');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      // Pass identifier (email or phone) to login
      const result = await login(formData.identifier, formData.password, 'jobseeker');
      if (result.success && result.user) {
        // Redirect based on role
        if (result.user.role === 'jobseeker') {
          navigate('/update-profile');
        } else if (result.user.role === 'admin') {
          navigate('/dashboard/admin');
        } else {
          navigate('/');
        }
      } else {
        setErrors({ general: result.error || t('login.errors.general', 'Login failed. Please try again.') });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: t('login.errors.general', 'Login failed. Please try again.') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${jobseekerBackground})` }}
    >
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-blue-600/90 backdrop-blur-sm">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome Back
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Sign in to your job seeker account and continue your career journey
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20"
          >
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
                type="text"
                id="identifier"
                name="identifier"
                label={t('login.identifier', 'Email or Phone Number')}
                value={formData.identifier}
                onChange={handleInputChange}
                placeholder={t('login.identifierPlaceholder', 'Enter your email or phone number')}
                error={errors.identifier}
                icon={Mail}
                required
              />

              <PasswordInput
                id="password"
                name="password"
                label={t('login.password', 'Password')}
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t('login.passwordPlaceholder', 'Enter your password')}
                error={errors.password}
                required
              />

              <div className="flex items-center justify-between">
                <FormCheckbox
                  id="rememberMe"
                  name="rememberMe"
                  label={t('login.rememberMe', 'Remember me')}
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
                >
                  {t('login.forgotPassword', 'Forgot password?')}
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full group bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('login.signingIn', 'Signing in...')}
                  </>
                ) : (
                  <>
                    {t('login.signIn', 'Sign In')}
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
                    <span className="px-2 bg-white text-gray-500">New to our platform?</span>
                  </div>
                </div>
                
                <p className="text-gray-600">
                  {t('login.noAccount', "Don't have an account?")}{' '}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                  >
                    {t('login.signUp', 'Sign up')}
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login; 