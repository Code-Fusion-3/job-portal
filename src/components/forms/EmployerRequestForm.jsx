import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, User, Building, MessageSquare, Send } from 'lucide-react';
import Button from '../ui/Button';
import FormInput from '../ui/FormInput';
import FormLayout from '../ui/FormLayout';

const EmployerRequestForm = ({ 
  jobSeekerId = null,
  jobSeekerName = null,
  onSuccess = () => {},
  onError = () => {},
  className = '',
  ...props 
}) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    employerName: '',
    companyName: '',
    email: '',
    phone: '',
    message: '',
    jobSeekerId: jobSeekerId || '',
    priority: 'normal',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Update form data when jobSeekerId prop changes
  useEffect(() => {
    console.log('EmployerRequestForm: jobSeekerId prop changed to:', jobSeekerId);
    setFormData(prev => ({
      ...prev,
      jobSeekerId: jobSeekerId || ''
    }));
  }, [jobSeekerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    
    if (!formData.employerName.trim()) {
      newErrors.employerName = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (25 ---)';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }
    
    // Add validation for jobSeekerId
    if (!formData.jobSeekerId || formData.jobSeekerId === '') {
      newErrors.general = 'Candidate ID is missing. Please refresh the page and try again.';
    }
    
    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Event:', e);
    console.log('Form data:', formData);
    console.log('Current errors:', errors);
    console.log('Job seeker ID prop:', jobSeekerId);
    console.log('Form jobSeekerId value:', formData.jobSeekerId);
    console.log('Form jobSeekerId type:', typeof formData.jobSeekerId);
    console.log('Form jobSeekerId length:', formData.jobSeekerId ? formData.jobSeekerId.toString().length : 'undefined');
    
    if (!validateForm()) {
      console.log('Form validation failed', { errors });
      return;
    }
    
    console.log('Form validation passed, proceeding with submission...');
    setLoading(true);
    
    try {
      // Use environment variable for API URL
      const apiUrl = import.meta.env.VITE_DEV_API_URL || 'http://localhost:3000';
      const endpoint = `${apiUrl}/employer/request`;
      
      console.log('Sending request to:', endpoint);
      console.log('Request payload:', {
        name: formData.employerName,
        companyName: formData.companyName,
        email: formData.email,
        phoneNumber: formData.phone,
        message: formData.message,
        id: formData.jobSeekerId, // Changed from requestedCandidateId to id
        priority: formData.priority
      });
      
      // Send request to backend
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.employerName,
          companyName: formData.companyName,
          email: formData.email,
          phoneNumber: formData.phone,
          message: formData.message,
          id: formData.jobSeekerId, // Changed from requestedCandidateId to id
          priority: formData.priority
        })
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response not OK:', { status: response.status, statusText: response.statusText, body: errorText });
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      console.log('Response data:', responseData);
      console.log('=== FORM SUBMISSION SUCCESSFUL ===');
      
      onSuccess();
      setFormData({
        employerName: '',
        companyName: '',
        email: '',
        phone: '',
        message: '',
        jobSeekerId: jobSeekerId || '',
        priority: 'normal',
      });
    } catch (error) {
      console.error('=== FORM SUBMISSION FAILED ===');
      console.error('Request error:', error);
      onError(error);
    } finally {
      setLoading(false);
      console.log('=== FORM SUBMISSION COMPLETED ===');
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 ${className}`} {...props}>
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t('employerRequest.title', 'Request Candidate')}
        </h3>
        <p className="text-gray-600">
          {jobSeekerName 
            ? t('employerRequest.subtitleWithName', 'Request to connect with {{name}}', { name: jobSeekerName })
            : t('employerRequest.subtitle', 'Send a request to connect with this candidate')
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-xs text-gray-500 mb-2">
          Form ID: employer-request-form | onSubmit handler: {handleSubmit ? 'Attached' : 'Missing'}
        </div>
        
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            {t('employerRequest.priority', 'Priority')}
          </label>
          <select
            id="priority"
            name="priority"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            value={formData.priority}
            onChange={handleInputChange}
            required
          >
            <option value="low">{t('employerRequest.priorityLow', 'Low')}</option>
            <option value="normal">{t('employerRequest.priorityNormal', 'Normal')}</option>
            <option value="high">{t('employerRequest.priorityHigh', 'High')}</option>
          </select>
        </div>
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            id="employerName"
            name="employerName"
            label={t('employerRequest.employerName', 'Your Name')}
            placeholder={t('employerRequest.employerNamePlaceholder', 'Enter your full name')}
            value={formData.employerName}
            onChange={handleInputChange}
            error={errors.employerName}
            icon={User}
            required
          />
          
          <FormInput
            id="companyName"
            name="companyName"
            label={t('employerRequest.companyName', 'Company Name')}
            placeholder={t('employerRequest.companyNamePlaceholder', 'Enter company name (optional)')}
            value={formData.companyName}
            onChange={handleInputChange}
            error={errors.companyName}
            icon={Building}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            id="email"
            name="email"
            type="email"
            label={t('employerRequest.email', 'Email Address')}
            placeholder={t('employerRequest.emailPlaceholder', 'Enter your email')}
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
            label={t('employerRequest.phone', 'Phone Number')}
            placeholder={t('employerRequest.phonePlaceholder', 'Enter your phone number')}
            value={formData.phone}
            onChange={handleInputChange}
            error={errors.phone}
            icon={MessageSquare}
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            {t('employerRequest.message', 'Message')}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
              errors.message ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={t('employerRequest.messagePlaceholder', 'Tell us about your requirements and why you\'re interested in this candidate...')}
            value={formData.message}
            onChange={handleInputChange}
            required
          />
          {errors.message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.message}
            </motion.p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {t('employerRequest.sending', 'Sending request...')}
            </>
          ) : (
            <>
              {t('employerRequest.sendRequest', 'Send Request')}
              <Send className="w-5 h-5" />
            </>
          )}
        </Button>

     

        <p className="text-center text-sm text-gray-500">
          {t('employerRequest.disclaimer', 'Your request will be sent to our admin team for review. We\'ll get back to you within 24 hours.')}
        </p>
      </form>
    </div>
  );
};

export default EmployerRequestForm; 