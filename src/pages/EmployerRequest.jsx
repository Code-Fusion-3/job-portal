import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import EmployerRequestForm from '../components/forms/EmployerRequestForm';
import { jobSeekersData } from '../data/mockData';

const EmployerRequest = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [requestSent, setRequestSent] = useState(false);
  
  // Find the job seeker by ID (in real app, this would be an API call)
  const jobSeeker = jobSeekersData.find(seeker => seeker.id === id) || jobSeekersData[0];

  const handleSuccess = () => {
    setRequestSent(true);
  };

  const handleError = (error) => {
    console.error('Request failed:', error);
    // Handle error (show notification, etc.)
  };

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
                <Link
                  to="/job-seekers"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  {t('employerRequest.success.backToJobSeekers', 'Back to Job Seekers')}
                </Link>
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
          <nav className="mb-8">
            <Link
              to="/job-seekers"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('employerRequest.backToJobSeekers', 'Back to Job Seekers')}
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job Seeker Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('employerRequest.candidateInfo', 'Candidate Information')}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{jobSeeker.name}</h3>
                    <p className="text-gray-600">{jobSeeker.title}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {t('employerRequest.experience', 'Experience')}
                    </h4>
                    <p className="text-gray-600">{jobSeeker.experience} years</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {t('employerRequest.location', 'Location')}
                    </h4>
                    <p className="text-gray-600">{jobSeeker.location}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {t('employerRequest.skills', 'Key Skills')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {jobSeeker.skills.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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