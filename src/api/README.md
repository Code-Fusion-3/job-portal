# API Module Documentation

## Overview
This module provides a complete API integration layer for the Job Portal frontend, with support for authentication, file uploads, and comprehensive error handling.

## Structure

```
src/api/
├── config/
│   ├── apiConfig.js      # Main API configuration
│   ├── endpoints.js      # API endpoint definitions
│   └── interceptors.js   # Request/response interceptors
├── client/
│   ├── apiClient.js      # Main API client (axios wrapper)
│   ├── authClient.js     # Authentication client
│   └── uploadClient.js   # File upload client
├── utils/
│   └── errorHandler.js   # Comprehensive error handling
├── index.js              # Main export file
└── test.js               # Test file
```

## Usage

### Basic Import
```javascript
import { api, authApi, uploadApi, API_CONFIG, ENDPOINTS } from './api';
```

### Making API Calls
```javascript
// GET request
const jobSeekers = await api.get('/job-seekers');

// POST request
const newJobSeeker = await api.post('/job-seekers', jobSeekerData);

// PUT request
const updatedJobSeeker = await api.put(`/job-seekers/${id}`, updateData);

// DELETE request
await api.delete(`/job-seekers/${id}`);
```

### Authentication
```javascript
// Job seeker login
const loginResult = await authApi.loginJobSeeker({
  email: 'user@example.com',
  password: 'password123'
});

// Admin login
const adminLogin = await authApi.loginAdmin({
  email: 'admin@example.com',
  password: 'admin123'
});

// Job seeker registration with photo
const registerResult = await authApi.registerJobSeeker(userData, photoFile);

// Logout
await authApi.logout();
```

### Error Handling
```javascript
import { handleError, ERROR_TYPES, useErrorHandler } from './api';

// Using error handler hook
const { handleApiError, isNetworkError, isAuthError } = useErrorHandler();

try {
  const result = await api.get('/job-seekers');
} catch (error) {
  const apiError = handleApiError(error, { context: 'fetch_job_seekers' });
  
  if (isNetworkError(apiError)) {
    // Handle network error
  } else if (isAuthError(apiError)) {
    // Handle authentication error
  }
}
```

### File Uploads
```javascript
// Upload image
const uploadResult = await uploadApi.uploadImage(file, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});

// Upload job seeker photo
const photoResult = await uploadApi.uploadJobSeekerPhoto(jobSeekerId, photoFile);
```

## Configuration

### Environment Variables
- `VITE_API_URL`: Base API URL (defaults to production URL)
- `VITE_DEV_API_URL`: Development API URL (optional)

### API Configuration
The `API_CONFIG` object contains:
- Base URL and timeouts
- Authentication settings
- File upload limits
- Development/production settings

## Features

### ✅ Completed (Phase 1)
- [x] API configuration structure
- [x] Endpoint definitions
- [x] Request/response interceptors
- [x] Main API client
- [x] Authentication client
- [x] File upload client
- [x] Automatic token refresh
- [x] Comprehensive error handling system
- [x] Error boundary components
- [x] Authentication system overhaul
- [x] JWT token management
- [x] Protected routes integration

### 🔄 In Progress (Phase 2)
- Service layer implementation
- Custom hooks development

### 📋 Planned (Phase 3+)
- Frontend pagination system
- File upload components
- Messaging system
- Performance optimization

## Error Handling

### Error Types
- `NETWORK_ERROR`: Connection issues
- `AUTH_ERROR`: Authentication failures
- `VALIDATION_ERROR`: Invalid input data
- `SERVER_ERROR`: Server-side errors
- `RATE_LIMIT_ERROR`: Too many requests
- `TIMEOUT_ERROR`: Request timeouts
- `UPLOAD_ERROR`: File upload failures

### Error Boundary
```javascript
import ErrorBoundary from '../components/ui/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## Testing

Run the test file to verify the API setup:
```javascript
import './api/test.js';
```

This will log the configuration and available methods to the console. 