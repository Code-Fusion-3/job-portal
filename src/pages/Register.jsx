import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, User, Phone } from 'lucide-react';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import PasswordInput from '../components/ui/PasswordInput';
import FormCheckbox from '../components/ui/FormCheckbox';
import UserTypeSelector from '../components/ui/UserTypeSelector';
import FormLayout from '../components/ui/FormLayout';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'jobseeker', // Always jobseeker now
    agreeToTerms: false,
    agreeToMarketing: false
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

  const handleUserTypeChange = (userType) => {
    setFormData(prev => ({ ...prev, userType }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('register.errors.firstNameRequired', 'First name is required');
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = t('register.errors.firstNameLength', 'First name must be at least 2 characters');
    }
    
    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('register.errors.lastNameRequired', 'Last name is required');
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = t('register.errors.lastNameLength', 'Last name must be at least 2 characters');
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = t('register.errors.emailRequired', 'Email is required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('register.errors.emailInvalid', 'Please enter a valid email');
    }
    
    // Phone validation
    if (!formData.phone) {
      newErrors.phone = t('register.errors.phoneRequired', 'Phone number is required');
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = t('register.errors.phoneInvalid', 'Please enter a valid phone number');
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = t('register.errors.passwordRequired', 'Password is required');
    } else if (formData.password.length < 8) {
      newErrors.password = t('register.errors.passwordLength', 'Password must be at least 8 characters');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = t('register.errors.passwordComplexity', 'Password must contain uppercase, lowercase, and number');
    }
    
    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('register.errors.confirmPasswordRequired', 'Please confirm your password');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('register.errors.passwordMismatch', 'Passwords do not match');
    }
    
    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = t('register.errors.termsRequired', 'You must agree to the terms and conditions');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Registration attempt:', formData);
      
      // For demo purposes, always succeed
      navigate('/login');
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: t('register.errors.general', 'Registration failed. Please try again.') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <FormLayout
        title={t('register.title', 'Create Your Account')}
        subtitle={t('register.subtitle', 'Join thousands of job seekers and start your career journey')}
        onSubmit={handleSubmit}
      >
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        <UserTypeSelector
          label={t('register.userType', 'I am a')}
          value={formData.userType}
          onChange={handleUserTypeChange}
          jobseekerLabel={t('register.jobseeker', 'Job Seeker')}
          jobseekerDesc={t('register.jobseekerDesc', 'Looking for opportunities')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            id="firstName"
            name="firstName"
            label={t('register.firstName', 'First Name')}
            placeholder={t('register.firstNamePlaceholder', 'First name')}
            value={formData.firstName}
            onChange={handleInputChange}
            error={errors.firstName}
            icon={User}
            required
          />
          <FormInput
            id="lastName"
            name="lastName"
            label={t('register.lastName', 'Last Name')}
            placeholder={t('register.lastNamePlaceholder', 'Last name')}
            value={formData.lastName}
            onChange={handleInputChange}
            error={errors.lastName}
            icon={User}
            required
          />
        </div>

        <FormInput
          id="email"
          name="email"
          type="email"
          label={t('register.email', 'Email Address')}
          placeholder={t('register.emailPlaceholder', 'Enter your email')}
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          icon={Mail}
          required
        />

        <FormInput
          id="phone"
          name="phone"
          type="tel"
          label={t('register.phone', 'Phone Number')}
          placeholder={t('register.phonePlaceholder', 'Enter your phone number')}
          value={formData.phone}
          onChange={handleInputChange}
          error={errors.phone}
          icon={Phone}
          required
        />

        <PasswordInput
          id="password"
          name="password"
          label={t('register.password', 'Password')}
          placeholder={t('register.passwordPlaceholder', 'Create a password')}
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          showStrength
          required
        />

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label={t('register.confirmPassword', 'Confirm Password')}
          placeholder={t('register.confirmPasswordPlaceholder', 'Confirm your password')}
          value={formData.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
          required
        />

        <FormCheckbox
          id="agreeToTerms"
          name="agreeToTerms"
          label={
            <span>
              {t('register.agreeToTerms', 'I agree to the')}{' '}
              <Link to="/terms" className="text-red-600 hover:underline">
                {t('register.terms', 'Terms of Service')}
              </Link>{' '}
              {t('register.and', 'and')}{' '}
              <Link to="/privacy" className="text-red-600 hover:underline">
                {t('register.privacy', 'Privacy Policy')}
              </Link>
            </span>
          }
          checked={formData.agreeToTerms}
          onChange={handleInputChange}
          error={errors.agreeToTerms}
          required
        />

        <FormCheckbox
          id="agreeToMarketing"
          name="agreeToMarketing"
          label={t('register.agreeToMarketing', 'I agree to receive marketing communications and updates')}
          checked={formData.agreeToMarketing}
          onChange={handleInputChange}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? t('register.creating', 'Creating account...') : t('register.createAccount', 'Create Account')}
          {!loading && <ArrowRight className="w-5 h-5" />}
        </Button>

        <p className="text-center text-sm text-gray-600">
          {t('register.haveAccount', 'Already have an account?')}{' '}
          <Link to="/login" className="font-medium text-red-600 hover:text-red-700 transition-colors duration-200">
            {t('register.signIn', 'Sign in')}
          </Link>
        </p>
      </FormLayout>
      <Footer />
    </div>
  );
};

export default Register; 