import { useState } from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@jobportal.rw',
    oldPassword: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // If changing password, require old password and matching new passwords
    if ((profile.password || profile.confirmPassword) && !profile.oldPassword) {
      alert('Please enter your old password to change your password.');
      return;
    }
    if (profile.password && profile.password !== profile.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={profile.oldPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              autoComplete="current-password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              name="password"
              value={profile.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={profile.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              autoComplete="new-password"
            />
          </div>
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isLoading}
            >
              Save Profile
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;