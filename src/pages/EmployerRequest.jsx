import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle, User, MapPin, Briefcase, Star, Clock, MessageSquare } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import BackButton from '../components/ui/BackButton';
import EmployerRequestForm from '../components/forms/EmployerRequestForm';
import { jobSeekerService } from '../api/index.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import jobseekerBackground from '../assets/jobseekerBackground.png';

const EmployerRequest = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();
  const [requestSent, setRequestSent] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState(null);
  const [jobSeeker, setJobSeeker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchJobSeeker = async () => {
      try {
        setLoading(true);
        let result;
        
        if (!user) {
          // Public user: fetch anonymized data
          result = await jobSeekerService.getPublicJobSeekerById(id);
        } else {
          // Authenticated user: fetch full data
          let candidateId = id;
          if (typeof id === 'string' && id.startsWith('JS')) {
            candidateId = parseInt(id.replace(/^JS/, ''), 10);
          }
          result = await jobSeekerService.getJobSeekerById(candidateId);
        }
        
        if (result && result.success && result.data) {
          setJobSeeker(result.data);
        } else {
          console.error('Failed to fetch job seeker:', result);
          setJobSeeker(null);
        }
      } catch (err) {
        console.error('Error fetching job seeker:', err);
        setError(err);
        setJobSeeker(null);
      } finally {
        setLoading(false);
      }
    };
    fetchJobSeeker();
  }, [id, user]);

  const handleSuccess = (credentials) => {
    setRequestSent(true);
    setLoginCredentials(credentials);
  };

  const handleError = (error) => {
    console.error('Request failed:', error);
    // Handle error (show notification, etc.)
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${jobseekerBackground})` }}
      >
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" text={t('employerRequest.loading.candidateInfo')} />
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
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('employerRequest.errors.loadingProfile')}</h2>
              <p className="text-gray-600 mb-6">{t('employerRequest.error.message', 'Failed to load job seeker profile.')}</p>
              <BackButton to="/job-seekers" text="Back to Job Seekers" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (requestSent) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 bg-fixed"
        style={{ backgroundImage: `url(${jobseekerBackground})` }}
      >
        <Header />
        <div className="pt-20 pb-12 flex flex-col items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl px-8 py-12 max-w-xl w-full text-center border border-green-100"
          >
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg mb-4">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
              <h1 className="text-4xl font-extrabold text-green-700 mb-2 tracking-tight">
                {t('employerRequest.success.title', 'Request Submitted!')}
              </h1>
              <p className="text-lg text-gray-700 font-medium mb-2">
                {t('employerRequest.success.message', 'Thank you for your interest. Our team will review your request and respond within 24 hours.')}
              </p>
            </div>

            {loginCredentials && (
              <div className="bg-gradient-to-br from-green-100 to-blue-100 border border-green-200 rounded-2xl p-6 mb-8 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block bg-green-600 text-white rounded-full px-3 py-1 text-xs font-semibold">New Account</span>
                  <span className="text-green-700 font-semibold">Login Credentials</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-green-300 shadow-sm w-full max-w-xs text-left mx-auto">
                  <div className="flex items-center mb-2">
                    <span className="font-bold text-green-800 w-20">Email:</span>
                    <span className="text-green-900 break-all">{loginCredentials.email}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-green-800 w-20">Password:</span>
                    <span className="text-green-900 break-all">{loginCredentials.password}</span>
                  </div>
                </div>
                <p className="text-xs text-green-700 mt-3">
                  {loginCredentials.message || 'Please save these credentials. You will need them to access your employer dashboard.'}
                </p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-blue-800 mb-2 text-lg flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                {t('employerRequest.success.whatHappensNext', 'What Happens Next?')}
              </h3>
              <ul className="text-sm text-blue-700 space-y-1 pl-4 list-disc">
                <li>{t('employerRequest.success.emailConfirmation', 'You will receive an email confirmation with further details.')}</li>
                <li>{t('employerRequest.success.contactNextSteps', 'Our team may contact you for additional information if needed.')}</li>
                <li>{t('employerRequest.fullDetail.content', 'You can track your request status after logging in.')}</li>
              </ul>
            </div>

            <div className="mt-6 flex flex-col items-center">
              <BackButton 
                to="/employer/login"
                text={t('employerRequest.success.loginToDashboard', 'Login to Access Dashboard')}
                className="inline-block bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 rounded-2xl font-bold text-lg shadow-md transition-colors duration-200"
              />
              <p className="text-xs text-gray-400 mt-3">For your security, please do not share your credentials with anyone.</p>
            </div>
          </motion.div>
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
      <div className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="relative backdrop-blur-sm mb-8">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <BackButton 
                to={`/view-profile/${id}`}
                text={t('employerRequest.backToProfile', 'Back to Profile')}
                className="text-white hover:text-gray-200"
              />
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mt-6"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('employerRequest.hero.title')}</h1>
                  <p className="text-gray-600 text-lg">{t('employerRequest.hero.subtitle')}</p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enhanced Candidate Info */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.2 }}
              >
                <Card className="p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border-0 sticky top-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {t('employerRequest.candidateInfo', 'Candidate Information')}
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Profile Header */}
                    <div className="text-center pb-6 border-b border-gray-200">
                      <div className="relative inline-block">
                        <Avatar 
                          src={jobSeeker?.profile?.photo}
                          alt={jobSeeker?.profile?.firstName + ' ' + jobSeeker?.profile?.lastName}
                          size="xl"
                          fallback={jobSeeker?.profile?.firstName + ' ' + jobSeeker?.profile?.lastName}
                          className="w-20 h-20 ring-4 ring-white shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <h3 className="font-bold text-xl text-gray-900 mt-4">
                        {jobSeeker?.profile?.firstName ? jobSeeker.profile.firstName.charAt(0) + '*'.repeat(jobSeeker.profile.firstName.length - 1) : ''}
                        {' '}
                        {jobSeeker?.profile?.lastName ? jobSeeker.profile.lastName.charAt(0) + '*'.repeat(jobSeeker.profile.lastName.length - 1) : ''}
                      </h3>
                      <Badge variant="primary" size="lg" className="mt-2 bg-blue-500 text-white border-0">
                        {jobSeeker?.profile?.jobCategory?.name_en || t('employerRequest.candidate.jobSeeker')}
                      </Badge>
                    </div>

                    {/* Key Information */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{t('employerRequest.candidate.location')}</p>
                          <p className="text-sm text-gray-600">{jobSeeker?.profile?.location || (jobSeeker?.profile?.city ? jobSeeker.profile.city : '') || t('employerRequest.candidate.locationNotSpecified')}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                        <Briefcase className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{t('employerRequest.candidate.experience')}</p>
                          <p className="text-sm text-gray-600">{jobSeeker?.profile?.experience || t('employerRequest.candidate.notSpecified')}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                        <Clock className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{t('employerRequest.candidate.availability')}</p>
                          <p className="text-sm text-gray-600">{jobSeeker?.profile?.availability || t('employerRequest.candidate.notSpecified')}</p>
                        </div>
                      </div>

                      {jobSeeker?.profile?.monthlyRate && (
                        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{t('employerRequest.candidate.monthlyRate')}</p>
                            <p className="text-sm font-semibold text-blue-600">{jobSeeker.profile.monthlyRate}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Skills Section */}
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Star className="w-4 h-4 text-orange-500" />
                        <h4 className="text-sm font-semibold text-gray-900">{t('employerRequest.candidate.skillsExpertise')}</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {jobSeeker?.profile?.skills ? jobSeeker.profile.skills.split(',').map((skill, idx) => (
                          <Badge key={idx} variant="outline" size="sm" className="px-3 py-1 text-xs font-medium border-gray-200 text-gray-700 bg-gray-50">
                            {skill.trim()}
                          </Badge>
                        )) : <span className="text-gray-400 text-sm">{t('employerRequest.candidate.noSkillsListed')}</span>}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-4 border-t border-gray-200">
                      <Link 
                        to={`/view-profile/${id}`}
                        className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-xl transition-colors"
                      >
                        {t('employerRequest.candidate.viewFullProfile')}
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Request Form */}
            <div className="lg:col-span-2">
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.3 }}
              >
                <EmployerRequestForm
                  jobSeekerId={(() => {
                   
                    // Try different ways to get the ID
                    let candidateId = null;
                    
                    // console.log('=== DEBUG: Calculating jobSeekerId ===');
                    // console.log('URL id parameter:', id);
                    // console.log('jobSeeker object:', jobSeeker);
                    // console.log('jobSeeker.id:', jobSeeker?.id);
                    // console.log('jobSeeker.profile?.userId:', jobSeeker?.profile?.userId);
                    // console.log('jobSeeker.userId:', jobSeeker?.userId);
                    
                    // Priority order for ID extraction
                    if (jobSeeker?.id && jobSeeker.id !== 'undefined' && jobSeeker.id !== 'null') {
                      candidateId = jobSeeker.id;
                      // console.log('Using jobSeeker.id:', candidateId);
                    } else if (jobSeeker?.profile?.userId && jobSeeker.profile.userId !== 'undefined' && jobSeeker.profile.userId !== 'null') {
                      candidateId = jobSeeker.profile.userId;
                      // console.log('Using jobSeeker.profile.userId:', candidateId);
                    } else if (jobSeeker?.userId && jobSeeker.userId !== 'undefined' && jobSeeker.userId !== 'null') {
                      candidateId = jobSeeker.userId;
                      // console.log('Using jobSeeker.userId:', candidateId);
                    } else if (id && id !== 'undefined' && id !== 'null') {
                      // Fallback to URL parameter - try to convert JS prefix if present
                      if (typeof id === 'string' && id.startsWith('JS')) {
                        const numericId = parseInt(id.replace(/^JS/, ''), 10);
                        if (!isNaN(numericId)) {
                          candidateId = numericId;
                          // console.log('Converted JS prefix to numeric ID:', candidateId);
                        } else {
                          candidateId = id;
                          // console.log('Using URL id parameter as fallback (JS format):', candidateId);
                        }
                      } else {
                        candidateId = id;
                        // console.log('Using URL id parameter as fallback:', candidateId);
                      }
                    }
                    
                    // Final validation
                    if (!candidateId || candidateId === 'undefined' || candidateId === 'null' || candidateId === '') {
                      console.error('❌ No valid candidate ID found!');
                      console.error('Available data:', {
                        urlId: id,
                        jobSeekerId: jobSeeker?.id,
                        profileUserId: jobSeeker?.profile?.userId,
                        userId: jobSeeker?.userId
                      });
                    } else {
                      // console.log('✅ Final candidateId:', candidateId);
                    }
                    
                    return candidateId;
                  })()}
                  jobSeekerName={jobSeeker?.profile ? `${jobSeeker.profile.firstName} ${jobSeeker.profile.lastName}` : jobSeeker.name}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmployerRequest; 