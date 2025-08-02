import React, { useState } from 'react';
import { authApi, userService } from '../api/index.js';

const TestLogin = () => {
  const [email, setEmail] = useState('admin@jobportal.com');
  const [password, setPassword] = useState('admin123');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('🧪 Testing login with:', { email, password });
      
      // Test direct API call
      const loginResult = await authApi.loginAdmin({ email, password });
      console.log('✅ Login API result:', loginResult);
      
      // Test user service
      const userResult = await userService.getCurrentUser();
      console.log('👤 User service result:', userResult);
      
      setResult({
        login: loginResult,
        user: userResult
      });
    } catch (error) {
      console.error('❌ Test error:', error);
      setResult({
        error: error.message,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  const testJobSeekerLogin = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('🧪 Testing job seeker login with:', { email, password });
      
      // Test direct API call
      const loginResult = await authApi.loginJobSeeker({ email, password });
      console.log('✅ Job Seeker Login API result:', loginResult);
      
      // Test user service
      const userResult = await userService.getCurrentUser();
      console.log('👤 Job Seeker User service result:', userResult);
      
      setResult({
        login: loginResult,
        user: userResult
      });
    } catch (error) {
      console.error('❌ Job Seeker Test error:', error);
      setResult({
        error: error.message,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  const testDashboardNavigation = () => {
    // Test navigation to admin dashboard
    window.location.href = '/dashboard/admin';
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Login Test</h1>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <button
          onClick={testLogin}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Admin Login'}
        </button>
        
        <button
          onClick={testJobSeekerLogin}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50 ml-2"
        >
          {loading ? 'Testing...' : 'Test Job Seeker Login'}
        </button>
        
        {result && result.login && (
          <button
            onClick={testDashboardNavigation}
            className="px-4 py-2 bg-green-500 text-white rounded ml-2"
          >
            Test Dashboard Navigation
          </button>
        )}
      </div>
      
      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Result:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestLogin; 