import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const [error, setError] = useState(null);
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
          setError(result?.error || t('viewProfile.errors.notAvailable'));
        }
      } catch (error) {
        console.error('Error fetching job seeker:', error);
        setError(t('viewProfile.errors.loadFailed'));
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
        text: t('viewProfile.share.text', { name: jobSeeker?.name }),
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
          <LoadingSpinner size="lg" text={t('viewProfile.loading.title')} />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${jobseekerBackground})` }}
      >
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8 max-w-md mx-4">
            <div className="text-orange-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('viewProfile.errors.profileNotAvailable')}</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="text-sm text-blue-600 bg-blue-50 rounded-lg p-3 mb-6">
              💡 {t('viewProfile.errors.underReview')}
            </div>
            <BackButton />
          </div>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('viewProfile.errors.profileNotFound')}</h2>
            <p className="text-gray-600 mb-6">{t('viewProfile.errors.profileNotExist')}</p>
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
                        ? jobSeeker.jobCategory?.name_en || t('viewProfile.hero.jobSeeker')
                        : jobSeeker?.profile?.jobCategory?.name_en || t('viewProfile.hero.jobSeeker')}
                    </p>
                    
                    {/* Approval Status Indicator */}
                    {isPublic && jobSeeker.approvalStatus && (
                      <div className="mb-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                          jobSeeker.approvalStatus === 'approved'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : jobSeeker.approvalStatus === 'rejected'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}>
                          {jobSeeker.approvalStatus === 'approved' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : jobSeeker.approvalStatus === 'rejected' ? (
                            <AlertCircle className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                          {jobSeeker.approvalStatus === 'approved'
                            ? t('viewProfile.hero.verifiedProfile')
                            : jobSeeker.approvalStatus === 'rejected'
                            ? t('viewProfile.hero.profileNotAvailable')
                            : t('viewProfile.hero.profileUnderReview')}
                        </div>
                      </div>
                    )}

                    {/* Key Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">
                          {isPublic ? jobSeeker.location : jobSeeker?.profile?.location || t('viewProfile.info.locationNotSpecified')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Briefcase className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">
                          {isPublic ? jobSeeker.experience : jobSeeker?.profile?.experience || t('viewProfile.info.experienceNotSpecified')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium">
                                                    {isPublic ? jobSeeker.availability : jobSeeker?.profile?.availability || t('viewProfile.info.availabilityNotSpecified')}
                        </span>
                      </div>
                      {isPublic && jobSeeker.memberSince && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium">
                            {t('viewProfile.info.memberSince')} {new Date(jobSeeker.memberSince).toLocaleString('default', { month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      )}
                    </div>

                                         {/* Rate Display */}
                     <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-2">
                           <span className="text-sm font-medium text-gray-700">{t('viewProfile.info.monthlyRate')}</span>
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
                   <h2 className="text-3xl font-bold text-gray-900">{t('viewProfile.sections.profileInformation')}</h2>
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
                         <h3 className="text-xl font-semibold text-gray-900">{t('viewProfile.sections.about')}</h3>
                       </div>
                       <div className="bg-gray-50 rounded-xl p-4">
                         <p className="text-gray-700 leading-relaxed">
                           {isPublic ? jobSeeker.description : jobSeeker?.profile?.description || t('viewProfile.sections.noDescription')}
                         </p>
                       </div>
                     </div>

                     {/* Skills Section */}
                     <div>
                       <div className="flex items-center space-x-3 mb-4">
                         <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                           <Star className="w-4 h-4 text-purple-600" />
                         </div>
                         <h3 className="text-xl font-semibold text-gray-900">{t('viewProfile.sections.skillsAndExpertise')}</h3>
                       </div>
                       <div className="flex flex-wrap gap-2">
                         {(isPublic ? jobSeeker.skills : jobSeeker?.profile?.skills)
                           ? (isPublic ? jobSeeker.skills : jobSeeker?.profile?.skills).split(',').map((skill, index) => (
                               <Badge key={index} variant="primary" size="md" className="px-3 py-1 text-sm font-medium bg-blue-500 text-white border-0">
                                 {skill.trim()}
                               </Badge>
                             ))
                           : <p className="text-gray-500">{t('viewProfile.sections.noSkillsListed')}</p>}
                       </div>
                     </div>

                     {/* References Section */}
                     {isPublic && jobSeeker.references && (
                       <div>
                         <div className="flex items-center space-x-3 mb-4">
                           <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                             <Users className="w-4 h-4 text-green-600" />
                           </div>
                           <h3 className="text-xl font-semibold text-gray-900">{t('viewProfile.sections.references')}</h3>
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
                         <h3 className="text-xl font-semibold text-gray-900">{t('viewProfile.sections.educationAndCertifications')}</h3>
                       </div>
                       <div className="space-y-4">
                         <div className="bg-blue-50 rounded-xl p-4">
                           <div className="flex items-center mb-2">
                             <GraduationCap className="w-4 h-4 mr-2 text-blue-600" />
                             <span className="font-semibold text-gray-900 text-sm">{t('viewProfile.sections.education')}</span>
                           </div>
                           <p className="text-gray-700 text-sm">{isPublic ? jobSeeker.educationLevel : jobSeeker?.profile?.educationLevel}</p>
                         </div>
                         <div className="bg-green-50 rounded-xl p-4">
                           <div className="flex items-center mb-2">
                             <Award className="w-4 h-4 mr-2 text-green-600" />
                             <span className="font-semibold text-gray-900 text-sm">{t('viewProfile.sections.certifications')}</span>
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
                                 return <p className="text-gray-500 text-sm">{t('viewProfile.sections.noCertificationsListed')}</p>;
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
                         <h3 className="text-xl font-semibold text-gray-900">{t('viewProfile.sections.languages')}</h3>
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
                                 return <p className="text-gray-500 text-sm">{t('viewProfile.sections.noLanguagesListed')}</p>;
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
        

            {/* Action Buttons - Sticky */}
                         <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
               <Card className="p-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border-0 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t('viewProfile.sections.actions')}</h3>
                <div className="space-y-3">
                                     <Button 
                     variant="primary" 
                     size="lg" 
                     className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg" 
                     onClick={handleRequestCandidate}
                   >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    {t('viewProfile.actions.requestCandidate')}
                  </Button>
                 
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