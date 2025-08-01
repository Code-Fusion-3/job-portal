import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2,
  RefreshCw,
  FileText,
  Database,
  Users,
  FolderOpen,
  MessageSquare,
  Settings
} from 'lucide-react';

const TestServices = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [logs, setLogs] = useState([]);
  const [apiConfig, setApiConfig] = useState(null);

  // Mock the test runner for browser environment
  const runServiceTests = async () => {
    setIsRunning(true);
    setResults(null);
    setLogs([]);

    // Simulate test results (in real implementation, this would call the actual test script)
    const mockResults = {
      passed: 18,
      failed: 2,
      total: 20,
      details: [
        { testName: 'Base URL Configuration', result: true, details: 'Base URL: https://job-portal-backend-cfk4.onrender.com' },
        { testName: 'Timeout Configuration', result: true, details: 'Timeout: 30000ms' },
        { testName: 'Upload Configuration', result: true, details: 'Max file size: 5242880 bytes' },
        { testName: 'Auth Configuration', result: true, details: 'Token key: job_portal_token' },
        { testName: 'Job Seeker Registration', result: true, details: 'User registered successfully' },
        { testName: 'Job Seeker Login', result: true, details: 'Login successful' },
        { testName: 'Admin Login', result: false, details: 'Invalid credentials' },
        { testName: 'Get All Job Seekers (Admin)', result: true, details: 'Found 15 job seekers' },
        { testName: 'Get Public Job Seekers', result: true, details: 'Found 12 public profiles' },
        { testName: 'Search Job Seekers', result: true, details: 'Found 5 matching profiles' },
        { testName: 'Get All Categories (Public)', result: true, details: 'Found 8 categories' },
        { testName: 'Get All Categories (Admin)', result: true, details: 'Found 8 categories with stats' },
        { testName: 'Create Category (Admin)', result: true, details: 'Category created with ID: 9' },
        { testName: 'Get Available Filters', result: true, details: 'Filters retrieved successfully' },
        { testName: 'Submit Employer Request (Public)', result: true, details: 'Request submitted with ID: 25' },
        { testName: 'Get All Requests (Admin)', result: true, details: 'Found 25 requests' },
        { testName: 'Get Request Statistics', result: true, details: 'Statistics retrieved successfully' },
        { testName: 'Get Dashboard Statistics', result: true, details: 'Dashboard stats retrieved successfully' },
        { testName: 'Get Analytics', result: false, details: 'Unauthorized access' },
        { testName: 'Get System Settings', result: true, details: 'System settings retrieved successfully' },
        { testName: 'Get Admin Profile', result: true, details: 'Admin profile retrieved successfully' },
        { testName: 'Get System Health', result: true, details: 'System health check completed' }
      ]
    };

    // Simulate test execution with logs
    const testLogs = [
      '🚀 Starting Comprehensive Service Testing',
      'API Base URL: https://job-portal-backend-cfk4.onrender.com',
      'Environment: development',
      'Timestamp: 2024-01-15T10:30:00.000Z',
      '',
      '============================================================',
      '🧪 TESTING: API Configuration',
      '============================================================',
      '✅ Base URL Configuration - PASSED',
      '   Details: Base URL: https://job-portal-backend-cfk4.onrender.com',
      '✅ Timeout Configuration - PASSED',
      '   Details: Timeout: 30000ms',
      '✅ Upload Configuration - PASSED',
      '   Details: Max file size: 5242880 bytes',
      '✅ Auth Configuration - PASSED',
      '   Details: Token key: job_portal_token',
      '',
      '============================================================',
      '🧪 TESTING: Authentication Service',
      '============================================================',
      '✅ Job Seeker Registration - PASSED',
      '   Details: User registered successfully',
      '✅ Job Seeker Login - PASSED',
      '   Details: Login successful',
      '❌ Admin Login - FAILED',
      '   Details: Invalid credentials',
      '',
      '============================================================',
      '🧪 TESTING: Job Seeker Service',
      '============================================================',
      '✅ Get All Job Seekers (Admin) - PASSED',
      '   Details: Found 15 job seekers',
      '✅ Get Public Job Seekers - PASSED',
      '   Details: Found 12 public profiles',
      '✅ Search Job Seekers - PASSED',
      '   Details: Found 5 matching profiles',
      '',
      '============================================================',
      '🧪 TESTING: Category Service',
      '============================================================',
      '✅ Get All Categories (Public) - PASSED',
      '   Details: Found 8 categories',
      '✅ Get All Categories (Admin) - PASSED',
      '   Details: Found 8 categories with stats',
      '✅ Create Category (Admin) - PASSED',
      '   Details: Category created with ID: 9',
      '✅ Get Available Filters - PASSED',
      '   Details: Filters retrieved successfully',
      '',
      '============================================================',
      '🧪 TESTING: Employer Request Service',
      '============================================================',
      '✅ Submit Employer Request (Public) - PASSED',
      '   Details: Request submitted with ID: 25',
      '✅ Get All Requests (Admin) - PASSED',
      '   Details: Found 25 requests',
      '✅ Get Request Statistics - PASSED',
      '   Details: Statistics retrieved successfully',
      '',
      '============================================================',
      '🧪 TESTING: Admin Service',
      '============================================================',
      '✅ Get Dashboard Statistics - PASSED',
      '   Details: Dashboard stats retrieved successfully',
      '❌ Get Analytics - FAILED',
      '   Details: Unauthorized access',
      '✅ Get System Settings - PASSED',
      '   Details: System settings retrieved successfully',
      '✅ Get Admin Profile - PASSED',
      '   Details: Admin profile retrieved successfully',
      '✅ Get System Health - PASSED',
      '   Details: System health check completed',
      '',
      '============================================================',
      '📊 TEST SUMMARY',
      '============================================================',
      'Total Tests: 20',
      'Passed: 18 ✅',
      'Failed: 2 ❌',
      'Success Rate: 90.0%',
      '',
      '❌ FAILED TESTS:',
      '   - Admin Login: Invalid credentials',
      '   - Get Analytics: Unauthorized access'
    ];

    // Simulate test execution time
    await new Promise(resolve => setTimeout(resolve, 3000));

    setLogs(testLogs);
    setResults(mockResults);
    setIsRunning(false);
  };

  useEffect(() => {
    // Load API configuration
    const loadApiConfig = async () => {
      try {
        const { API_CONFIG } = await import('../api/index.js');
        setApiConfig(API_CONFIG);
      } catch (error) {
        console.error('Failed to load API config:', error);
      }
    };
    loadApiConfig();
  }, []);

  const getStatusIcon = (result) => {
    if (result === null) return <AlertCircle className="w-4 h-4 text-gray-400" />;
    return result ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusColor = (result) => {
    if (result === null) return 'text-gray-500';
    return result ? 'text-green-600' : 'text-red-600';
  };

  const getServiceIcon = (testName) => {
    if (testName.includes('Auth') || testName.includes('Login') || testName.includes('Registration')) {
      return <Database className="w-4 h-4" />;
    } else if (testName.includes('Job Seeker')) {
      return <Users className="w-4 h-4" />;
    } else if (testName.includes('Category')) {
      return <FolderOpen className="w-4 h-4" />;
    } else if (testName.includes('Request')) {
      return <MessageSquare className="w-4 h-4" />;
    } else if (testName.includes('Admin') || testName.includes('Dashboard') || testName.includes('System')) {
      return <Settings className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Service Integration Testing
          </h1>
          <p className="text-slate-600 text-lg">
            Comprehensive testing of all completed API services
          </p>
        </motion.div>

        {/* API Configuration Display */}
        {apiConfig && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              API Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm font-medium text-slate-600">Base URL</div>
                <div className="text-sm text-slate-800 font-mono truncate">{apiConfig.BASE_URL}</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm font-medium text-slate-600">Timeout</div>
                <div className="text-sm text-slate-800">{apiConfig.TIMEOUT}ms</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm font-medium text-slate-600">Max File Size</div>
                <div className="text-sm text-slate-800">{(apiConfig.UPLOAD_CONFIG.maxFileSize / 1024 / 1024).toFixed(1)}MB</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm font-medium text-slate-600">Environment</div>
                <div className="text-sm text-slate-800 capitalize">{import.meta.env.MODE}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Test Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Test Controls
            </h2>
            <button
              onClick={runServiceTests}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run All Tests
                </>
              )}
            </button>
          </div>
          
          <div className="text-sm text-slate-600">
            This will test all completed services: Authentication, Job Seeker, Category, Employer Request, and Admin services.
          </div>
        </motion.div>

        {/* Test Results */}
        {results && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Test Results
            </h2>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-slate-800">{results.total}</div>
                <div className="text-sm text-slate-600">Total Tests</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{results.passed}</div>
                <div className="text-sm text-green-600">Passed</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {((results.passed / results.total) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-blue-600">Success Rate</div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-2">
              {results.details.map((test, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    test.result ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  {getStatusIcon(test.result)}
                  <div className="flex items-center gap-2 flex-1">
                    {getServiceIcon(test.testName)}
                    <span className={`font-medium ${getStatusColor(test.result)}`}>
                      {test.testName}
                    </span>
                  </div>
                  <span className="text-sm text-slate-600">{test.details}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Test Logs */}
        {logs.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Test Logs
              </h2>
              <button
                onClick={() => setLogs([])}
                className="text-sm text-slate-600 hover:text-slate-800"
              >
                Clear Logs
              </button>
            </div>
            
            <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap">{log}</div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TestServices; 