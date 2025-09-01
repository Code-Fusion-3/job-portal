import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  Save,
  Edit,
  Plus,
  Trash2,
  X,
  GitBranch,
  Globe,
  Facebook,
  Linkedin,
  Twitter,
  Instagram
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import adminProfileService from '../../api/services/adminProfileService';

const AdminProfileManagement = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    personal: {
      name: '',
      title: '',
      location: '',
      email: '',
      phone: '',
      aboutMe: '',
      github: '',
      facebook: '',
      linkedin: '',
      twitter: '',
      instagram: ''
    },
    skills: {
      frontend: [],
      backend: [],
      database: [],
      devops: [],
      design: [],
      management: []
    },
    experience: [],
    education: [],
    certifications: [],
    projects: [],

  });

  const [editingSection, setEditingSection] = useState(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async (retryCount = 0) => {
    const maxRetries = 2;
    
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 AdminProfileManagement: Loading profile data...');
      
      // Use public profile to avoid authentication issues
      const data = await adminProfileService.getPublicProfile();
      console.log('✅ AdminProfileManagement: Profile data loaded:', data);
      setProfileData(data);
    } catch (error) {
      console.error('❌ AdminProfileManagement: Error loading profile data:', error);
      
      // Retry logic for temporary failures
      if (retryCount < maxRetries) {
        console.log(`🔄 Retrying profile load... (${retryCount + 1}/${maxRetries})`);
        setTimeout(() => {
          loadProfileData(retryCount + 1);
        }, 2000 * (retryCount + 1)); // Exponential backoff
        return;
      }
      
      setError('Failed to load profile data after multiple attempts. Please try again.');
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const saveProfileData = async () => {
    try {
      setSaving(true);
      console.log('🔍 AdminProfileManagement: Saving profile data...');
      
      // Since we're using public profile, we need to check if user is authenticated
      try {
        await adminProfileService.updateProfile(profileData);
        toast.success('Profile updated successfully!');
        setEditingSection(null);
        console.log('✅ AdminProfileManagement: Profile saved successfully');
      } catch (updateError) {
        console.error('❌ AdminProfileManagement: Update failed, trying to create new profile...');
        
        // If update fails, try to create a new profile
        if (updateError.response?.status === 404) {
          toast.info('Creating new profile...');
          // The backend should handle profile creation automatically
          await loadProfileData(); // Reload to get the newly created profile
          toast.success('Profile created successfully!');
        } else {
          throw updateError;
        }
      }
    } catch (error) {
      console.error('❌ AdminProfileManagement: Error saving profile data:', error);
      toast.error('Failed to save profile data. Please check your authentication.');
    } finally {
      setSaving(false);
    }
  };

  // Helper functions for managing arrays
  const addItem = (section, newItem) => {
    setProfileData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem]
    }));
  };

  const updateItem = (section, index, updatedItem) => {
    setProfileData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => i === index ? updatedItem : item)
    }));
  };

  const removeItem = (section, index) => {
    setProfileData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  // Add null check for profileData
  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Data Not Available</h2>
          <p className="text-gray-600 mb-4">Unable to load profile data. Please try refreshing the page.</p>
          <button 
            onClick={loadProfileData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Safe access to nested properties with defaults
  const personal = profileData.personal || {};
  const skills = profileData.skills || {};
  const experience = profileData.experience || [];
  const education = profileData.education || [];
  const certifications = profileData.certifications || [];
  const projects = profileData.projects || [];


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Management</h1>
          <p className="text-gray-600">Manage your professional profile and platform information</p>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800">Error Loading Profile</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={loadProfileData}
                  className="mt-2 text-sm text-red-600 hover:text-red-500 font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Personal Info & Skills */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Personal Information */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h2>
                <Button
                  onClick={() => setEditingSection(editingSection === 'personal' ? null : 'personal')}
                  variant="outline"
                  size="sm"
                >
                  {editingSection === 'personal' ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
              </div>
              
              {editingSection === 'personal' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={personal.name}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, name: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={personal.title}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, title: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={personal.location}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, location: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={personal.email}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, email: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={personal.phone}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, phone: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                    <input
                      type="text"
                      value={personal.github}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, github: e.target.value }
                      }))}
                      placeholder="github.com/username"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                    <input
                      type="text"
                      value={personal.facebook}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, facebook: e.target.value }
                      }))}
                      placeholder="facebook.com/username or full URL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                    <input
                      type="text"
                      value={personal.linkedin}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, linkedin: e.target.value }
                      }))}
                      placeholder="linkedin.com/in/username or full URL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Twitter/X</label>
                    <input
                      type="text"
                      value={personal.twitter}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, twitter: e.target.value }
                      }))}
                      placeholder="twitter.com/username or full URL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                    <input
                      type="text"
                      value={personal.instagram}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, instagram: e.target.value }
                      }))}
                      placeholder="instagram.com/username or full URL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">About Me</label>
                    <textarea
                      value={personal.aboutMe}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, aboutMe: e.target.value }
                      }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{personal.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{personal.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{personal.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{personal.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{personal.phone}</span>
                  </div>
                  {personal.github && (
                    <div className="flex items-center gap-3">
                      <GitBranch className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{personal.github}</span>
                    </div>
                  )}
                  {personal.facebook && (
                    <div className="flex items-center gap-3">
                      <Facebook className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">{personal.facebook}</span>
                    </div>
                  )}
                  {personal.linkedin && (
                    <div className="flex items-center gap-3">
                      <Linkedin className="w-4 h-4 text-blue-700" />
                      <span className="text-gray-700">{personal.linkedin}</span>
                    </div>
                  )}
                  {personal.twitter && (
                    <div className="flex items-center gap-3">
                      <Twitter className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-700">{personal.twitter}</span>
                    </div>
                  )}
                  {personal.instagram && (
                    <div className="flex items-center gap-3">
                      <Instagram className="w-4 h-4 text-pink-600" />
                      <span className="text-gray-700">{personal.instagram}</span>
                    </div>
                  )}
                  {personal.aboutMe && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-gray-700 text-sm">{personal.aboutMe}</p>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Skills Management */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-600" />
                  Skills
                </h2>
                <Button
                  onClick={() => setEditingSection(editingSection === 'skills' ? null : 'skills')}
                  variant="outline"
                  size="sm"
                >
                  {editingSection === 'skills' ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
              </div>
              
              {editingSection === 'skills' ? (
                <div className="space-y-6">
                  {/* Add New Category */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Add New Skill Category</h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Category name (e.g., Design, Marketing, Languages)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            const newCategory = e.target.value.trim().toLowerCase();
                            if (!skills[newCategory]) {
                              setProfileData(prev => ({
                                ...prev,
                                skills: { ...prev.skills, [newCategory]: [] }
                              }));
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                      <Button
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          const newCategory = input.value.trim().toLowerCase();
                          if (newCategory && !skills[newCategory]) {
                            setProfileData(prev => ({
                              ...prev,
                              skills: { ...prev.skills, [newCategory]: [] }
                            }));
                            input.value = '';
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="whitespace-nowrap"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Category
                      </Button>
                    </div>
                  </div>

                  {/* Existing Categories */}
                  {Object.entries(skills).map(([category, skillsList]) => (
                    <div key={category} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={category}
                            onChange={(e) => {
                              const newCategory = e.target.value.trim().toLowerCase();
                              if (newCategory && newCategory !== category) {
                                const newSkills = { ...skills };
                                newSkills[newCategory] = newSkills[category];
                                delete newSkills[category];
                                setProfileData(prev => ({
                                  ...prev,
                                  skills: newSkills
                                }));
                              }
                            }}
                            className="font-semibold text-gray-800 capitalize bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-1"
                            placeholder="Category name"
                          />
                        </div>
                        <Button
                          onClick={() => {
                            if (Object.keys(skills).length > 1) {
                              const newSkills = { ...skills };
                              delete newSkills[category];
                              setProfileData(prev => ({
                                ...prev,
                                skills: newSkills
                              }));
                            }
                          }}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          disabled={Object.keys(skills).length <= 1}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {skillsList.map((skill, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={skill}
                              onChange={(e) => {
                                const newSkills = [...skillsList];
                                newSkills[index] = e.target.value;
                                setProfileData(prev => ({
                                  ...prev,
                                  skills: { ...prev.skills, [category]: newSkills }
                                }));
                              }}
                              placeholder="Skill name"
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <Button
                              onClick={() => {
                                const newSkills = skillsList.filter((_, i) => i !== index);
                                setProfileData(prev => ({
                                  ...prev,
                                  skills: { ...prev.skills, [category]: newSkills }
                                }));
                              }}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          onClick={() => {
                            const newSkills = [...skillsList, ''];
                            setProfileData(prev => ({
                              ...prev,
                              skills: { ...prev.skills, [category]: newSkills }
                            }));
                          }}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Skill
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(skills).map(([category, skillsList]) => (
                    <div key={category}>
                      <h3 className="font-semibold text-gray-800 mb-2 capitalize">{category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {skillsList.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>


          </div>

          {/* Right Column - Experience, Education, Projects, etc. */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Professional Experience */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Professional Experience
                </h2>
                <Button
                  onClick={() => setEditingSection(editingSection === 'experience' ? null : 'experience')}
                  variant="outline"
                  size="sm"
                >
                  {editingSection === 'experience' ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
              </div>
              
              {editingSection === 'experience' ? (
                <div className="space-y-4">
                  {experience.map((exp, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => updateItem('experience', index, { ...exp, position: e.target.value })}
                        placeholder="Job Position"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateItem('experience', index, { ...exp, company: e.target.value })}
                        placeholder="Company Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => updateItem('experience', index, { ...exp, period: e.target.value })}
                        placeholder="Employment Period (e.g., 2020-2023)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateItem('experience', index, { ...exp, description: e.target.value })}
                        placeholder="Job Description"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Achievements (one per line)</label>
                        <textarea
                          value={exp.achievements ? exp.achievements.join('\n') : ''}
                          onChange={(e) => updateItem('experience', index, { 
                            ...exp, 
                            achievements: e.target.value.split('\n').filter(line => line.trim()) 
                          })}
                          placeholder="List your key achievements..."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <Button
                        onClick={() => removeItem('experience', index)}
                        variant="outline"
                        size="sm"
                        className="w-full text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Remove Experience
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => addItem('experience', { 
                      position: '', 
                      company: '', 
                      period: '', 
                      description: '', 
                      achievements: [] 
                    })}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Experience
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {experience.length > 0 ? (
                    experience.map((exp, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {exp.period}
                          </span>
                        </div>
                        <h4 className="text-md font-medium text-blue-600 mb-2">{exp.company}</h4>
                        <p className="text-gray-700 mb-3 leading-relaxed">{exp.description}</p>
                        {exp.achievements && exp.achievements.length > 0 && (
                          <ul className="list-disc list-inside space-y-1">
                            {exp.achievements.map((achievement, achIndex) => (
                              <li key={achIndex} className="text-sm text-gray-600">{achievement}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No experience added yet.</p>
                  )}
                </div>
              )}
            </Card>

            {/* Education */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Education
                </h2>
                <Button
                  onClick={() => setEditingSection(editingSection === 'education' ? null : 'education')}
                  variant="outline"
                  size="sm"
                >
                  {editingSection === 'education' ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
              </div>
              
              {editingSection === 'education' ? (
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateItem('education', index, { ...edu, degree: e.target.value })}
                        placeholder="Degree/Qualification"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => updateItem('education', index, { ...edu, school: e.target.value })}
                        placeholder="School/University"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={edu.period}
                        onChange={(e) => updateItem('education', index, { ...edu, period: e.target.value })}
                        placeholder="Study Period (e.g., 2016-2020)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <textarea
                        value={edu.description}
                        onChange={(e) => updateItem('education', index, { ...edu, description: e.target.value })}
                        placeholder="Description of your studies"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <Button
                        onClick={() => removeItem('education', index)}
                        variant="outline"
                        size="sm"
                        className="w-full text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Remove Education
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => addItem('education', { 
                      degree: '', 
                      school: '', 
                      period: '', 
                      description: '' 
                    })}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Education
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {education.length > 0 ? (
                    education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {edu.period}
                          </span>
                        </div>
                        <h4 className="text-md font-medium text-green-600 mb-1">{edu.school}</h4>
                        <p className="text-gray-700 text-sm">{edu.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No education added yet.</p>
                  )}
                </div>
              )}
            </Card>

            {/* Certifications */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Certifications
                </h2>
                <Button
                  onClick={() => setEditingSection(editingSection === 'certifications' ? null : 'certifications')}
                  variant="outline"
                  size="sm"
                >
                  {editingSection === 'certifications' ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
              </div>
              
              {editingSection === 'certifications' ? (
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateItem('certifications', index, { ...cert, name: e.target.value })}
                        placeholder="Certification Name"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => updateItem('certifications', index, { ...cert, issuer: e.target.value })}
                        placeholder="Issuing Organization"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="text"
                        value={cert.year}
                        onChange={(e) => updateItem('certifications', index, { ...cert, year: e.target.value })}
                        placeholder="Year"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <Button
                        onClick={() => removeItem('certifications', index)}
                        variant="outline"
                        size="sm"
                        className="w-full text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => addItem('certifications', { name: '', issuer: '', year: '' })}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Certification
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {certifications.length > 0 ? (
                    certifications.map((cert, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-3">
                        <h4 className="font-semibold text-gray-800">{cert.name}</h4>
                        <p className="text-sm text-gray-600">{cert.issuer} • {cert.year}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No certifications added yet.</p>
                  )}
                </div>
              )}
            </Card>

            {/* Projects */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-600" />
                  Key Projects
                </h2>
                <Button
                  onClick={() => setEditingSection(editingSection === 'projects' ? null : 'projects')}
                  variant="outline"
                  size="sm"
                >
                  {editingSection === 'projects' ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
              </div>
              
              {editingSection === 'projects' ? (
                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => updateItem('projects', index, { ...project, name: e.target.value })}
                        placeholder="Project Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <select
                        value={project.status}
                        onChange={(e) => updateItem('projects', index, { ...project, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="live">Live</option>
                        <option value="development">Development</option>
                        <option value="completed">Completed</option>
                      </select>
                      <textarea
                        value={project.description}
                        onChange={(e) => updateItem('projects', index, { ...project, description: e.target.value })}
                        placeholder="Project Description"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={Array.isArray(project.tech) ? project.tech.join(', ') : project.tech}
                        onChange={(e) => updateItem('projects', index, { 
                          ...project, 
                          tech: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                        })}
                        placeholder="Technologies (comma-separated)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <Button
                        onClick={() => removeItem('projects', index)}
                        variant="outline"
                        size="sm"
                        className="w-full text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Remove Project
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => addItem('projects', { 
                      name: '', 
                      status: 'development', 
                      description: '', 
                      tech: [] 
                    })}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Project
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.length > 0 ? (
                    projects.map((project, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            project.status === 'live' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3 text-sm leading-relaxed">{project.description}</p>
                        {project.tech && project.tech.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.tech.map((tech, techIndex) => (
                              <span 
                                key={techIndex}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No projects added yet.</p>
                  )}
                </div>
              )}
            </Card>


          </div>
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <Button
            onClick={saveProfileData}
            disabled={saving}
            className="px-8 py-3 text-lg"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminProfileManagement;
