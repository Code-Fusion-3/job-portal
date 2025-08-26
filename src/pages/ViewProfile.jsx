import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Briefcase, 
  Star, 
  Clock, 
  Globe, 
  GraduationCap, 
  Award, 
  Calendar,
  Users,
  TrendingUp,
  MessageSquare,
  Share2,
  Bookmark,
  BookmarkPlus,
  CheckCircle,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { jobSeekerService } from '../api/index.js';
import { useAuth } from '../api/hooks/useAuth.js';
import Button from '../components/ui/Button';
import BackButton from '../components/ui/BackButton';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatMonthlyRate } from '../utils/helpers';
import jobseekerBackground from '../assets/jobseekerBackground.png';

const ViewProfile = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobSeeker, setJobSeeker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
                          ? `${jobSeeker.firstName?.charAt(0) || ''}** ${jobSeeker.lastName?.charAt(0) || ''}**`
                          : `${jobSeeker?.profile?.firstName?.charAt(0) || ''}** ${jobSeeker?.profile?.lastName?.charAt(0) || ''}**`}
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
                    
                    {/* Job Category Badge */}
                    {isPublic && jobSeeker.jobCategory?.name_en && (
                      <div className="mb-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          <Briefcase className="w-4 h-4" />
                          {jobSeeker.jobCategory.name_en}
                        </div>
                      </div>
                    )}
                    
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
                            ? 'Verified Profile'
                            : jobSeeker.approvalStatus === 'rejected'
                            ? 'Profile Not Available'
                            : 'Profile Under Review'}
                        </div>
                      </div>
                    )}

                    {/* Key Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">
                          {isPublic 
                            ? (jobSeeker.location && jobSeeker.location.trim() !== '' 
                                ? jobSeeker.location 
                                : <span className="text-gray-400">Location not specified</span>)
                            : (jobSeeker?.profile?.location && jobSeeker?.profile?.location.trim() !== '' 
                                ? jobSeeker?.profile?.location 
                                : <span className="text-gray-400">Location not specified</span>)
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Globe className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium">
                          {isPublic 
                            ? (jobSeeker.languages && jobSeeker.languages.trim() !== '' 
                                ? jobSeeker.languages.split(',').slice(0, 2).join(', ') + (jobSeeker.languages.split(',').length > 2 ? '...' : '')
                                : <span className="text-gray-400">Languages not specified</span>)
                            : (jobSeeker?.profile?.languages && jobSeeker?.profile?.languages.trim() !== '' 
                                ? jobSeeker?.profile?.languages.split(',').slice(0, 2).join(', ') + (jobSeeker?.profile?.languages.split(',').length > 2 ? '...' : '')
                                : <span className="text-gray-400">Languages not specified</span>)
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <GraduationCap className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-medium">
                          {isPublic 
                            ? (jobSeeker.educationLevel && jobSeeker.educationLevel.trim() !== '' 
                                ? jobSeeker.educationLevel 
                                : <span className="text-gray-400">Education not specified</span>)
                            : (jobSeeker?.profile?.educationLevel && jobSeeker?.profile?.educationLevel.trim() !== '' 
                                ? jobSeeker?.profile?.educationLevel 
                                : <span className="text-gray-400">Education not specified</span>)
                          }
                        </span>
                      </div>
                    </div>

                    {/* Additional Info Row */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
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
                           {isPublic ? jobSeeker.description : jobSeeker?.profile?.description || 'No description provided'}
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

                     {/* Availability Section */}
                     <div>
                       <div className="flex items-center space-x-3 mb-4">
                         <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                           <Clock className="w-4 h-4 text-purple-600" />
                         </div>
                         <h3 className="text-xl font-semibold text-gray-900">Availability</h3>
                       </div>
                       <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                         <div className="flex items-center justify-between">
                           <div className="flex items-center space-x-2">
                             <span className="text-sm font-medium text-gray-700">Work Schedule</span>
                           </div>
                           <span className="text-lg font-semibold text-purple-700">
                             {isPublic 
                               ? (jobSeeker.availability && jobSeeker.availability.trim() !== '' 
                                   ? jobSeeker.availability 
                                   : <span className="text-gray-400">Not specified</span>)
                               : (jobSeeker?.profile?.availability && jobSeeker?.profile?.availability.trim() !== '' 
                                   ? jobSeeker?.profile?.availability 
                                   : <span className="text-gray-400">Not specified</span>)
                             }
                           </span>
                         </div>
                       </div>
                     </div>

                     {/* Experience Section */}
                     <div>
                       <div className="flex items-center space-x-3 mb-4">
                         <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                           <TrendingUp className="w-4 h-4 text-emerald-600" />
                         </div>
                         <h3 className="text-xl font-semibold text-gray-900">Experience</h3>
                       </div>
                       <div className="bg-gray-50 rounded-xl p-4">
                         <p className="text-gray-700 leading-relaxed">
                           {isPublic 
                             ? (jobSeeker.experience && jobSeeker.experience.trim() !== '' 
                                 ? jobSeeker.experience 
                                 : <span className="text-gray-400">No experience listed</span>)
                             : (jobSeeker?.profile?.experience && jobSeeker?.profile?.experience.trim() !== '' 
                                 ? jobSeeker?.profile?.experience 
                                 : <span className="text-gray-400">No experience listed</span>)
                           }
                         </p>
                       </div>
                     </div>

                     {/* References Section */}
                     <div>
                       <div className="flex items-center space-x-3 mb-4">
                         <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                           <Users className="w-4 h-4 text-green-600" />
                         </div>
                         <h3 className="text-xl font-semibold text-gray-900">References</h3>
                       </div>
                       <div className="bg-gray-50 rounded-xl p-4">
                         <p className="text-gray-700 leading-relaxed text-sm">
                           {isPublic 
                             ? (jobSeeker.references && jobSeeker.references.trim() !== '' 
                                 ? jobSeeker.references 
                                 : <span className="text-gray-400">No references listed</span>)
                             : (jobSeeker?.profile?.references && jobSeeker?.profile?.references.trim() !== '' 
                                 ? jobSeeker?.profile?.references 
                                 : <span className="text-gray-400">No references listed</span>)
                           }
                         </p>
                       </div>
                     </div>
                   </div>

                   {/* Right Column */}
                   <div className="space-y-6">
                     {/* Personal Information */}
                     <div>
                       <div className="flex items-center space-x-3 mb-4">
                         <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                           <UserCheck className="w-4 h-4 text-pink-600" />
                         </div>
                         <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                       </div>
                       <div className="space-y-3">
                         <div className="bg-pink-50 rounded-xl p-3">
                           <div className="flex items-center mb-1">
                             <span className="text-xs font-medium text-pink-700 uppercase tracking-wide">Gender</span>
                           </div>
                           <p className="text-gray-700 text-sm">
                             {isPublic 
                               ? (jobSeeker.gender && jobSeeker.gender.trim() !== '' 
                                   ? jobSeeker.gender 
                                   : <span className="text-gray-400">Not specified</span>)
                               : (jobSeeker?.profile?.gender && jobSeeker?.profile?.gender.trim() !== '' 
                                   ? jobSeeker?.profile?.gender 
                                   : <span className="text-gray-400">Not specified</span>)
                             }
                           </p>
                         </div>
                         <div className="bg-pink-50 rounded-xl p-3">
                           <div className="flex items-center mb-1">
                             <span className="text-xs font-medium text-pink-700 uppercase tracking-wide">Marital Status</span>
                           </div>
                           <p className="text-gray-700 text-sm">
                             {isPublic 
                               ? (jobSeeker.maritalStatus && jobSeeker.maritalStatus.trim() !== '' 
                                   ? jobSeeker.maritalStatus 
                                   : <span className="text-gray-400">Not specified</span>)
                               : (jobSeeker?.profile?.maritalStatus && jobSeeker?.profile?.maritalStatus.trim() !== '' 
                                   ? jobSeeker?.profile?.maritalStatus 
                                   : <span className="text-gray-400">Not specified</span>)
                             }
                           </p>
                         </div>
                         {isPublic && jobSeeker.dateOfBirth && (
                           <div className="bg-pink-50 rounded-xl p-3">
                             <div className="flex items-center mb-1">
                               <span className="text-xs font-medium text-pink-700 uppercase tracking-wide">Date of Birth</span>
                             </div>
                             <p className="text-gray-700 text-sm">
                               {new Date(jobSeeker.dateOfBirth).toLocaleDateString()}
                             </p>
                           </div>
                         )}
                       </div>
                     </div>

                     {/* Location Details */}
                     <div>
                       <div className="flex items-center space-x-3 mb-4">
                         <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                           <MapPin className="w-4 h-4 text-teal-600" />
                         </div>
                         <h3 className="text-xl font-semibold text-gray-900">Location Details</h3>
                       </div>
                       <div className="space-y-3">
                         <div className="bg-teal-50 rounded-xl p-3">
                           <div className="flex items-center mb-1">
                             <span className="text-xs font-medium text-teal-700 uppercase tracking-wide">City</span>
                           </div>
                           <p className="text-gray-700 text-sm">
                             {isPublic 
                               ? (jobSeeker.city && jobSeeker.city.trim() !== '' 
                                   ? jobSeeker.city 
                                   : <span className="text-gray-400">Not specified</span>)
                               : (jobSeeker?.profile?.city && jobSeeker?.profile?.city.trim() !== '' 
                                   ? jobSeeker?.profile?.city 
                                   : <span className="text-gray-400">Not specified</span>)
                             }
                           </p>
                         </div>
                         <div className="bg-teal-50 rounded-xl p-3">
                           <div className="flex items-center mb-1">
                             <span className="text-xs font-medium text-teal-700 uppercase tracking-wide">Country</span>
                           </div>
                           <p className="text-gray-700 text-sm">
                             {isPublic 
                               ? (jobSeeker.country && jobSeeker.country.trim() !== '' 
                                   ? jobSeeker.country 
                                   : <span className="text-gray-400">Not specified</span>)
                               : (jobSeeker?.profile?.country && jobSeeker?.profile?.country.trim() !== '' 
                                   ? jobSeeker?.profile?.country 
                                   : <span className="text-gray-400">Not specified</span>)
                             }
                           </p>
                         </div>
                       </div>
                     </div>

                     {/* Job Category */}
                     <div>
                       <div className="flex items-center space-x-3 mb-4">
                         <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                           <Briefcase className="w-4 h-4 text-amber-600" />
                         </div>
                         <h3 className="text-xl font-semibold text-gray-900">Job Category</h3>
                       </div>
                       <div className="bg-amber-50 rounded-xl p-4">
                         <p className="text-gray-700 text-sm">
                           {isPublic 
                             ? (jobSeeker.jobCategory?.name_en && jobSeeker.jobCategory.name_en.trim() !== '' 
                                 ? jobSeeker.jobCategory.name_en 
                                 : <span className="text-gray-400">No job category specified</span>)
                             : (jobSeeker?.profile?.jobCategory?.name_en && jobSeeker?.profile?.jobCategory.name_en.trim() !== '' 
                                 ? jobSeeker?.profile?.jobCategory.name_en 
                                 : <span className="text-gray-400">No job category specified</span>)
                           }
                         </p>
                       </div>
                     </div>

                     {/* Additional Profile Details */}
                     <div>
                       <div className="flex items-center space-x-3 mb-4">
                         <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                           <UserCheck className="w-4 h-4 text-slate-600" />
                         </div>
                         <h3 className="text-xl font-semibold text-gray-900">Additional Details</h3>
                       </div>
                       <div className="space-y-3">
                         <div className="bg-slate-50 rounded-xl p-3">
                           <div className="flex items-center mb-1">
                             <span className="text-xs font-medium text-slate-700 uppercase tracking-wide">ID Number</span>
                           </div>
                           <p className="text-gray-700 text-sm">
                             {isPublic 
                               ? (jobSeeker.idNumber && jobSeeker.idNumber.trim() !== '' 
                                   ? jobSeeker.idNumber 
                                   : <span className="text-gray-400">Not specified</span>)
                               : (jobSeeker?.profile?.idNumber && jobSeeker?.profile?.idNumber.trim() !== '' 
                                   ? jobSeeker?.profile?.idNumber 
                                   : <span className="text-gray-400">Not specified</span>)
                             }
                           </p>
                         </div>
                         {isPublic && jobSeeker.createdAt && (
                           <div className="bg-slate-50 rounded-xl p-3">
                             <div className="flex items-center mb-1">
                               <span className="text-xs font-medium text-slate-700 uppercase tracking-wide">Profile Created</span>
                             </div>
                             <p className="text-gray-700 text-sm">
                               {new Date(jobSeeker.createdAt).toLocaleDateString()}
                             </p>
                           </div>
                         )}
                         {isPublic && jobSeeker.updatedAt && (
                           <div className="bg-slate-50 rounded-xl p-3">
                             <div className="flex items-center mb-1">
                               <span className="text-xs font-medium text-slate-700 uppercase tracking-wide">Last Updated</span>
                             </div>
                             <p className="text-gray-700 text-sm">
                               {new Date(jobSeeker.updatedAt).toLocaleDateString()}
                             </p>
                           </div>
                         )}
                       </div>
                     </div>

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
                           <p className="text-gray-700 text-sm">
                             {isPublic 
                               ? (jobSeeker.educationLevel && jobSeeker.educationLevel.trim() !== '' 
                                   ? jobSeeker.educationLevel 
                                   : <span className="text-gray-400">No education specified</span>)
                               : (jobSeeker?.profile?.educationLevel && jobSeeker?.profile?.educationLevel.trim() !== '' 
                                   ? jobSeeker?.profile?.educationLevel 
                                   : <span className="text-gray-400">No education specified</span>)
                             }
                           </p>
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