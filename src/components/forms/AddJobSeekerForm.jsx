import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import FormInput from '../ui/FormInput';
import PasswordInput from '../ui/PasswordInput';
import Modal from '../ui/Modal';

const AddJobSeekerForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  educationLevels = [], 
  availabilityOptions = [], 
  skillsData = [], 
  languageLevels = [], 
  jobCategories = [],
  initialData = {},
  isEdit = false
}) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    contactNumber: initialData.contactNumber || '',
    description: initialData.description || '',
    skills: initialData.skills || '',
    gender: initialData.gender || '',
    dateOfBirth: initialData.dateOfBirth || '',
    idNumber: initialData.idNumber || '',
    maritalStatus: initialData.maritalStatus || '',
    location: initialData.location || '',
    city: initialData.city || '',
    country: initialData.country || 'Rwanda',
    references: initialData.references || '',
    experience: initialData.experience || '',
    monthlyRate: initialData.monthlyRate || '',
    jobCategoryId: initialData.jobCategoryId || ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      console.log('🔍 Form initialization - isEdit:', isEdit);
      console.log('🔍 Form initialization - initialData:', initialData);
      
      // For edit mode, use the provided initialData
      // For add mode, use empty values
      const defaultData = isEdit ? initialData : {};
      
      console.log('🔍 Form initialization - defaultData:', defaultData);
      
      const newFormData = {
        firstName: defaultData.firstName || '',
        lastName: defaultData.lastName || '',
        email: defaultData.email || '',
        contactNumber: defaultData.contactNumber || '',
        description: defaultData.description || '',
        skills: defaultData.skills || '',
        gender: defaultData.gender || '',
        dateOfBirth: defaultData.dateOfBirth || '',
        idNumber: defaultData.idNumber || '',
        maritalStatus: defaultData.maritalStatus || '',
        location: defaultData.location || '',
        city: defaultData.city || '',
        country: defaultData.country || 'Rwanda',
        references: defaultData.references || '',
        experience: defaultData.experience || '',
        monthlyRate: defaultData.monthlyRate || '',
        jobCategoryId: defaultData.jobCategoryId || ''
      };
      
      console.log('🔍 Form initialization - newFormData:', newFormData);
      
      setFormData(newFormData);
      setErrors({});
    }
  }, [isOpen, isEdit]); // Removed initialData from dependencies to prevent re-initialization

  // Handle initialData changes for edit mode only
  useEffect(() => {
    if (isOpen && isEdit && initialData) {
      console.log('🔍 Edit mode - updating form with initialData:', initialData);
      setFormData(prev => ({
        ...prev,
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        contactNumber: initialData.contactNumber || '',
        description: initialData.description || '',
        skills: initialData.skills || '',
        gender: initialData.gender || '',
        dateOfBirth: initialData.dateOfBirth || '',
        idNumber: initialData.idNumber || '',
        maritalStatus: initialData.maritalStatus || '',
        location: initialData.location || '',
        city: initialData.city || '',
        country: initialData.country || 'Rwanda',
        references: initialData.references || '',
        experience: initialData.experience || '',
        monthlyRate: initialData.monthlyRate || '',
        jobCategoryId: initialData.jobCategoryId || ''
      }));
    }
  }, [isOpen, isEdit, initialData]);

  // Get the selected job category name for display
  const getSelectedJobCategoryName = () => {
    if (!formData.jobCategoryId) return '';
    const selectedCategory = jobCategories.find(cat => cat.id.toString() === formData.jobCategoryId.toString());
    return selectedCategory ? selectedCategory.name_en : '';
  };

  // Handle input changes
  const handleInputChange = (e) => {
    console.log('🔍 handleInputChange called:', e);
    
    // Handle both event objects and direct values
    let fieldName, fieldValue;
    
    if (e && e.target) {
      // Event object
      const { name, value, type, checked } = e.target;
      fieldName = name;
      fieldValue = type === 'checkbox' ? checked : value;
    } else {
      // Direct value (fallback)
      console.warn('Received non-event object:', e);
      return;
    }
    
    console.log('🔍 Processing field:', fieldName, 'with value:', fieldValue);
    
    // Ensure we're working with strings for text inputs
    if (typeof fieldValue === 'object' && fieldValue !== null) {
      console.warn(`Field ${fieldName} received object instead of string:`, fieldValue);
      fieldValue = '';
    }
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [fieldName]: fieldValue
      };
      console.log('🔍 Updated formData:', newData);
      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
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

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('🔍 Form submission - isEdit:', isEdit);
    console.log('🔍 Form submission - formData:', formData);

    if (validateForm()) {
      setIsLoading(true);
      
      try {
        // Prepare data in the format expected by the backend
      const jobSeekerData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          contactNumber: formData.contactNumber,
          description: formData.description,
          skills: formData.skills,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          idNumber: formData.idNumber,
          maritalStatus: formData.maritalStatus,
          location: formData.location,
          city: formData.city,
          country: formData.country,
          references: formData.references,
          experience: formData.experience,
          monthlyRate: formData.monthlyRate ? parseFloat(formData.monthlyRate) : null,
          jobCategoryId: formData.jobCategoryId ? parseInt(formData.jobCategoryId) : null
        };

        console.log('🔍 Form submission - jobSeekerData:', jobSeekerData);

        await onSubmit(jobSeekerData);
        
        // Reset form on success
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          contactNumber: '',
          description: '',
          skills: '',
          gender: '',
          dateOfBirth: '',
          idNumber: '',
          maritalStatus: '',
          location: '',
          city: '',
          country: 'Rwanda',
          references: '',
          experience: '',
          monthlyRate: '',
          jobCategoryId: ''
        });
        setErrors({});
        
      } catch (error) {
        console.error('Error creating job seeker:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      contactNumber: '',
      description: '',
      skills: '',
      gender: '',
      dateOfBirth: '',
      idNumber: '',
      maritalStatus: '',
      location: '',
      city: '',
      country: 'Rwanda',
      references: '',
      experience: '',
      monthlyRate: '',
      jobCategoryId: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={isEdit ? "Edit Job Seeker" : "Add New Job Seeker"}
      size="lg"
    >
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Debug Test Input */}
      <div className="bg-yellow-100 p-2 rounded">
        <label className="block text-sm font-medium text-gray-700 mb-2">Debug Test</label>
        <input
          type="text"
          value={formData.firstName}
          onChange={handleInputChange}
          name="firstName"
          className="w-full p-2 border rounded"
          placeholder="Test typing here"
        />
        <p className="text-xs text-gray-600">Current value: {formData.firstName}</p>
      </div>
      
      {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="First Name"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          error={errors.firstName}
          required
        />
        <FormInput
          label="Last Name"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          error={errors.lastName}
          required
        />
        <FormInput
            label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          required
        />
        <FormInput
          label="Phone Number"
          type="tel"
          name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            error={errors.contactNumber}
          required
        />
      </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Gender"
            type="select"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            options={[
              { value: '', label: 'Select Gender' },
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' }
            ]}
          />
          <FormInput
            label="Date of Birth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
          />
          <FormInput
            label="ID Number"
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleInputChange}
          />
          <FormInput
            label="Marital Status"
            type="select"
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleInputChange}
            options={[
              { value: '', label: 'Select Status' },
              { value: 'Single', label: 'Single' },
              { value: 'Married', label: 'Married' },
              { value: 'Divorced', label: 'Divorced' },
              { value: 'Widowed', label: 'Widowed' }
            ]}
          />
        </div>

        {/* Location Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Kigali, Rwanda"
          />
          <FormInput
            label="City"
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
          />
          <FormInput
            label="Country"
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
          />
          <FormInput
            label="Job Category"
            type="select"
            name="jobCategoryId"
            value={formData.jobCategoryId}
            onChange={handleInputChange}
            options={[
              { value: '', label: 'Select Category' },
              ...jobCategories.map(category => ({
                value: category.id.toString(),
                label: category.name_en || category.name
              }))
            ]}
          />
        </div>

        {/* Skills and Experience */}
        <div className="space-y-4">
          <FormInput
            label="Skills"
            type="textarea"
            name="skills"
            value={formData.skills}
            onChange={handleInputChange}
            placeholder="e.g., JavaScript, React, Node.js"
          />
          <FormInput
            label="Experience"
            type="textarea"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            placeholder="Describe your work experience"
          />
          <FormInput
            label="Description"
            type="textarea"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description about yourself"
          />
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Monthly Rate (RWF)"
            type="number"
            name="monthlyRate"
            value={formData.monthlyRate}
            onChange={handleInputChange}
            placeholder="Expected monthly salary"
          />
          <FormInput
            label="References"
            type="textarea"
            name="references"
            value={formData.references}
            onChange={handleInputChange}
            placeholder="Previous employers or references"
          />
      </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
            onClick={handleCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
            {isLoading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Job Seeker' : 'Create Job Seeker')}
        </Button>
      </div>
    </form>
    </Modal>
  );
};

export default AddJobSeekerForm;