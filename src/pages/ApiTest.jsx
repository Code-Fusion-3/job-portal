import React, { useState } from 'react';
import { api } from '../api/client/apiClient';
import { ENDPOINTS } from '../api/config/endpoints';
import API_CONFIG from '../api/config/apiConfig';

const ApiTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testApiConfig = () => {
    setTestResult(`
🔧 API Configuration Debug:
Base URL: ${API_CONFIG.BASE_URL}
Environment Variables:
- VITE_DEV_API_URL: ${import.meta.env.VITE_DEV_API_URL}
- VITE_API_URL: ${import.meta.env.VITE_API_URL}
- DEV: ${import.meta.env.DEV}
- MODE: ${import.meta.env.MODE}

Endpoints:
- Employer Login: ${ENDPOINTS.EMPLOYER.LOGIN}
- Full URL: ${API_CONFIG.BASE_URL}${ENDPOINTS.EMPLOYER.LOGIN}
    `);
  };

  const testApiCall = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing API call...');
      const response = await api.get('/health');
      setTestResult(prev => prev + '\n\n✅ API Call Success:\n' + JSON.stringify(response, null, 2));
    } catch (error) {
      console.error('❌ API call failed:', error);
      setTestResult(prev => prev + '\n\n❌ API Call Failed:\n' + JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const testEmployerLogin = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing employer login...');
      const response = await api.post(ENDPOINTS.EMPLOYER.LOGIN, {
        email: 'test@example.com',
        password: 'test123'
      });
      setTestResult(prev => prev + '\n\n✅ Employer Login Success:\n' + JSON.stringify(response, null, 2));
    } catch (error) {
      console.error('❌ Employer login failed:', error);
      setTestResult(prev => prev + '\n\n❌ Employer Login Failed:\n' + JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const testFetchCall = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing fetch call...');
      const response = await fetch('http://localhost:3000/health');
      const data = await response.json();
      setTestResult(prev => prev + '\n\n✅ Fetch Call Success:\n' + JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('❌ Fetch call failed:', error);
      setTestResult(prev => prev + '\n\n❌ Fetch Call Failed:\n' + JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const testFetchEmployerLogin = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing fetch employer login...');
      const response = await fetch('http://localhost:3000/employer/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123'
        })
      });
      const data = await response.json();
      setTestResult(prev => prev + '\n\n✅ Fetch Employer Login Success:\n' + JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('❌ Fetch employer login failed:', error);
      setTestResult(prev => prev + '\n\n❌ Fetch Employer Login Failed:\n' + JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Configuration Test</h1>
        
        <div className="space-y-4 mb-6">
          <button
            onClick={testApiConfig}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Test API Config
          </button>
          
          <button
            onClick={testApiCall}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 ml-2"
          >
            Test Health Endpoint
          </button>
          
          <button
            onClick={testEmployerLogin}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 ml-2"
          >
            Test Employer Login
          </button>

          <button
            onClick={testFetchCall}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 ml-2"
          >
            Test Fetch Health
          </button>

          <button
            onClick={testFetchEmployerLogin}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 ml-2"
          >
            Test Fetch Employer Login
          </button>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Testing...</p>
          </div>
        )}

        {testResult && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm whitespace-pre-wrap">
              {testResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTest;
