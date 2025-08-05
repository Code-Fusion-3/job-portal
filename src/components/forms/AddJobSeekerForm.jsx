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
  // Complete form state with all job seeker profile fields (removed emergency contacts)
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
    experienceLevel: '',
    monthlyRate: '',
    jobCategoryId: '',
    educationLevel: '',
    availability: '',
    languages: '',
    certifications: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Skills selection state
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [skillSearch, setSkillSearch] = useState('');

  // Languages selection state
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [customLanguage, setCustomLanguage] = useState('');
  const [languageSearch, setLanguageSearch] = useState('');

  // Experience level options
  const experienceLevels = [
    { value: 'no_experience', label: 'No Experience (0 years)', description: 'New to the workforce' },
    { value: 'beginner', label: 'Beginner (1-2 years)', description: 'Some basic experience' },
    { value: 'intermediate', label: 'Intermediate (3-5 years)', description: 'Moderate experience' },
    { value: 'experienced', label: 'Experienced (6-10 years)', description: 'Significant experience' },
    { value: 'expert', label: 'Expert (10+ years)', description: 'Extensive experience' }
  ];

  // Predefined skills options - House maid skills first, then others
  const predefinedSkills = [
    // House Maid & Domestic Skills (Priority)
    'House Cleaning', 'Laundry', 'Ironing', 'Cooking', 'Meal Preparation', 'Kitchen Management',
    'Childcare', 'Elderly Care', 'Pet Care', 'First Aid', 'Safety', 'Educational Activities',
    'Gardening', 'Plant Care', 'Basic Repairs', 'Security Monitoring', 'Access Control',
    
    // Hospitality & Service Skills
    'Food Service', 'Table Setting', 'Order Taking', 'Cash Handling', 'Customer Service',
    'Bartending', 'Food Delivery', 'Housekeeping', 'Reception', 'Secretarial Work',
    
    // Trade Skills
    'Carpentry', 'Plumbing', 'Electrical Work', 'Masonry', 'Painting', 'Welding', 'Machining',
    'Landscaping', 'Baking', 'Cleaning',
    
    // Transportation Skills
    'Safe Driving', 'Vehicle Maintenance', 'Route Planning', 'GPS Navigation',
    'Defensive Driving', 'Passenger Safety', 'Driving',
    
    // Business Skills
    'Accounting', 'Bookkeeping', 'Marketing', 'Sales', 'Business Development', 'Financial Analysis',
    'Human Resources', 'Operations Management', 'Supply Chain Management',
    'Inventory Management', 'Negotiation', 'Product Knowledge', 'Market Knowledge',
    
    // Technical Skills
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'PHP', 'Ruby', 'Go', 'Rust',
    'HTML/CSS', 'TypeScript', 'Angular', 'Vue.js', 'Django', 'Flask', 'Laravel', 'Express.js',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    
    // Professional Skills
    'Project Management', 'Agile/Scrum', 'Leadership', 'Team Management', 'Communication',
    'Problem Solving', 'Critical Thinking', 'Time Management', 'Customer Service',
    
    // Creative Skills
    'Graphic Design', 'Web Design', 'Video Editing', 'Photography', 'Content Writing',
    'Social Media Management', 'Digital Marketing', 'SEO', 'Copywriting',
    
    // Healthcare Skills
    'Nursing', 'Medical Assistance', 'Pharmacy', 'Laboratory Work', 'Patient Care',
    'Medical Records', 'Health Administration',
    
    // Education Skills
    'Teaching', 'Tutoring', 'Curriculum Development', 'Student Assessment', 'Classroom Management',
    'Special Education', 'ESL Teaching',
    
    // Other Skills
    'Security', 'Event Planning', 'Tourism', 'Translation', 'Interpretation',
    'Data Entry', 'Administrative Work'
  ];

  // Filter skills based on search
  const filteredSkills = predefinedSkills.filter(skill =>
    skill.toLowerCase().includes(skillSearch.toLowerCase())
  );

  // Predefined languages
  const predefinedLanguages = [
    'Kinyarwanda', 'English', 'French', 'Swahili', 'German', 'Spanish', 'Chinese', 'Arabic',
    'Portuguese', 'Italian', 'Dutch', 'Russian', 'Japanese', 'Korean', 'Hindi', 'Turkish'
  ];

  // Filter languages based on search
  const filteredLanguages = predefinedLanguages.filter(language =>
    language.toLowerCase().includes(languageSearch.toLowerCase())
  );

  // Simple input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Skills selection handlers
  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills(prev => [...prev, skill]);
      updateSkillsField([...selectedSkills, skill]);
    }
  };

  const handleSkillRemove = (skill) => {
    const updatedSkills = selectedSkills.filter(s => s !== skill);
    setSelectedSkills(updatedSkills);
    updateSkillsField(updatedSkills);
  };

  const handleCustomSkillAdd = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      const newSkills = [...selectedSkills, customSkill.trim()];
      setSelectedSkills(newSkills);
      setCustomSkill('');
      updateSkillsField(newSkills);
    }
  };

  const updateSkillsField = (skills) => {
    setFormData(prev => ({ ...prev, skills: skills.join(', ') }));
  };

  // Language selection handlers
  const handleLanguageSelect = (language) => {
    if (!selectedLanguages.includes(language)) {
      setSelectedLanguages(prev => [...prev, language]);
      updateLanguagesField([...selectedLanguages, language]);
    }
  };

  const handleLanguageRemove = (language) => {
    const updatedLanguages = selectedLanguages.filter(l => l !== language);
    setSelectedLanguages(updatedLanguages);
    updateLanguagesField(updatedLanguages);
  };

  const handleCustomLanguageAdd = () => {
    if (customLanguage.trim() && !selectedLanguages.includes(customLanguage.trim())) {
      const newLanguages = [...selectedLanguages, customLanguage.trim()];
      setSelectedLanguages(newLanguages);
      setCustomLanguage('');
      updateLanguagesField(newLanguages);
    }
  };

  const updateLanguagesField = (languages) => {
    setFormData(prev => ({ ...prev, languages: languages.join(', ') }));
  };

  // Comprehensive validation
  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Contact number is now required
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.contactNumber.trim())) {
      newErrors.contactNumber = 'Please enter a valid phone number';
    }

    // Experience level is required
    if (!formData.experienceLevel.trim()) {
      newErrors.experienceLevel = 'Experience level is required';
    }

    // Email validation (optional but if provided, must be valid)
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Date of birth validation
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 16 || age > 100) {
        newErrors.dateOfBirth = 'Age must be between 16 and 100 years';
      }
    }

    // Monthly rate validation
    if (formData.monthlyRate && isNaN(parseFloat(formData.monthlyRate))) {
      newErrors.monthlyRate = 'Please enter a valid number for monthly rate';
    }

    // Skills validation
    if (!formData.skills.trim()) {
      newErrors.skills = 'At least one skill is required';
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
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim() || null, // Allow null email
          contactNumber: formData.contactNumber.trim(),
          description: formData.description.trim(),
          skills: formData.skills.trim(),
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          idNumber: formData.idNumber.trim(),
          maritalStatus: formData.maritalStatus,
          location: formData.location.trim(),
          city: formData.city.trim(),
          country: formData.country,
          references: formData.references.trim(),
          experience: formData.experience.trim(),
          experienceLevel: formData.experienceLevel.trim(),
          monthlyRate: formData.monthlyRate ? parseFloat(formData.monthlyRate) : null,
          jobCategoryId: formData.jobCategoryId ? parseInt(formData.jobCategoryId, 10) : null,
          educationLevel: formData.educationLevel,
          availability: formData.availability,
          languages: formData.languages.trim(),
          certifications: formData.certifications.trim()
        };

        console.log('📤 Frontend sending data:', { email: jobSeekerData.email, firstName: jobSeekerData.firstName });



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
          experienceLevel: initialData.experienceLevel || '',
          monthlyRate: initialData.monthlyRate || '',
          jobCategoryId: initialData.jobCategoryId || '',
          educationLevel: initialData.educationLevel || '',
          availability: initialData.availability || '',
          languages: initialData.languages || '',
          certifications: initialData.certifications || ''
        });
        
        // Initialize selected skills from existing skills
        if (initialData.skills) {
          const skillsArray = initialData.skills.split(',').map(s => s.trim()).filter(s => s);
          setSelectedSkills(skillsArray);
        }

        // Initialize selected languages from existing languages
        if (initialData.languages) {
          const languagesArray = initialData.languages.split(',').map(l => l.trim()).filter(l => l);
          setSelectedLanguages(languagesArray);
        }
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
          experienceLevel: '',
          monthlyRate: '',
          jobCategoryId: '',
          educationLevel: '',
          availability: '',
          languages: '',
          certifications: ''
        });
        setSelectedSkills([]);
        setSelectedLanguages([]);
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
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
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
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter last name"
          required
        />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Optional)
                </label>
                <input
          type="email"
                  name="email"
          value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email (optional)"
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
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                    errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+250788123456"
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
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                    errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
                )}
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
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                    errors.monthlyRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter monthly rate"
                />
                {errors.monthlyRate && (
                  <p className="text-red-500 text-sm mt-1">{errors.monthlyRate}</p>
                )}
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
                  <option value="Available">Available</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Not Available">Not Available</option>
                  <option value="Open to Opportunities">Open to Opportunities</option>
                </select>
              </div>
        </div>

            {/* Professional Skills Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills *
              </label>
              <div className="space-y-3">
                {/* Selected Skills Display */}
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleSkillRemove(skill)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
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
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Skills Selection */}
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
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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
              {errors.skills && (
                <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
              )}
            </div>

            {/* Experience and Description */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level *
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                    errors.experienceLevel ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select Experience Level</option>
                  {experienceLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                {errors.experienceLevel && (
                  <p className="text-red-500 text-sm mt-1">{errors.experienceLevel}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Details (Optional)
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your specific work experience, previous jobs, or relevant background"
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

        {/* Languages Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Languages
          </label>
          <div className="space-y-3">
            {/* Selected Languages Display */}
            {selectedLanguages.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedLanguages.map((language, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                  >
                    {language}
                    <button
                      type="button"
                      onClick={() => handleLanguageRemove(language)}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
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
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Languages Selection */}
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
                className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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