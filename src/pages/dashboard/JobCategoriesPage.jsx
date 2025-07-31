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
  Eye
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../../services/categoryService';

const JobCategoriesPage = () => {
  const { t } = useTranslation();
  
  // State management
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name_en: '',
    name_rw: ''
  });

  // Mock data - replace with actual API calls
  const mockCategories = [
    {
      id: 1,
      name_en: "Domestic & Household",
      name_rw: "Umuryango & Inzu",
      createdAt: "2024-01-01T00:00:00.000Z",
      jobSeekersCount: 82
    },
    {
      id: 2,
      name_en: "Care Services",
      name_rw: "Serivisi z'Uburezi",
      createdAt: "2024-01-02T00:00:00.000Z",
      jobSeekersCount: 58
    },
    {
      id: 3,
      name_en: "Food & Hospitality",
      name_rw: "Ibikoresho & Ubukerarugendo",
      createdAt: "2024-01-03T00:00:00.000Z",
      jobSeekersCount: 47
    },
    {
      id: 4,
      name_en: "Maintenance & Services",
      name_rw: "Gukurikirana & Serivisi",
      createdAt: "2024-01-04T00:00:00.000Z",
      jobSeekersCount: 28
    },
    {
      id: 5,
      name_en: "Transportation",
      name_rw: "Ubutwara",
      createdAt: "2024-01-05T00:00:00.000Z",
      jobSeekersCount: 19
    },
    {
      id: 6,
      name_en: "Sales & Marketing",
      name_rw: "Kugurisha & Kwamamaza",
      createdAt: "2024-01-06T00:00:00.000Z",
      jobSeekersCount: 15
    }
  ];

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      // Use real API call when available, fallback to mock data
      try {
        const apiCategories = await getCategories();
        setCategories(apiCategories);
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
        setCategories(mockCategories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories(mockCategories); // Fallback to mock data
    } finally {
      setIsLoading(false);
    }
  };

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
      alert('Please fill in both English and Kinyarwanda names');
      return;
    }

    try {
      // Use real API call when available
      try {
        const newCategory = await createCategory({
          name_en: formData.name_en.trim(),
          name_rw: formData.name_rw.trim()
        });
        
        // Add additional fields for UI
        const categoryWithUI = {
          ...newCategory,
          jobSeekersCount: 0
        };
        
        setCategories(prev => [categoryWithUI, ...prev]);
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
        // Fallback to mock creation
        const newCategory = {
          id: Date.now(),
          name_en: formData.name_en.trim(),
          name_rw: formData.name_rw.trim(),
          createdAt: new Date().toISOString(),
          jobSeekersCount: 0
        };
        setCategories(prev => [newCategory, ...prev]);
      }
      
      setFormData({ name_en: '', name_rw: '' });
      setShowAddModal(false);
      
      alert('Job category created successfully!');
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category. Please try again.');
    }
  };

  // Handle edit category
  const handleEditCategory = async (e) => {
    e.preventDefault();
    
    if (!formData.name_en.trim() || !formData.name_rw.trim()) {
      alert('Please fill in both English and Kinyarwanda names');
      return;
    }

    try {
      // Use real API call when available
      try {
        const updatedCategory = await updateCategory(selectedCategory.id, {
          name_en: formData.name_en.trim(),
          name_rw: formData.name_rw.trim()
        });
        
        // Add additional fields for UI
        const categoryWithUI = {
          ...updatedCategory,
          jobSeekersCount: selectedCategory.jobSeekersCount
        };
        
        setCategories(prev => 
          prev.map(cat => 
            cat.id === selectedCategory.id ? categoryWithUI : cat
          )
        );
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
        // Fallback to mock update
        const updatedCategory = {
          ...selectedCategory,
          name_en: formData.name_en.trim(),
          name_rw: formData.name_rw.trim()
        };
        
        setCategories(prev => 
          prev.map(cat => 
            cat.id === selectedCategory.id ? updatedCategory : cat
          )
        );
      }
      
      setFormData({ name_en: '', name_rw: '' });
      setSelectedCategory(null);
      setShowEditModal(false);
      
      alert('Job category updated successfully!');
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category. Please try again.');
    }
  };

  // Handle delete category
  const handleDeleteCategory = async () => {
    try {
      // Use real API call when available
      try {
        await deleteCategory(selectedCategory.id);
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
      }
      
      // Update local state
      setCategories(prev => 
        prev.filter(cat => cat.id !== selectedCategory.id)
      );
      
      setSelectedCategory(null);
      setShowDeleteModal(false);
      
      alert('Job category deleted successfully!');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    }
  };

  // Open edit modal
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      name_en: category.name_en,
      name_rw: category.name_rw
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
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
    totalJobSeekers: categories.reduce((sum, cat) => sum + cat.jobSeekersCount, 0)
  };

  if (isLoading) {
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
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      {category.jobSeekersCount} job seekers
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
                No categories found
              </h3>
              <p className="text-gray-600">
                {searchTerm 
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
        onClose={() => setShowAddModal(false)}
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
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
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
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Update Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Category Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Job Category"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the category "{selectedCategory?.name_en}"? 
            This action cannot be undone.
          </p>
          
          {selectedCategory?.jobSeekersCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ This category has {selectedCategory.jobSeekersCount} job seekers. 
                Deleting it may affect their profiles.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteCategory}
            >
              Delete Category
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobCategoriesPage; 