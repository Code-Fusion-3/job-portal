import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Briefcase, 
  MapPin, 
  Star, 
  Calendar,
  Clock,
  TrendingUp,
  Users,
  FileText,
  Settings,
  LogOut,
  Bell,
  Search,
  Filter,
  Eye,
  Edit,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  GraduationCap,
  Languages,
  Award,
  Mail,
  Phone
} from 'lucide-react';
import { useAuth } from '../../api/hooks/useAuth.js';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatDailyRate, formatMonthlyRate } from '../../utils/helpers';

const JobSeekerDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if no user
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditProfile = () => {
    navigate('/update-profile');
  };

  // Show loading if user is not loaded
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

 
  // Helper functions to map backend data to frontend expectations
  const getUserName = () => {
    if (user?.profile?.firstName && user?.profile?.lastName) {
      return `${user.profile.firstName} ${user.profile.lastName}`;
    }
    return user?.profile?.firstName || user?.profile?.lastName || user?.email || 'No Name';
  };

  const getUserTitle = () => {
    // Map jobCategoryId to title based on backend data
    const categoryMap = {
      1: 'Software Developer',
      2: 'Housemaid',
      3: 'Gardener',
      4: 'Driver',
      5: 'Cook',
      6: 'Security Guard'
    };
    return categoryMap[user?.profile?.jobCategoryId] || 'Job Seeker';
  };

  const getSkillsArray = () => {
    if (user?.profile?.skills) {
      return user.profile.skills.split(',').map(skill => skill.trim());
    }
    return [];
  };

  const getLanguagesArray = () => {
    // Backend doesn't have languages field, so we'll use defaults
    return ['Kinyarwanda', 'English'];
  };

  const getContactInfo = () => {
    return {
      email: user?.email || 'No email',
      phone: user?.profile?.contactNumber || 'No phone',
      linkedin: null // Backend doesn't have LinkedIn
    };
  };

  const getRates = () => {
    return {
      dailyRate: null, // Backend doesn't have dailyRate
      monthlyRate: user?.profile?.monthlyRate || null
    };
  };

  const getExperience = () => {
    return user?.profile?.experience || 'No experience specified';
  };

  const getEducation = () => {
    // Backend doesn't have education field, so we'll use a default
    return 'Not specified';
  };

  const getAvailability = () => {
    // Backend doesn't have availability field, so we'll use a default
    return 'Not specified';
  };

  try {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-green-600 font-bold p-4">✅ JobSeekerDashboard is rendering!</div>
        
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">J</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">JobPortal</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <Avatar 
                    src={user?.avatar} 
                    alt={getUserName()} 
                    size="sm"
                    fallback={getUserName()}
                  />
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {getUserName()}!
                </h1>
                <p className="text-gray-600">
                  Here's your complete profile. Keep your information up to date for potential employers.
                </p>
              </div>
              <Button variant="primary" onClick={handleEditProfile}>
                <Edit className="w-4 h-4 mr-2" />
                Update Profile
              </Button>
            </div>
          </motion.div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Card */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="p-6">
                <div className="flex items-start space-x-6">
                  <Avatar 
                    src={user?.profile?.photo} 
                    alt={getUserName()} 
                    size="xl"
                    fallback={getUserName()}
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {getUserName()}
                    </h2>
                    <p className="text-xl text-gray-600 mb-3">
                      {getUserTitle()}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{user?.profile?.location || 'No Location'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        <span>{getExperience()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{getAvailability()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <GraduationCap className="w-4 h-4" />
                        <span>{getEducation()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* About Section */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                <p className="text-gray-700 leading-relaxed">
                  {user?.profile?.description || 'No bio available'}
                </p>
              </Card>

              {/* Skills */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {getSkillsArray().length > 0 ? (
                    getSkillsArray().map((skill, index) => (
                      <Badge key={index} variant="primary" size="md">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500">No skills listed</p>
                  )}
                </div>
              </Card>

              {/* Languages */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Languages className="w-5 h-5 mr-2" />
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {getLanguagesArray().length > 0 ? (
                    getLanguagesArray().map((language, index) => (
                      <Badge key={index} variant="secondary" size="md">
                        {language}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500">No languages listed</p>
                  )}
                </div>
              </Card>

              {/* Certifications */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Certifications
                </h3>
                {user?.profile?.certifications && user.profile.certifications.length > 0 ? (
                  <div className="space-y-3">
                    {user.profile.certifications.map((cert, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900">{cert.name}</h4>
                        <p className="text-sm text-gray-600">{cert.issuer}</p>
                        <p className="text-xs text-gray-500">{cert.date}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No certifications listed</p>
                )}
              </Card>

              {/* References */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  References
                </h3>
                {user?.profile?.references ? (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{user.profile.references}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No references listed</p>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{getContactInfo().email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{getContactInfo().phone}</span>
                  </div>
                  {getContactInfo().linkedin && (
                    <div className="flex items-center space-x-3">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{getContactInfo().linkedin}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Rates */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  Rates
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Daily Rate:</span>
                    <span className="font-semibold text-gray-900">
                      {getRates().dailyRate ? formatDailyRate(getRates().dailyRate) : 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monthly Rate:</span>
                    <span className="font-semibold text-gray-900">
                      {getRates().monthlyRate ? formatMonthlyRate(getRates().monthlyRate) : 'Not set'}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Category Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Category:</span>
                    <p className="font-medium text-gray-900 capitalize">
                      {getUserTitle()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Category ID:</span>
                    <p className="font-medium text-gray-900">
                      {user?.profile?.jobCategoryId || 'Not specified'}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Profile Completion */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Profile Score</span>
                    <span className="text-sm font-medium text-gray-900">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Complete your profile to increase your chances of getting hired
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering JobSeekerDashboard:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-lg text-gray-800">
          An error occurred while rendering the JobSeekerDashboard. Please try again later.
        </p>
      </div>
    );
  }
};

export default JobSeekerDashboard; 