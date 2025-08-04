import React, { useState } from 'react';

const AddJobSeekerForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  educationLevels = [], 
  availabilityOptions = [], 
  skillsData = [], 
  languageLevels = [], 
  jobCategories = [],
  isEdit = false,
  initialData = null
}) => {
  // Complete form state with all job seeker profile fields
  const [formData, setFormData] = useState({
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
    jobCategoryId: '',
    educationLevel: '',
    availability: '',
    languages: '',
    certifications: '',
    emergencyContact: '',
    emergencyPhone: '',
    emergencyRelationship: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Simple input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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

  // Simple submit handler
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
          jobCategoryId: formData.jobCategoryId ? parseInt(formData.jobCategoryId) : null,
          educationLevel: formData.educationLevel,
          availability: formData.availability,
          languages: formData.languages,
          certifications: formData.certifications,
          emergencyContact: formData.emergencyContact,
          emergencyPhone: formData.emergencyPhone,
          emergencyRelationship: formData.emergencyRelationship
        };

        await onSubmit(jobSeekerData);
        onClose();
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Simple cancel handler
  const handleCancel = () => {
    onClose();
  };

  // Initialize form data when modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (isEdit && initialData) {
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
          jobCategoryId: initialData.jobCategoryId || '',
          educationLevel: initialData.educationLevel || '',
          availability: initialData.availability || '',
          languages: initialData.languages || '',
          certifications: initialData.certifications || '',
          emergencyContact: initialData.emergencyContact || '',
          emergencyPhone: initialData.emergencyPhone || '',
          emergencyRelationship: initialData.emergencyRelationship || ''
        });
      } else {
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
          jobCategoryId: '',
          educationLevel: '',
          availability: '',
          languages: '',
          certifications: '',
          emergencyContact: '',
          emergencyPhone: '',
          emergencyRelationship: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, isEdit]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? "Edit Job Seeker" : "Add New Job Seeker"}
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter first name"
                  required
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter last name"
                  required
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                  required
                />
                {errors.contactNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Number
                </label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter ID number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marital Status
                </label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>

            {/* Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Kigali, Rwanda"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter country"
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Category
                </label>
                <select
                  name="jobCategoryId"
                  value={formData.jobCategoryId}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {jobCategories.map(category => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name_en || category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Rate (RWF)
                </label>
                <input
                  type="number"
                  name="monthlyRate"
                  value={formData.monthlyRate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter monthly rate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education Level
                </label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Education Level</option>
                  {educationLevels.map(level => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Availability</option>
                  {availabilityOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Skills and Experience */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., JavaScript, React, Node.js, Gardening, Cooking"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your work experience"
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
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description about yourself"
                  rows="3"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Languages
                </label>
                <textarea
                  name="languages"
                  value={formData.languages}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Kinyarwanda (Native), English (Fluent), French (Basic)"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certifications
                </label>
                <textarea
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="List any certifications or licenses"
                  rows="2"
                />
              </div>
            </div>

            {/* References */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                References
              </label>
              <textarea
                name="references"
                value={formData.references}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="List your references with contact information"
                rows="3"
              />
            </div>

            {/* Emergency Contact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Emergency contact name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Emergency contact phone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  name="emergencyRelationship"
                  value={formData.emergencyRelationship}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Spouse, Parent, Friend"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Job Seeker' : 'Create Job Seeker')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddJobSeekerForm;