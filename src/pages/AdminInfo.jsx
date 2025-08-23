import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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
  User
} from 'lucide-react';
import Card from '../components/ui/Card';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const AdminInfo = () => {
  const { t } = useTranslation();

  const personalInfo = {
    name: t('adminInfo.cv.personal.name'),
    title: t('adminInfo.cv.title'),
    location: t('adminInfo.cv.personal.location'),
    email: t('adminInfo.cv.personal.email'),
    phone: t('adminInfo.cv.personal.phone'),
    linkedin: t('adminInfo.cv.personal.linkedin'),
    github: t('adminInfo.cv.personal.github')
  };

  const skills = [
    { category: 'frontend', items: ['React.js', 'Vue.js', 'Angular', 'TypeScript', 'Tailwind CSS', 'Next.js'] },
    { category: 'backend', items: ['Node.js', 'Express.js', 'Python', 'Django', 'PHP', 'Laravel'] },
    { category: 'database', items: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Prisma ORM'] },
    { category: 'devops', items: ['Docker', 'AWS', 'CI/CD', 'Git', 'Linux', 'Nginx'] }
  ];

  const experience = [
    {
      company: t('adminInfo.cv.experience.jobPortal.company'),
      position: t('adminInfo.cv.experience.jobPortal.title'),
      period: t('adminInfo.cv.experience.jobPortal.period'),
      description: t('adminInfo.cv.experience.jobPortal.description'),
      achievements: [
        t('adminInfo.cv.experience.jobPortal.achievement1'), 
        t('adminInfo.cv.experience.jobPortal.achievement2'), 
        t('adminInfo.cv.experience.jobPortal.achievement3')
      ]
    },
    {
      company: t('adminInfo.cv.experience.techSolutions.company'),
      position: t('adminInfo.cv.experience.techSolutions.title'),
      period: t('adminInfo.cv.experience.techSolutions.period'),
      description: t('adminInfo.cv.experience.techSolutions.description'),
      achievements: [
        t('adminInfo.cv.experience.techSolutions.achievement1'), 
        t('adminInfo.cv.experience.techSolutions.achievement2'), 
        t('adminInfo.cv.experience.techSolutions.achievement3')
      ]
    },
    {
      company: t('adminInfo.cv.experience.digitalInnovations.company'),
      position: t('adminInfo.cv.experience.digitalInnovations.title'),
      period: t('adminInfo.cv.experience.digitalInnovations.period'),
      description: t('adminInfo.cv.experience.digitalInnovations.description'),
      achievements: [
        t('adminInfo.cv.experience.digitalInnovations.achievement1'), 
        t('adminInfo.cv.experience.digitalInnovations.achievement2'), 
        t('adminInfo.cv.experience.digitalInnovations.achievement3')
      ]
    }
  ];

  const education = [
    {
      degree: t('adminInfo.cv.education.masters.degree'),
      school: t('adminInfo.cv.education.masters.school'),
      period: t('adminInfo.cv.education.masters.period'),
      description: t('adminInfo.cv.education.masters.description')
    },
    {
      degree: t('adminInfo.cv.education.bachelors.degree'),
      school: t('adminInfo.cv.education.bachelors.school'),
      period: t('adminInfo.cv.education.bachelors.period'),
      description: t('adminInfo.cv.education.bachelors.description')
    }
  ];

  const certifications = [
    { name: t('adminInfo.cv.certifications.aws.name'), issuer: t('adminInfo.cv.certifications.aws.issuer'), year: t('adminInfo.cv.certifications.aws.year') },
    { name: t('adminInfo.cv.certifications.azure.name'), issuer: t('adminInfo.cv.certifications.azure.issuer'), year: t('adminInfo.cv.certifications.azure.year') },
    { name: t('adminInfo.cv.certifications.scrum.name'), issuer: t('adminInfo.cv.certifications.scrum.issuer'), year: t('adminInfo.cv.certifications.scrum.year') },
    { name: t('adminInfo.cv.certifications.mongodb.name'), issuer: t('adminInfo.cv.certifications.mongodb.issuer'), year: t('adminInfo.cv.certifications.mongodb.year') }
  ];

  const projects = [
    {
      name: t('adminInfo.cv.projects.jobPortal.name'),
      description: t('adminInfo.cv.projects.jobPortal.description'),
      tech: t('adminInfo.cv.projects.jobPortal.tech').split(', '),
      status: 'live'
    },
    {
      name: t('adminInfo.cv.projects.elearning.name'),
      description: t('adminInfo.cv.projects.elearning.description'),
      tech: t('adminInfo.cv.projects.elearning.tech').split(', '),
      status: 'live'
    },
    {
      name: t('adminInfo.cv.projects.inventory.name'),
      description: t('adminInfo.cv.projects.inventory.description'),
      tech: t('adminInfo.cv.projects.inventory.tech').split(', '),
      status: 'live'
    }
  ];

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
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white bg-opacity-20 rounded-full mb-6">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{personalInfo.name}</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6">{t('adminInfo.cv.title')}</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{personalInfo.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{personalInfo.phone}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Sidebar - Personal Info & Skills */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* About Me */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  {t('adminInfo.cv.aboutMe.title')}
            </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('adminInfo.cv.aboutMe.description')}
            </p>
              </Card>
            </motion.div>
          
            {/* Skills */}
              <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  {t('adminInfo.cv.skills.title')}
                </h2>
                <div className="space-y-4">
                  {skills.map((skillGroup, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-800 mb-2">{t(`adminInfo.cv.skills.${skillGroup.category.toLowerCase()}`)}</h3>
                      <div className="flex flex-wrap gap-2">
                        {skillGroup.items.map((skill, skillIndex) => (
                          <span 
                            key={skillIndex}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {skill}
                          </span>
            ))}
          </div>
        </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  {t('adminInfo.cv.certifications.title')}
            </h2>
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-3">
                      <h4 className="font-semibold text-gray-800">{cert.name}</h4>
                      <p className="text-sm text-gray-600">{cert.issuer} • {cert.year}</p>
          </div>
                  ))}
                  </div>
                </Card>
              </motion.div>

            {/* Contact & Social */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  {t('adminInfo.cv.contact.title')}
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a href={`mailto:${personalInfo.email}`} className="text-blue-600 hover:text-blue-800">
                      {personalInfo.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <a href={`tel:${personalInfo.phone}`} className="text-blue-600 hover:text-blue-800">
                      {personalInfo.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{personalInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <GitBranch className="w-4 h-4 text-gray-500" />
                    <a href={`https://${personalInfo.github}`} className="text-blue-600 hover:text-blue-800">
                      {personalInfo.github}
                    </a>
                </div>
              </div>
              </Card>
            </motion.div>
          </div>

          {/* Main Content - Experience & Projects */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Professional Experience */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  {t('adminInfo.cv.experience.title')}
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
                      <ul className="list-disc list-inside space-y-1">
                        {exp.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} className="text-sm text-gray-600">{achievement}</li>
                        ))}
                      </ul>
                </div>
                  ))}
              </div>
              </Card>
            </motion.div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  {t('adminInfo.cv.education.title')}
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
          
            {/* Key Projects */}
              <motion.div
              initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Code className="w-6 h-6 text-blue-600" />
                  {t('adminInfo.cv.projects.title')}
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
                          {t(`adminInfo.cv.projectStatus.${project.status}`)}
                        </span>
                </div>
                      <p className="text-gray-700 mb-3 text-sm leading-relaxed">{project.description}</p>
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
        </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* System Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Server className="w-6 h-6 text-blue-600" />
                  {t('adminInfo.cv.systemPerformance.title')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">500+</div>
                    <div className="text-sm text-gray-600">{t('adminInfo.cv.stats.jobSeekers')}</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">98%</div>
                    <div className="text-sm text-gray-600">{t('adminInfo.cv.stats.uptime')}</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">50+</div>
                    <div className="text-sm text-gray-600">{t('adminInfo.cv.stats.companies')}</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 mb-1">5+</div>
                    <div className="text-sm text-gray-600">{t('adminInfo.cv.stats.experience')}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
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
          <h2 className="text-3xl font-bold mb-6">{t('adminInfo.cv.cta.title')}</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('adminInfo.cv.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => window.location.href = '/contact'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {t('adminInfo.cv.cta.getInTouch')}
            </motion.button>
            <motion.button
              onClick={() => window.location.href = '/job-seekers'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              {t('adminInfo.cv.cta.viewPlatform')}
            </motion.button>
          </div>
        </div>
      </motion.section>
      
      <Footer />
    </div>
  );
};

export default AdminInfo;
