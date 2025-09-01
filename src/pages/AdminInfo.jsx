import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Award, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  CheckCircle,
  Star,
  TrendingUp,
  Heart,
  Briefcase,
  GraduationCap,
  Code,
  Database,
  Server,
  Cloud,
  GitBranch,
  Zap,
  User,
  Facebook,
  Linkedin,
  Twitter,
  Instagram
} from 'lucide-react';
import Card from '../components/ui/Card';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import defaultProfileImage from '../assets/adminProfile.jpg';
import adminProfileService from '../api/services/adminProfileService';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const AdminInfo = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const data = await adminProfileService.getPublicProfile();
      setProfileData(data);
    } catch (error) {
      console.error('Error loading profile data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Available</h2>
          <p className="text-gray-600 mb-4">{error || 'Profile data could not be loaded'}</p>
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

  const { personal, skills, experience, education, certifications, projects } = profileData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* CV Header */}
      <motion.section 
        className="relative py-16 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <motion.div
              className="inline-flex items-center justify-center mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white border-opacity-30 shadow-2xl">
                  <img 
                    src={defaultProfileImage} 
                    alt={`${personal.name} - ${personal.title}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = defaultProfileImage;
                    }}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{personal.name}</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6">{personal.title}</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {personal.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{personal.location}</span>
                </div>
              )}
              {personal.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{personal.email}</span>
                </div>
              )}
              {personal.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{personal.phone}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Sidebar - Personal Info & Skills */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* About Me - Only show if aboutMe exists */}
            {personal.aboutMe && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    About Me
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {personal.aboutMe}
                  </p>
                </Card>
              </motion.div>
            )}
          
            {/* Skills - Only show if skills exist and have content */}
            {skills && Object.keys(skills).length > 0 && Object.values(skills).some(skillList => skillList && skillList.length > 0) && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    Skills
                  </h2>
                  <div className="space-y-4">
                    {Object.entries(skills).map(([category, skillList]) => (
                      skillList && skillList.length > 0 && (
                        <div key={category}>
                          <h3 className="font-semibold text-gray-800 mb-2 capitalize">{category}</h3>
                          <div className="flex flex-wrap gap-2">
                            {skillList.map((skill, skillIndex) => (
                              <span 
                                key={skillIndex}
                                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}



            {/* Social Media - Only show if social media links exist */}
            {(personal.facebook || personal.linkedin || personal.twitter || personal.instagram) && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Social Media
                  </h2>
                  <div className="space-y-3">
                    {personal.facebook && (
                      <div className="flex items-center gap-3">
                        <Facebook className="w-4 h-4 text-blue-600" />
                        <a href={personal.facebook.startsWith('http') ? personal.facebook : `https://${personal.facebook}`} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800">
                          {personal.facebook.includes('facebook.com') ? 'Facebook Profile' : personal.facebook}
                        </a>
                      </div>
                    )}
                    {personal.linkedin && (
                      <div className="flex items-center gap-3">
                        <Linkedin className="w-4 h-4 text-blue-700" />
                        <a href={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800">
                          {personal.linkedin.includes('linkedin.com') ? 'LinkedIn Profile' : personal.linkedin}
                        </a>
                      </div>
                    )}
                    {personal.twitter && (
                      <div className="flex items-center gap-3">
                        <Twitter className="w-4 h-4 text-blue-400" />
                        <a href={personal.twitter.startsWith('http') ? personal.twitter : `https://${personal.twitter}`} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800">
                          {personal.twitter.includes('twitter.com') ? 'Twitter Profile' : personal.twitter}
                        </a>
                      </div>
                    )}
                    {personal.instagram && (
                      <div className="flex items-center gap-3">
                        <Instagram className="w-4 h-4 text-pink-600" />
                        <a href={personal.instagram.startsWith('http') ? personal.instagram : `https://${personal.instagram}`} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800">
                          {personal.instagram.includes('instagram.com') ? 'Instagram Profile' : personal.instagram}
                        </a>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Main Content - Experience & Projects */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Professional Experience - Only show if experience exists and has content */}
            {experience && experience.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                    Professional Experience
                  </h2>
                  <div className="space-y-6">
                    {experience.map((exp, index) => (
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
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Education - Only show if education exists and has content */}
            {education && education.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                    Education
                  </h2>
                  <div className="space-y-4">
                    {education.map((edu, index) => (
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
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Certifications - Only show if certifications exist and have content */}
            {certifications && certifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Award className="w-6 h-6 text-blue-600" />
                    Certifications
                  </h2>
                  <div className="space-y-4">
                    {certifications.map((cert, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {cert.year}
                          </span>
                        </div>
                        <h4 className="text-md font-medium text-blue-600 mb-1">{cert.issuer}</h4>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          
            {/* Key Projects - Only show if projects exist and have content */}
            {projects && projects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Code className="w-6 h-6 text-blue-600" />
                    Key Projects
                  </h2>
                  <div className="space-y-4">
                    {projects.map((project, index) => (
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
                        {project.tech && (
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(project.tech) ? project.tech.map((tech, techIndex) => (
                              <span 
                                key={techIndex}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {tech}
                              </span>
                            )) : (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {project.tech}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.section 
        className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let's work together to find the perfect candidates for your organization or explore our platform's capabilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => window.location.href = '/contact'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Get In Touch
            </motion.button>
            <motion.button
              onClick={() => window.location.href = '/job-seekers'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              View Platform
            </motion.button>
          </div>
        </div>
      </motion.section>
      
      <Footer />
    </div>
  );
};

export default AdminInfo;
