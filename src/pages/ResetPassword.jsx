import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/ui/Button';
import PasswordInput from '../components/ui/PasswordInput';
import FormLayout from '../components/ui/FormLayout';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { authApi } from '../api/client/authClient';

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Get token from query string
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
     if (newPassword !== confirmPassword) {
    setError('Passwords do not match.');
    return;
  }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await authApi.resetPassword({ token, newPassword });
      setMessage(res.message || t('resetPassword.success', 'Password has been reset successfully.'));
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || t('resetPassword.error', 'Failed to reset password.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  bg-gray-50">
      <Header />
      <FormLayout
        title={t('resetPassword.title', 'Reset Password')}
        subtitle={t('resetPassword.subtitle', 'Enter your new password below.')}
        onSubmit={handleSubmit}
      >
        <PasswordInput
          id="newPassword"
          name="newPassword"
          label={t('resetPassword.newPassword', 'New Password')}
          placeholder={t('resetPassword.newPasswordPlaceholder', 'Enter new password')}
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          error={error}
          required
        />
        <PasswordInput
      id="confirmPassword"
      name="confirmPassword"
      label="Confirm Password"
      type="password"
      placeholder="Confirm Password"
      value={confirmPassword}
      onChange={e => setConfirmPassword(e.target.value)}
      required
    />
    {error && <div style={{ color: 'red' }}>{error}</div>}
        <Button type="submit" variant="primary" size="lg" className="w-full mt-6" disabled={loading}>
          {loading ? t('resetPassword.saving', 'Saving...') : t('resetPassword.save', 'Save New Password')}
        </Button>
        {message && <div className="mt-4 text-green-600 text-center">{message}</div>}
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
      </FormLayout>
      <Footer />
    </div>
  );
};

export default ResetPassword;
