// Job Categories API Service
// This service handles all job category-related API operations

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Get all job categories
 * @returns {Promise<Array>} Array of job categories
 */
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.categories || data; // Handle different response structures
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Create a new job category
 * @param {Object} categoryData - Category data with name_en and name_rw
 * @returns {Promise<Object>} Created category object
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Expected response structure based on Postman API:
    // {
    //   "message": "Job category created successfully",
    //   "category": {
    //     "id": 3,
    //     "name_en": "Graphic Design",
    //     "name_rw": "Ubwubatsi bw'Amashusho",
    //     "createdAt": "2024-01-01T00:00:00.000Z"
    //   }
    // }
    
    return data.category;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

/**
 * Update an existing job category
 * @param {number} categoryId - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise<Object>} Updated category object
 */
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.category;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

/**
 * Delete a job category
 * @param {number} categoryId - Category ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteCategory = async (categoryId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

/**
 * Get a single job category by ID
 * @param {number} categoryId - Category ID
 * @returns {Promise<Object>} Category object
 */
export const getCategoryById = async (categoryId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.category;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

/**
 * Get categories with job seeker counts
 * @returns {Promise<Array>} Array of categories with counts
 */
export const getCategoriesWithCounts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/with-counts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.categories || data;
  } catch (error) {
    console.error('Error fetching categories with counts:', error);
    throw error;
  }
};

// Export all functions
export default {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getCategoriesWithCounts
}; 