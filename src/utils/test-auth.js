// Test utility to check frontend authentication state
import { getAuthToken, getTokenExpiry, isTokenExpired } from '../api/config/apiConfig.js';

export const testAuthState = () => {
  const token = getAuthToken();
  const expiry = getTokenExpiry();
  const expired = isTokenExpired();
  
  console.log('=== Frontend Auth State ===');
  console.log('Token exists:', !!token);
  console.log('Token length:', token ? token.length : 0);
  console.log('Token expiry:', expiry);
  console.log('Token expired:', expired);
  console.log('Token preview:', token ? `${token.substring(0, 50)}...` : 'None');
  
  return {
    hasToken: !!token,
    tokenLength: token ? token.length : 0,
    expiry,
    expired,
    tokenPreview: token ? `${token.substring(0, 50)}...` : 'None'
  };
};

export const testApiCall = async () => {
  try {
    const response = await fetch('http://localhost:3000/employer/requests', {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    console.log('=== API Call Test ===');
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    return {
      status: response.status,
      data
    };
  } catch (error) {
    console.error('API call error:', error);
    return {
      status: 'error',
      error: error.message
    };
  }
}; 