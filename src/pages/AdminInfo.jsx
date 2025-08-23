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
    name: 'Jean Pierre Uwimana',
    title: 'Senior Full-Stack Developer & System Administrator',
    location: 'Kigali, Rwanda',
    email: 'jean.uwimana@jobportal.rw',
    phone: '+250 788 123 456',
    linkedin: 'linkedin.com/in/jean-uwimana',
    github: 'github.com/jean-uwimana'
  };

  const skills = [
    { category: 'Frontend', items: ['React.js', 'Vue.js', 'Angular', 'TypeScript', 'Tailwind CSS', 'Next.js'] },
    { category: 'Backend', items: ['Node.js', 'Express.js', 'Python', 'Django', 'PHP', 'Laravel'] },
    { category: 'Database', items: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Prisma ORM'] },
    { category: 'DevOps', items: ['Docker', 'AWS', 'CI/CD', 'Git', 'Linux', 'Nginx'] }
  ];

  const experience = [
    {
      company: 'Job Portal Rwanda',
      position: 'Lead Developer & System Administrator',
      period: '2023 - Present',
      description: 'Architected and developed a comprehensive job portal platform serving 500+ job seekers and 50+ companies. Implemented secure authentication, real-time messaging, and admin approval workflows.',
      achievements: ['Reduced system downtime by 95%', 'Improved user engagement by 40%', 'Implemented automated approval system']
    },
    {
      company: 'Tech Solutions Rwanda',
      position: 'Senior Software Engineer',
      period: '2021 - 2023',
      description: 'Led development of enterprise applications and provided technical leadership to junior developers.',
      achievements: ['Led 5+ major projects', 'Mentored 8 junior developers', 'Improved code quality by 60%']
    },
    {
      company: 'Digital Innovations Ltd',
      position: 'Full-Stack Developer',
      period: '2019 - 2021',
      description: 'Developed web applications and mobile apps using modern technologies and best practices.',
      achievements: ['Built 10+ client applications', 'Implemented CI/CD pipelines', 'Reduced deployment time by 70%']
    }
  ];

  const education = [
    {
      degree: 'Master of Computer Science',
      school: 'University of Rwanda',
      period: '2017 - 2019',
      description: 'Specialized in Software Engineering and Distributed Systems'
    },
    {
      degree: 'Bachelor of Computer Science',
      school: 'University of Rwanda',
      period: '2013 - 2017',
      description: 'Major in Computer Science with minor in Mathematics'
    }
  ];

  const certifications = [
    { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2023' },
    { name: 'Microsoft Certified: Azure Developer', issuer: 'Microsoft', year: '2022' },
    { name: 'Certified Scrum Master (CSM)', issuer: 'Scrum Alliance', year: '2021' },
    { name: 'MongoDB Certified Developer', issuer: 'MongoDB University', year: '2020' }
  ];

  const projects = [
    {
      name: 'Job Portal Platform',
      description: 'Full-stack job portal with real-time messaging, admin approval workflows, and advanced search capabilities.',
      tech: ['React', 'Node.js', 'PostgreSQL', 'Socket.io', 'Redis'],
      status: 'Live Production'
    },
    {
      name: 'E-Learning Management System',
      description: 'Comprehensive LMS platform supporting 1000+ students with course management and progress tracking.',
      tech: ['Vue.js', 'Django', 'PostgreSQL', 'Celery', 'Docker'],
      status: 'Live Production'
    },
    {
      name: 'Inventory Management System',
      description: 'Enterprise inventory solution with barcode scanning, reporting, and multi-warehouse support.',
      tech: ['React Native', 'Node.js', 'MongoDB', 'Express', 'JWT'],
      status: 'Live Production'
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
            <p className="text-xl md:text-2xl text-blue-100 mb-6">{personalInfo.title}</p>
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
                  About Me
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Passionate full-stack developer with 5+ years of experience building scalable web applications. 
                  Specialized in modern JavaScript frameworks, cloud architecture, and DevOps practices. 
                  Committed to writing clean, maintainable code and mentoring junior developers.
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
                  Technical Skills
                </h2>
                <div className="space-y-4">
                  {skills.map((skillGroup, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-800 mb-2">{skillGroup.category}</h3>
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
                  Certifications
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
                  Contact & Social
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

            {/* Key Projects */}
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
                          project.status === 'Live Production' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.status}
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
                  System Performance
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">500+</div>
                    <div className="text-sm text-gray-600">Job Seekers</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">98%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">50+</div>
                    <div className="text-sm text-gray-600">Companies</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 mb-1">5+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
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
          <h2 className="text-3xl font-bold mb-6">Ready to Work Together?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            I'm always open to discussing new opportunities, interesting projects, and innovative ideas.
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
