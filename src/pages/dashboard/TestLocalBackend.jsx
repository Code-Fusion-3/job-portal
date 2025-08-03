/**
 * Test Local Backend Connection
 * Simple test to verify connection to localhost:3000
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../api/hooks/useAuth.js';
import { adminService } from '../../api/services/adminService.js';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const TestLocalBackend = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('idle');

  // Test basic connection
  const testConnection = async () => {
    setLoading(true);
    setConnectionStatus('testing');
    
    try {
      // Test basic GET request
      const response = await fetch('http://localhost:3000/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTestResults(prev => ({
          ...prev,
          connection: {
            status: 'success',
            message: 'Backend connection successful',
            data: data
          }
        }));
        setConnectionStatus('connected');
      } else {
        setTestResults(prev => ({
          ...prev,
          connection: {
            status: 'error',
            message: `Backend connection failed: ${response.status} ${response.statusText}`,
            data: null
          }
        }));
        setConnectionStatus('failed');
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        connection: {
          status: 'error',
          message: `Connection error: ${error.message}`,
          data: null
        }
      }));
      setConnectionStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  // Test admin dashboard stats
  const testDashboardStats = async () => {
    setLoading(true);
    
    try {
      const result = await adminService.getDashboardStats();
      setTestResults(prev => ({
        ...prev,
        dashboardStats: {
          status: result.success ? 'success' : 'error',
          message: result.success ? 'Dashboard stats loaded successfully' : result.error,
          data: result.data
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        dashboardStats: {
          status: 'error',
          message: `Dashboard stats error: ${error.message}`,
          data: null
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  // Test job seekers API
  const testJobSeekers = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/job-seekers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('job_portal_token')}`
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTestResults(prev => ({
          ...prev,
          jobSeekers: {
            status: 'success',
            message: `Job seekers loaded: ${data.users?.length || 0} users`,
            data: data
          }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          jobSeekers: {
            status: 'error',
            message: `Job seekers error: ${response.status} ${response.statusText}`,
            data: null
          }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        jobSeekers: {
          status: 'error',
          message: `Job seekers error: ${error.message}`,
          data: null
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    await testConnection();
    await testDashboardStats();
    await testJobSeekers();
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      runAllTests();
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <h1 className="text-xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible to admin users.</p>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Local Backend Test</h1>
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
                connectionStatus === 'failed' ? 'bg-red-100 text-red-800' :
                connectionStatus === 'testing' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {connectionStatus === 'connected' ? '🟢 Connected' :
                 connectionStatus === 'failed' ? '🔴 Failed' :
                 connectionStatus === 'testing' ? '🟡 Testing' :
                 '⚪ Idle'}
              </div>
              <Button onClick={runAllTests} disabled={loading}>
                {loading ? 'Testing...' : 'Run Tests'}
              </Button>
            </div>
          </div>

          {loading && (
            <div className="mb-6">
              <LoadingSpinner text="Testing backend connection..." />
            </div>
          )}

          <div className="space-y-4">
            {/* Connection Test */}
            <div className={`p-4 rounded-lg border ${getStatusColor(testResults.connection?.status || 'idle')}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Backend Connection</h3>
                  <p className="text-sm mt-1">
                    {testResults.connection?.message || 'Not tested yet'}
                  </p>
                </div>
                <span className="text-2xl">{getStatusIcon(testResults.connection?.status)}</span>
              </div>
            </div>

            {/* Dashboard Stats Test */}
            <div className={`p-4 rounded-lg border ${getStatusColor(testResults.dashboardStats?.status || 'idle')}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Dashboard Stats</h3>
                  <p className="text-sm mt-1">
                    {testResults.dashboardStats?.message || 'Not tested yet'}
                  </p>
                </div>
                <span className="text-2xl">{getStatusIcon(testResults.dashboardStats?.status)}</span>
              </div>
            </div>

            {/* Job Seekers Test */}
            <div className={`p-4 rounded-lg border ${getStatusColor(testResults.jobSeekers?.status || 'idle')}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Job Seekers API</h3>
                  <p className="text-sm mt-1">
                    {testResults.jobSeekers?.message || 'Not tested yet'}
                  </p>
                </div>
                <span className="text-2xl">{getStatusIcon(testResults.jobSeekers?.status)}</span>
              </div>
            </div>
          </div>

          {/* API Configuration Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">API Configuration</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Base URL:</strong> http://localhost:3000</p>
              <p><strong>Environment:</strong> Development</p>
              <p><strong>Debug Mode:</strong> Enabled</p>
              <p><strong>Timeout:</strong> 10 seconds</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TestLocalBackend; 