/**
 * Custom Categories Hook
 * Provides data management for categories with CRUD operations
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { categoryService } from '../services/categoryService.js';

export const useCategories = (options = {}) => {
  const {
    autoFetch = true,
    includeAdmin = false
  } = options;

  // State management
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = includeAdmin 
        ? await categoryService.getAllCategoriesAdmin()
        : await categoryService.getAllCategories();
      
      if (result.success) {
        setCategories(result.data || []);
      } else {
        setError(result.error || 'Failed to fetch categories');
      }
    } catch (error) {
      setError('An error occurred while fetching categories');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }, [includeAdmin]);

  // Create new category
  const createCategory = useCallback(async (categoryData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await categoryService.createCategory(categoryData);
      if (result.success) {
        // Refresh the list after creation
        await fetchCategories();
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to create category');
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An error occurred while creating category';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  // Update category
  const updateCategory = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await categoryService.updateCategory(id, updateData);
      if (result.success) {
        // Update the local state
        setCategories(prev => 
          prev.map(category => 
            category.id === id ? { ...category, ...result.data } : category
          )
        );
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to update category');
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An error occurred while updating category';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete category
  const deleteCategory = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await categoryService.deleteCategory(id);
      if (result.success) {
        // Remove from local state
        setCategories(prev => prev.filter(category => category.id !== id));
        // Clear selection if deleted category was selected
        if (selectedCategory?.id === id) {
          setSelectedCategory(null);
        }
        return { success: true };
      } else {
        setError(result.error || 'Failed to delete category');
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An error occurred while deleting category';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  // Get category by ID
  const getCategoryById = useCallback(async (id) => {
    if (!id) return null;
    
    try {
      const result = await categoryService.getCategoryById(id);
      if (result.success) {
        return result.data;
      } else {
        setError(result.error || 'Failed to fetch category');
        return null;
      }
    } catch (error) {
      setError('An error occurred while fetching category');
      console.error('Error fetching category:', error);
      return null;
    }
  }, []);

  // Category selection
  const selectCategory = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchCategories();
    }
  }, [fetchCategories, autoFetch]);

  // Clear error when selection changes
  useEffect(() => {
    setError(null);
  }, [selectedCategory]);

  return {
    // Data
    categories,
    selectedCategory,
    
    // State
    loading,
    error,
    
    // Actions
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    
    // Selection
    selectCategory,
    clearSelection,
    
    // Utilities
    hasCategories: categories.length > 0,
    categoriesCount: categories.length
  };
};

// Specialized hooks for different use cases
export const usePublicCategories = (options = {}) => {
  return useCategories({ ...options, includeAdmin: false });
};

export const useAdminCategories = (options = {}) => {
  return useCategories({ ...options, includeAdmin: true });
};

export const useCategorySelection = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { categories, fetchCategories } = useCategories({ autoFetch: false });

  // Load categories for selection
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Toggle category selection
  const toggleCategory = useCallback((categoryId) => {
    setSelectedCategories(prev => {
      const isSelected = prev.includes(categoryId);
      if (isSelected) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  }, []);

  // Select multiple categories
  const selectCategories = useCallback((categoryIds) => {
    setSelectedCategories(categoryIds);
  }, []);

  // Clear all selections
  const clearSelections = useCallback(() => {
    setSelectedCategories([]);
  }, []);

  // Get selected category objects
  const selectedCategoryObjects = useMemo(() => {
    return categories.filter(category => 
      selectedCategories.includes(category.id)
    );
  }, [categories, selectedCategories]);

  return {
    // Data
    categories,
    selectedCategories,
    selectedCategoryObjects,
    
    // State
    loading,
    error,
    
    // Actions
    toggleCategory,
    selectCategories,
    clearSelections,
    
    // Utilities
    hasSelections: selectedCategories.length > 0,
    selectionsCount: selectedCategories.length
  };
}; 