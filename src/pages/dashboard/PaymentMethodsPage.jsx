import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  GripVertical,
  DollarSign,
  CreditCard,
  Smartphone
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import API_CONFIG from '../../api/config/apiConfig';

const PaymentMethodsPage = () => {
  // State for payment methods
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    type: 'mobile_money',
    accountName: '',
    accountNumber: '',
    bankName: '',
    sortOrder: 0,
    isActive: true
  });

  // Loading states
  const [submitting, setSubmitting] = useState(false);
  const [reordering, setReordering] = useState(false);

  // Fetch payment methods
  const fetchPaymentMethods = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_CONFIG.BASE_URL}/payment-methods/admin/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.paymentMethods || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch payment methods');
      }
    } catch (err) {
      console.error('Error fetching payment methods:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load payment methods on component mount
  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: '',
      type: 'mobile_money',
      accountName: '',
      accountNumber: '',
      bankName: '',
      sortOrder: 0,
      isActive: true
    });
  };

  // Open create modal
  const openCreateModal = () => {
    resetFormData();
    setShowCreateModal(true);
  };

  // Open edit modal
  const openEditModal = (method) => {
    setSelectedMethod(method);
    setFormData({
      name: method.name,
      type: method.type,
      accountName: method.accountName,
      accountNumber: method.accountNumber,
      bankName: method.bankName || '',
      sortOrder: method.sortOrder,
      isActive: method.isActive
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (method) => {
    setSelectedMethod(method);
    setShowDeleteModal(true);
  };

  // Close modals
  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedMethod(null);
    resetFormData();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.accountName || !formData.accountNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);

      const url = showEditModal 
        ? `${API_CONFIG.BASE_URL}/payment-methods/${selectedMethod.id}`
        : `${API_CONFIG.BASE_URL}/payment-methods`;
      
      const method = showEditModal ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        const action = showEditModal ? 'updated' : 'created';
        toast.success(`Payment method ${action} successfully!`);
        closeModals();
        fetchPaymentMethods();
      } else {
        toast.error(data.error || `Failed to ${showEditModal ? 'update' : 'create'} payment method`);
      }
    } catch (err) {
      console.error('Error submitting payment method:', err);
      toast.error('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedMethod) return;

    try {
      setSubmitting(true);

      const response = await fetch(`${API_CONFIG.BASE_URL}/payment-methods/${selectedMethod.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        }
      });

      if (response.ok) {
        toast.success('Payment method deleted successfully!');
        closeModals();
        fetchPaymentMethods();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete payment method');
      }
    } catch (err) {
      console.error('Error deleting payment method:', err);
      toast.error('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (method) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/payment-methods/${method.id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        }
      });

      if (response.ok) {
        toast.success(`Payment method ${method.isActive ? 'deactivated' : 'activated'} successfully!`);
        fetchPaymentMethods();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to toggle payment method status');
      }
    } catch (err) {
      console.error('Error toggling payment method status:', err);
      toast.error('Network error. Please try again.');
    }
  };

  // Handle reordering
  const handleReorder = async (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;

    try {
      setReordering(true);

      const newOrder = [...paymentMethods];
      const [movedItem] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, movedItem);

      // Update sort order
      const orderData = newOrder.map((item, index) => ({
        id: item.id,
        sortOrder: index
      }));

      const response = await fetch(`${API_CONFIG.BASE_URL}/payment-methods/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH_CONFIG.tokenKey)}`
        },
        body: JSON.stringify({ order: orderData })
      });

      if (response.ok) {
        setPaymentMethods(newOrder);
        toast.success('Payment methods reordered successfully!');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to reorder payment methods');
      }
    } catch (err) {
      console.error('Error reordering payment methods:', err);
      toast.error('Network error. Please try again.');
    } finally {
      setReordering(false);
    }
  };

  // Get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'mobile_money':
        return <Smartphone className="h-4 w-4" />;
      case 'bank_transfer':
        return <CreditCard className="h-4 w-4" />;
      case 'cash':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  // Get type label
  const getTypeLabel = (type) => {
    switch (type) {
      case 'mobile_money':
        return 'Mobile Money';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'cash':
        return 'Cash';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
              <p className="text-gray-600 mt-2">
                Manage payment methods for employer requests
              </p>
            </div>
            <Button
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Payment Methods List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Payment Methods ({paymentMethods.length})
            </h2>
          </div>

          {paymentMethods.length === 0 ? (
            <div className="p-8 text-center">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No payment methods found</p>
              <p className="text-sm text-gray-500 mt-1">
                Create your first payment method to get started
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {paymentMethods.map((method, index) => (
                <div
                  key={method.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Drag Handle */}
                      <button
                        className="text-gray-400 hover:text-gray-600 cursor-move"
                        disabled={reordering}
                      >
                        <GripVertical className="h-5 w-5" />
                      </button>

                      {/* Type Icon */}
                      <div className="text-gray-500">
                        {getTypeIcon(method.type)}
                      </div>

                      {/* Method Info */}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {method.name}
                          </h3>
                          <Badge
                            variant={method.isActive ? 'success' : 'secondary'}
                            className="ml-2"
                          >
                            {method.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Type:</span> {getTypeLabel(method.type)}
                          {method.bankName && (
                            <>
                              <span className="mx-2">•</span>
                              <span className="font-medium">Bank:</span> {method.bankName}
                            </>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Account:</span> {method.accountName}
                          <span className="mx-2">•</span>
                          <span className="font-medium">Number:</span> {method.accountNumber}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(method)}
                        className={method.isActive ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                      >
                        {method.isActive ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(method)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteModal(method)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <Modal
          isOpen={showCreateModal || showEditModal}
          onClose={closeModals}
          title={showEditModal ? 'Edit Payment Method' : 'Add Payment Method'}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Method Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., MTN MOMO, Airtel Money, Bank of Rwanda"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="mobile_money">Mobile Money</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
              </select>
            </div>

            {/* Account Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Holder Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.accountName}
                onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Braziconnect Portal, Company Name"
                required
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number/Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 0788123456, 1234567890"
                required
              />
            </div>

            {/* Bank Name (conditional) */}
            {formData.type === 'bank_transfer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Bank of Rwanda, Equity Bank"
                />
              </div>
            )}

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                min="0"
              />
              <p className="text-sm text-gray-500 mt-1">
                Lower numbers appear first in the list
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active (available for payments)
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={closeModals}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {showEditModal ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  showEditModal ? 'Update Method' : 'Create Method'
                )}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedMethod && (
        <Modal
          isOpen={showDeleteModal}
          onClose={closeModals}
          title="Delete Payment Method"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete the payment method <strong>"{selectedMethod.name}"</strong>?
            </p>
            <p className="text-sm text-gray-600">
              This action cannot be undone. If this method is being used by existing payments, it cannot be deleted.
            </p>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={closeModals}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Method'
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}
      <Toaster />
    </div>
  );
};

export default PaymentMethodsPage;
