import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight, AlertTriangle, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import PasswordInput from '../components/ui/PasswordInput';
import FormCheckbox from '../components/ui/FormCheckbox';
import FormLayout from '../components/ui/FormLayout';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const AdminLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
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
      setSessionMessage('Your admin session has expired. Please log in again.');
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
    
    if (!formData.email) {
      newErrors.email = t('login.errors.emailRequired', 'Email is required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('login.errors.emailInvalid', 'Please enter a valid email');
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
      const result = await login(formData.email, formData.password, 'admin');
      if (result.success && result.user) {
        // Redirect based on role
        if (result.user.role === 'admin') {
          navigate('/dashboard/admin');
        } else if (result.user.role === 'jobseeker') {
          navigate('/update-profile');
        } else {
          navigate('/');
        }
      } else {
        setErrors({ general: result.error || t('login.errors.general', 'Admin login failed. Please try again.') });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setErrors({ general: t('login.errors.general', 'Admin login failed. Please try again.') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Admin Login Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mb-4"
            >
              <Shield className="h-8 w-8 text-white" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-white mb-2">
              Admin Portal
            </h2>
          </div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-lg shadow-2xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Session Expiration Message */}
              {sessionMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <span className="text-yellow-700 text-sm">{sessionMessage}</span>
                  </div>
                </motion.div>
              )}

              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                  <p className="text-red-600 text-sm">{errors.general}</p>
                </motion.div>
              )}

              {/* Admin Badge */}
              <div className="flex items-center justify-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <Building2 className="w-3 h-3 mr-1" />
                  Administrator Access
                </span>
              </div>

              <FormInput
                type="email"
                id="email"
                name="email"
                label="Admin Email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter admin email"
                error={errors.email}
                icon={Mail}
                required
              />

              <PasswordInput
                id="password"
                name="password"
                label="Admin Password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter admin password"
                error={errors.password}
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
                  to="/admin/forgot-password"
                  className="text-sm text-red-600 hover:text-red-500 transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full group bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Access Admin Portal
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Need help?{' '}
                <Link
                  to="/contact"
                  className="text-red-600 hover:text-red-500 font-medium transition-colors duration-200"
                >
                  Contact Support
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center"
          >
            <p className="text-gray-400 text-xs">
              <Shield className="inline w-3 h-3 mr-1" />
              Secure admin access • All activities are logged
            </p>
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminLogin; 