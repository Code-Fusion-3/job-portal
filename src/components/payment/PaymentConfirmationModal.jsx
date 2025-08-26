import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  DollarSign, 
  CreditCard, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Info,
  Calendar,
  Phone,
  User,
  FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const PaymentConfirmationModal = ({ 
  isOpen, 
  onClose, 
  request, 
  onConfirm,
  paymentMethods = []
}) => {
  const [formData, setFormData] = useState({
    confirmationName: '',
    confirmationPhone: '',
    paymentReference: '',
    transferAmount: '',
    transferDate: '',
    paymentMethod: '',
    notes: '',
    proofFile: null
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid image (JPEG, PNG) or PDF file');
        return;
      }
      setFormData(prev => ({
        ...prev,
        proofFile: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.confirmationName || !formData.confirmationPhone || !formData.transferAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await onConfirm({
        requestId: request.id,
        ...formData
      });
      
      toast.success('Payment confirmation submitted successfully!');
      onClose();
      setFormData({
        confirmationName: '',
        confirmationPhone: '',
        paymentReference: '',
        transferAmount: '',
        transferDate: '',
        paymentMethod: '',
        notes: '',
        proofFile: null
      });
      setStep(1);
    } catch (error) {
      toast.error('Failed to submit payment confirmation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentTypeInfo = () => {
    if (request?.paymentType === 'photo_access') {
      return {
        title: 'Photo Access Payment',
        description: 'Payment for viewing candidate photo and basic information',
        amount: request.paymentAmount || 5000,
        currency: 'RWF'
      };
    } else if (request?.paymentType === 'full_details') {
      return {
        title: 'Full Details Payment',
        description: 'Payment for complete candidate contact information',
        amount: request.paymentAmount || 10000,
        currency: 'RWF'
      };
    }
    return {
      title: 'Payment Required',
      description: 'Payment for candidate access',
      amount: request.paymentAmount || 0,
      currency: 'RWF'
    };
  };

  const paymentInfo = getPaymentTypeInfo();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Confirm Payment</h2>
                  <p className="text-sm text-gray-600">Step {step} of 2: Payment Confirmation</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Payment Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-900">{paymentInfo.title}</h3>
                    <p className="text-sm text-blue-700 mt-1">{paymentInfo.description}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-lg font-bold text-blue-900">
                        {paymentInfo.amount.toLocaleString()} {paymentInfo.currency}
                      </span>
                      <span className="text-sm text-blue-600">
                        Due: {request?.paymentDueDate ? new Date(request.paymentDueDate).toLocaleDateString() : 'ASAP'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              {paymentMethods.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Available Payment Methods</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          formData.paymentMethod === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
                      >
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-5 w-5 text-gray-600" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{method.name}</p>
                            <p className="text-sm text-gray-600">{method.accountName}</p>
                            <p className="text-sm text-gray-600 font-mono">{method.accountNumber}</p>
                            {method.bankName && (
                              <p className="text-xs text-gray-500">{method.bankName}</p>
                            )}
                          </div>
                          {formData.paymentMethod === method.id && (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirmation Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        name="confirmationName"
                        value={formData.confirmationName}
                        onChange={handleInputChange}
                        placeholder="Name as shown on transfer"
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        name="confirmationPhone"
                        value={formData.confirmationPhone}
                        onChange={handleInputChange}
                        placeholder="Your phone number"
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transfer Amount <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        name="transferAmount"
                        value={formData.transferAmount}
                        onChange={handleInputChange}
                        placeholder="Amount transferred"
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transfer Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        name="transferDate"
                        value={formData.transferDate}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Reference (Optional)
                  </label>
                  <input
                    type="text"
                    name="paymentReference"
                    value={formData.paymentReference}
                    onChange={handleInputChange}
                    placeholder="Transaction ID or reference number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any additional information about your payment..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Proof (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      className="hidden"
                      id="proofFile"
                    />
                    <label htmlFor="proofFile" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600">
                        {formData.proofFile ? (
                          <span className="text-blue-600 font-medium">
                            {formData.proofFile.name} selected
                          </span>
                        ) : (
                          <>
                            Click to upload payment proof
                            <br />
                            <span className="text-xs text-gray-500">
                              JPEG, PNG, or PDF (max 5MB)
                            </span>
                          </>
                        )}
                      </p>
                    </label>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium">Important:</p>
                      <ul className="mt-1 space-y-1">
                        <li>• Ensure the transfer amount matches exactly</li>
                        <li>• Use the correct account details provided above</li>
                        <li>• Keep your transfer receipt for reference</li>
                        <li>• Admin will review and approve within 24 hours</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Confirm Payment</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentConfirmationModal;
