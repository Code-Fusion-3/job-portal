import { useState } from 'react';
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
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
      newErrors.employerName = t('employerRequest.errors.nameRequired', 'Employer name is required');
    }
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = t('employerRequest.errors.companyRequired', 'Company name is required');
    }
    
    if (!formData.email) {
      newErrors.email = t('employerRequest.errors.emailRequired', 'Email is required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('employerRequest.errors.emailInvalid', 'Please enter a valid email');
    }
    
    if (!formData.phone) {
      newErrors.phone = t('employerRequest.errors.phoneRequired', 'Phone number is required');
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = t('employerRequest.errors.phoneInvalid', 'Please enter a valid phone number');
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t('employerRequest.errors.messageRequired', 'Message is required');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('employerRequest.errors.messageLength', 'Message must be at least 10 characters');
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
      
  
      
      // For demo purposes, always succeed
      onSuccess();
      
      // Reset form
      setFormData({
        employerName: '',
        companyName: '',
        email: '',
        phone: '',
        message: '',
        jobSeekerId: jobSeekerId || '',
      });
      
    } catch (error) {
      console.error('Request error:', error);
      onError(error);
    } finally {
      setLoading(false);
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
            placeholder={t('employerRequest.companyNamePlaceholder', 'Enter company name')}
            value={formData.companyName}
            onChange={handleInputChange}
            error={errors.companyName}
            icon={Building}
            required
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