import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Briefcase, 
  MapPin, 
  Star, 
  Save, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Upload,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import FormInput from '../components/ui/FormInput';
import PasswordInput from '../components/ui/PasswordInput';
import FormCheckbox from '../components/ui/FormCheckbox';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  filterOptions, 
  skillsData, 
  educationLevels, 
  availabilityOptions,
  languageLevels 
} from '../data/mockData';

const UpdateProfile = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    category: '',
    subcategory: '',
    location: '',
    experience: '',
    dailyRate: '',
    monthlyRate: '',
    availability: '',
    education: '',
    languages: [],
    skills: [],
    bio: '',
    contact: {
      email: '',
      phone: '',
      linkedin: ''
    },
    certifications: [],
    references: []
  });

  // Profile completion tracking
  const [completionScore, setCompletionScore] = useState(0);
  const [completionItems, setCompletionItems] = useState([]);

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        title: user.profile?.title || '',
        category: user.profile?.category || '',
        subcategory: user.profile?.subcategory || '',
        location: user.profile?.location || '',
        experience: user.profile?.experience || '',
        dailyRate: user.profile?.dailyRate || '',
        monthlyRate: user.profile?.monthlyRate || '',
        availability: user.profile?.availability || '',
        education: user.profile?.education || '',
        languages: user.profile?.languages || [],
        skills: user.profile?.skills || [],
        bio: user.profile?.bio || '',
        contact: {
          email: user.profile?.contact?.email || '',
          phone: user.profile?.contact?.phone || '',
          linkedin: user.profile?.contact?.linkedin || ''
        },
        certifications: user.profile?.certifications || [],
        references: user.profile?.references || []
      });
      setImagePreview(user.avatar);
    }
  }, [user]);

  // Calculate profile completion score
  useEffect(() => {
    const requiredFields = [
      { field: 'name', weight: 10 },
      { field: 'title', weight: 10 },
      { field: 'category', weight: 8 },
      { field: 'location', weight: 8 },
      { field: 'experience', weight: 8 },
      { field: 'dailyRate', weight: 8 },
      { field: 'monthlyRate', weight: 8 },
      { field: 'availability', weight: 6 },
      { field: 'education', weight: 6 },
      { field: 'languages', weight: 5 },
      { field: 'skills', weight: 10 },
      { field: 'bio', weight: 8 },
      { field: 'contact.email', weight: 5 },
      { field: 'contact.phone', weight: 5 }
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
      name: 'Full Name',
      title: 'Job Title',
      category: 'Work Category',
      location: 'Location',
      experience: 'Experience',
      dailyRate: 'Daily Rate',
      monthlyRate: 'Monthly Rate',
      availability: 'Availability',
      education: 'Education',
      languages: 'Languages',
      skills: 'Skills',
      bio: 'Bio/Description',
      'contact.email': 'Email',
      'contact.phone': 'Phone'
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user profile
      const updatedProfile = {
        ...user,
        name: formData.name,
        avatar: imagePreview,
        profile: {
          ...user.profile,
          ...formData
        }
      };

      updateUser(updatedProfile);
      
      // Show success message and redirect
      alert('Profile updated successfully!');
      navigate('/dashboard/jobseeker');
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
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                placeholder="Enter your full name"
              />

              <FormInput
                label="Job Title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                placeholder="e.g., Housemaid, Gardener, Driver"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  required
                >
                  <option value="">Select Category</option>
                  {filterOptions.categories.slice(1).map(category => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <FormInput
                label="Location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
                placeholder="e.g., Kigali, Rwanda"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (Years)
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  required
                >
                  <option value="">Select Experience</option>
                  {filterOptions.experience.slice(1).map(exp => (
                    <option key={exp} value={exp}>
                      {exp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Level
                </label>
                <select
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  required
                >
                  <option value="">Select Education</option>
                  {filterOptions.education.slice(1).map(education => (
                    <option key={education} value={education}>
                      {education}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Rates and Availability */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Rates & Availability</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Daily Rate (RWF)"
                type="number"
                value={formData.dailyRate}
                onChange={(e) => handleInputChange('dailyRate', e.target.value)}
                required
                placeholder="e.g., 5000"
              />

              <FormInput
                label="Monthly Rate (RWF)"
                type="number"
                value={formData.monthlyRate}
                onChange={(e) => handleInputChange('monthlyRate', e.target.value)}
                required
                placeholder="e.g., 120000"
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  required
                >
                  <option value="">Select Availability</option>
                  {filterOptions.availability.slice(1).map(availability => (
                    <option key={availability} value={availability}>
                      {availability}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Skills */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Skills & Languages</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Skills ({formData.skills.length} selected)
                </label>
                <div className="flex flex-wrap gap-2">
                  {skillsData.map(skill => (
                    <Badge
                      key={skill}
                      variant={formData.skills.includes(skill) ? 'primary' : 'outline'}
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Languages ({formData.languages.length} selected)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Kinyarwanda', 'English', 'French', 'Swahili'].map(language => (
                    <Badge
                      key={language}
                      variant={formData.languages.includes(language) ? 'primary' : 'outline'}
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => handleLanguageToggle(language)}
                    >
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Bio */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">About You</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio/Description
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                placeholder="Tell potential employers about your experience, skills, and what makes you a great worker..."
                required
              />
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Email"
                type="email"
                value={formData.contact.email}
                onChange={(e) => handleInputChange('contact.email', e.target.value)}
                required
                placeholder="your.email@example.com"
              />

              <FormInput
                label="Phone Number"
                value={formData.contact.phone}
                onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                required
                placeholder="+250 789 123 456"
              />
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