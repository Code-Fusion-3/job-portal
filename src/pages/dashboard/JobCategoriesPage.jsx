import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Briefcase,
  Globe,
  Calendar,
  Eye,
  RefreshCw
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { categoryService } from '../../api/services/categoryService';
import { useCategories } from '../../api/hooks/useCategories';
import toast, { Toaster } from 'react-hot-toast';

const JobCategoriesPage = () => {
  const { t } = useTranslation();
  
  // Use the categories hook for data management
  const { 
    categories, 
    loading, 
    error, 
    createCategory: createCategoryHook, 
    updateCategory: updateCategoryHook, 
    deleteCategory: deleteCategoryHook,
    fetchCategories 
  } = useCategories({ includeAdmin: true });
  
  // State management
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name_en: '',
    name_rw: ''
  });

  // Filter and search categories
  const filteredCategories = categories.filter(category => {
    const matchesSearch = 
      category.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.name_rw.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle add category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!formData.name_en.trim() || !formData.name_rw.trim()) {
      setActionError('Please fill in both English and Kinyarwanda names');
      return;
    }

    // Validate name length
    if (formData.name_en.trim().length < 2) {
      setActionError('English name must be at least 2 characters long');
      return;
    }

    if (formData.name_rw.trim().length < 2) {
      setActionError('Kinyarwanda name must be at least 2 characters long');
      return;
    }

    setActionLoading(true);
    setActionError('');

    try {
      const result = await createCategoryHook({
          name_en: formData.name_en.trim(),
          name_rw: formData.name_rw.trim()
        });
        
      if (result.success) {
      setFormData({ name_en: '', name_rw: '' });
      setShowAddModal(false);
      toast.success('Job category created successfully!');
      } else {
        setActionError(result.error || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      setActionError('Network error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle edit category
  const handleEditCategory = async (e) => {
    e.preventDefault();
    
    if (!formData.name_en.trim() || !formData.name_rw.trim()) {
      setActionError('Please fill in both English and Kinyarwanda names');
      return;
    }

    // Validate name length
    if (formData.name_en.trim().length < 2) {
      setActionError('English name must be at least 2 characters long');
      return;
    }

    if (formData.name_rw.trim().length < 2) {
      setActionError('Kinyarwanda name must be at least 2 characters long');
      return;
    }

    setActionLoading(true);
    setActionError('');

    try {
      const result = await updateCategoryHook(selectedCategory.id, {
          name_en: formData.name_en.trim(),
          name_rw: formData.name_rw.trim()
        });
        
      if (result.success) {
      setFormData({ name_en: '', name_rw: '' });
      setSelectedCategory(null);
      setShowEditModal(false);
      toast.success('Job category updated successfully!');
      } else {
        setActionError(result.error || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setActionError('Network error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete category
  const handleDeleteCategory = async () => {
    setActionLoading(true);
    setActionError('');

    try {
      const result = await deleteCategoryHook(selectedCategory.id);
      
      if (result.success) {
      setSelectedCategory(null);
      setShowDeleteModal(false);
      toast.success('Job category deleted successfully!');
      } else {
        setActionError(result.error || 'Failed to delete category');
        
        // Handle special case where category is in use
        if (result.profilesCount) {
          setActionError(`Cannot delete category. It is being used by ${result.profilesCount} job seekers.`);
        }
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setActionError('Network error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      name_en: category.name_en,
      name_rw: category.name_rw
    });
    setActionError('');
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setActionError('');
    setShowDeleteModal(true);
  };

  // Close modals and clear errors
  const closeAddModal = () => {
    setShowAddModal(false);
    setFormData({ name_en: '', name_rw: '' });
    setActionError('');
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedCategory(null);
    setFormData({ name_en: '', name_rw: '' });
    setActionError('');
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedCategory(null);
    setActionError('');
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Statistics
  const stats = {
    total: categories.length,
    totalJobSeekers: categories.reduce((sum, cat) => sum + (cat._count?.profiles || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading categories..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Categories</h1>
          <p className="text-gray-600">Manage job categories for the platform</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={fetchCategories}
            variant="outline"
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
              <span className="text-red-800 text-xs">!</span>
            </div>
            <div>
              <p className="text-red-800 font-medium">Error loading categories</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <Button
              onClick={fetchCategories}
              variant="outline"
              size="sm"
              className="ml-auto"
            >
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Job Seekers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalJobSeekers}</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
      </Card>

      {/* Categories List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Seekers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {category.name_en}
                      </div>
                      <div className="text-sm text-gray-500">
                        {category.name_rw}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {category._count?.profiles || 0} job seekers
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(category.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(category)}
                        className="min-h-[32px] px-2"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteModal(category)}
                        className="min-h-[32px] px-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {loading ? 'Loading categories...' : 'No categories found'}
              </h3>
              <p className="text-gray-600">
                {loading 
                  ? 'Please wait while we fetch the categories.'
                  : searchTerm 
                  ? 'Try adjusting your search criteria.'
                  : 'Get started by creating your first job category.'
                }
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Add Category Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={closeAddModal}
        title="Add New Job Category"
      >
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name (English) *
            </label>
            <input
              type="text"
              name="name_en"
              value={formData.name_en}
              onChange={handleInputChange}
              placeholder="e.g., Graphic Design"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name (Kinyarwanda) *
            </label>
            <input
              type="text"
              name="name_rw"
              value={formData.name_rw}
              onChange={handleInputChange}
              placeholder="e.g., Ubwubatsi bw'Amashusho"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeAddModal}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={actionLoading}>
              {actionLoading ? 'Creating...' : 'Create Category'}
            </Button>
          </div>
          {actionError && (
            <p className="text-red-500 text-sm">{actionError}</p>
          )}
        </form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={closeEditModal}
        title="Edit Job Category"
      >
        <form onSubmit={handleEditCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name (English) *
            </label>
            <input
              type="text"
              name="name_en"
              value={formData.name_en}
              onChange={handleInputChange}
              placeholder="e.g., Graphic Design"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name (Kinyarwanda) *
            </label>
            <input
              type="text"
              name="name_rw"
              value={formData.name_rw}
              onChange={handleInputChange}
              placeholder="e.g., Ubwubatsi bw'Amashusho"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeEditModal}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={actionLoading}>
              {actionLoading ? 'Updating...' : 'Update Category'}
            </Button>
          </div>
          {actionError && (
            <p className="text-red-500 text-sm">{actionError}</p>
          )}
        </form>
      </Modal>

      {/* Delete Category Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        title="Delete Job Category"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the category "{selectedCategory?.name_en}"? 
            This action cannot be undone.
          </p>
          
          {selectedCategory?._count?.profiles > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ This category has {selectedCategory._count.profiles} job seekers. 
                Deleting it may affect their profiles.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={closeDeleteModal}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteCategory}
              disabled={actionLoading}
            >
              {actionLoading ? 'Deleting...' : 'Delete Category'}
            </Button>
          </div>
          {actionError && (
            <p className="text-red-500 text-sm">{actionError}</p>
          )}
        </div>
      </Modal>
      
      <Toaster position="top-right" />
    </div>
  );
};

export default JobCategoriesPage; 