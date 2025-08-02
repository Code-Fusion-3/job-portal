import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../api/hooks/useAuth.js';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import FormInput from '../components/ui/FormInput';
import LoadingSpinner from '../components/ui/LoadingSpinner';

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

const educationLevels = [
  { id: 'none', name: 'No Formal Education', description: 'Learned through experience' },
  { id: 'primary', name: 'Primary School', description: 'Basic education completed' },
  { id: 'secondary', name: 'Secondary School', description: 'High school education' },
  { id: 'vocational', name: 'Vocational Training', description: 'Trade or skill training' },
  { id: 'bachelor', name: 'Bachelor\'s Degree', description: 'University degree' },
  { id: 'master', name: 'Master\'s Degree', description: 'Advanced university degree' },
  { id: 'phd', name: 'PhD/Doctorate', description: 'Highest academic degree' }
];

const availabilityOptions = [
  { id: 'fulltime', name: 'Full Time', description: 'Available for full-time work' },
  { id: 'parttime', name: 'Part Time', description: 'Available for part-time work' },
  { id: 'flexible', name: 'Flexible', description: 'Flexible schedule available' },
  { id: 'weekends', name: 'Weekends Only', description: 'Available on weekends' },
  { id: 'evenings', name: 'Evenings Only', description: 'Available in evenings' },
  { id: 'oncall', name: 'On Call', description: 'Available when needed' }
];

const languageLevels = [
  { id: 'basic', name: 'Basic', description: 'Can understand and speak basic phrases' },
  { id: 'conversational', name: 'Conversational', description: 'Can hold basic conversations' },
  { id: 'fluent', name: 'Fluent', description: 'Can speak and understand well' },
  { id: 'native', name: 'Native', description: 'Native speaker level' }
];

const UpdateProfile = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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
    monthlyRate: '',
    jobCategoryId: 1
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
          return user.profile.skills.split(',').map(skill => skill.trim());
        }
        return [];
      };

      setFormData({
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
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
        monthlyRate: user.profile?.monthlyRate || '',
        jobCategoryId: user.profile?.jobCategoryId || 1
      });
      setImagePreview(user.profile?.photo);
    }
  }, [user]);

  // Calculate profile completion score
  useEffect(() => {
    const requiredFields = [
      { field: 'firstName', weight: 10 },
      { field: 'lastName', weight: 5 },
      { field: 'description', weight: 10 },
      { field: 'skills', weight: 10 },
      { field: 'gender', weight: 5 },
      { field: 'dateOfBirth', weight: 5 },
      { field: 'idNumber', weight: 5 },
      { field: 'contactNumber', weight: 10 },
      { field: 'maritalStatus', weight: 5 },
      { field: 'location', weight: 10 },
      { field: 'city', weight: 8 },
      { field: 'country', weight: 8 },
      { field: 'experience', weight: 10 },
      { field: 'monthlyRate', weight: 10 },
      { field: 'jobCategoryId', weight: 10 }
    ];

    let completed = 0;
    let totalWeight = 0;
    const items = [];

    requiredFields.forEach(({ field, weight }) => {
      totalWeight += weight;
      let isCompleted = false;

      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        isCompleted = formData[parent]?.[child] && formData[parent][child].toString().trim() !== '';
      } else {
        const value = formData[field];
        if (Array.isArray(value)) {
          isCompleted = value.length > 0;
        } else {
          isCompleted = value && value.toString().trim() !== '';
        }
      }

      if (isCompleted) {
        completed += weight;
      }

      items.push({
        field,
        weight,
        completed: isCompleted,
        label: getFieldLabel(field)
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

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleLanguageToggle = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

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
        // Show success message and redirect
        alert('Profile updated successfully!');
        navigate('/dashboard/jobseeker');
      } else {
        alert(result.error || 'Error updating profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
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

              <FormInput
                label="Skills"
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                placeholder="Enter your skills separated by commas (e.g., cooking, cleaning, childcare)"
                className="md:col-span-2"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marital Status
                </label>
                <select
                  value={formData.maritalStatus}
                  onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  required
                >
                  <option value="">Select Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
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

              <FormInput
                label="Country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                required
                placeholder="e.g., Rwanda"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Category
                </label>
                <select
                  value={formData.jobCategoryId}
                  onChange={(e) => handleInputChange('jobCategoryId', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  required
                >
                  <option value="">Select Work Category</option>
                  <option value={1}>Software Developer</option>
                  <option value={2}>Housemaid</option>
                  <option value={3}>Gardener</option>
                  <option value={4}>Driver</option>
                  <option value={5}>Cook</option>
                  <option value={6}>Security Guard</option>
                </select>
              </div>

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

          {/* Job Category */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Job Category</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Category
              </label>
              <select
                value={formData.jobCategoryId}
                onChange={(e) => handleInputChange('jobCategoryId', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                required
              >
                <option value="">Select Work Category</option>
                <option value={1}>Software Developer</option>
                <option value={2}>Housemaid</option>
                <option value={3}>Gardener</option>
                <option value={4}>Driver</option>
                <option value={5}>Cook</option>
                <option value={6}>Security Guard</option>
              </select>
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