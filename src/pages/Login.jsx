import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Shield, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '../api/hooks/useAuth.js';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import PasswordInput from '../components/ui/PasswordInput';
import FormCheckbox from '../components/ui/FormCheckbox';
import FormLayout from '../components/ui/FormLayout';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <FormLayout
        title={t('login.title', 'Welcome Back')}
        subtitle={t('login.subtitle', 'Sign in to your job seeker account')}
        onSubmit={handleSubmit}
      >
        {/* Session Expiration Message */}
        {sessionMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-700">{sessionMessage}</span>
            </div>
          </motion.div>
        )}

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

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
            className="text-sm text-red-600 hover:text-red-500 transition-colors duration-200"
          >
            {t('login.forgotPassword', 'Forgot password?')}
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full group"
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

        <div className="text-center space-y-2">
          <p className="text-gray-600">
            {t('login.noAccount', "Don't have an account?")}{' '}
            <Link
              to="/register"
              className="text-red-600 hover:text-red-500 font-medium transition-colors duration-200"
            >
              {t('login.signUp', 'Sign up')}
            </Link>
          </p>
        </div>
      </FormLayout>
      
      <Footer />
    </div>
  );
};

export default Login; 