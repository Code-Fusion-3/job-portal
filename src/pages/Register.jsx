import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, User, Phone, Camera, MapPin, Calendar, FileText, Briefcase } from 'lucide-react';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import PasswordInput from '../components/ui/PasswordInput';
import FormCheckbox from '../components/ui/FormCheckbox';
import UserTypeSelector from '../components/ui/UserTypeSelector';
import FormLayout from '../components/ui/FormLayout';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { authService } from '../api/index.js';

// Sample job categories data - replace with API call later
const sampleCategories = [
 
  { id: '10', name: 'Customer Service' },
  { id: '11', name: 'Human Resources' },
  { id: '12', name: 'Finance & Accounting' },
  { id: '13', name: 'Healthcare' },
  { id: '14', name: 'Education' },
  { id: '15', name: 'Legal' },
  { id: '16', name: 'Engineering' },
  { id: '17', name: 'Architecture' },
  { id: '18', name: 'Construction' },
  { id: '19', name: 'Manufacturing' },
  { id: '20', name: 'Transportation & Logistics' },
  { id: '21', name: 'Hospitality & Tourism' },
  { id: '22', name: 'Agriculture' },
  { id: '23', name: 'Media & Entertainment' },
  { id: '24', name: 'Non-profit & NGO' },
  { id: '25', name: 'Other' }
];

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Required fields
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Optional fields
    contactNumber: '',
    description: '',
    skills: '',
    gender: '',
    dateOfBirth: '',
    idNumber: '',
    maritalStatus: '',
    location: '',
    city: '',
    country: '',
    references: '',
    experience: '',
    jobCategoryId: '',
    
    // Form controls
    userType: 'jobseeker',
    agreeToTerms: false,
    agreeToMarketing: false
  });
  
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photo: 'Please select an image file' }));
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'File size must be less than 5MB' }));
        return;
      }
      
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, photo: '' }));
    }
  };

  const handleUserTypeChange = (userType) => {
    setFormData(prev => ({ ...prev, userType }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('register.errors.firstNameRequired', 'First name is required');
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = t('register.errors.firstNameLength', 'First name must be at least 2 characters');
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('register.errors.lastNameRequired', 'Last name is required');
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = t('register.errors.lastNameLength', 'Last name must be at least 2 characters');
    }
    
    if (!formData.email) {
      newErrors.email = t('register.errors.emailRequired', 'Email is required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('register.errors.emailInvalid', 'Please enter a valid email');
    }
    
    if (!formData.password) {
      newErrors.password = t('register.errors.passwordRequired', 'Password is required');
    } else if (formData.password.length < 6) {
      newErrors.password = t('register.errors.passwordLength', 'Password must be at least 6 characters');
    }
    
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
      // Prepare data for API
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        contactNumber: formData.contactNumber || undefined,
        description: formData.description || undefined,
        skills: formData.skills || undefined,
        gender: formData.gender || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        idNumber: formData.idNumber || undefined,
        maritalStatus: formData.maritalStatus || undefined,
        location: formData.location || undefined,
        city: formData.city || undefined,
        country: formData.country || undefined,
        references: formData.references || undefined,
        experience: formData.experience || undefined,
        jobCategoryId: formData.jobCategoryId || undefined,
      };

      // Remove undefined values
      Object.keys(userData).forEach(key => {
        if (userData[key] === undefined) {
          delete userData[key];
        }
      });

      const result = await authService.registerJobSeeker(userData, photo);
      
      if (result.success) {
        navigate('/login');
      } else {
        setErrors({ general: result.error });
      }
      
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
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

        {/* Main Form Content with Responsive Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Required Information */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                {t('register.requiredFields', 'Required Information')}
              </h3>
              
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
            </div>
              {/* Photo Upload */}
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('register.photo', 'Profile Photo')}
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo"
                    />
                    <label
                      htmlFor="photo"
                      className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                    >
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Camera className="w-6 h-6 text-gray-400" />
                      )}
                    </label>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      {t('register.photoHelp', 'Upload a professional photo (max 5MB)')}
                    </p>
                    {errors.photo && (
                      <p className="text-sm text-red-600 mt-1">{errors.photo}</p>
                    )}
                  </div>
                </div>
              </div>
          </div>

          {/* Right Column - Additional Information */}
          <div className="space-y-6 pb-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('register.optionalFields', 'Additional Information (Optional)')}
              </h3>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  label={t('register.contactNumber', 'Phone Number')}
                  placeholder={t('register.contactNumberPlaceholder', '+250 788 123 456')}
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  error={errors.contactNumber}
                  icon={Phone}
                />
                <FormInput
                  id="idNumber"
                  name="idNumber"
                  label={t('register.idNumber', 'ID Number')}
                  placeholder={t('register.idNumberPlaceholder', 'National ID number')}
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  error={errors.idNumber}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date of Birth */}
                <FormInput
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  label={t('register.dateOfBirth', 'Date of Birth')}
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  error={errors.dateOfBirth}
                  icon={Calendar}
                />

                {/* Gender Select */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('register.gender', 'Gender')}
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 text-gray-900 pl-4 pr-10"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>

                {/* Marital Status Select */}
                <div>
                  <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('register.maritalStatus', 'Marital Status')}
                  </label>
                  <select
                    id="maritalStatus"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    className="w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 text-gray-900 pl-4 pr-10"
                  >
                    <option value="">Select Marital Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  {errors.maritalStatus && (
                    <p className="mt-1 text-sm text-red-600">{errors.maritalStatus}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="jobCategoryId" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('register.jobCategory', 'Job Category')}
                  </label>
                  <select
                    id="jobCategoryId"
                    name="jobCategoryId"
                    value={formData.jobCategoryId}
                    onChange={handleInputChange}
                    className="w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 text-gray-900 pl-4 pr-10"
                  >
                    <option value="">{t('register.jobCategoryPlaceholder', 'Select your job category')}</option>
                    {sampleCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.jobCategoryId && (
                    <p className="mt-1 text-sm text-red-600">{errors.jobCategoryId}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  id="location"
                  name="location"
                  label={t('register.location', 'Location')}
                  placeholder={t('register.locationPlaceholder', 'Kigali, Rwanda')}
                  value={formData.location}
                  onChange={handleInputChange}
                  error={errors.location}
                  icon={MapPin}
                />
                <FormInput
                  id="city"
                  name="city"
                  label={t('register.city', 'City')}
                  placeholder={t('register.cityPlaceholder', 'Kigali')}
                  value={formData.city}
                  onChange={handleInputChange}
                  error={errors.city}
                />
                <FormInput
                  id="country"
                  name="country"
                  label={t('register.country', 'Country')}
                  placeholder={t('register.countryPlaceholder', 'Rwanda')}
                  value={formData.country}
                  onChange={handleInputChange}
                  error={errors.country}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Section - Professional Information */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Professional Information
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormInput
              id="description"
              name="description"
              type="textarea"
              label={t('register.description', 'Professional Description')}
              placeholder={t('register.descriptionPlaceholder', 'Tell us about your professional background and skills...')}
              value={formData.description}
              onChange={handleInputChange}
              error={errors.description}
              icon={FileText}
            />

            <FormInput
              id="skills"
              name="skills"
              type="textarea"
              label={t('register.skills', 'Skills')}
              placeholder={t('register.skillsPlaceholder', 'List your key skills and competencies...')}
              value={formData.skills}
              onChange={handleInputChange}
              error={errors.skills}
              icon={Briefcase}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <FormInput
              id="experience"
              name="experience"
              type="textarea"
              label={t('register.experience', 'Experience')}
              placeholder={t('register.experiencePlaceholder', 'Describe your work experience...')}
              value={formData.experience}
              onChange={handleInputChange}
              error={errors.experience}
              icon={Briefcase}
            />

            <FormInput
              id="references"
              name="references"
              type="textarea"
              label={t('register.references', 'References')}
              placeholder={t('register.referencesPlaceholder', 'Professional references or previous employers...')}
              value={formData.references}
              onChange={handleInputChange}
              error={errors.references}
              icon={FileText}
            />
          </div>
        </div>

        {/* Form Controls */}
        <div className="pt-6 border-t border-gray-200">
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
            className="w-full flex items-center justify-center gap-2 mt-6"
            disabled={loading}
          >
            {loading ? t('register.creating', 'Creating account...') : t('register.createAccount', 'Create Account')}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </Button>

          <p className="text-center text-sm text-gray-600 mt-4">
            {t('register.haveAccount', 'Already have an account?')}{' '}
            <Link to="/login" className="font-medium text-red-600 hover:text-red-700 transition-colors duration-200">
              {t('register.signIn', 'Sign in')}
            </Link>
          </p>
        </div>
      </FormLayout>
      <Footer />
    </div>
  );
};

export default Register; 