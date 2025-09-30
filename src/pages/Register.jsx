import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, User, Phone, Camera, MapPin, Calendar, FileText, Briefcase, ChevronDown, ChevronUp, UserPlus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import PasswordInput from '../components/ui/PasswordInput';
import PhoneInput from '../components/ui/PhoneInput';
import FormCheckbox from '../components/ui/FormCheckbox';
import UserTypeSelector from '../components/ui/UserTypeSelector';
import FormLayout from '../components/ui/FormLayout';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/ui/HeroSection';
import Modal from '../components/ui/Modal';
import BackendErrorModal from '../components/ui/BackendErrorModal';
import { authService } from '../api/index.js';
import { usePublicCategories } from '../api/hooks/useCategories';
import jobseekerBackground from '../assets/jobseekerBackground.png';
import React from 'react'; // Added missing import

// Job categories will be loaded dynamically from the API

// Education levels data - using translation keys
const sampleEducationLevels = [
  'education.noFormal',
  'education.primarySchool',
  'education.secondarySchool',
  'education.highSchool',
  'education.vocationalTraining',
  'education.associateDegree',
  'education.bachelorsDegree',
  'education.mastersDegree',
  'education.phd',
  'education.other'
];

// Availability options data - using translation keys
const sampleAvailabilityOptions = [
  'availability.available',
  'availability.partTime',
  'availability.contract',
  'availability.freelance',
  'availability.notAvailable',
  'availability.openToOpportunities'
];

// Predefined skills options - using translation keys
const predefinedSkills = [
  // House Maid & Domestic Skills (Priority)
  'skills.houseCleaning', 'skills.laundry', 'skills.ironing', 'skills.cooking', 'skills.mealPreparation', 'skills.kitchenManagement',
  'skills.childcare', 'skills.elderlyCare', 'skills.petCare', 'skills.firstAid', 'skills.safety', 'skills.educationalActivities',
  'skills.gardening', 'skills.plantCare', 'skills.basicRepairs', 'skills.securityMonitoring', 'skills.accessControl',
  
  // Hospitality & Service Skills
  'skills.foodService', 'skills.tableSetting', 'skills.orderTaking', 'skills.cashHandling', 'skills.customerService',
  'skills.bartending', 'skills.foodDelivery', 'skills.housekeeping', 'skills.reception', 'skills.secretarialWork',
  
  // Trade Skills
  'skills.carpentry', 'skills.plumbing', 'skills.electricalWork', 'skills.masonry', 'skills.painting', 'skills.welding', 'skills.machining',
  'skills.landscaping', 'skills.baking',
  
  // Transportation Skills
  'skills.safeDriving', 'skills.vehicleMaintenance', 'skills.routePlanning', 'skills.gpsNavigation',
  'skills.defensiveDriving', 'skills.passengerSafety',
  
  // Business Skills
  'skills.accounting', 'skills.bookkeeping', 'skills.marketing', 'skills.sales', 'skills.businessDevelopment', 'skills.financialAnalysis',
  'skills.humanResources', 'skills.operationsManagement', 'skills.supplyChainManagement',
  'skills.inventoryManagement', 'skills.negotiation', 'skills.productKnowledge', 'skills.marketKnowledge',
  
  // Technical Skills
  'skills.javascript', 'skills.react', 'skills.nodejs', 'skills.python', 'skills.java', 'skills.cpp', 'skills.php', 'skills.ruby', 'skills.go', 'skills.rust',
  'skills.htmlcss', 'skills.typescript', 'skills.angular', 'skills.vuejs', 'skills.django', 'skills.flask', 'skills.laravel', 'skills.expressjs',
  'skills.mongodb', 'skills.postgresql', 'skills.mysql', 'skills.redis', 'skills.docker', 'skills.kubernetes', 'skills.aws', 'skills.azure', 'skills.gcp',
  
  // Professional Skills
  'skills.projectManagement', 'skills.agileScrum', 'skills.leadership', 'skills.teamManagement', 'skills.communication',
  'skills.problemSolving', 'skills.criticalThinking', 'skills.timeManagement',
  
  // Creative Skills
  'skills.graphicDesign', 'skills.webDesign', 'skills.videoEditing', 'skills.photography', 'skills.contentWriting',
  'skills.socialMediaManagement', 'skills.digitalMarketing', 'skills.seo', 'skills.copywriting',
  
  // Healthcare Skills
  'skills.nursing', 'skills.medicalAssistance', 'skills.pharmacy', 'skills.laboratoryWork', 'skills.patientCare',
  'skills.medicalRecords', 'skills.healthAdministration',
  
  // Education Skills
  'skills.teaching', 'skills.tutoring', 'skills.curriculumDevelopment', 'skills.studentAssessment', 'skills.classroomManagement',
  'skills.specialEducation', 'skills.eslTeaching',
  
  // Other Skills
  'skills.security', 'skills.eventPlanning', 'skills.tourism', 'skills.translation', 'skills.interpretation',
  'skills.dataEntry', 'skills.administrativeWork'
];

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Load categories dynamically from API
  const { categories: jobCategories, loading: categoriesLoading, error: categoriesError } = usePublicCategories();
  
  const [formData, setFormData] = useState({
    // Required fields
    firstName: '',
    lastName: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
    // Optional fields
    email: '', // Add missing email field
    description: '',
    gender: '',
    dateOfBirth: '',
    location: '',
    city: '',
    country: '',
    jobCategoryId: '',
    educationLevel: '',
    experienceLevel: '',
    // Form controls
    userType: 'jobseeker',
    agreeToTerms: false,
    agreeToMarketing: false
  });
  
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Validation modal state
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  
  // Backend error modal state
  const [showBackendErrorModal, setShowBackendErrorModal] = useState(false);
  const [backendErrors, setBackendErrors] = useState([]);











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
    
    // Clear validation modal when user starts fixing errors
    if (showValidationModal) {
      setShowValidationModal(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photo: t('register.errors.photo') }));
        setPhoto(null);
        setPhotoPreview(null);
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: t('register.errors.photoSize') }));
        setPhoto(null);
        setPhotoPreview(null);
        return;
      }
      
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, photo: '' }));
    } else {
      // Handle case when no file is selected (e.g., user cancels file dialog)
      if (!photo) {
        setErrors(prev => ({ ...prev, photo: t('register.errors.photoRequired') }));
      }
    }
  };

  const handleUserTypeChange = (userType) => {
    setFormData(prev => ({ ...prev, userType }));
  };



  // Helper function to group errors by section
  const groupErrorsBySection = (errors) => {
    const grouped = {};
    errors.forEach(error => {
      if (!grouped[error.section]) {
        grouped[error.section] = [];
      }
      grouped[error.section].push(error);
    });
    return grouped;
  };

  // Helper function to scroll to a specific field
  const scrollToField = (fieldName) => {
    const element = document.getElementById(fieldName);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.focus();
      // Add a brief highlight effect
      element.classList.add('ring-2', 'ring-red-500', 'ring-opacity-50');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-red-500', 'ring-opacity-50');
      }, 2000);
    }
    setShowValidationModal(false);
    setShowBackendErrorModal(false);
  };

  const validateForm = () => {
    const newErrors = {};
    const errorList = [];

    // First Name
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('register.errors.firstNameRequired');
      errorList.push({
        field: 'firstName',
        message: t('register.errors.firstNameRequired'),
        section: 'required',
        label: t('register.firstName')
      });
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = t('register.errors.firstNameLength');
      errorList.push({
        field: 'firstName',
        message: t('register.errors.firstNameLength'),
        section: 'required',
        label: t('register.firstName')
      });
    }

    // Last Name
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('register.errors.lastNameRequired');
      errorList.push({
        field: 'lastName',
        message: t('register.errors.lastNameRequired'),
        section: 'required',
        label: t('register.lastName')
      });
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = t('register.errors.lastNameLength');
      errorList.push({
        field: 'lastName',
        message: t('register.errors.lastNameLength'),
        section: 'required',
        label: t('register.lastName')
      });
    }

    // Phone Number - Now required
    if (!formData.contactNumber || !formData.contactNumber.trim()) {
      newErrors.contactNumber = t('register.errors.phoneRequired');
      errorList.push({
        field: 'contactNumber',
        message: t('register.errors.phoneRequired'),
        section: 'required',
        label: t('register.phone')
      });
    } else if (formData.contactNumber.replace(/\D/g, '').length < 9) {
      newErrors.contactNumber = 'Phone number must be at least 9 digits';
      errorList.push({
        field: 'contactNumber',
        message: 'Phone number must be at least 9 digits',
        section: 'required',
        label: t('register.phone')
      });
    }

    // Email - Now required
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = t('register.errors.emailRequired');
      errorList.push({
        field: 'email',
        message: t('register.errors.emailRequired'),
        section: 'required',
        label: t('register.email')
      });
    } else if (!/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,})$/.test(formData.email)) {
      newErrors.email = t('register.errors.emailInvalid');
      errorList.push({
        field: 'email',
        message: t('register.errors.emailInvalid'),
        section: 'required',
        label: t('register.email')
      });
    }

    // Gender - Now required
    if (!formData.gender || !formData.gender.trim()) {
      newErrors.gender = t('register.errors.genderRequired');
      errorList.push({
        field: 'gender',
        message: t('register.errors.genderRequired'),
        section: 'required',
        label: t('register.gender')
      });
    }

    // Date of Birth - Now required
    if (!formData.dateOfBirth || !formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = t('register.errors.dateOfBirthRequired');
      errorList.push({
        field: 'dateOfBirth',
        message: t('register.errors.dateOfBirthRequired'),
        section: 'required',
        label: t('register.dateOfBirth')
      });
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 18) {
        newErrors.dateOfBirth = t('register.errors.ageLimit');
        errorList.push({
          field: 'dateOfBirth',
          message: t('register.errors.ageLimit'),
          section: 'required',
          label: t('register.dateOfBirth')
        });
      }
    }

    // Job Category - Now required
    if (!formData.jobCategoryId || !formData.jobCategoryId.toString().trim()) {
      newErrors.jobCategoryId = t('register.errors.jobCategoryRequired');
      errorList.push({
        field: 'jobCategoryId',
        message: t('register.errors.jobCategoryRequired'),
        section: 'required',
        label: t('register.jobCategory')
      });
    }

    // Experience Level - Required
    if (!formData.experienceLevel || formData.experienceLevel.trim().length === 0) {
      newErrors.experienceLevel = t('register.errors.experienceLevelRequired');
      errorList.push({
        field: 'experienceLevel',
        message: t('register.errors.experienceLevelRequired'),
        section: 'required',
        label: t('register.experienceLevel')
      });
    }

    // Education Level - Now required
    if (!formData.educationLevel || !formData.educationLevel.trim()) {
      newErrors.educationLevel = t('register.errors.educationLevelRequired');
      errorList.push({
        field: 'educationLevel',
        message: t('register.errors.educationLevelRequired'),
        section: 'required',
        label: t('register.educationLevel')
      });
    }

    // Location - Now required
    if (!formData.location || !formData.location.trim()) {
      newErrors.location = t('register.errors.locationRequired');
      errorList.push({
        field: 'location',
        message: t('register.errors.locationRequired'),
        section: 'required',
        label: t('register.location')
      });
    }

    // City - Now required
    if (!formData.city || !formData.city.trim()) {
      newErrors.city = t('register.errors.cityRequired');
      errorList.push({
        field: 'city',
        message: t('register.errors.cityRequired'),
        section: 'required',
        label: t('register.city')
      });
    }

    // Country - Now required
    if (!formData.country || !formData.country.trim()) {
      newErrors.country = t('register.errors.countryRequired');
      errorList.push({
        field: 'country',
        message: t('register.errors.countryRequired'),
        section: 'required',
        label: t('register.country')
      });
    }

    // Password
    if (!formData.password) {
      newErrors.password = t('register.errors.passwordRequired');
      errorList.push({
        field: 'password',
        message: t('register.errors.passwordRequired'),
        section: 'required',
        label: t('register.password')
      });
    } else if (formData.password.length < 6) {
      newErrors.password = t('register.errors.passwordLength');
      errorList.push({
        field: 'password',
        message: t('register.errors.passwordLength'),
        section: 'required',
        label: t('register.password')
      });
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('register.errors.confirmPasswordRequired');
      errorList.push({
        field: 'confirmPassword',
        message: t('register.errors.confirmPasswordRequired'),
        section: 'required',
        label: t('register.confirmPassword')
      });
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('register.errors.passwordMismatch');
      errorList.push({
        field: 'confirmPassword',
        message: t('register.errors.passwordMismatch'),
        section: 'required',
        label: t('register.confirmPassword')
      });
    }

    // Description - Now required
    if (!formData.description || !formData.description.trim()) {
      newErrors.description = t('register.errors.descriptionRequired');
      errorList.push({
        field: 'description',
        message: t('register.errors.descriptionRequired'),
        section: 'required',
        label: t('register.description')
      });
    }

    // Profile Photo - Now required
    if (!photo) {
      newErrors.photo = t('register.errors.photoRequired');
      errorList.push({
        field: 'photo',
        message: t('register.errors.photoRequired'),
        section: 'required',
        label: t('register.profilePhoto')
      });
    }

    // Terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = t('register.errors.termsRequired');
      errorList.push({
        field: 'agreeToTerms',
        message: t('register.errors.termsRequired'),
        section: 'required',
        label: t('register.terms')
      });
    }

    setErrors(newErrors);
    setValidationErrors(errorList);
    
    // Show validation modal if there are errors
    if (errorList.length > 0) {
      setShowValidationModal(true);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data for API - simplified user data
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        contactNumber: formData.contactNumber.trim(),
        password: formData.password,
        email: formData.email.trim() || null,
        description: formData.description.trim() || null,
        gender: formData.gender || null,
        dateOfBirth: formData.dateOfBirth || null,
        location: formData.location.trim() || null,
        city: formData.city.trim() || null,
        country: formData.country.trim() || null,
        jobCategoryId: formData.jobCategoryId ? parseInt(formData.jobCategoryId, 10) : null,
        educationLevel: formData.educationLevel || null,
        experienceLevel: formData.experienceLevel || null,
      };

      // Remove null and empty string values, but keep fields with actual content
      Object.keys(userData).forEach(key => {
        if (userData[key] === null || userData[key] === '' || userData[key] === undefined) {
          delete userData[key];
        }
      });



      const result = await authService.registerJobSeeker(userData, photo);
      if (result.success && result.user) {
        // Always clear errors after successful registration
        setErrors({});
        setValidationErrors([]);
        setShowValidationModal(false);
        setBackendErrors([]);
        setShowBackendErrorModal(false);
        // Redirect jobseeker to pending approval page
        if (result.user.role === 'jobseeker') {
          navigate('/pending-approval');
        } else if (result.user.role === 'admin') {
          navigate('/dashboard/admin');
        } else {
          navigate('/');
        }
      } else {
        // Handle backend validation errors
        if (result.backendErrors && Array.isArray(result.backendErrors)) {
          setBackendErrors(result.backendErrors);
          setShowBackendErrorModal(true);
        } else {
          setErrors({ general: result.error });
        }
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: t('register.errors.general') });
    } finally {
      setLoading(false);
    }
  };

  // Validation Error List Component
  const ValidationErrorList = ({ errors, onClose, onScrollToField }) => {
    const groupedErrors = groupErrorsBySection(errors);
    
    const getSectionTitle = (section) => {
      switch (section) {
        case 'required':
          return t('register.sections.required');
        case 'additional':
          return t('register.sections.additional');
        case 'professional':
          return t('register.sections.professional');
        default:
          return section;
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-2">
            {t('register.validationErrors.title')}
          </p>
          <p className="text-lg text-gray-600 mb-1">
            {t('register.validationErrors.found', { count: errors.length })}
          </p>
          <p className="text-sm text-gray-500">
            {t('register.validationErrors.pleaseFix')}
          </p>
        </div>
        
        {Object.entries(groupedErrors).map(([section, sectionErrors]) => (
          <div key={section} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              {getSectionTitle(section)}
              <span className="ml-2 text-sm text-gray-500">({sectionErrors.length})</span>
            </h3>
            <div className="space-y-2">
              {sectionErrors.map((error, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{error.label}:</span>
                    <span className="text-red-600 ml-2">{error.message}</span>
                  </div>
                  <button
                    onClick={() => onScrollToField(error.field)}
                    className="ml-3 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {t('register.validationErrors.goToField')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="flex justify-center pt-4 border-t border-gray-200">
          <Button 
            variant="primary" 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700"
          >
            {t('register.validationErrors.fixErrors')}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${jobseekerBackground})` }}
    >
      <Header />
      
      {/* Hero Section */}
      <HeroSection 
        title={t('register.title')}
        description={t('register.subtitle')}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        {/* <UserTypeSelector
          value={formData.userType}
          onChange={handleUserTypeChange}
        /> */}





          {/* Single Form Section - All Fields */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-6">
                {t('register.requiredFields')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  id="firstName"
                  name="firstName"
                  label={t('register.firstName')}
                  placeholder={t('register.firstNamePlaceholder')}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                  icon={User}
                  required
                />
                <FormInput
                  id="lastName"
                  name="lastName"
                  label={t('register.lastName')}
                  placeholder={t('register.lastNamePlaceholder')}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                  icon={User}
                  required
                />
                <PhoneInput
                  id="contactNumber"
                  name="contactNumber"
                  label={t('register.phone')}
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  error={errors.contactNumber}
                  required
                />
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  label={t('register.email')}
                  placeholder={t('register.emailPlaceholder')}
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  icon={Mail}
                  required
                />
                {/* Gender Select */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('register.gender')} *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 text-gray-900 pl-4 pr-10"
                    required
                  >
                    <option value="">{t('register.selectGender')}</option>
                    <option value="Male">{t('gender.male')}</option>
                    <option value="Female">{t('gender.female')}</option>
                    <option value="Other">{t('gender.other')}</option>
                    <option value="Prefer not to say">{t('gender.preferNotToSay')}</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>
                {/* Date of Birth */}
                <FormInput
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  label={t('register.dateOfBirth')}
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  error={errors.dateOfBirth}
                  icon={Calendar}
                  required
                />
                {/* Job Category */}
                <div>
                  <label htmlFor="jobCategoryId" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('register.jobCategory')} *
                  </label>
                  <select
                    id="jobCategoryId"
                    name="jobCategoryId"
                    value={formData.jobCategoryId}
                    onChange={handleInputChange}
                    disabled={categoriesLoading}
                    className="w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 text-gray-900 pl-4 pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">
                      {categoriesLoading 
                        ? t('register.loadingCategories') 
                        : t('register.selectJobCategory')
                      }
                    </option>
                    {!categoriesLoading && jobCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name_en} - {category.name_rw}
                      </option>
                    ))}
                  </select>
                  {errors.jobCategoryId && (
                    <p className="mt-1 text-sm text-red-600">{errors.jobCategoryId}</p>
                  )}
                  {categoriesError && (
                    <p className="mt-1 text-sm text-red-600">{t('register.errorLoadingCategories')} {categoriesError}</p>
                  )}
                </div>
                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('register.experienceLevel')} *
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    className={`w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 text-gray-900 pl-4 pr-10 ${
                      errors.experienceLevel ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">{t('register.selectExperienceLevel')}</option>
                    <option value="no_experience">{t('experience.noExperience')}</option>
                    <option value="beginner">{t('experience.beginner')}</option>
                    <option value="intermediate">{t('experience.intermediate')}</option>
                    <option value="experienced">{t('experience.experienced')}</option>
                    <option value="expert">{t('experience.expert')}</option>
                  </select>
                  {errors.experienceLevel && (
                    <p className="mt-1 text-sm text-red-600">{t('register.errors.experienceLevelRequired')}</p>
                  )}
                </div>
                {/* Education Level */}
                <div>
                  <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('register.educationLevel')} *
                  </label>
                  <select
                    id="educationLevel"
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleInputChange}
                    className="w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 text-gray-900 pl-4 pr-10"
                    required
                  >
                    <option value="">{t('register.selectEducationLevel')}</option>
                    {sampleEducationLevels.map(level => (
                      <option key={level} value={level}>
                        {t(level)}
                      </option>
                    ))}
                  </select>
                  {errors.educationLevel && (
                    <p className="mt-1 text-sm text-red-600">{errors.educationLevel}</p>
                  )}
                </div>
                {/* Location */}
                <FormInput
                  id="location"
                  name="location"
                  label={t('register.location')}
                  placeholder={t('register.locationPlaceholder')}
                  value={formData.location}
                  onChange={handleInputChange}
                  error={errors.location}
                  icon={MapPin}
                  required
                />
                <FormInput
                  id="city"
                  name="city"
                  label={t('register.city')}
                  placeholder={t('register.cityPlaceholder')}
                  value={formData.city}
                  onChange={handleInputChange}
                  error={errors.city}
                  required
                />
                <FormInput
                  id="country"
                  name="country"
                  label={t('register.country')}
                  placeholder={t('register.countryPlaceholder')}
                  value={formData.country}
                  onChange={handleInputChange}
                  error={errors.country}
                  required
                />
                {/* Password Fields - Moved to be last */}
                <PasswordInput
                  id="password"
                  name="password"
                  label={t('register.password')}
                  placeholder={t('register.passwordPlaceholder')}
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  showStrength
                  required
                />
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  label={t('register.confirmPassword')}
                  placeholder={t('register.confirmPasswordPlaceholder')}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={errors.confirmPassword}
                  required
                />
              </div>
              
              {/* Description and Photo Upload - Two Column Layout */}
              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('register.description')} *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                      placeholder={t('register.descriptionPlaceholder')}
                      rows="4"
                      required
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>
                  
                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('register.profilePhoto')} *
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                            id="photo"
                            required
                          />
                          <label
                            htmlFor="photo"
                            className={`flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                              errors.photo ? 'border-red-300 hover:border-red-400' : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {photoPreview ? (
                              <img
                                src={photoPreview}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Camera className={`w-8 h-8 ${
                                errors.photo ? 'text-red-400' : 'text-gray-400'
                              }`} />
                            )}
                          </label>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-2">
                            {t('register.photoHelp')}
                          </p>
                          <p className="text-xs text-gray-500">
                            Max size: 5MB. Formats: JPG, PNG, GIF
                          </p>
                        </div>
                      </div>
                      {errors.photo && (
                        <p className="text-sm text-red-600">{errors.photo}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>



        {/* Form Controls */}
        <div className="pt-6 border-t border-gray-200">
          <FormCheckbox
            id="agreeToTerms"
            name="agreeToTerms"
            label={
              <span>
                {t('register.agreeToTerms')}{' '}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  {t('register.terms')}
                </Link>{' '}
                {t('register.and')}{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  {t('register.privacy')}
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
            label={t('register.agreeToMarketing')}
            checked={formData.agreeToMarketing}
            onChange={handleInputChange}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 mt-6"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {t('register.creating')}
              </>
            ) : (
              <>
                {t('register.createAccount')}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>

          <div className="text-center space-y-4 mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t('register.alreadyHaveAccount')}</span>
              </div>
            </div>
            
            <p className="text-gray-600">
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
              {t('register.signIn')}
            </Link>
          </p>
        </div>
        </div>
      </form>
    </motion.div>
  </div>
      
      {/* Validation Error Modal */}
      <Modal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        title=""
        maxWidth="max-w-2xl"
        showCloseButton={false}
      >
        <ValidationErrorList 
          errors={validationErrors}
          onClose={() => setShowValidationModal(false)}
          onScrollToField={scrollToField}
        />
      </Modal>
      
      {/* Backend Error Modal */}
      <BackendErrorModal
        isOpen={showBackendErrorModal}
        onClose={() => setShowBackendErrorModal(false)}
        errors={backendErrors}
        onScrollToField={scrollToField}
      />
      
      <Footer />
    </div>
  );
};

export default Register; 