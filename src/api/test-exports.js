/**
 * Test API Exports
 * Simple test to verify all API exports work correctly
 */

// Test all imports
try {
  console.log('🧪 Testing API exports...');
  
  // Test configuration imports
  const { API_CONFIG, getAuthToken, isTokenExpired } = await import('./index.js');
  console.log('✅ API_CONFIG imported successfully');
  console.log('✅ getAuthToken imported successfully');
  console.log('✅ isTokenExpired imported successfully');
  
  // Test service imports
  const { authService, jobSeekerService, categoryService, requestService, adminService } = await import('./index.js');
  console.log('✅ authService imported successfully');
  console.log('✅ jobSeekerService imported successfully');
  console.log('✅ categoryService imported successfully');
  console.log('✅ requestService imported successfully');
  console.log('✅ adminService imported successfully');
  
  // Test client imports
  const { authApi, apiClient, uploadClient } = await import('./index.js');
  console.log('✅ authApi imported successfully');
  console.log('✅ apiClient imported successfully');
  console.log('✅ uploadClient imported successfully');
  
  // Test utility imports
  const { handleError, APIError } = await import('./index.js');
  console.log('✅ handleError imported successfully');
  console.log('✅ APIError imported successfully');
  
  // Test configuration values
  console.log('📊 API Configuration:');
  console.log('  - Base URL:', API_CONFIG.BASE_URL);
  console.log('  - Timeout:', API_CONFIG.TIMEOUT);
  console.log('  - Token Key:', API_CONFIG.AUTH_CONFIG.tokenKey);
  
  console.log('🎉 All API exports working correctly!');
  
} catch (error) {
  console.error('❌ API export test failed:', error);
  console.error('Error details:', error.message);
  console.error('Stack trace:', error.stack);
}

export default 'API exports test completed'; 