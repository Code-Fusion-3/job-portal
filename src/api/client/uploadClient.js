/**
 * Upload Client
 * Specialized client for file uploads
 */

import axios from 'axios';
import API_CONFIG from '../config/apiConfig.js';

const uploadClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.UPLOAD_TIMEOUT,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Add auth token to upload requests
uploadClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const uploadApi = {
  // Upload single file
  uploadFile: async (file, onProgress = null) => {
    try {
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      if (file.size > API_CONFIG.UPLOAD_CONFIG.maxFileSize) {
        throw new Error(`File size exceeds ${API_CONFIG.UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB limit`);
      }

      const formData = new FormData();
      formData.append('file', file);

      const config = {
        onUploadProgress: onProgress,
      };

      const response = await uploadClient.post('/upload/file', formData, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload image
  uploadImage: async (image, onProgress = null) => {
    try {
      // Validate image
      if (!image) {
        throw new Error('No image provided');
      }

      if (!API_CONFIG.UPLOAD_CONFIG.allowedTypes.includes(image.type)) {
        throw new Error('Invalid image type. Allowed: JPEG, PNG, WebP');
      }

      if (image.size > API_CONFIG.UPLOAD_CONFIG.maxFileSize) {
        throw new Error(`Image size exceeds ${API_CONFIG.UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB limit`);
      }

      const formData = new FormData();
      formData.append('image', image);

      const config = {
        onUploadProgress: onProgress,
      };

      const response = await uploadClient.post('/upload/image', formData, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload job seeker photo
  uploadJobSeekerPhoto: async (jobSeekerId, photo, onProgress = null) => {
    try {
      if (!photo) {
        throw new Error('No photo provided');
      }

      if (!API_CONFIG.UPLOAD_CONFIG.allowedTypes.includes(photo.type)) {
        throw new Error('Invalid image type. Allowed: JPEG, PNG, WebP');
      }

      const formData = new FormData();
      formData.append('photo', photo);

      const config = {
        onUploadProgress: onProgress,
      };

      const response = await uploadClient.post(`/job-seekers/${jobSeekerId}/photo`, formData, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete file
  deleteFile: async (fileId) => {
    try {
      const response = await uploadClient.delete(`/upload/files/${fileId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get file info
  getFileInfo: async (fileId) => {
    try {
      const response = await uploadClient.get(`/upload/files/${fileId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default uploadApi; 