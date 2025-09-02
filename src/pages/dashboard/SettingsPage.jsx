import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Lock, 
  Save, 
  Eye, 
  EyeOff,
  Shield,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { adminService } from '../../api/services/adminService';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import PerformanceMonitor from '../../components/ui/PerformanceMonitor';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Performance tracking state
  const [performanceMetrics, setPerformanceMetrics] = useState({
    startTime: Date.now(),
    loadingTime: 0,
    apiCalls: 0,
    cacheHits: 0,
    errors: []
  });

  // Optimized profile state - only necessary fields
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Form validation state
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Memoized tabs to prevent unnecessary re-renders
  const tabs = useMemo(() => [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield }
  ], []);

  // Load admin profile data from API
  const loadAdminProfile = useCallback(async () => {
    try {
      setIsLoadingProfile(true);
      setPerformanceMetrics(prev => ({ ...prev, apiCalls: prev.apiCalls + 1 }));
      
      console.log('🔄 Loading admin profile...');
      const result = await adminService.getAdminProfile();
      console.log('📊 Admin profile result:', result);
      
      if (result.success) {
        // Map the API response to our profile state
        const adminData = result.data;
        console.log('👤 Admin data received:', adminData);
        
        setProfile({
          firstName: adminData.firstName || adminData.profile?.firstName || '',
          lastName: adminData.lastName || adminData.profile?.lastName || '',
          email: adminData.email || '',
          phone: adminData.phone || adminData.phoneNumber || adminData.profile?.phoneNumber || '',
          location: adminData.location || adminData.city || adminData.profile?.city || '',
          bio: adminData.bio || adminData.profile?.bio || ''
        });
        
        // Update cache hits if data came from cache
        if (result.fromCache) {
          setPerformanceMetrics(prev => ({ ...prev, cacheHits: prev.cacheHits + 1 }));
        }
      } else {
        // If API call fails, fall back to user context data
        console.warn('⚠️ Failed to load admin profile from API, using user context data');
        console.warn('❌ API Error:', result.error);
        
        if (user) {
          console.log('👤 Falling back to user context data:', user);
          setProfile({
            firstName: user.profile?.firstName || user.firstName || '',
            lastName: user.profile?.lastName || user.lastName || '',
            email: user.email || '',
            phone: user.profile?.phoneNumber || user.phoneNumber || '',
            location: user.profile?.city || user.city || '',
            bio: user.profile?.bio || user.bio || ''
          });
        }
        
        // Track the error
        setPerformanceMetrics(prev => ({ 
          ...prev, 
          errors: [...prev.errors, result.error || 'Failed to load admin profile'] 
        }));
      }
    } catch (error) {
      console.error('💥 Error loading admin profile:', error);
      
      // Fall back to user context data on error
      if (user) {
        console.log('👤 Falling back to user context data on error:', user);
        setProfile({
          firstName: user.profile?.firstName || user.firstName || '',
          lastName: user.profile?.lastName || user.lastName || '',
          email: user.email || '',
          phone: user.profile?.phoneNumber || user.phoneNumber || '',
          location: user.profile?.city || user.city || '',
          bio: user.profile?.bio || user.bio || ''
        });
      }
      
      // Track the error
      setPerformanceMetrics(prev => ({ 
        ...prev, 
        errors: [...prev.errors, 'Network error loading admin profile'] 
      }));
    } finally {
      setIsLoadingProfile(false);
    }
  }, [user]);

  // Performance tracking effect
  useEffect(() => {
    const endTime = Date.now();
    const loadingTime = endTime - performanceMetrics.startTime;
    
    setPerformanceMetrics(prev => ({
      ...prev,
      loadingTime
    }));
  }, [isLoadingProfile]);

  // Load admin profile on component mount
  useEffect(() => {
    loadAdminProfile();
  }, [loadAdminProfile]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleProfileChange = useCallback((e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handlePasswordChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Memoized validation functions
  const validateProfile = useCallback(() => {
    const newErrors = {};
    
    if (!profile.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!profile.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!profile.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Phone validation removed - only check minimum 9 digits if provided
    if (profile.phone && profile.phone.replace(/\D/g, '').length < 9) {
      newErrors.phone = 'Phone number must be at least 9 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [profile]);

  const validatePassword = useCallback(() => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [passwordData]);

  // Optimized profile save handler
  const handleSaveProfile = useCallback(async () => {
    if (!validateProfile()) return;

    try {
      setIsLoading(true);
      setPerformanceMetrics(prev => ({ ...prev, apiCalls: prev.apiCalls + 1 }));
      
      const result = await adminService.updateAdminProfile(profile);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Update user context if needed
        if (updateUser) {
          updateUser({ ...user, ...profile });
        }
        // Clear message after 3 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
        setPerformanceMetrics(prev => ({ 
          ...prev, 
          errors: [...prev.errors, result.error || 'Profile update failed'] 
        }));
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
      setPerformanceMetrics(prev => ({ 
        ...prev, 
        errors: [...prev.errors, 'Network error during profile update'] 
      }));
    } finally {
      setIsLoading(false);
    }
  }, [profile, validateProfile, updateUser, user]);

  // Optimized password change handler
  const handleChangePassword = useCallback(async () => {
    if (!validatePassword()) return;

    try {
      setIsLoading(true);
      setPerformanceMetrics(prev => ({ ...prev, apiCalls: prev.apiCalls + 1 }));
      
      const result = await adminService.changeAdminPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        // Clear message after 3 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to change password' });
        setPerformanceMetrics(prev => ({ 
          ...prev, 
          errors: [...prev.errors, result.error || 'Password change failed'] 
        }));
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
      setPerformanceMetrics(prev => ({ 
        ...prev, 
        errors: [...prev.errors, 'Network error during password change'] 
      }));
    } finally {
      setIsLoading(false);
    }
  }, [passwordData, validatePassword]);

  // Memoized message display component
  const MessageDisplay = useMemo(() => {
    if (!message.text) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}
      >
        {message.type === 'success' ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <AlertCircle className="w-5 h-5" />
        )}
        <span>{message.text}</span>
        <button
          onClick={() => setMessage({ type: '', text: '' })}
          className="ml-auto hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }, [message]);

  // Loading state
  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
            <p className="text-gray-600">Manage your profile and system settings</p>
          </div>
        </div>

        {/* Message Display */}
        {MessageDisplay}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Profile Information */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleProfileChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                          errors.firstName ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleProfileChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                          errors.lastName ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                          errors.phone ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={profile.location}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={profile.bio}
                        onChange={handleProfileChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      variant="primary"
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                    >
                      {isLoading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4 mr-2" />}
                      Save Profile
                    </Button>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Password Change */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                          errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-70 transition-opacity"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                          errors.newPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-70 transition-opacity"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                          errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-70 transition-opacity"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      onClick={handleChangePassword}
                      disabled={isLoading}
                    >
                      {isLoading ? <LoadingSpinner size="sm" /> : <Lock className="w-4 h-4 mr-2" />}
                      Change Password
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Performance Monitor */}
      <PerformanceMonitor
        loadingTime={performanceMetrics.loadingTime}
        apiCalls={performanceMetrics.apiCalls}
        cacheHits={performanceMetrics.cacheHits}
        errors={performanceMetrics.errors}
        showDetails={true}
      />
    </>
  );
};

export default SettingsPage;