import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { User, MapPin, Briefcase, Eye, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

const LatestJobSeekers = () => {
  const { t } = useTranslation();

  // Mock data for job seekers
  const jobSeekers = [
    {
      id: 1,
      name: "Alice Uwimana",
      title: "Software Engineer",
      location: t('jobSeekers.location'),
      experience: "3 " + t('jobSeekers.experience'),
      skills: ["React", "Node.js", "Python"],
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Jean Pierre Ndayisaba",
      title: "Data Scientist",
      location: t('jobSeekers.location'),
      experience: "5 " + t('jobSeekers.experience'),
      skills: ["Python", "Machine Learning", "SQL"],
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Marie Claire Uwineza",
      title: "UX/UI Designer",
      location: t('jobSeekers.location'),
      experience: "2 " + t('jobSeekers.experience'),
      skills: ["Figma", "Adobe XD", "Prototyping"],
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Emmanuel Niyonshuti",
      title: "Product Manager",
      location: t('jobSeekers.location'),
      experience: "4 " + t('jobSeekers.experience'),
      skills: ["Agile", "Product Strategy", "Analytics"],
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="job-seekers" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('jobSeekers.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('jobSeekers.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {jobSeekers.map((seeker) => (
            <motion.div
              key={seeker.id}
              variants={cardVariants}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden job-seeker-card"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={seeker.avatar}
                    alt={seeker.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{seeker.name}</h3>
                    <p className="text-sm text-gray-600">{seeker.title}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {seeker.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {seeker.experience} experience
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {seeker.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group"
                >
                  <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  View Profile
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link to="/job-seekers">
            <Button as="div" variant="outline" size="lg" className="group" onClick={() => console.log('View More button clicked!')}>
              {t('jobSeekers.viewMore')}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestJobSeekers; 