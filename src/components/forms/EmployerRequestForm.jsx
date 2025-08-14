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
    console.log('EmployerRequestForm: jobSeekerId prop changed:', jobSeekerId);
    console.log('EmployerRequestForm: Current formData.jobSeekerId:', formData.jobSeekerId);
    
    if (jobSeekerId && jobSeekerId !== formData.jobSeekerId) {
      console.log('EmployerRequestForm: Updating jobSeekerId from', formData.jobSeekerId, 'to', jobSeekerId);
      setFormData(prev => ({
        ...prev,
        jobSeekerId: jobSeekerId
      }));
    }
    
    // Fallback: if jobSeekerId is still null, try to extract from URL
    if (!jobSeekerId && !formData.jobSeekerId) {
      const urlParams = new URLSearchParams(window.location.search);
      const urlId = urlParams.get('id') || window.location.pathname.split('/').pop();
      
      if (urlId && urlId !== 'undefined' && urlId !== 'null') {
        console.log('EmployerRequestForm: Fallback - extracting ID from URL:', urlId);
        
        // Convert JS prefix to numeric ID if needed
        let numericId = urlId;
        if (typeof urlId === 'string' && urlId.startsWith('JS')) {
          numericId = parseInt(urlId.replace(/^JS/, ''), 10);
          console.log('EmployerRequestForm: Converted URL JS prefix to numeric ID:', numericId);
        }
        
        setFormData(prev => ({
          ...prev,
          jobSeekerId: numericId
        }));
      }
    }
    
    // Additional fallback: if jobSeekerId is a JS-prefixed ID, convert it to numeric
    if (jobSeekerId && typeof jobSeekerId === 'string' && jobSeekerId.startsWith('JS')) {
      const numericId = parseInt(jobSeekerId.replace(/^JS/, ''), 10);
      if (!isNaN(numericId) && numericId !== formData.jobSeekerId) {
        console.log('EmployerRequestForm: Converting JS-prefixed prop to numeric ID:', jobSeekerId, '->', numericId);
        setFormData(prev => ({
          ...prev,
          jobSeekerId: numericId
        }));
      }
    }
  }, [jobSeekerId, formData.jobSeekerId]);

  // Debug effect to log form data changes
  useEffect(() => {
    console.log('EmployerRequestForm: Form data updated:', formData);
  }, [formData]);

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
      newErrors.general = `Candidate ID is missing (current value: ${formData.jobSeekerId}). This is required to submit the request. Please refresh the page and try again.`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMISSION START ===');
    console.log('Form data being submitted:', formData);
    console.log('jobSeekerId value:', formData.jobSeekerId);
    console.log('jobSeekerId type:', typeof formData.jobSeekerId);
    console.log('jobSeekerId truthy check:', !!formData.jobSeekerId);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }
    
    setLoading(true);
    
    try {
      // Use environment variable for API URL
      const apiUrl = import.meta.env.VITE_DEV_API_URL || 'http://localhost:3000';
      const endpoint = `${apiUrl}/employer/request`;
      
      const requestBody = {
        name: formData.employerName,
        companyName: formData.companyName,
        email: formData.email,
        phoneNumber: formData.phone,
        message: formData.message,
        requestedCandidateId: (() => {
          // Extract the numeric ID from JS-prefixed IDs
          let candidateId = formData.jobSeekerId;
          
          if (typeof candidateId === 'string' && candidateId.startsWith('JS')) {
            const numericId = parseInt(candidateId.replace(/^JS/, ''), 10);
            console.log('Converting JS prefix ID:', candidateId, 'to numeric ID:', numericId);
            return numericId;
          }
          
          // If it's already a number, use it directly
          if (typeof candidateId === 'number') {
            return candidateId;
          }
          
          // If it's a string number, convert it
          const parsedId = parseInt(candidateId, 10);
          console.log('Converting string ID:', candidateId, 'to numeric ID:', parsedId);
          return parsedId;
        })(),
        priority: formData.priority
      };
      
      // Validate that requestedCandidateId is a valid number
      if (isNaN(requestBody.requestedCandidateId) || !requestBody.requestedCandidateId) {
        console.error('❌ Invalid requestedCandidateId:', requestBody.requestedCandidateId);
        throw new Error('Invalid candidate ID. Please refresh the page and try again.');
      }
      
      console.log('Request body being sent:', requestBody);
      console.log('API endpoint:', endpoint);
      console.log('requestedCandidateId in requestBody:', requestBody.requestedCandidateId);
      console.log('requestedCandidateId type:', typeof requestBody.requestedCandidateId);
      console.log('Original jobSeekerId:', formData.jobSeekerId);
      console.log('Original jobSeekerId type:', typeof formData.jobSeekerId);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response not OK:', { status: response.status, statusText: response.statusText, body: errorText });
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      console.log('Response received:', responseData);
      
      // Log the successful submission details
      console.log('✅ Request submitted successfully!');
      console.log('Sent requestedCandidateId:', requestBody.requestedCandidateId);
      console.log('Response requestedCandidateId:', responseData.request?.requestedCandidateId);
      console.log('Response selectedUserId:', responseData.request?.selectedUserId);
      
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
        {/* Debug Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="text-xs text-blue-800 font-medium mb-2">Debug Information:</div>
          <div className="text-xs text-blue-700 space-y-1">
            <div>Prop jobSeekerId: <span className="font-mono bg-blue-100 px-1 rounded">{String(jobSeekerId)}</span> (type: {typeof jobSeekerId})</div>
            <div>Form jobSeekerId: <span className="font-mono bg-blue-100 px-1 rounded">{String(formData.jobSeekerId)}</span> (type: {typeof formData.jobSeekerId})</div>
            <div>jobSeekerName: <span className="font-mono bg-blue-100 px-1 rounded">{String(jobSeekerName)}</span></div>
            <div>Will send as requestedCandidateId: <span className="font-mono bg-blue-100 px-1 rounded">{(() => {
              let candidateId = formData.jobSeekerId;
              if (typeof candidateId === 'string' && candidateId.startsWith('JS')) {
                return parseInt(candidateId.replace(/^JS/, ''), 10);
              }
              if (typeof candidateId === 'number') return candidateId;
              return parseInt(candidateId, 10);
            })()}</span></div>
          </div>
        </div>
        
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
            <p className="text-red-600 text-sm font-medium">{errors.general}</p>
            <p className="text-red-500 text-xs mt-1">
              This form requires a valid candidate ID to submit. Please contact support if this issue persists.
            </p>
          </div>
        )}

        {/* Warning if jobSeekerId is missing */}
        {!formData.jobSeekerId && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-700 text-sm font-medium">⚠️ Candidate ID Missing</p>
            <p className="text-yellow-600 text-xs mt-1">
              The candidate ID is required to submit this request. Current value: <span className="font-mono bg-yellow-100 px-1 rounded">{String(formData.jobSeekerId)}</span>
            </p>
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

        {/* Test Button for Debugging */}
        <button
          type="button"
          onClick={() => {
            console.log('=== TEST BUTTON CLICKED ===');
            console.log('Current formData:', formData);
            console.log('jobSeekerId prop:', jobSeekerId);
            console.log('Form validation result:', validateForm());
            
            // Calculate what will actually be sent
            const actualCandidateId = (() => {
              let candidateId = formData.jobSeekerId;
              if (typeof candidateId === 'string' && candidateId.startsWith('JS')) {
                return parseInt(candidateId.replace(/^JS/, ''), 10);
              }
              if (typeof candidateId === 'number') return candidateId;
              return parseInt(candidateId, 10);
            })();
            
            console.log('What would be sent:', {
              name: formData.employerName,
              companyName: formData.companyName,
              email: formData.email,
              phoneNumber: formData.phone,
              message: formData.message,
              requestedCandidateId: actualCandidateId,
              priority: formData.priority
            });
            console.log('Actual numeric candidate ID:', actualCandidateId);
          }}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
        >
          🧪 Test Form Data (Debug)
        </button>

        <p className="text-center text-sm text-gray-500">
          {t('employerRequest.disclaimer', 'Your request will be sent to our admin team for review. We\'ll get back to you within 24 hours.')}
        </p>
      </form>
    </div>
  );
};

export default EmployerRequestForm; 