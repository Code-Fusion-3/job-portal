/**
 * Comprehensive Testing Script for Completed Services
 * Tests all implemented services: Auth, Job Seeker, Category, Employer Request, Admin
 */

import { 
  authService, 
  jobSeekerService, 
  categoryService, 
  requestService, 
  adminService 
} from './index.js';

import API_CONFIG from './config/apiConfig.js';

// Test Results Storage
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Utility Functions
const logTest = (testName, result, details = '') => {
  testResults.total++;
  if (result) {
    testResults.passed++;
    console.log(`✅ ${testName} - PASSED`);
  } else {
    testResults.failed++;
    console.log(`❌ ${testName} - FAILED`);
  }
  if (details) {
    console.log(`   Details: ${details}`);
  }
  testResults.details.push({ testName, result, details });
};

const logSection = (sectionName) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 TESTING: ${sectionName}`);
  console.log(`${'='.repeat(60)}`);
};

const logSummary = () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 TEST SUMMARY`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed} ✅`);
  console.log(`Failed: ${testResults.failed} ❌`);
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  
  if (testResults.failed > 0) {
    console.log(`\n❌ FAILED TESTS:`);
    testResults.details
      .filter(test => !test.result)
      .forEach(test => console.log(`   - ${test.testName}: ${test.details}`));
  }
};

// Test Data
const testJobSeeker = {
  firstName: 'Test',
  lastName: 'User',
  email: `test.user.${Date.now()}@example.com`,
  phone: '+250789123456',
  password: 'TestPassword123!',
  dateOfBirth: '1990-01-01',
  gender: 'Male',
  maritalStatus: 'Single',
  educationLevel: 'Bachelor',
  experienceYears: 3,
  availability: 'Immediate',
  dailyRate: 5000,
  skills: ['JavaScript', 'React', 'Node.js'],
  languages: ['English', 'Kinyarwanda'],
  location: 'Kigali',
  bio: 'Experienced software developer with 3 years of experience.'
};

const testCategory = {
  name_en: `Test Category ${Date.now()}`,
  name_rw: `Umutekano ${Date.now()}`
};

const testEmployerRequest = {
  name: 'Test Employer',
  email: `employer.${Date.now()}@company.com`,
  phone: '+250789654321',
  companyName: 'Test Company Ltd',
  message: 'We are looking for a skilled developer for our team.',
  requestedCandidateId: null
};

// Authentication Service Tests
const testAuthenticationService = async () => {
  logSection('Authentication Service');
  
  // Test 1: Job Seeker Registration
  try {
    const registerResult = await authService.registerJobSeeker(testJobSeeker);
    logTest(
      'Job Seeker Registration',
      registerResult.success,
      registerResult.success ? 'User registered successfully' : registerResult.error
    );
  } catch (error) {
    logTest('Job Seeker Registration', false, error.message);
  }
  
  // Test 2: Job Seeker Login
  try {
    const loginResult = await authService.loginJobSeeker({
      email: testJobSeeker.email,
      password: testJobSeeker.password
    });
    logTest(
      'Job Seeker Login',
      loginResult.success,
      loginResult.success ? 'Login successful' : loginResult.error
    );
  } catch (error) {
    logTest('Job Seeker Login', false, error.message);
  }
  
  // Test 3: Admin Login (using test credentials)
  try {
    const adminLoginResult = await authService.loginAdmin({
      email: 'admin@jobportal.com',
      password: 'admin123'
    });
    logTest(
      'Admin Login',
      adminLoginResult.success,
      adminLoginResult.success ? 'Admin login successful' : adminLoginResult.error
    );
  } catch (error) {
    logTest('Admin Login', false, error.message);
  }
};

// Job Seeker Service Tests
const testJobSeekerService = async () => {
  logSection('Job Seeker Service');
  
  // Test 1: Get All Job Seekers (Admin)
  try {
    const result = await jobSeekerService.getAllJobSeekers();
    logTest(
      'Get All Job Seekers (Admin)',
      result.success,
      result.success ? `Found ${result.data?.length || 0} job seekers` : result.error
    );
  } catch (error) {
    logTest('Get All Job Seekers (Admin)', false, error.message);
  }
  
  // Test 2: Get Public Job Seekers
  try {
    const result = await jobSeekerService.getPublicJobSeekers();
    logTest(
      'Get Public Job Seekers',
      result.success,
      result.success ? `Found ${result.data?.length || 0} public profiles` : result.error
    );
  } catch (error) {
    logTest('Get Public Job Seekers', false, error.message);
  }
  
  // Test 3: Search Job Seekers
  try {
    const result = await jobSeekerService.searchJobSeekers({
      skills: ['JavaScript'],
      location: 'Kigali',
      availability: 'Immediate'
    });
    logTest(
      'Search Job Seekers',
      result.success,
      result.success ? `Found ${result.data?.length || 0} matching profiles` : result.error
    );
  } catch (error) {
    logTest('Search Job Seekers', false, error.message);
  }
};

// Category Service Tests
const testCategoryService = async () => {
  logSection('Category Service');
  
  // Test 1: Get All Categories (Public)
  try {
    const result = await categoryService.getAllCategories();
    logTest(
      'Get All Categories (Public)',
      result.success,
      result.success ? `Found ${result.data?.length || 0} categories` : result.error
    );
  } catch (error) {
    logTest('Get All Categories (Public)', false, error.message);
  }
  
  // Test 2: Get All Categories (Admin)
  try {
    const result = await categoryService.getAllCategoriesAdmin();
    logTest(
      'Get All Categories (Admin)',
      result.success,
      result.success ? `Found ${result.data?.length || 0} categories with stats` : result.error
    );
  } catch (error) {
    logTest('Get All Categories (Admin)', false, error.message);
  }
  
  // Test 3: Create Category (Admin)
  try {
    const result = await categoryService.createCategory(testCategory);
    logTest(
      'Create Category (Admin)',
      result.success,
      result.success ? `Category created with ID: ${result.data?.id}` : result.error
    );
  } catch (error) {
    logTest('Create Category (Admin)', false, error.message);
  }
  
  // Test 4: Get Available Filters
  try {
    const result = await categoryService.getAvailableFilters();
    logTest(
      'Get Available Filters',
      result.success,
      result.success ? 'Filters retrieved successfully' : result.error
    );
  } catch (error) {
    logTest('Get Available Filters', false, error.message);
  }
};

// Employer Request Service Tests
const testRequestService = async () => {
  logSection('Employer Request Service');
  
  // Test 1: Submit Employer Request (Public)
  try {
    const result = await requestService.submitRequest(testEmployerRequest);
    logTest(
      'Submit Employer Request (Public)',
      result.success,
      result.success ? `Request submitted with ID: ${result.data?.id}` : result.error
    );
  } catch (error) {
    logTest('Submit Employer Request (Public)', false, error.message);
  }
  
  // Test 2: Get All Requests (Admin)
  try {
    const result = await requestService.getAllRequests();
    logTest(
      'Get All Requests (Admin)',
      result.success,
      result.success ? `Found ${result.data?.length || 0} requests` : result.error
    );
  } catch (error) {
    logTest('Get All Requests (Admin)', false, error.message);
  }
  
  // Test 3: Get Request Statistics
  try {
    const result = await requestService.getRequestStatistics();
    logTest(
      'Get Request Statistics',
      result.success,
      result.success ? 'Statistics retrieved successfully' : result.error
    );
  } catch (error) {
    logTest('Get Request Statistics', false, error.message);
  }
};

// Admin Service Tests
const testAdminService = async () => {
  logSection('Admin Service');
  
  // Test 1: Get Dashboard Statistics
  try {
    const result = await adminService.getDashboardStats();
    logTest(
      'Get Dashboard Statistics',
      result.success,
      result.success ? 'Dashboard stats retrieved successfully' : result.error
    );
  } catch (error) {
    logTest('Get Dashboard Statistics', false, error.message);
  }
  
  // Test 2: Get Analytics
  try {
    const result = await adminService.getAnalytics();
    logTest(
      'Get Analytics',
      result.success,
      result.success ? 'Analytics retrieved successfully' : result.error
    );
  } catch (error) {
    logTest('Get Analytics', false, error.message);
  }
  
  // Test 3: Get System Settings
  try {
    const result = await adminService.getSystemSettings();
    logTest(
      'Get System Settings',
      result.success,
      result.success ? 'System settings retrieved successfully' : result.error
    );
  } catch (error) {
    logTest('Get System Settings', false, error.message);
  }
  
  // Test 4: Get Admin Profile
  try {
    const result = await adminService.getAdminProfile();
    logTest(
      'Get Admin Profile',
      result.success,
      result.success ? 'Admin profile retrieved successfully' : result.error
    );
  } catch (error) {
    logTest('Get Admin Profile', false, error.message);
  }
  
  // Test 5: Get System Health
  try {
    const result = await adminService.getSystemHealth();
    logTest(
      'Get System Health',
      result.success,
      result.success ? 'System health check completed' : result.error
    );
  } catch (error) {
    logTest('Get System Health', false, error.message);
  }
};

// API Configuration Test
const testApiConfiguration = () => {
  logSection('API Configuration');
  
  // Test 1: Base URL Configuration
  logTest(
    'Base URL Configuration',
    !!API_CONFIG.BASE_URL,
    `Base URL: ${API_CONFIG.BASE_URL}`
  );
  
  // Test 2: Timeout Configuration
  logTest(
    'Timeout Configuration',
    API_CONFIG.TIMEOUT > 0,
    `Timeout: ${API_CONFIG.TIMEOUT}ms`
  );
  
  // Test 3: Upload Configuration
  logTest(
    'Upload Configuration',
    !!API_CONFIG.UPLOAD_CONFIG,
    `Max file size: ${API_CONFIG.UPLOAD_CONFIG.maxFileSize} bytes`
  );
  
  // Test 4: Auth Configuration
  logTest(
    'Auth Configuration',
    !!API_CONFIG.AUTH_CONFIG.tokenKey,
    `Token key: ${API_CONFIG.AUTH_CONFIG.tokenKey}`
  );
};

// Main Test Runner
const runAllTests = async () => {
  console.log(`🚀 Starting Comprehensive Service Testing`);
  console.log(`API Base URL: ${API_CONFIG.BASE_URL}`);
  console.log(`Environment: ${import.meta.env.MODE}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  
  try {
    // Test API Configuration
    testApiConfiguration();
    
    // Test Authentication Service
    await testAuthenticationService();
    
    // Test Job Seeker Service
    await testJobSeekerService();
    
    // Test Category Service
    await testCategoryService();
    
    // Test Employer Request Service
    await testRequestService();
    
    // Test Admin Service
    await testAdminService();
    
    // Display Summary
    logSummary();
    
  } catch (error) {
    console.error('❌ Test runner failed:', error);
  }
};

// Export for use in browser console or Node.js
if (typeof window !== 'undefined') {
  // Browser environment
  window.runServiceTests = runAllTests;
  console.log('🧪 Service testing available. Run: window.runServiceTests()');
} else {
  // Node.js environment
  runAllTests();
}

export { runAllTests, testResults }; 