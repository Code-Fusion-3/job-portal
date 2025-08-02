import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useProfile } from '../../api/hooks/useAuth.js';
import Button from '../ui/Button';
import FormInput from '../ui/FormInput';
import PasswordInput from '../ui/PasswordInput';
import Card from '../ui/Card';
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
  CheckCircle
} from 'lucide-react';

const ProfileUpdateForm = () => {
  const { user, updateProfile, changePassword, loading, error, refreshUserData } = useProfile();
  
  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    email: user?.email || '',
    contactNumber: user?.profile?.contactNumber || '',
    location: user?.profile?.location || '',
    city: user?.profile?.city || '',
    country: user?.profile?.country || '',
    description: user?.profile?.description || '',
    skills: user?.profile?.skills || '',
    experience: user?.profile?.experience || '',
    education: user?.profile?.education || '',
    languages: user?.profile?.languages || '',
    references: user?.profile?.references || '',
    gender: user?.profile?.gender || '',
    dateOfBirth: user?.profile?.dateOfBirth ? user.profile.dateOfBirth.split('T')[0] : '',
    maritalStatus: user?.profile?.maritalStatus || '',
    idNumber: user?.profile?.idNumber || ''
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [photo, setPhoto] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (file) => {
    setPhoto(file);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    try {
      const result = await updateProfile(formData, photo);
      if (result.success) {
        setSuccessMessage('Profile updated successfully!');
        // Refresh user data to get the latest from backend
        await refreshUserData();
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSuccessMessage('New passwords do not match');
      return;
    }
    
    try {
      const result = await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      
      if (result.success) {
        setSuccessMessage('Password changed successfully!');
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordForm(false);
      }
    } catch (error) {
      console.error('Password change error:', error);
    }
  };

  const educationOptions = [
    { value: 'Primary School', label: 'Primary School' },
    { value: 'Secondary School', label: 'Secondary School' },
    { value: 'High School', label: 'High School' },
    { value: 'Diploma', label: 'Diploma' },
    { value: 'Bachelor', label: 'Bachelor Degree' },
    { value: 'Master', label: 'Master Degree' },
    { value: 'PhD', label: 'PhD' },
    { value: 'Other', label: 'Other' }
  ];

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

  const maritalStatusOptions = [
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Widowed', label: 'Widowed' }
  ];

  return (
    <div className="space-y-6">
             {/* Success/Error Messages */}
       {successMessage && (
         <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
           <div className="flex items-center justify-between">
             <div className="flex items-center">
               <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
               <div>
                 <h3 className="text-sm font-medium text-green-800">Success</h3>
                 <p className="text-sm text-green-700">{successMessage}</p>
               </div>
             </div>
             <button
               onClick={() => setSuccessMessage('')}
               className="text-green-400 hover:text-green-600"
             >
               <AlertCircle className="w-4 h-4" />
             </button>
           </div>
         </div>
       )}
       
       {error && (
         <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
           <div className="flex items-center">
             <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
             <div>
               <h3 className="text-sm font-medium text-red-800">Error</h3>
               <p className="text-sm text-red-700">{error}</p>
             </div>
           </div>
         </div>
       )}

      {/* Profile Update Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              icon={<User className="w-4 h-4" />}
            />
            
            <FormInput
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              icon={<User className="w-4 h-4" />}
            />
            
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              icon={<Mail className="w-4 h-4" />}
            />
            
            <FormInput
              label="Phone Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              icon={<Phone className="w-4 h-4" />}
            />
            
            <FormInput
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              icon={<MapPin className="w-4 h-4" />}
            />
            
            <FormInput
              label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              icon={<MapPin className="w-4 h-4" />}
            />
            
            <FormInput
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              icon={<MapPin className="w-4 h-4" />}
            />
            
            <FormInput
              label="ID Number"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleInputChange}
              placeholder="16-digit ID number"
            />
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Gender
               </label>
               <select
                 name="gender"
                 value={formData.gender}
                 onChange={handleInputChange}
                 className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
               >
                 <option value="">Select Gender</option>
                 {genderOptions.map(option => (
                   <option key={option.value} value={option.value}>
                     {option.label}
                   </option>
                 ))}
               </select>
             </div>
            
                         <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Marital Status
               </label>
               <select
                 name="maritalStatus"
                 value={formData.maritalStatus}
                 onChange={handleInputChange}
                 className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
               >
                 <option value="">Select Marital Status</option>
                 {maritalStatusOptions.map(option => (
                   <option key={option.value} value={option.value}>
                     {option.label}
                   </option>
                 ))}
               </select>
             </div>
             
             <FormInput
               label="Date of Birth"
               name="dateOfBirth"
               type="date"
               value={formData.dateOfBirth}
               onChange={handleInputChange}
             />
             
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Education Level
               </label>
               <select
                 name="education"
                 value={formData.education}
                 onChange={handleInputChange}
                 className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
               >
                 <option value="">Select Education Level</option>
                 {educationOptions.map(option => (
                   <option key={option.value} value={option.value}>
                     {option.label}
                   </option>
                 ))}
               </select>
             </div>
          </div>

          {/* Skills and Experience */}
          <div className="space-y-4">
            <FormInput
              label="Skills"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="e.g., JavaScript, React, Node.js, Cooking, Cleaning"
              rows={3}
            />
            
            <FormInput
              label="Experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="Describe your work experience"
              rows={3}
            />
            
            <FormInput
              label="Languages"
              name="languages"
              value={formData.languages}
              onChange={handleInputChange}
              placeholder="e.g., English, Kinyarwanda, French"
              rows={2}
              icon={<Languages className="w-4 h-4" />}
            />
          </div>

          {/* Description and References */}
          <div className="space-y-4">
            <FormInput
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell us about yourself and your background"
              rows={4}
            />
            
            <FormInput
              label="References"
              name="references"
              value={formData.references}
              onChange={handleInputChange}
              placeholder="Previous employers or references"
              rows={3}
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">Profile Photo</h3>
            </div>
            
                         <div className="space-y-2">
               <input
                 type="file"
                 accept="image/jpeg,image/png,image/webp"
                 onChange={(e) => {
                   const file = e.target.files[0];
                   if (file && file.size <= 5 * 1024 * 1024) {
                     handlePhotoChange(file);
                   } else {
                     alert('Please select an image file under 5MB');
                   }
                 }}
                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
               />
               {user?.profile?.photo && (
                 <div className="text-xs text-gray-500">
                   Current photo: {user.profile.photo}
                 </div>
               )}
             </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </motion.div>

      {/* Password Change Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </Button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <FormInput
              label="Current Password"
              name="oldPassword"
              type="password"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              required
            />
            
            <FormInput
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
            
            <FormInput
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
            
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ProfileUpdateForm; 