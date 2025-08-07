import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { CheckCircle, User } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import BackButton from '../components/ui/BackButton';
import EmployerRequestForm from '../components/forms/EmployerRequestForm';
import { jobSeekerService } from '../api/index.js';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';

const EmployerRequest = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [requestSent, setRequestSent] = useState(false);
  const [jobSeeker, setJobSeeker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchJobSeeker = async () => {
      try {
        setLoading(true);
        let candidateId = id;
        if (typeof id === 'string' && id.startsWith('JS')) {
          candidateId = parseInt(id.replace(/^JS/, ''), 10);
        }
        const seeker = await jobSeekerService.getJobSeekerById(candidateId);
        console.log('Fetched job seeker:', seeker);
        if (seeker && seeker.success && seeker.data) {
          setJobSeeker(seeker.data);
        } else {
          setJobSeeker(null);
        }
      } catch (err) {
        setError(err);
        console.error('Error fetching job seeker:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobSeeker();
  }, [id]);

  const handleSuccess = () => {
    setRequestSent(true);
  };

  const handleError = (error) => {
    console.error('Request failed:', error);
    // Handle error (show notification, etc.)
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center py-8">{t('employerRequest.error.message', 'Failed to load job seeker profile.')}</div>;
  }

  if (requestSent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16 pb-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {t('employerRequest.success.title', 'Request Sent Successfully!')}
              </h1>
              <p className="text-gray-600 mb-6">
                {t('employerRequest.success.message', 'Your request has been sent to our admin team. We\'ll review it and get back to you within 24 hours.')}
              </p>
              <div className="space-y-4">
                <BackButton 
                  to={`/view-profile/${id}`}
                  text={t('employerRequest.success.backToProfile', 'Back to Profile')}
                  className="inline-block"
                />
              </div>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mt-8 mb-8">
            <BackButton 
              to={`/view-profile/${id}`}
              text={t('employerRequest.backToProfile', 'Back to Profile')}
            />
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job Seeker Info */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('employerRequest.candidateInfo', 'Candidate Information')}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      {jobSeeker?.profile?.photo ? (
                        <img 
                          src={jobSeeker.profile.photo} 
                          alt={jobSeeker.profile.firstName + ' ' + jobSeeker.profile.lastName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {jobSeeker?.profile?.firstName ? jobSeeker.profile.firstName.charAt(0) + '*'.repeat(jobSeeker.profile.firstName.length - 1) : ''}
                        {' '}
                        {jobSeeker?.profile?.lastName ? jobSeeker.profile.lastName.charAt(0) + '*'.repeat(jobSeeker.profile.lastName.length - 1) : ''}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                          {jobSeeker?.profile?.jobCategory?.name_en || 'Job Seeker'}
                        </span>
                        {/* Status dot (green for demo) */}
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-xs text-gray-400">View Profile</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <span className="inline-flex items-center"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10.5a8.38 8.38 0 0 1-.9 3.8c-.6 1.2-1.5 2.2-2.6 3.1-2.1 1.7-4.7 2.6-7.5 2.1-2.8-.5-5.2-2.3-6.5-4.8A8.38 8.38 0 0 1 3 10.5C3 6.4 6.4 3 10.5 3S18 6.4 18 10.5c0 .2 0 .4-.1.6"/></svg></span>
                    <span>{jobSeeker?.profile?.location || (jobSeeker?.profile?.city ? jobSeeker.profile.city : '') || 'Location not specified'}</span>
                  </div>
                  <div className="mt-2">
                    <div className="bg-blue-50 rounded-lg px-3 py-2 mb-2">
                      <span className="text-xs font-bold text-blue-700">EXPERIENCE</span>
                      <div className="text-gray-700 text-sm mt-1">{jobSeeker?.profile?.experience || 'Not specified'}</div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs font-bold text-gray-700">SKILLS</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {jobSeeker?.profile?.skills ? jobSeeker.profile.skills.split(',').map((skill, idx) => (
                        <span key={idx} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{skill.trim()}</span>
                      )) : <span className="text-gray-400">No skills listed</span>}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Request Form */}
            <div className="lg:col-span-2">
              <EmployerRequestForm
                jobSeekerId={jobSeeker?.id || jobSeeker?.profile?.userId}
                jobSeekerName={jobSeeker?.profile ? `${jobSeeker.profile.firstName} ${jobSeeker.profile.lastName}` : jobSeeker.name}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmployerRequest; 