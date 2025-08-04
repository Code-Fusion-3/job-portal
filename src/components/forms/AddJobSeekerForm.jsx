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
      setFormData({
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
      setErrors({});
    }
  }, [isOpen, initialData]);

  // Get the selected job category name for display
  const getSelectedJobCategoryName = () => {
    if (!formData.jobCategoryId) return '';
    const selectedCategory = jobCategories.find(cat => cat.id.toString() === formData.jobCategoryId.toString());
    return selectedCategory ? selectedCategory.name_en : '';
  };

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

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="First Name"
            type="text"
            value={formData.firstName}
            onChange={(value) => handleInputChange('firstName', value)}
            error={errors.firstName}
            required
          />
          <FormInput
            label="Last Name"
            type="text"
            value={formData.lastName}
            onChange={(value) => handleInputChange('lastName', value)}
            error={errors.lastName}
            required
          />
          <FormInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            error={errors.email}
            required
          />
          <FormInput
            label="Phone Number"
            type="tel"
            value={formData.contactNumber}
            onChange={(value) => handleInputChange('contactNumber', value)}
            error={errors.contactNumber}
            required
          />
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Gender"
            type="select"
            value={formData.gender}
            onChange={(value) => handleInputChange('gender', value)}
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
            value={formData.dateOfBirth}
            onChange={(value) => handleInputChange('dateOfBirth', value)}
          />
          <FormInput
            label="ID Number"
            type="text"
            value={formData.idNumber}
            onChange={(value) => handleInputChange('idNumber', value)}
          />
          <FormInput
            label="Marital Status"
            type="select"
            value={formData.maritalStatus}
            onChange={(value) => handleInputChange('maritalStatus', value)}
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
            value={formData.location}
            onChange={(value) => handleInputChange('location', value)}
            placeholder="e.g., Kigali, Rwanda"
          />
          <FormInput
            label="City"
            type="text"
            value={formData.city}
            onChange={(value) => handleInputChange('city', value)}
          />
          <FormInput
            label="Country"
            type="text"
            value={formData.country}
            onChange={(value) => handleInputChange('country', value)}
          />
          <FormInput
            label="Job Category"
            type="select"
            value={formData.jobCategoryId}
            onChange={(e) => handleInputChange('jobCategoryId', e.target.value)}
            options={[
              { value: '', label: 'Select Category' },
              ...jobCategories.map(category => ({
                value: category.id.toString(),
                label: category.name_en || category.name
              }))
            ]}
          />
          
          {/* Debug job category selection */}
          {(() => {
            console.log('🔍 Job Category Debug:', {
              jobCategories,
              formDataJobCategoryId: formData.jobCategoryId,
              selectedCategoryName: getSelectedJobCategoryName(),
              isEdit
            });
            return null;
          })()}
        </div>

        {/* Skills and Experience */}
        <div className="space-y-4">
          <FormInput
            label="Skills"
            type="textarea"
            value={formData.skills}
            onChange={(value) => handleInputChange('skills', value)}
            placeholder="e.g., JavaScript, React, Node.js"
          />
          <FormInput
            label="Experience"
            type="textarea"
            value={formData.experience}
            onChange={(value) => handleInputChange('experience', value)}
            placeholder="Describe your work experience"
          />
          <FormInput
            label="Description"
            type="textarea"
            value={formData.description}
            onChange={(value) => handleInputChange('description', value)}
            placeholder="Brief description about yourself"
          />
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Monthly Rate (RWF)"
            type="number"
            value={formData.monthlyRate}
            onChange={(value) => handleInputChange('monthlyRate', value)}
            placeholder="Expected monthly salary"
          />
          <FormInput
            label="References"
            type="textarea"
            value={formData.references}
            onChange={(value) => handleInputChange('references', value)}
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