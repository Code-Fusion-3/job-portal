import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';

import { Mail, ArrowLeft, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import FormLayout from '../components/ui/FormLayout';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { authApi } from '../api/client/authClient';
import jobseekerBackground from '../assets/jobseekerBackground.png';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await authApi.requestPasswordReset({ email });
      setMessage(res.message || t('forgotPassword.success'));
    } catch (err) {
      setError(err.response?.data?.error || t('forgotPassword.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${jobseekerBackground})` }}
    >
      <Header />
      
      {/* Hero Section */}
      <div className="relative mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {t('forgotPassword.title')}
            </h1>
            <p className="text-xl text-white/95 max-w-2xl mx-auto drop-shadow-md">
              {t('forgotPassword.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="max-w-md mx-auto">
          <div 
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                id="email"
                name="email"
                type="email"
                label={t('forgotPassword.email')}
                placeholder={t('forgotPassword.emailPlaceholder')}
                value={email}
                onChange={e => setEmail(e.target.value)}
                error={error}
                icon={Mail}
                required
              />
              
              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg" 
                disabled={loading}
              >
                {loading ? t('forgotPassword.sending') : t('forgotPassword.sendLink')}
              </Button>
              
              {message && (
                <div 
                  className="bg-green-50 border border-green-200 rounded-xl p-4"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-green-700 text-sm">{message}</p>
                  </div>
                </div>
              )}
              
              {error && (
                <div 
                  className="bg-red-50 border border-red-200 rounded-xl p-4"
                >
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}
              
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">{t('forgotPassword.rememberPassword')}</span>
                  </div>
                </div>
                
                <p className="text-gray-600">
                  <Link 
                    to="/login" 
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                  >
                    {t('forgotPassword.backToSignIn')}
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
