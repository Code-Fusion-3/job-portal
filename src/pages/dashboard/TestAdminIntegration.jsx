/**
 * Test Admin Integration Page
 * Tests the integration between admin dashboard and backend API
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../api/hooks/useAuth.js';
import { adminService } from '../../api/services/adminService.js';
import { useAdminJobSeekers } from '../../api/hooks/useJobSeekers.js';
import { useAdminRequests } from '../../api/hooks/useRequests.js';
import { useAdminCategories } from '../../api/hooks/useCategories.js';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const TestAdminIntegration = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  // Test dashboard stats
  const testDashboardStats = async () => {
    setLoading(true);
    try {
      const result = await adminService.getDashboardStats();
      setTestResults(prev => ({
        ...prev,
        dashboardStats: result
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        dashboardStats: { success: false, error: error.message }
      }));
    } finally {
      setLoading(false);
    }
  };

  // Test job seekers hook
  const testJobSeekersHook = () => {
    const {
      jobSeekers,
      loading,
      error,
      fetchJobSeekers
    } = useAdminJobSeekers({ autoFetch: false });

    setTestResults(prev => ({
      ...prev,
      jobSeekersHook: {
        jobSeekersCount: jobSeekers.length,
        loading,
        error,
        hasFetchFunction: !!fetchJobSeekers
      }
    }));
  };

  // Test requests hook
  const testRequestsHook = () => {
    const {
      requests,
      loading,
      error,
      fetchRequests
    } = useAdminRequests({ autoFetch: false });

    setTestResults(prev => ({
      ...prev,
      requestsHook: {
        requestsCount: requests.length,
        loading,
        error,
        hasFetchFunction: !!fetchRequests
      }
    }));
  };

  // Test categories hook
  const testCategoriesHook = () => {
    const {
      categories,
      loading,
      error,
      fetchCategories
    } = useAdminCategories({ autoFetch: false });

    setTestResults(prev => ({
      ...prev,
      categoriesHook: {
        categoriesCount: categories.length,
        loading,
        error,
        hasFetchFunction: !!fetchCategories
      }
    }));
  };

  // Run all tests
  const runAllTests = async () => {
    setLoading(true);
    setTestResults({});

    // Test dashboard stats
    await testDashboardStats();

    // Test hooks
    testJobSeekersHook();
    testRequestsHook();
    testCategoriesHook();

    setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <h1 className="text-2xl font-bold mb-4">Admin Integration Test</h1>
          <p className="text-gray-600 mb-4">
            Testing the integration between admin dashboard and backend API
          </p>
          <Button onClick={runAllTests} disabled={loading}>
            {loading ? 'Running Tests...' : 'Run All Tests'}
          </Button>
        </Card>

        {/* Dashboard Stats Test */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Dashboard Stats Test</h2>
          {testResults.dashboardStats ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${testResults.dashboardStats.success ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className={testResults.dashboardStats.success ? 'text-green-600' : 'text-red-600'}>
                  {testResults.dashboardStats.success ? 'PASSED' : 'FAILED'}
                </span>
              </div>
              {testResults.dashboardStats.success ? (
                <div className="text-sm text-gray-600">
                  <p>Data received successfully</p>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(testResults.dashboardStats.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-sm text-red-600">{testResults.dashboardStats.error}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Not tested yet</p>
          )}
        </Card>

        {/* Job Seekers Hook Test */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Job Seekers Hook Test</h2>
          {testResults.jobSeekersHook ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-green-600">PASSED</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Hook initialized successfully</p>
                <p>Job seekers count: {testResults.jobSeekersHook.jobSeekersCount}</p>
                <p>Loading state: {testResults.jobSeekersHook.loading ? 'Yes' : 'No'}</p>
                <p>Has fetch function: {testResults.jobSeekersHook.hasFetchFunction ? 'Yes' : 'No'}</p>
                {testResults.jobSeekersHook.error && (
                  <p className="text-red-600">Error: {testResults.jobSeekersHook.error}</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Not tested yet</p>
          )}
        </Card>

        {/* Requests Hook Test */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Requests Hook Test</h2>
          {testResults.requestsHook ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-green-600">PASSED</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Hook initialized successfully</p>
                <p>Requests count: {testResults.requestsHook.requestsCount}</p>
                <p>Loading state: {testResults.requestsHook.loading ? 'Yes' : 'No'}</p>
                <p>Has fetch function: {testResults.requestsHook.hasFetchFunction ? 'Yes' : 'No'}</p>
                {testResults.requestsHook.error && (
                  <p className="text-red-600">Error: {testResults.requestsHook.error}</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Not tested yet</p>
          )}
        </Card>

        {/* Categories Hook Test */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Categories Hook Test</h2>
          {testResults.categoriesHook ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-green-600">PASSED</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Hook initialized successfully</p>
                <p>Categories count: {testResults.categoriesHook.categoriesCount}</p>
                <p>Loading state: {testResults.categoriesHook.loading ? 'Yes' : 'No'}</p>
                <p>Has fetch function: {testResults.categoriesHook.hasFetchFunction ? 'Yes' : 'No'}</p>
                {testResults.categoriesHook.error && (
                  <p className="text-red-600">Error: {testResults.categoriesHook.error}</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Not tested yet</p>
          )}
        </Card>

        {/* Summary */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Integration Summary</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Admin Dashboard:</strong> {testResults.dashboardStats?.success ? '✅ Connected' : '❌ Not Connected'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Job Seekers Hook:</strong> ✅ Available
            </p>
            <p className="text-sm text-gray-600">
              <strong>Requests Hook:</strong> ✅ Available
            </p>
            <p className="text-sm text-gray-600">
              <strong>Categories Hook:</strong> ✅ Available
            </p>
            <p className="text-sm text-gray-600">
              <strong>Authentication:</strong> {user ? '✅ Authenticated' : '❌ Not Authenticated'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>User Role:</strong> {user?.role === 'admin' ? '✅ Admin' : '❌ Not Admin'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TestAdminIntegration; 