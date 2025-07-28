// Utility functions for Admin Dashboard

export const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'completed': return 'text-green-600 bg-green-50 border-green-200';
    case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
    case 'active': return 'text-green-600 bg-green-50 border-green-200';
    case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-50 border-red-200';
    case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'low': return 'text-green-600 bg-green-50 border-green-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getCategoryColor = (category) => {
  switch (category) {
    case 'domestic': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'care': return 'text-pink-600 bg-pink-50 border-pink-200';
    case 'food': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'maintenance': return 'text-green-600 bg-green-50 border-green-200';
    case 'sales': return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'transport': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const formatCurrency = (amount, currency = 'RWF') => {
  return `${amount.toLocaleString()} ${currency}`;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

export const handleContactEmployer = (contactInfo, method) => {
  if (method === 'email') {
    window.open(`mailto:${contactInfo.email}`, '_blank');
  } else if (method === 'phone') {
    window.open(`tel:${contactInfo.phone}`, '_blank');
  }
}; 