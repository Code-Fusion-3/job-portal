import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Mail, User, Shield } from 'lucide-react';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import PasswordInput from '../components/ui/PasswordInput';
import FormCheckbox from '../components/ui/FormCheckbox';
import FormLayout from '../components/ui/FormLayout';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'jobseeker', // Default to job seeker
    rememberMe: false
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
    if (errors.role) {
      setErrors(prev => ({ ...prev, role: '' }));
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
      const result = await login(formData.email, formData.password, formData.role);
      
      if (result.success) {
        // Redirect to appropriate dashboard or intended page
        const from = location.state?.from?.pathname;
        const dashboardPath = formData.role === 'admin' ? '/dashboard/admin' : '/dashboard/jobseeker';
        navigate(from || dashboardPath);
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
        subtitle={t('login.subtitle', 'Sign in to your account to continue')}
        onSubmit={handleSubmit}
      >
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('login.role', 'I am a')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleRoleChange('jobseeker')}
              className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                formData.role === 'jobseeker'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <User className="w-6 h-6 mx-auto mb-2" />
              <div className="font-medium">{t('login.jobseeker', 'Job Seeker')}</div>
              <div className="text-sm text-gray-500">{t('login.jobseekerDesc', 'Looking for opportunities')}</div>
            </button>
            
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                formData.role === 'admin'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Shield className="w-6 h-6 mx-auto mb-2" />
              <div className="font-medium">{t('login.admin', 'Admin')}</div>
              <div className="text-sm text-gray-500">{t('login.adminDesc', 'Manage platform')}</div>
            </button>
          </div>
        </div>

        <FormInput
          type="email"
          id="email"
          name="email"
          label={t('login.email', 'Email Address')}
          value={formData.email}
          onChange={handleInputChange}
          placeholder={t('login.emailPlaceholder', 'Enter your email')}
          error={errors.email}
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

        <div className="text-center">
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