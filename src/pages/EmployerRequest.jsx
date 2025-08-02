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
        const seeker = await jobSeekerService.getJobSeekerById(id);
        setJobSeeker(seeker);
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
                          alt={jobSeeker.profile.firstName} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {jobSeeker?.profile?.firstName} {jobSeeker?.profile?.lastName}
                      </h3>
                      <p className="text-gray-600">
                        {jobSeeker?.profile?.jobCategoryId === 1 ? 'Software Developer' :
                         jobSeeker?.profile?.jobCategoryId === 2 ? 'Housemaid' :
                         jobSeeker?.profile?.jobCategoryId === 3 ? 'Gardener' :
                         jobSeeker?.profile?.jobCategoryId === 4 ? 'Driver' :
                         jobSeeker?.profile?.jobCategoryId === 5 ? 'Cook' :
                         jobSeeker?.profile?.jobCategoryId === 6 ? 'Security Guard' : 'Job Seeker'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {t('employerRequest.experience', 'Experience')}
                    </h4>
                    <p className="text-gray-600">{jobSeeker?.profile?.experience || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {t('employerRequest.location', 'Location')}
                    </h4>
                    <p className="text-gray-600">{jobSeeker?.profile?.location || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {t('employerRequest.skills', 'Skills')}
                    </h4>
                    <p className="text-gray-600">{jobSeeker?.profile?.skills || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {t('employerRequest.contact', 'Contact')}
                    </h4>
                    <p className="text-gray-600">{jobSeeker?.profile?.contactNumber || 'Not specified'}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Request Form */}
            <div className="lg:col-span-2">
              <EmployerRequestForm
                jobSeekerId={jobSeeker.id}
                jobSeekerName={jobSeeker.name}
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