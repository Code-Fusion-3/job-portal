import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import FormInput from '../ui/FormInput';
import PasswordInput from '../ui/PasswordInput';

const AddJobSeekerForm = ({ onSubmit, onCancel, isLoading = false }) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: 'password123' // Default password
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const jobSeekerData = {
        id: Date.now(), // Generate unique ID
        name: `${formData.firstName} ${formData.lastName}`,
        title: 'Job Seeker',
        category: 'domestic',
        subcategory: 'General',
        location: 'Kigali, Rwanda',
        experience: 0,
        skills: [],
        dailyRate: 0,
        monthlyRate: 0,
        rating: 0,
        reviews: 0,
        availability: 'Available',
        languages: ['Kinyarwanda'],
        education: 'Primary School',
        certifications: [],
        bio: 'Profile to be completed by job seeker.',
        projects: [],
        references: [],
        avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=150&h=150&fit=crop&crop=face`,
        contact: {
          email: formData.email,
          phone: formData.phone,
          linkedin: null
        },
        // Add login credentials
        loginCredentials: {
          email: formData.email,
          password: formData.password
        }
      };

      onSubmit(jobSeekerData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <FormInput
          label="First Name"
          type="text"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          error={errors.firstName}
          placeholder="Enter your first name"
          required
        />

        <FormInput
          label="Last Name"
          type="text"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          error={errors.lastName}
          placeholder="Enter your last name"
          required
        />

        <FormInput
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          placeholder="Enter your email"
          required
        />

        <FormInput
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          error={errors.phone}
          placeholder="Enter your phone number"
          required
        />

        <PasswordInput
          label="Password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          error={errors.password}
          placeholder="Create a password"
          required
        />
      </div>

      {/* Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This creates a basic profile with default password "password123". 
          The job seeker can log in and complete their full profile through the "Update Profile" page.
        </p>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Job Seeker'}
        </Button>
      </div>
    </form>
  );
};

export default AddJobSeekerForm;