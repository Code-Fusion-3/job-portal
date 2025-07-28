import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Shield, 
  Bell, 
  Mail, 
  Globe, 
  Users, 
  Database,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Settings,
  Key,
  Eye,
  EyeOff,
  Activity
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

const SettingsPage = () => {
  const { t } = useTranslation();
  
  // State management
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Settings state
  const [settings, setSettings] = useState({
    general: {
      platformName: 'Job Portal Rwanda',
      platformDescription: 'Connecting lower-skilled workers with employers',
      contactEmail: 'admin@jobportal.rw',
      contactPhone: '+250 788 123 456',
      timezone: 'Africa/Kigali',
      language: 'en',
      currency: 'RWF'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      newRequestAlerts: true,
      placementUpdates: true,
      systemMaintenance: true,
      weeklyReports: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
      ipWhitelist: '',
      auditLogging: true
    },
    integrations: {
      emailService: 'smtp',
      smsService: 'disabled',
      paymentGateway: 'disabled',
      analytics: true,
      backupService: true
    }
  });

  // System status
  const [systemStatus, setSystemStatus] = useState({
    database: { status: 'healthy', lastBackup: '2024-01-15T10:30:00Z' },
    email: { status: 'healthy', lastTest: '2024-01-15T09:15:00Z' },
    storage: { status: 'warning', usage: 75 },
    performance: { status: 'healthy', responseTime: 120 }
  });

  // Tab configuration
  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Database },
    { id: 'system', label: 'System Status', icon: Activity }
  ];

  // Event handlers
  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async (section) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Saving ${section} settings:`, settings[section]);
    setIsLoading(false);
    alert(`${section} settings saved successfully!`);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Password changed successfully');
    setIsLoading(false);
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    alert('Password changed successfully!');
  };

  const handleBackupDatabase = async () => {
    setIsLoading(true);
    // Simulate backup process
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('Database backup completed');
    setIsLoading(false);
    setShowBackupModal(false);
    alert('Database backup completed successfully!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600">Manage platform configuration and preferences</p>
      </div>

      {/* Settings Tabs */}
      <Card className="p-0">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    value={settings.general.platformName}
                    onChange={(e) => handleSettingChange('general', 'platformName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => handleSettingChange('general', 'contactEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={settings.general.contactPhone}
                    onChange={(e) => handleSettingChange('general', 'contactPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="Africa/Kigali">Africa/Kigali</option>
                    <option value="UTC">UTC</option>
                    <option value="Europe/London">Europe/London</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Description
                </label>
                <textarea
                  value={settings.general.platformDescription}
                  onChange={(e) => handleSettingChange('general', 'platformDescription', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  onClick={() => handleSaveSettings('general')}
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save General Settings
                </Button>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.smsNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">New Request Alerts</h3>
                    <p className="text-sm text-gray-500">Get notified when new employer requests arrive</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.newRequestAlerts}
                      onChange={(e) => handleSettingChange('notifications', 'newRequestAlerts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Weekly Reports</h3>
                    <p className="text-sm text-gray-500">Receive weekly performance reports</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.weeklyReports}
                      onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  onClick={() => handleSaveSettings('notifications')}
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Notification Settings
                </Button>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Expiry (days)
                  </label>
                  <input
                    type="number"
                    value={settings.security.passwordExpiry}
                    onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    value={settings.security.loginAttempts}
                    onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IP Whitelist (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={settings.security.ipWhitelist}
                    onChange={(e) => handleSettingChange('security', 'ipWhitelist', e.target.value)}
                    placeholder="192.168.1.1, 10.0.0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500">Require 2FA for admin access</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactorAuth}
                    onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Audit Logging</h3>
                  <p className="text-sm text-gray-500">Log all admin actions for security</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.security.auditLogging}
                    onChange={(e) => handleSettingChange('security', 'auditLogging', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordModal(true)}
                >
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleSaveSettings('security')}
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </div>
          )}

          {/* Integration Settings */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Service
                  </label>
                  <select
                    value={settings.integrations.emailService}
                    onChange={(e) => handleSettingChange('integrations', 'emailService', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="smtp">SMTP</option>
                    <option value="sendgrid">SendGrid</option>
                    <option value="mailgun">Mailgun</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMS Service
                  </label>
                  <select
                    value={settings.integrations.smsService}
                    onChange={(e) => handleSettingChange('integrations', 'smsService', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="disabled">Disabled</option>
                    <option value="twilio">Twilio</option>
                    <option value="africastalking">Africa's Talking</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Analytics</h3>
                  <p className="text-sm text-gray-500">Enable usage analytics and tracking</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.integrations.analytics}
                    onChange={(e) => handleSettingChange('integrations', 'analytics', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Backup Service</h3>
                  <p className="text-sm text-gray-500">Automated database backups</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.integrations.backupService}
                    onChange={(e) => handleSettingChange('integrations', 'backupService', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowBackupModal(true)}
                >
                  <Database className="w-4 h-4 mr-2" />
                  Backup Database
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleSaveSettings('integrations')}
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Integration Settings
                </Button>
              </div>
            </div>
          )}

          {/* System Status */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(systemStatus).map(([key, status]) => (
                  <Card key={key} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 capitalize">{key}</h3>
                        <div className="flex items-center mt-2">
                          {getStatusIcon(status.status)}
                          <Badge 
                            variant="outline" 
                            className={getStatusColor(status.status)}
                          >
                            {status.status}
                          </Badge>
                        </div>
                        {key === 'storage' && (
                          <div className="mt-2">
                            <div className="flex justify-between text-sm text-gray-500 mb-1">
                              <span>Usage</span>
                              <span>{status.usage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  status.usage > 80 ? 'bg-red-500' : 
                                  status.usage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${status.usage}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        {key === 'performance' && (
                          <p className="text-sm text-gray-500 mt-2">
                            Response time: {status.responseTime}ms
                          </p>
                        )}
                        {key === 'database' && (
                          <p className="text-sm text-gray-500 mt-2">
                            Last backup: {new Date(status.lastBackup).toLocaleString()}
                          </p>
                        )}
                        {key === 'email' && (
                          <p className="text-sm text-gray-500 mt-2">
                            Last test: {new Date(status.lastTest).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Simulate system refresh
                    console.log('Refreshing system status...');
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Status
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    // Simulate system test
                    console.log('Running system tests...');
                  }}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Run System Tests
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleChangePassword}
              disabled={isLoading}
            >
              Change Password
            </Button>
          </div>
        </div>
      </Modal>

      {/* Backup Database Modal */}
      <Modal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        title="Backup Database"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This will create a complete backup of the database. The process may take several minutes.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Warning</p>
                <p>Ensure you have sufficient storage space before proceeding.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowBackupModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleBackupDatabase}
              disabled={isLoading}
            >
              Start Backup
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage; 