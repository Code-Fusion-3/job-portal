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
  BookmarkPlus,
  CheckCircle,
  ExternalLink,
  DollarSign,
  UserCheck
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
import jobseekerBackground from '../assets/jobseekerBackground.png';

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
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${jobseekerBackground})` }}
      >
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
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${jobseekerBackground})` }}
      >
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
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${jobseekerBackground})` }}
    >
      <Header />
      
      {/* Hero Section with Background */}
      <div className="relative backdrop-blur-sm">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
            <BackButton className="text-white hover:text-gray-200" />
            
            {/* Profile Hero Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-2xl p-8 mt-6"
            >
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Avatar Section */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <Avatar 
                    src={isPublic ? jobSeeker.photo : jobSeeker?.profile?.photo}
                    alt={isPublic ? `${jobSeeker.firstName} ${jobSeeker.lastName}` : `${jobSeeker?.profile?.firstName} ${jobSeeker?.profile?.lastName}`}
                    size="xl"
                    fallback={isPublic ? `${jobSeeker.firstName} ${jobSeeker.lastName}` : `${jobSeeker?.profile?.firstName} ${jobSeeker?.profile?.lastName}`}
                    className="w-32 h-32 ring-4 ring-white shadow-lg"
                  />
                  {!isPublic && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-4xl font-bold text-gray-900">
                        {isPublic
                          ? `${jobSeeker.firstName} ${jobSeeker.lastName}`
                          : `${jobSeeker?.profile?.firstName} ${jobSeeker?.profile?.lastName}`}
                      </h1>
                      {user?.role === 'admin' && (
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleBookmark} 
                            className={`p-2 rounded-full ${isBookmarked ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-gray-600'}`}
                          >
                            {isBookmarked ? <Bookmark className="w-5 h-5 fill-current" /> : <BookmarkPlus className="w-5 h-5" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleShare}
                            className="p-2 rounded-full text-gray-400 hover:text-gray-600"
                          >
                            <Share2 className="w-5 h-5" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xl text-blue-600 font-semibold mb-4">
                      {isPublic
                        ? jobSeeker.jobCategory?.name_en || 'Job Seeker'
                        : jobSeeker?.profile?.jobCategory?.name_en || 'Job Seeker'}
                    </p>

                    {/* Key Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">
                          {isPublic ? jobSeeker.location : jobSeeker?.profile?.location || 'Location not specified'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Briefcase className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">
                          {isPublic ? jobSeeker.experience : jobSeeker?.profile?.experience || 'Experience not specified'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium">
                          {isPublic ? jobSeeker.availability : jobSeeker?.profile?.availability || 'Availability not specified'}
                        </span>
                      </div>
                      {isPublic && jobSeeker.memberSince && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium">
                            Member since {new Date(jobSeeker.memberSince).toLocaleString('default', { month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      )}
                    </div>

                                         {/* Rate Display */}
                     <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-2">
                           <DollarSign className="w-5 h-5 text-blue-600" />
                           <span className="text-sm font-medium text-gray-700">Monthly Rate</span>
                         </div>
                         <span className="text-2xl font-bold text-blue-600">
                           {formatMonthlyRate(isPublic ? jobSeeker.monthlyRate : jobSeeker?.profile?.monthlyRate)}
                         </span>
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

             {/* Main Content */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
                     <div className="lg:col-span-2 space-y-6">
             {/* Combined Profile Information Section */}
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
               <Card className="p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border-0">
                 <div className="flex items-center space-x-3 mb-8">
                   <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                     <UserCheck className="w-6 h-6 text-white" />
                   </div>
                   <h2 className="text-3xl font-bold text-gray-900">Profile Information</h2>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {/* Left Column */}
                   <div className="space-y-6">
                     {/* About Section */}
                     <div>
                       <div className="flex items-center space-x-3 mb-4">
                         <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                           <UserCheck className="w-4 h-4 text-blue-600" />
                         </div>
                         <h3 className="text-xl font-semibold text-gray-900">About</h3>
                       </div>
                       <div className="bg-gray-50 rounded-xl p-4">
                         <p className="text-gray-700 leading-relaxed">
                           {isPublic ? jobSeeker.description : jobSeeker?.profile?.description || 'No description available'}
                         </p>
                       </div>
                     </div>

                     {/* Skills Section */}
                     <div>
                       <div className="flex items-center space-x-3 mb-4">
                         <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                           <Star className="w-4 h-4 text-purple-600" />
                         </div>
                         <h3 className="text-xl font-semibold text-gray-900">Skills & Expertise</h3>
                       </div>
                       <div className="flex flex-wrap gap-2">
                         {(isPublic ? jobSeeker.skills : jobSeeker?.profile?.skills)
                           ? (isPublic ? jobSeeker.skills : jobSeeker?.profile?.skills).split(',').map((skill, index) => (
                               <Badge key={index} variant="primary" size="md" className="px-3 py-1 text-sm font-medium bg-blue-500 text-white border-0">
                                 {skill.trim()}
                               </Badge>
                             ))
                           : <p className="text-gray-500">No skills listed</p>}
                       </div>
                     </div>

                     {/* References Section */}
                     {isPublic && jobSeeker.references && (
                       <div>
                         <div className="flex items-center space-x-3 mb-4">
                           <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                             <Users className="w-4 h-4 text-green-600" />
                           </div>
                           <h3 className="text-xl font-semibold text-gray-900">References</h3>
                         </div>
                         <div className="bg-gray-50 rounded-xl p-4">
                           <p className="text-gray-700 leading-relaxed text-sm">{jobSeeker.references}</p>
                         </div>
                       </div>
                     )}
                   </div>

                   {/* Right Column */}
                   <div className="space-y-6">
                     {/* Education & Certifications */}
                     <div>
                       <div className="flex items-center space-x-3 mb-4">
                         <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                           <GraduationCap className="w-4 h-4 text-indigo-600" />
                         </div>
                         <h3 className="text-xl font-semibold text-gray-900">Education & Certifications</h3>
                       </div>
                       <div className="space-y-4">
                         <div className="bg-blue-50 rounded-xl p-4">
                           <div className="flex items-center mb-2">
                             <GraduationCap className="w-4 h-4 mr-2 text-blue-600" />
                             <span className="font-semibold text-gray-900 text-sm">Education</span>
                           </div>
                           <p className="text-gray-700 text-sm">{isPublic ? jobSeeker.educationLevel : jobSeeker?.profile?.educationLevel}</p>
                         </div>
                         <div className="bg-green-50 rounded-xl p-4">
                           <div className="flex items-center mb-2">
                             <Award className="w-4 h-4 mr-2 text-green-600" />
                             <span className="font-semibold text-gray-900 text-sm">Certifications</span>
                           </div>
                           <div className="space-y-1">
                             {(() => {
                               const certs = isPublic ? jobSeeker.certifications : jobSeeker?.profile?.certifications;
                               if (Array.isArray(certs) && certs.length > 0) {
                                 return certs.map((cert, index) => (
                                   <p key={index} className="text-gray-700 text-sm">{cert}</p>
                                 ));
                               } else if (certs && typeof certs === 'string' && certs.trim() !== '') {
                                 return certs.split(',').map((cert, index) => (
                                   <p key={index} className="text-gray-700 text-sm">{cert.trim()}</p>
                                 ));
                               } else {
                                 return <p className="text-gray-500 text-sm">No certifications listed</p>;
                               }
                             })()}
                           </div>
                         </div>
                       </div>
                     </div>

                     {/* Languages */}
                     <div>
                       <div className="flex items-center space-x-3 mb-4">
                         <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                           <Globe className="w-4 h-4 text-orange-600" />
                         </div>
                         <h3 className="text-xl font-semibold text-gray-900">Languages</h3>
                       </div>
                       <div className="flex flex-wrap gap-2">
                         {(() => {
                           const langs = isPublic ? jobSeeker.languages : jobSeeker?.profile?.languages;
                           if (Array.isArray(langs) && langs.length > 0) {
                             return langs.map((language, index) => (
                               <Badge key={index} variant="outline" size="md" className="px-3 py-1 text-sm font-medium border-orange-200 text-orange-700 bg-orange-50">
                                 {language}
                               </Badge>
                             ));
                           } else if (langs && typeof langs === 'string' && langs.trim() !== '') {
                             return langs.split(',').map((language, index) => (
                               <Badge key={index} variant="outline" size="md" className="px-3 py-1 text-sm font-medium border-orange-200 text-orange-700 bg-orange-50">
                                 {language.trim()}
                               </Badge>
                             ));
                           } else {
                             return <p className="text-gray-500 text-sm">No languages listed</p>;
                           }
                         })()}
                       </div>
                     </div>
                   </div>
                 </div>
               </Card>
             </motion.div>
           </div>

          {/* Sticky Sidebar */}
          <div className="space-y-6">
            {/* Contact Information - Only for authenticated users */}
            {!isPublic && (
                             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                 <Card className="p-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border-0 sticky top-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
                    </div>
                    {user?.role === 'admin' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowContact(!showContact)}
                        className="p-2 rounded-full hover:bg-gray-100"
                      >
                        {showContact ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                  {showContact ? (
                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-4 h-4 mr-3 text-blue-500" />
                        <span className="text-sm text-gray-700">{jobSeeker.contact?.email}</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-4 h-4 mr-3 text-green-500" />
                        <span className="text-sm text-gray-700">{jobSeeker.contact?.phone}</span>
                      </div>
                      {jobSeeker.contact?.linkedin && (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Linkedin className="w-4 h-4 mr-3 text-blue-600" />
                          <a 
                            href={`https://${jobSeeker.contact.linkedin}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                          >
                            {jobSeeker.contact.linkedin}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Eye className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Contact information is hidden</p>
                      <p className="text-xs text-gray-400">Click to reveal</p>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {/* Action Buttons - Sticky */}
                         <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
               <Card className="p-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border-0 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                                     <Button 
                     variant="primary" 
                     size="lg" 
                     className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg" 
                     onClick={handleRequestCandidate}
                   >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Request Candidate
                  </Button>
                  {user?.role === 'admin' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full border-2 border-gray-200 hover:border-gray-300 font-semibold py-3 rounded-xl"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download CV
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full border-2 border-gray-200 hover:border-gray-300 font-semibold py-3 rounded-xl" 
                        onClick={handleShare}
                      >
                        <Share2 className="w-5 h-5 mr-2" />
                        Share Profile
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewProfile; 