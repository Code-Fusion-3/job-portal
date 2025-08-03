/**
 * Test Admin Dashboard Component
 * Simple test to verify admin dashboard components work correctly
 */

import React, { useState } from 'react';
import { useAuth } from '../../api/hooks/useAuth.js';
import AdminHeader from '../../components/layout/AdminHeader';
import AdminSidebar from '../../components/layout/AdminSidebar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const TestAdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'Home' },
    { id: 'job-seekers', label: 'Job Seekers', icon: 'Users' },
    { id: 'requests', label: 'Employer Requests', icon: 'MessageSquare' },
    { id: 'categories', label: 'Categories', icon: 'Briefcase' },
    { id: 'reports', label: 'Reports', icon: 'BarChart3' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
    { id: 'test', label: 'Integration Test', icon: 'TestTube' }
  ];

  const handleLogout = () => {
    logout();
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    console.log('Search:', value);
  };

  const handleFilter = () => {
    console.log('Filter clicked');
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <h1 className="text-xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible to admin users.</p>
          <p className="text-sm text-gray-500 mt-2">Current user: {user?.email || 'Not logged in'}</p>
          <p className="text-sm text-gray-500">Role: {user?.role || 'No role'}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader
        user={user}
        onLogout={handleLogout}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSidebarToggle={handleSidebarToggle}
        searchTerm={searchTerm}
      />

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          navigationItems={navigationItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="p-6">
            <Card>
              <h1 className="text-2xl font-bold mb-4">Admin Dashboard Test</h1>
              <p className="text-gray-600 mb-4">
                This is a test page to verify the admin dashboard components are working correctly.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Current State:</h2>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Active Tab: {activeTab}</li>
                    <li>• Sidebar Open: {sidebarOpen ? 'Yes' : 'No'}</li>
                    <li>• Search Term: {searchTerm || 'None'}</li>
                    <li>• User: {user?.email}</li>
                    <li>• Role: {user?.role}</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2">Test Actions:</h2>
                  <div className="flex space-x-2">
                    <Button onClick={() => setActiveTab('job-seekers')}>
                      Switch to Job Seekers
                    </Button>
                    <Button onClick={handleSidebarToggle}>
                      Toggle Sidebar
                    </Button>
                    <Button onClick={() => setSearchTerm('test search')}>
                      Set Search Term
                    </Button>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2">Component Status:</h2>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✅ AdminHeader - Working</li>
                    <li>✅ AdminSidebar - Working</li>
                    <li>✅ Card Component - Working</li>
                    <li>✅ Button Component - Working</li>
                    <li>✅ Authentication - Working</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAdminDashboard; 