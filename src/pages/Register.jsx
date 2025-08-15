import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, User, Phone, Camera, MapPin, Calendar, FileText, Briefcase, ChevronDown, ChevronUp, UserPlus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import PasswordInput from '../components/ui/PasswordInput';
import FormCheckbox from '../components/ui/FormCheckbox';
import UserTypeSelector from '../components/ui/UserTypeSelector';
import FormLayout from '../components/ui/FormLayout';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/ui/HeroSection';
import { authService } from '../api/index.js';
import { usePublicCategories } from '../api/hooks/useCategories';
import jobseekerBackground from '../assets/jobseekerBackground.png';
import React from 'react'; // Added missing import

// Job categories will be loaded dynamically from the API

// Sample education levels data - replace with API call later
const sampleEducationLevels = [
  'No Formal Education',
  'Primary School',
  'Secondary School',
  'High School',
  'Vocational Training',
  'Associate Degree',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'PhD',
  'Other'
];

// Sample availability options data - replace with API call later
const sampleAvailabilityOptions = [
  'Available',
  'Part-time',
  'Contract',
  'Freelance',
  'Not Available',
  'Open to Opportunities'
];

// Predefined skills options - House maid skills first, then others
const predefinedSkills = [
  // House Maid & Domestic Skills (Priority)
  'House Cleaning', 'Laundry', 'Ironing', 'Cooking', 'Meal Preparation', 'Kitchen Management',
  'Childcare', 'Elderly Care', 'Pet Care', 'First Aid', 'Safety', 'Educational Activities',
  'Gardening', 'Plant Care', 'Basic Repairs', 'Security Monitoring', 'Access Control',
  
  // Hospitality & Service Skills
  'Food Service', 'Table Setting', 'Order Taking', 'Cash Handling', 'Customer Service',
  'Bartending', 'Food Delivery', 'Housekeeping', 'Reception', 'Secretarial Work',
  
  // Trade Skills
  'Carpentry', 'Plumbing', 'Electrical Work', 'Masonry', 'Painting', 'Welding', 'Machining',
  'Landscaping', 'Baking',
  
  // Transportation Skills
  'Safe Driving', 'Vehicle Maintenance', 'Route Planning', 'GPS Navigation',
  'Defensive Driving', 'Passenger Safety',
  
  // Business Skills
  'Accounting', 'Bookkeeping', 'Marketing', 'Sales', 'Business Development', 'Financial Analysis',
  'Human Resources', 'Operations Management', 'Supply Chain Management',
  'Inventory Management', 'Negotiation', 'Product Knowledge', 'Market Knowledge',
  
  // Technical Skills
  'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'PHP', 'Ruby', 'Go', 'Rust',
  'HTML/CSS', 'TypeScript', 'Angular', 'Vue.js', 'Django', 'Flask', 'Laravel', 'Express.js',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  
  // Professional Skills
  'Project Management', 'Agile/Scrum', 'Leadership', 'Team Management', 'Communication',
  'Problem Solving', 'Critical Thinking', 'Time Management',
  
  // Creative Skills
  'Graphic Design', 'Web Design', 'Video Editing', 'Photography', 'Content Writing',
  'Social Media Management', 'Digital Marketing', 'SEO', 'Copywriting',
  
  // Healthcare Skills
  'Nursing', 'Medical Assistance', 'Pharmacy', 'Laboratory Work', 'Patient Care',
  'Medical Records', 'Health Administration',
  
  // Education Skills
  'Teaching', 'Tutoring', 'Curriculum Development', 'Student Assessment', 'Classroom Management',
  'Special Education', 'ESL Teaching',
  
  // Other Skills
  'Security', 'Event Planning', 'Tourism', 'Translation', 'Interpretation',
  'Data Entry', 'Administrative Work'
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
    educationLevel: '',
    availability: '',
    languages: '',
    certifications: '',
    experienceLevel: '',
    monthlyRate: '',
    // Form controls
    userType: 'jobseeker',
    agreeToTerms: false,
    agreeToMarketing: false
  });
  
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    additionalInfo: false,
    professionalInfo: false
  });

  // Skills selection state
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [skillSearch, setSkillSearch] = useState('');

  // Languages selection state
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [customLanguage, setCustomLanguage] = useState('');
  const [languageSearch, setLanguageSearch] = useState('');

  // Toggle section expansion
  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // Filter skills based on search
  const filteredSkills = predefinedSkills.filter(skill =>
    skill.toLowerCase().includes(skillSearch.toLowerCase())
  );

  // Predefined languages
  const predefinedLanguages = [
    'Kinyarwanda', 'English', 'French', 'Swahili', 'German', 'Spanish', 'Chinese', 'Arabic',
    'Portuguese', 'Italian', 'Dutch', 'Russian', 'Japanese', 'Korean', 'Hindi', 'Turkish'
  ];

  // Filter languages based on search
  const filteredLanguages = predefinedLanguages.filter(language =>
    language.toLowerCase().includes(languageSearch.toLowerCase())
  );

  // Skills selection handlers
  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills(prev => {
        const newSkills = [...prev, skill];
        updateSkillsField(newSkills);
        return newSkills;
      });
    }
  };

  const handleSkillRemove = (skill) => {
    setSelectedSkills(prev => {
      const updatedSkills = prev.filter(s => s !== skill);
      updateSkillsField(updatedSkills);
      return updatedSkills;
    });
  };

  const handleCustomSkillAdd = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills(prev => {
        const newSkills = [...prev, customSkill.trim()];
        updateSkillsField(newSkills);
        return newSkills;
      });
      setCustomSkill('');
    }
  };

  const updateSkillsField = (skills) => {
    setFormData(prev => ({ ...prev, skills: skills.join(', ') }));
  };

  // Language selection handlers
  const handleLanguageSelect = (language) => {
    if (!selectedLanguages.includes(language)) {
      setSelectedLanguages(prev => {
        const newLanguages = [...prev, language];
        updateLanguagesField(newLanguages);
        return newLanguages;
      });
    }
  };

  const handleLanguageRemove = (language) => {
    setSelectedLanguages(prev => {
      const updatedLanguages = prev.filter(l => l !== language);
      updateLanguagesField(updatedLanguages);
      return updatedLanguages;
    });
  };

  const handleCustomLanguageAdd = () => {
    if (customLanguage.trim() && !selectedLanguages.includes(customLanguage.trim())) {
      setSelectedLanguages(prev => {
        const newLanguages = [...prev, customLanguage.trim()];
        updateLanguagesField(newLanguages);
        return newLanguages;
      });
      setCustomLanguage('');
    }
  };

  const updateLanguagesField = (languages) => {
    setFormData(prev => ({ ...prev, languages: languages.join(', ') }));
  };

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

  // Initialize skills and languages when form loads
  React.useEffect(() => {
    // Initialize skills from formData if they exist
    if (formData.skills) {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
      setSelectedSkills(skillsArray);
    }
    
    // Initialize languages from formData if they exist
    if (formData.languages) {
      const languagesArray = formData.languages.split(',').map(l => l.trim()).filter(l => l);
      setSelectedLanguages(languagesArray);
    }
  }, []); // Only run once when component mounts

  const validateForm = () => {
    const newErrors = {};

    // First Name
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('register.errors.firstNameRequired', 'First name is required');
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = t('register.errors.firstNameLength', 'First name must be at least 2 characters');
    }

    // Last Name
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('register.errors.lastNameRequired', 'Last name is required');
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = t('register.errors.lastNameLength', 'Last name must be at least 2 characters');
    }

    // Phone Number
    if (!formData.contactNumber) {
      newErrors.contactNumber = t('register.errors.phoneRequired', 'Please provide a valid contact number');
    } else if (!/^(078|079|072|073)\d{7}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = t('register.errors.phoneInvalid', 'Contact number format is invalid. Enter a valid Rwandan phone number (078XXXXXXXX, 079XXXXXXXX, 072XXXXXXXX, 073XXXXXXXX)');
    }

    // Password
    if (!formData.password) {
      newErrors.password = t('register.errors.passwordRequired', 'Password is required');
    } else if (formData.password.length < 6) {
      newErrors.password = t('register.errors.passwordLength', 'Password must be at least 6 characters');
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('register.errors.confirmPasswordRequired', 'Please confirm your password');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('register.errors.passwordMismatch', 'Passwords do not match');
    }

    // Skills - make it more lenient
    if (!formData.skills || formData.skills.trim().length === 0) {
      newErrors.skills = t('register.errors.skillsRequired', 'At least one skill is required');
    }

    // Experience Level - now required
    if (!formData.experienceLevel || formData.experienceLevel.trim().length === 0) {
      newErrors.experienceLevel = t('register.errors.experienceLevelRequired', 'Experience level is required');
    }

    // Terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = t('register.errors.termsRequired', 'You must agree to the terms and conditions');
    }

    // Optional fields: friendly validation
    if (formData.email && formData.email.trim().length > 0) {
      // Only validate if provided
      if (!/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,})$/.test(formData.email)) {
        newErrors.email = t('register.errors.emailInvalid', 'Please provide a valid email address');
      }
    }

    // Date of Birth - make it optional but validate if provided
    if (formData.dateOfBirth && formData.dateOfBirth.length > 0) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 18) {
        newErrors.dateOfBirth = t('register.errors.ageLimit', 'You must be at least 18 years old');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data for API - Now sending all fields the backend supports
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        contactNumber: formData.contactNumber.trim(),
        password: formData.password,
        email: formData.email.trim() || null,
        description: formData.description.trim() || null,
        skills: formData.skills.trim() || null,
        gender: formData.gender || null,
        dateOfBirth: formData.dateOfBirth || null,
        idNumber: formData.idNumber.trim() || null,
        maritalStatus: formData.maritalStatus || null,
        location: formData.location.trim() || null,
        city: formData.city.trim() || null,
        country: formData.country.trim() || null,
        references: formData.references.trim() || null,
        experience: formData.experience.trim() || null,
        jobCategoryId: formData.jobCategoryId ? parseInt(formData.jobCategoryId, 10) : null,
        availability: formData.availability || null,
        certifications: formData.certifications?.trim() || null,
        educationLevel: formData.educationLevel || null,
        languages: formData.languages.trim() || null,
        experienceLevel: formData.experienceLevel || null,
        monthlyRate: formData.monthlyRate.trim() || null,
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
        // Always redirect jobseeker to update-profile
        if (result.user.role === 'jobseeker') {
          navigate('/update-profile');
        } else if (result.user.role === 'admin') {
          navigate('/dashboard/admin');
        } else {
          navigate('/');
        }
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
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${jobseekerBackground})` }}
    >
      <Header />
      
      {/* Hero Section */}
      <HeroSection 
        title="Create Your Account"
        description="Join thousands of job seekers and start your career journey"
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

        <UserTypeSelector
          value={formData.userType}
          onChange={handleUserTypeChange}
        />





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
              <FormInput
                id="contactNumber"
                name="contactNumber"
                type="tel"
                label={t('register.phone', 'Phone Number')}
                placeholder={t('register.phonePlaceholder', 'e.g. 078XXXXXXXX')}
                value={formData.contactNumber}
                onChange={e => {
                  // Only allow digits, max 10
                  const value = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
                  handleInputChange({
                    target: {
                      name: 'contactNumber',
                      value,
                      type: 'text',
                    }
                  });
                }}
                error={errors.contactNumber}
                icon={Phone}
                required
                maxLength={10}
                pattern="^(078|079|072|073)\d{7}$"
                inputMode="numeric"
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
              </div>
            </div>


          {/* Additional Information Section - Collapsible */}
          <div className="space-y-6 pb-4">
            <motion.div 
              className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden"
              initial={false}
            >
              {/* Section Header */}
              <button
                type="button"
                onClick={() => toggleSection('additionalInfo')}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('register.optionalFields', 'Additional Information (Optional)')}
                  </h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Optional
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: expandedSections.additionalInfo ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.div>
              </button>

              {/* Collapsible Content */}
              <AnimatePresence>
                {expandedSections.additionalInfo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pb-8 border-t border-gray-200">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                {/* Job Category */}
                <div>
                  <label htmlFor="jobCategoryId" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('register.jobCategory', 'Job Category')}
                  </label>
                  <select
                    id="jobCategoryId"
                    name="jobCategoryId"
                    value={formData.jobCategoryId}
                    onChange={handleInputChange}
                    disabled={categoriesLoading}
                    className="w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 text-gray-900 pl-4 pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {categoriesLoading 
                        ? 'Loading categories...' 
                        : t('register.jobCategoryPlaceholder', 'Select your job category')
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
                    <p className="mt-1 text-sm text-red-600">Error loading categories: {categoriesError}</p>
                  )}
                </div>
                  {/* Education Level */}
                <div>
                  <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('register.educationLevel', 'Education Level')}
                  </label>
                  <select
                    id="educationLevel"
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleInputChange}
                    className="w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 text-gray-900 pl-4 pr-10"
                  >
                    <option value="">{t('register.educationLevelPlaceholder', 'Select your education level')}</option>
                    {sampleEducationLevels.map(level => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  {errors.educationLevel && (
                    <p className="mt-1 text-sm text-red-600">{errors.educationLevel}</p>
                  )}
                </div>
                {/* Availability */}
                <div>
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('register.availability', 'Availability')}
                  </label>
                  <select
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 text-gray-900 pl-4 pr-10"
                  >
                    <option value="">{t('register.availabilityPlaceholder', 'Select your availability')}</option>
                    {sampleAvailabilityOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.availability && (
                    <p className="mt-1 text-sm text-red-600">{errors.availability}</p>
                  )}
                </div>
                {/* Location */}
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {/* Skills Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('register.skills', 'Skills')} *
                  </label>
                  <div className="space-y-3">
                    {/* Selected Skills Display */}
                    {selectedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {selectedSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleSkillRemove(skill)}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Skills Search */}
                    <div className="relative">
                      <input
                        type="text"
                        value={skillSearch}
                        onChange={(e) => setSkillSearch(e.target.value)}
                        placeholder="Search skills..."
                        className="w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 text-gray-900 pl-4 pr-10"
                      />
                    </div>

                    {/* Skills Selection */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-1 max-h-32 overflow-y-auto border border-gray-300 rounded p-2">
                      {filteredSkills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleSkillSelect(skill)}
                          disabled={selectedSkills.includes(skill)}
                          className={`text-left p-1 rounded text-xs ${
                            selectedSkills.includes(skill)
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white hover:bg-blue-50 text-gray-700 border border-gray-200'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>

                    {/* Custom Skill Input */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <input
                        type="text"
                        value={customSkill}
                        onChange={(e) => setCustomSkill(e.target.value)}
                        placeholder="Add custom skill..."
                        className="col-span-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 text-gray-900 pl-4 pr-10"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleCustomSkillAdd())}
                      />
                      <button
                        type="button"
                        onClick={handleCustomSkillAdd}
                        className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-800 text-sm transition-colors duration-200"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  {errors.skills && (
                    <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
                  )}
                </div>

                {/* Languages Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('register.languages', 'Languages')}
                  </label>
                  <div className="space-y-3">
                    {/* Selected Languages Display */}
                    {selectedLanguages.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {selectedLanguages.map((language, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                          >
                            {language}
                            <button
                              type="button"
                              onClick={() => handleLanguageRemove(language)}
                              className="ml-1 text-green-600 hover:text-green-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Languages Search */}
                    <div className="relative">
                      <input
                        type="text"
                        value={languageSearch}
                        onChange={(e) => setLanguageSearch(e.target.value)}
                        placeholder="Search languages..."
                        className="w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 text-gray-900 pl-4 pr-10"
                      />
                    </div>

                    {/* Languages Selection */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-1 max-h-32 overflow-y-auto border border-gray-300 rounded p-2">
                      {filteredLanguages.map((language) => (
                        <button
                          key={language}
                          type="button"
                          onClick={() => handleLanguageSelect(language)}
                          disabled={selectedLanguages.includes(language)}
                          className={`text-left p-1 rounded text-xs ${
                            selectedLanguages.includes(language)
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white hover:bg-green-50 text-gray-700 border border-gray-200'
                          }`}
                        >
                          {language}
                        </button>
                      ))}
                    </div>

                    {/* Custom Language Input */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <input
                        type="text"
                        value={customLanguage}
                        onChange={(e) => setCustomLanguage(e.target.value)}
                        placeholder="Add custom language..."
                        className="col-span-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 text-gray-900 pl-4 pr-10"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleCustomLanguageAdd())}
                      />
                      <button
                        type="button"
                        onClick={handleCustomLanguageAdd}
                        className="px-3 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm transition-colors duration-200"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  {errors.languages && (
                    <p className="mt-1 text-sm text-red-600">{errors.languages}</p>
                  )}
                </div>

                {/* Certifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certifications
                  </label>
                  <textarea
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="List any certifications or licenses"
                    rows="2"
                  />
                </div>


              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  </div>


        {/* Professional Information Section - Collapsible */}
        <motion.div 
          className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden"
          initial={false}
        >
          {/* Section Header */}
          <button
            type="button"
            onClick={() => toggleSection('professionalInfo')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Professional Information
              </h3>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Optional
              </span>
            </div>
            <motion.div
              animate={{ rotate: expandedSections.professionalInfo ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-gray-500" />
            </motion.div>
          </button>

          {/* Collapsible Content */}
          <AnimatePresence>
            {expandedSections.professionalInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="p-4 border-t border-gray-200">
                  {/* Experience and Description */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience Level *
                      </label>
                      <select
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                          errors.experienceLevel ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="">Select Experience Level</option>
                        <option value="no_experience">No Experience (0 years)</option>
                        <option value="beginner">Beginner (1-2 years)</option>
                        <option value="intermediate">Intermediate (3-5 years)</option>
                        <option value="experienced">Experienced (6-10 years)</option>
                        <option value="expert">Expert (10+ years)</option>
                      </select>
                      {errors.experienceLevel && (
                        <p className="mt-1 text-sm text-red-600">{errors.experienceLevel}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience Details (Optional)
                      </label>
                      <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe your specific work experience, previous jobs, or relevant background"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Brief description about yourself"
                        rows="3"
                      />
                    </div>

                    {/* Monthly Rate */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Rate (Optional)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="monthlyRate"
                          value={formData.monthlyRate}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pl-8"
                          placeholder="e.g., $500, €800, RWF 100,000"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-500 text-sm">$</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Enter your expected monthly salary or rate. You can specify currency.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Form Controls */}
        <div className="pt-6 border-t border-gray-200">
          <FormCheckbox
            id="agreeToTerms"
            name="agreeToTerms"
            label={
              <span>
                {t('register.agreeToTerms', 'I agree to the')}{' '}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  {t('register.terms', 'Terms of Service')}
                </Link>{' '}
                {t('register.and', 'and')}{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 mt-6"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {t('register.creating', 'Creating account...')}
              </>
            ) : (
              <>
                {t('register.createAccount', 'Create Account')}
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
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
            
            <p className="text-gray-600">
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
              {t('register.signIn', 'Sign in')}
            </Link>
          </p>
        </div>
        </div>
      </form>
    </motion.div>
  </div>
      <Footer />
    </div>
  );
};

export default Register; 