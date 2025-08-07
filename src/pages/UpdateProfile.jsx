import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/hooks/useAuth';
import { userService } from '../api/services/userService';
import { categoryService } from '../api/services/categoryService';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import FormInput from '../components/ui/FormInput';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Languages,
  Save,
  Upload,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  X,
  Camera,
  Star,
  Award,
  Globe,
  Heart,
  Calendar
} from 'lucide-react';

// Static data moved from mockData.js
const skillsData = [
  // Domestic Skills
  "House Cleaning", "Laundry", "Ironing", "Cooking", "Meal Preparation", "Kitchen Management",
  "Childcare", "Elderly Care", "Pet Care", "First Aid", "Safety", "Educational Activities",
  
  // Maintenance Skills
  "Gardening", "Landscaping", "Plant Care", "Basic Repairs", "Plumbing", "Electrical",
  "Carpentry", "Painting", "Security Monitoring", "Access Control", "Patrol",
  
  // Transportation Skills
  "Safe Driving", "Vehicle Maintenance", "Route Planning", "GPS Navigation",
  "Defensive Driving", "Passenger Safety",
  
  // Hospitality Skills
  "Food Service", "Table Setting", "Order Taking", "Cash Handling", "Customer Service",
  "Bartending", "Food Delivery",
  
  // Sales Skills
  "Sales", "Inventory Management", "Negotiation", "Product Knowledge", "Market Knowledge",
  
  // Language Skills
  "Kinyarwanda", "English", "French", "Swahili", "Basic Communication", "Translation"
];

const languagesData = [
  // African Languages
  "Kinyarwanda", "English", "French", "Swahili", "Luganda", "Kirundi", "Lingala",
  
  // European Languages
  "German", "Spanish", "Italian", "Portuguese", "Dutch", "Russian", "Polish",
  
  // Asian Languages
  "Chinese (Mandarin)", "Japanese", "Korean", "Hindi", "Arabic", "Urdu",
  
  // Other Languages
  "Amharic", "Hausa", "Yoruba", "Igbo", "Zulu", "Afrikaans"
];

// Exact same options as JobSeekersPage/AddJobSeekerForm
const educationLevels = [
  { id: 'none', name: 'No Formal Education', description: 'Learned through experience' },
  { id: 'primary', name: 'Primary School', description: 'Basic education completed' },
  { id: 'secondary', name: 'Secondary School', description: 'High school education' },
  { id: 'vocational', name: 'Vocational Training', description: 'Trade or skill training' },
  { id: 'bachelor', name: 'Bachelor\'s Degree', description: 'University degree' },
  { id: 'master', name: 'Master\'s Degree', description: 'Advanced university degree' },
  { id: 'phd', name: 'PhD/Doctorate', description: 'Highest academic degree' }
];

// Education level options for dropdown (exact match with AddJobSeekerForm)
const educationLevelOptions = [
  { value: '', label: 'Select Education Level' },
  { value: 'No Formal Education', label: 'No Formal Education' },
  { value: 'Primary School', label: 'Primary School' },
  { value: 'Secondary School', label: 'Secondary School' },
  { value: 'High School', label: 'High School' },
  { value: 'Vocational Training', label: 'Vocational Training' },
  { value: 'Associate Degree', label: 'Associate Degree' },
  { value: 'Bachelor\'s Degree', label: 'Bachelor\'s Degree' },
  { value: 'Master\'s Degree', label: 'Master\'s Degree' },
  { value: 'PhD', label: 'PhD' },
  { value: 'Other', label: 'Other' }
];

// Availability options for dropdown (exact match with AddJobSeekerForm)
const availabilityOptions = [
  { value: '', label: 'Select Availability' },
  { value: 'Available', label: 'Available' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Freelance', label: 'Freelance' },
  { value: 'Not Available', label: 'Not Available' },
  { value: 'Open to Opportunities', label: 'Open to Opportunities' }
];

const languageLevels = [
  { id: 'basic', name: 'Basic', description: 'Can understand and speak basic phrases' },
  { id: 'conversational', name: 'Conversational', description: 'Can hold basic conversations' },
  { id: 'fluent', name: 'Fluent', description: 'Can speak and understand well' },
  { id: 'native', name: 'Native', description: 'Native speaker level' }
];

// Experience levels for dropdown (exact match with JobSeekersPage)
const experienceLevels = [
  { value: 'no_experience', label: 'No Experience (0 years)', description: 'New to the workforce' },
  { value: 'beginner', label: 'Beginner (1-2 years)', description: 'Some basic experience' },
  { value: 'intermediate', label: 'Intermediate (3-5 years)', description: 'Moderate experience' },
  { value: 'experienced', label: 'Experienced (6-10 years)', description: 'Significant experience' },
  { value: 'expert', label: 'Expert (10+ years)', description: 'Extensive experience' }
];

// Marital status options for dropdown (exact match with AddJobSeekerForm)
const maritalStatusOptions = [
  { value: '', label: 'Select Status' },
  { value: 'Single', label: 'Single' },
  { value: 'Married', label: 'Married' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Widowed', label: 'Widowed' }
];

const genderOptions = [
  { id: 'male', name: 'Male', description: '👨 Male' },
  { id: 'female', name: 'Female', description: '👩 Female' },
  { id: 'other', name: 'Other', description: '🧑 Other' },
  { id: 'prefer_not_to_say', name: 'Prefer not to say', description: '🤐 Prefer not to say' }
];

// Enhanced dropdown options with better descriptions and icons
const countryOptions = [
  { id: 'rwanda', name: 'Rwanda', description: '🇷🇼 Rwanda' },
  { id: 'uganda', name: 'Uganda', description: '🇺🇬 Uganda' },
  { id: 'kenya', name: 'Kenya', description: '🇰🇪 Kenya' },
  { id: 'tanzania', name: 'Tanzania', description: '🇹🇿 Tanzania' },
  { id: 'burundi', name: 'Burundi', description: '🇧🇮 Burundi' },
  { id: 'drc', name: 'Democratic Republic of Congo', description: '🇨🇩 DRC' },
  { id: 'other', name: 'Other', description: '🌍 Other Country' }
];

// Enhanced Dropdown Component
const EnhancedDropdown = ({ label, value, onChange, options, placeholder, required = false, loading = false, className = '' }) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white transition-all duration-200 hover:border-gray-400"
        disabled={loading}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.id} value={option.id} title={option.description}>
            {option.description || option.name}
          </option>
        ))}
      </select>
      {loading && (
        <p className="text-sm text-gray-500 mt-1">Loading options...</p>
      )}
    </div>
  );
};

const UpdateProfile = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [jobCategories, setJobCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Skills selection state
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [skillSearch, setSkillSearch] = useState('');

  // Languages selection state
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [customLanguage, setCustomLanguage] = useState('');
  const [languageSearch, setLanguageSearch] = useState('');

  // Form state - Updated to include all profile fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    description: '',
    skills: '',
    gender: '',
    dateOfBirth: '',
    idNumber: '',
    contactNumber: '',
    maritalStatus: '',
    location: '',
    city: '',
    country: '',
    references: '',
    experience: '',
    experienceLevel: '',
    monthlyRate: '',
    availability: '',
    educationLevel: '',
    languages: '',
    certifications: '',
    jobCategoryId: null
  });

  // Profile completion tracking
  const [completionScore, setCompletionScore] = useState(0);
  const [completionItems, setCompletionItems] = useState([]);

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      // Helper function to get full name from backend data
      const getFullName = () => {
        if (user.profile?.firstName && user.profile?.lastName) {
          return `${user.profile.firstName} ${user.profile.lastName}`;
        }
        return user.profile?.firstName || user.profile?.lastName || '';
      };

      // Helper function to convert skills string to array
      const getSkillsArray = () => {
        if (user.profile?.skills) {
          return user.profile.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
        }
        return [];
      };

      // Helper function to convert languages string to array
      const getLanguagesArray = () => {
        if (user.profile?.languages) {
          return user.profile.languages.split(',').map(lang => lang.trim()).filter(lang => lang);
        }
        return [];
      };

      setFormData({
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        email: user.email || '',
        description: user.profile?.description || '',
        skills: user.profile?.skills || '',
        gender: user.profile?.gender || '',
        dateOfBirth: user.profile?.dateOfBirth ? user.profile.dateOfBirth.split('T')[0] : '',
        idNumber: user.profile?.idNumber || '',
        contactNumber: user.profile?.contactNumber || '',
        maritalStatus: user.profile?.maritalStatus || '',
        location: user.profile?.location || '',
        city: user.profile?.city || '',
        country: user.profile?.country || '',
        references: user.profile?.references || '',
        experience: user.profile?.experience || '',
        experienceLevel: user.profile?.experienceLevel || '',
        monthlyRate: user.profile?.monthlyRate || '',
        availability: user.profile?.availability || '',
        educationLevel: user.profile?.educationLevel || '',
        languages: user.profile?.languages || '',
        certifications: user.profile?.certifications || '',
        jobCategoryId: user.profile?.jobCategoryId || null,
      });

      // Initialize selected skills and languages arrays
      setSelectedSkills(getSkillsArray());
      setSelectedLanguages(getLanguagesArray());
      setImagePreview(user.profile?.photo);
    }
  }, [user]);

  // Fetch job categories from API
  useEffect(() => {
    const fetchJobCategories = async () => {
      try {
        const result = await categoryService.getAllCategories();
        if (result.success) {
          setJobCategories(result.data);
        } else {
          console.error('Error fetching job categories:', result.error);
          // Fallback to empty array or show error message
          setJobCategories([]);
        }
      } catch (error) {
        console.error('Error fetching job categories:', error);
        setJobCategories([]);
      }
    };

    fetchJobCategories();
  }, []);

  // Calculate profile completion score - Updated with all profile fields
  useEffect(() => {
    const requiredFields = [
      // Essential fields (higher weight)
      { field: 'firstName', weight: 8, label: 'First Name' },
      { field: 'lastName', weight: 8, label: 'Last Name' },
      { field: 'contactNumber', weight: 10, label: 'Contact Number' },
      { field: 'skills', weight: 10, label: 'Skills' },
      { field: 'jobCategoryId', weight: 10, label: 'Job Category' },
      
      // Important fields (medium weight)
      { field: 'description', weight: 8, label: 'Professional Description' },
      { field: 'experience', weight: 8, label: 'Work Experience' },
      { field: 'experienceLevel', weight: 6, label: 'Experience Level' },
      { field: 'location', weight: 8, label: 'Location' },
      { field: 'availability', weight: 6, label: 'Availability' },
      { field: 'educationLevel', weight: 6, label: 'Education Level' },
      
      // Personal details (lower weight)
      { field: 'email', weight: 5, label: 'Email' },
      { field: 'gender', weight: 4, label: 'Gender' },
      { field: 'dateOfBirth', weight: 5, label: 'Date of Birth' },
      { field: 'city', weight: 5, label: 'City' },
      { field: 'country', weight: 4, label: 'Country' },
      { field: 'maritalStatus', weight: 3, label: 'Marital Status' },
      
      // Optional but valuable fields
      { field: 'monthlyRate', weight: 6, label: 'Expected Monthly Rate' },
      { field: 'languages', weight: 5, label: 'Languages' },
      { field: 'certifications', weight: 4, label: 'Certifications' },
      { field: 'references', weight: 4, label: 'References' },
      { field: 'idNumber', weight: 3, label: 'ID Number' }
    ];

    let completed = 0;
    let totalWeight = 0;
    const items = [];

    requiredFields.forEach(({ field, weight, label }) => {
      totalWeight += weight;
      let isCompleted = false;

      const value = formData[field];
      if (Array.isArray(value)) {
        isCompleted = value.length > 0;
      } else if (field === 'jobCategoryId') {
        isCompleted = value !== null && value !== undefined && value !== '';
      } else {
        isCompleted = value && value.toString().trim() !== '';
      }

      if (isCompleted) {
        completed += weight;
      }

      items.push({
        field,
        weight,
        completed: isCompleted,
        label: label
      });
    });

    const score = Math.round((completed / totalWeight) * 100);
    setCompletionScore(score);
    setCompletionItems(items);
  }, [formData]);

  const getFieldLabel = (field) => {
    const labels = {
      firstName: 'First Name',
      lastName: 'Last Name',
      description: 'Bio/Description',
      skills: 'Skills',
      gender: 'Gender',
      dateOfBirth: 'Date of Birth',
      idNumber: 'ID Number',
      contactNumber: 'Phone Number',
      maritalStatus: 'Marital Status',
      location: 'Location',
      city: 'City',
      country: 'Country',
      experience: 'Experience',
      monthlyRate: 'Monthly Rate',
      jobCategoryId: 'Job Category'
    };
    return labels[field] || field;
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Skills selection handlers (from admin dashboard)
  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill)) {
      const newSkills = [...selectedSkills, skill];
      setSelectedSkills(newSkills);
      updateSkillsField(newSkills);
    }
  };

  const handleSkillRemove = (skill) => {
    const newSkills = selectedSkills.filter(s => s !== skill);
    setSelectedSkills(newSkills);
    updateSkillsField(newSkills);
  };

  const handleCustomSkillAdd = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      const newSkills = [...selectedSkills, customSkill.trim()];
      setSelectedSkills(newSkills);
      updateSkillsField(newSkills);
      setCustomSkill('');
    }
  };

  const updateSkillsField = (skills) => {
    setFormData(prev => ({ ...prev, skills: skills.join(', ') }));
  };

  // Language selection handlers (from admin dashboard)
  const handleLanguageSelect = (language) => {
    if (!selectedLanguages.includes(language)) {
      const newLanguages = [...selectedLanguages, language];
      setSelectedLanguages(newLanguages);
      updateLanguagesField(newLanguages);
    }
  };

  const handleLanguageRemove = (language) => {
    const newLanguages = selectedLanguages.filter(l => l !== language);
    setSelectedLanguages(newLanguages);
    updateLanguagesField(newLanguages);
  };

  const handleCustomLanguageAdd = () => {
    if (customLanguage.trim() && !selectedLanguages.includes(customLanguage.trim())) {
      const newLanguages = [...selectedLanguages, customLanguage.trim()];
      setSelectedLanguages(newLanguages);
      updateLanguagesField(newLanguages);
      setCustomLanguage('');
    }
  };

  const updateLanguagesField = (languages) => {
    setFormData(prev => ({ ...prev, languages: languages.join(', ') }));
  };

  // Filtered skills and languages for search (from admin dashboard)
  const filteredSkills = skillsData.filter(skill =>
    skill.toLowerCase().includes(skillSearch.toLowerCase())
  );

  const filteredLanguages = languagesData.filter(language =>
    language.toLowerCase().includes(languageSearch.toLowerCase())
  );

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Use the updateProfile function from auth context
      const result = await updateProfile(formData, profileImage);
      if (result.success) {
        // Show success notification and stay on the page
        setNotification({
          show: true,
          type: 'success',
          message: 'Profile updated successfully! 🎉'
        });
        // Auto-hide notification after 5 seconds
        setTimeout(() => {
          setNotification({ show: false, type: '', message: '' });
        }, 5000);
      } else {
        setNotification({
          show: true,
          type: 'error',
          message: result.error || 'Error updating profile. Please try again.'
        });
        // Auto-hide error notification after 7 seconds
        setTimeout(() => {
          setNotification({ show: false, type: '', message: '' });
        }, 7000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        show: true,
        type: 'error',
        message: 'Error updating profile. Please try again.'
      });
      // Auto-hide error notification after 7 seconds
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 7000);
    } finally {
      setSaving(false);
    }
  };

  const getCompletionColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCompletionMessage = (score) => {
    if (score >= 80) return 'Excellent! Your profile is nearly complete.';
    if (score >= 60) return 'Good progress! Complete a few more fields to improve your profile.';
    if (score >= 40) return 'You\'re making progress. Keep filling in the details.';
    return 'Your profile needs more information to be effective.';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Toast */}
      {notification.show && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-lg max-w-md w-full mx-4 ${
            notification.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <div className="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <span className="font-medium">{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification({ show: false, type: '', message: '' })}
              className="ml-4 text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard/jobseeker')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Update Profile</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Completion Scale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Profile Completion</h2>
              <div className={`text-2xl font-bold ${getCompletionColor(completionScore)}`}>
                {completionScore}%
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  completionScore >= 80 ? 'bg-green-500' :
                  completionScore >= 60 ? 'bg-yellow-500' :
                  completionScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${completionScore}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              {getCompletionMessage(completionScore)}
            </p>

            {/* Completion Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {completionItems.map((item, index) => (
                <div key={index} className="flex items-center text-sm">
                  {item.completed ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-400 mr-2" />
                  )}
                  <span className={item.completed ? 'text-gray-900' : 'text-gray-500'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Update Profile Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Basic Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Image */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profile-image"
                    />
                    <label
                      htmlFor="profile-image"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </label>
                  </div>
                </div>
              </div>

              <FormInput
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                placeholder="Enter your first name"
              />

              <FormInput
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter your last name"
              />

              <FormInput
                label="Bio/Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="md:col-span-2"
                placeholder="Tell potential employers about your experience, skills, and what makes you a great worker..."
                required
              />

              {/* Skills Selection (Admin Dashboard Style) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills *
                </label>
                <div className="space-y-3">
                  {/* Selected Skills Display */}
                  {selectedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="primary"
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleSkillRemove(skill)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
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
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Skills Selection Grid */}
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-1 max-h-32 overflow-y-auto border border-gray-300 rounded p-2">
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
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      placeholder="Add custom skill..."
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleCustomSkillAdd())}
                    />
                    <button
                      type="button"
                      onClick={handleCustomSkillAdd}
                      className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <FormInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
              />

              <EnhancedDropdown
                label="Gender"
                value={formData.gender}
                onChange={(value) => handleInputChange('gender', value)}
                options={genderOptions}
                placeholder="Select Gender"
              />

              <FormInput
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                placeholder="YYYY-MM-DD"
              />

              <FormInput
                label="ID Number"
                value={formData.idNumber}
                onChange={(e) => handleInputChange('idNumber', e.target.value)}
                placeholder="Enter your ID number"
              />

              <FormInput
                label="Contact Number"
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                required
                placeholder="+250 789 123 456"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marital Status
                </label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              {/* New Professional Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level *
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select Experience Level</option>
                  <option value="no_experience">No Experience (0 years)</option>
                  <option value="beginner">Beginner (1-2 years)</option>
                  <option value="intermediate">Intermediate (3-5 years)</option>
                  <option value="experienced">Experienced (6-10 years)</option>
                  <option value="expert">Expert (10+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select Availability</option>
                  <option value="Available">Available</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Not Available">Not Available</option>
                  <option value="Open to Opportunities">Open to Opportunities</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education Level
                </label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select Education Level</option>
                  <option value="No Formal Education">No Formal Education</option>
                  <option value="Primary School">Primary School</option>
                  <option value="Secondary School">Secondary School</option>
                  <option value="High School">High School</option>
                  <option value="Vocational Training">Vocational Training</option>
                  <option value="Associate Degree">Associate Degree</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="PhD">PhD</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Location and References */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Location & References</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
                placeholder="e.g., Kigali, Rwanda"
              />

              <FormInput
                label="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
                placeholder="e.g., Kigali"
              />

              <EnhancedDropdown
                label="Country"
                value={formData.country}
                onChange={(value) => handleInputChange('country', value)}
                options={countryOptions}
                placeholder="Select Country"
              />

              <FormInput
                label="Experience (Years)"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                required
                placeholder="e.g., 2"
              />

              <FormInput
                label="Monthly Rate (RWF)"
                type="number"
                value={formData.monthlyRate}
                onChange={(e) => handleInputChange('monthlyRate', e.target.value)}
                placeholder="e.g., 120000"
              />

              {/* Languages Selection (Admin Dashboard Style) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages
                </label>
                <div className="space-y-3">
                  {/* Selected Languages Display */}
                  {selectedLanguages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedLanguages.map((language, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                        >
                          {language}
                          <button
                            type="button"
                            onClick={() => handleLanguageRemove(language)}
                            className="ml-1 text-green-600 hover:text-green-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
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
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Languages Selection Grid */}
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-1 max-h-32 overflow-y-auto border border-gray-300 rounded p-2">
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
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customLanguage}
                      onChange={(e) => setCustomLanguage(e.target.value)}
                      placeholder="Add custom language..."
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleCustomLanguageAdd())}
                    />
                    <button
                      type="button"
                      onClick={handleCustomLanguageAdd}
                      className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications
                </label>
                <textarea
                  value={formData.certifications}
                  onChange={(e) => handleInputChange('certifications', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  placeholder="List any certifications, training, or qualifications you have"
                />
              </div>

              {/* Job Category Selection */}
              <EnhancedDropdown
                label="Work Category"
                value={formData.jobCategoryId}
                onChange={(value) => handleInputChange('jobCategoryId', value ? parseInt(value) : null)}
                options={jobCategories.map(cat => ({ id: cat.id, name: cat.name_en, description: `💼 ${cat.name_en}` }))}
                placeholder="Select Work Category"
                required
                loading={jobCategories.length === 0}
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  References
                </label>
                <textarea
                  value={formData.references}
                  onChange={(e) => handleInputChange('references', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  placeholder="List any previous employers or references"
                />
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard/jobseeker')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              className="min-w-[120px]"
            >
              {saving ? (
                <>
                  <LoadingSpinner size="sm" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default UpdateProfile; 