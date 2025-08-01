/**
 * Category Service - Legacy Compatibility
 * This file redirects to the new API-integrated category service
 * 
 * @deprecated Use the new category service from src/api/services/categoryService.js
 */

// Re-export the new category service for backward compatibility
export { 
  categoryService as default,
  categoryService,
  CATEGORY_FIELDS 
} from '../api/services/categoryService.js';

// Legacy function exports for backward compatibility
export const getCategories = async () => {
  const { categoryService } = await import('../api/services/categoryService.js');
  const result = await categoryService.getAllCategories();
  if (result.success) {
    return result.data;
  }
  throw new Error(result.error);
};

export const createCategory = async (categoryData) => {
  const { categoryService } = await import('../api/services/categoryService.js');
  const result = await categoryService.createCategory(categoryData);
  if (result.success) {
    return result.data;
  }
  throw new Error(result.error);
};

export const updateCategory = async (categoryId, categoryData) => {
  const { categoryService } = await import('../api/services/categoryService.js');
  const result = await categoryService.updateCategory(categoryId, categoryData);
  if (result.success) {
    return result.data;
  }
  throw new Error(result.error);
};

export const deleteCategory = async (categoryId) => {
  const { categoryService } = await import('../api/services/categoryService.js');
  const result = await categoryService.deleteCategory(categoryId);
  if (result.success) {
    return result.message;
  }
  throw new Error(result.error);
};

export const getCategoryById = async (categoryId) => {
  const { categoryService } = await import('../api/services/categoryService.js');
  const result = await categoryService.getCategoryById(categoryId);
  if (result.success) {
    return result.data;
  }
  throw new Error(result.error);
};

export const getCategoriesWithCounts = async () => {
  const { categoryService } = await import('../api/services/categoryService.js');
  const result = await categoryService.getAllCategoriesAdmin();
  if (result.success) {
    return result.data;
  }
  throw new Error(result.error);
}; 