import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Briefcase, 
  Star, 
  Clock, 
  Globe, 
  GraduationCap, 
  Award, 
  Mail, 
  Phone, 
  Linkedin, 
  Eye, 
  EyeOff,
  Calendar,
  Users,
  TrendingUp,
  MessageSquare,
  Download,
  Share2,
  Bookmark,
  BookmarkPlus
} from 'lucide-react';
import { jobSeekerService } from '../api/index.js';
import { useAuth } from '../api/hooks/useAuth.js';
import { maskName } from '../utils/helpers.js';
import Button from '../components/ui/Button';
import BackButton from '../components/ui/BackButton';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatDailyRate, formatMonthlyRate } from '../utils/helpers';

const ViewProfile = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobSeeker, setJobSeeker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchJobSeeker = async () => {
      setLoading(true);
      try {
        let result;
        if (!user) {
          // Public user: fetch anonymized data
          result = await jobSeekerService.getPublicJobSeekerById(id);
        } else {
          // Authenticated user: fetch full data
          let numericId = id;
          if (typeof id === 'string' && id.startsWith('JS')) {
            numericId = parseInt(id.replace(/^JS/, ''), 10);
          }
          result = await jobSeekerService.getJobSeekerById(numericId);
        }
        if (result && result.success) {
          setJobSeeker(result.data);
        } else {
          navigate('/job-seekers');
        }
      } catch (error) {
        console.error('Error fetching job seeker:', error);
        navigate('/job-seekers');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobSeeker();
    }
  }, [id, navigate, user]);

  const handleRequestCandidate = () => {
    navigate(`/employer-request/${id}`);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In real app, this would save to backend
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${jobSeeker?.name} - ${jobSeeker?.title}`,
        text: `Check out ${jobSeeker?.name}'s profile on Job Portal`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Helper to check if public (anonymized) data is being used
  const isPublic = !user && jobSeeker && jobSeeker.id && jobSeeker.id.startsWith('JS');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" text="Loading profile..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (!jobSeeker) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">The profile you're looking for doesn't exist.</p>
            <BackButton />
          </div>
        </div>
        <Footer />
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <BackButton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  <Avatar 
                    src={isPublic ? jobSeeker.photo : jobSeeker?.profile?.photo}
                    alt={isPublic ? `${jobSeeker.firstName} ${jobSeeker.lastName}` : `${jobSeeker?.profile?.firstName} ${jobSeeker?.profile?.lastName}`}
                    size="xl"
                    fallback={isPublic ? `${jobSeeker.firstName} ${jobSeeker.lastName}` : `${jobSeeker?.profile?.firstName} ${jobSeeker?.profile?.lastName}`}
                    className="flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                          {isPublic
                            ? `${jobSeeker.firstName} ${jobSeeker.lastName}`
                            : `${jobSeeker?.profile?.firstName} ${jobSeeker?.profile?.lastName}`}
                        </h1>
                        <p className="text-xl text-gray-600 mb-3">
                          {isPublic
                            ? jobSeeker.jobCategory?.name_en || 'Job Seeker'
                            : jobSeeker?.profile?.jobCategory?.name_en || 'Job Seeker'}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {isPublic ? jobSeeker.location : jobSeeker?.profile?.location || 'Location not specified'}
                          </span>
                          <span className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {isPublic ? jobSeeker.experience : jobSeeker?.profile?.experience || 'Experience not specified'}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {isPublic ? jobSeeker.availability : jobSeeker?.profile?.availability || 'Availability not specified'}
                          </span>
                          {isPublic && jobSeeker.memberSince && (
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {`Member since ${new Date(jobSeeker.memberSince).toLocaleString('default', { month: 'long', year: 'numeric' })}`}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 mt-4 md:mt-0">
                        {user?.role === 'admin' && (
                          <>
                            <Button variant="outline" size="sm" onClick={handleBookmark} className={isBookmarked ? 'text-red-600 border-red-600' : ''}>
                              {isBookmarked ? <Bookmark className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleShare}>
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
            {/* About Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-600 leading-relaxed">
                  {isPublic ? jobSeeker.description : jobSeeker?.profile?.description || 'No description available'}
                </p>
              </Card>
            </motion.div>
            {/* Skills Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills & Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {(isPublic ? jobSeeker.skills : jobSeeker?.profile?.skills)
                    ? (isPublic ? jobSeeker.skills : jobSeeker?.profile?.skills).split(',').map((skill, index) => (
                        <Badge key={index} variant="primary" size="md">
                          {skill.trim()}
                        </Badge>
                      ))
                    : <p className="text-gray-500">No skills listed</p>}
                </div>
              </Card>
            </motion.div>
            {/* References Section */}
            {isPublic && jobSeeker.references && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">References</h2>
                  <div className="space-y-2">
                    <p className="text-gray-600">{jobSeeker.references}</p>
                  </div>
                </Card>
              </motion.div>
            )}
            {/* Education & Certifications */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Education & Certifications</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <GraduationCap className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="font-medium text-gray-900">Education</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">{isPublic ? jobSeeker.educationLevel : jobSeeker?.profile?.educationLevel}</p>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <Award className="w-4 h-4 mr-2 text-green-600" />
                      <span className="font-medium text-gray-900">Certifications</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      {(() => {
                        const certs = isPublic ? jobSeeker.certifications : jobSeeker?.profile?.certifications;
                        if (Array.isArray(certs) && certs.length > 0) {
                          return certs.map((cert, index) => (
                            <p key={index} className="text-sm text-gray-600">{cert}</p>
                          ));
                        } else if (certs && typeof certs === 'string' && certs.trim() !== '') {
                          return certs.split(',').map((cert, index) => (
                            <p key={index} className="text-sm text-gray-600">{cert.trim()}</p>
                          ));
                        } else {
                          return <p className="text-sm text-gray-400">No certifications listed</p>;
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
            {/* Languages */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const langs = isPublic ? jobSeeker.languages : jobSeeker?.profile?.languages;
                    if (Array.isArray(langs) && langs.length > 0) {
                      return langs.map((language, index) => (
                        <Badge key={index} variant="outline" size="sm">
                          {language}
                        </Badge>
                      ));
                    } else if (langs && typeof langs === 'string' && langs.trim() !== '') {
                      return langs.split(',').map((language, index) => (
                        <Badge key={index} variant="outline" size="sm">
                          {language.trim()}
                        </Badge>
                      ));
                    } else {
                      return <p className="text-sm text-gray-400">No languages listed</p>;
                    }
                  })()}
                </div>
              </Card>
            </motion.div>
            {/* Rate & Availability */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Rate & Availability</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monthly Rate:</span>
                    <span className="font-semibold text-gray-900">{formatMonthlyRate(isPublic ? jobSeeker.monthlyRate : jobSeeker?.profile?.monthlyRate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Availability:</span>
                    <span className="font-semibold text-green-600">{isPublic ? jobSeeker.availability : jobSeeker?.profile?.availability}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
            {/* Action Buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="space-y-3">
              <Button variant="primary" size="lg" className="w-full" onClick={handleRequestCandidate}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Request Candidate
              </Button>
              {user?.role === 'admin' && (
                <>
                  <Button variant="outline" size="lg" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download CV
                  </Button>
                  <Button variant="outline" size="lg" className="w-full" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                </>
              )}
            </motion.div>
          </div>
          {/* Sidebar: Hide for public profiles */}
          {!isPublic && (
            <div className="space-y-6">
              {/* Contact Information */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                    {user?.role === 'admin' && (
                      <Button variant="ghost" size="sm" onClick={() => setShowContact(!showContact)}>
                        {showContact ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                  {showContact ? (
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-gray-600">{jobSeeker.contact?.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-gray-600">{jobSeeker.contact?.phone}</span>
                      </div>
                      {jobSeeker.contact?.linkedin && (
                        <div className="flex items-center text-sm">
                          <Linkedin className="w-4 h-4 mr-3 text-gray-400" />
                          <a href={`https://${jobSeeker.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            {jobSeeker.contact.linkedin}
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Eye className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Contact information is hidden</p>
                      <p className="text-xs text-gray-400 mt-1">Click to reveal</p>
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewProfile; 