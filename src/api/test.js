/**
 * API Test File
 * Simple test to verify API configuration and clients
 */

import { API_CONFIG, ENDPOINTS, api, authApi, uploadApi } from './index.js';

// Test API configuration
console.log('🔧 API Configuration Test:');
console.log('Base URL:', API_CONFIG.BASE_URL);
console.log('Timeout:', API_CONFIG.TIMEOUT);
console.log('Debug Mode:', API_CONFIG.DEBUG);

// Test endpoints
console.log('\n📍 Endpoints Test:');
console.log('Auth endpoints:', Object.keys(ENDPOINTS.AUTH));
console.log('Job seekers endpoints:', Object.keys(ENDPOINTS.JOB_SEEKERS));
console.log('Categories endpoints:', Object.keys(ENDPOINTS.CATEGORIES));

// Test API clients
console.log('\n🚀 API Clients Test:');
console.log('Main API methods:', Object.keys(api));
console.log('Auth API methods:', Object.keys(authApi));
console.log('Upload API methods:', Object.keys(uploadApi));

// Test URL building
console.log('\n🔗 URL Building Test:');
console.log('Job seekers URL:', ENDPOINTS.JOB_SEEKERS.GET_ALL);
console.log('Categories URL:', ENDPOINTS.CATEGORIES.GET_ALL);

console.log('\n✅ API setup test completed successfully!'); 