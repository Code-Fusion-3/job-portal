import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import FormLayout from '../components/ui/FormLayout';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { authApi } from '../api/client/authClient';

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
      setMessage(res.message || t('forgotPassword.success', 'If the email exists, a password reset link has been sent.'));
    } catch (err) {
      setError(err.response?.data?.error || t('forgotPassword.error', 'Failed to request password reset.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <FormLayout
        title={t('forgotPassword.title', 'Forgot Password?')}
        subtitle={t('forgotPassword.subtitle', 'Enter your email to receive a password reset link.')}
        onSubmit={handleSubmit}
      >
        <FormInput
          id="email"
          name="email"
          type="email"
          label={t('forgotPassword.email', 'Email Address')}
          placeholder={t('forgotPassword.emailPlaceholder', 'Enter your email')}
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={error}
          required
        />
        <Button type="submit" variant="primary" size="lg" className="w-full mt-6" disabled={loading}>
          {loading ? t('forgotPassword.sending', 'Sending...') : t('forgotPassword.sendLink', 'Send Reset Link')}
        </Button>
        {message && <div className="mt-4 text-green-600 text-center">{message}</div>}
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
      </FormLayout>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
