import React from 'react';
import { 
  User, 
  MessageSquare, 
  Send, 
  RefreshCw, 
  FileText,
  CreditCard,
  History
} from 'lucide-react';
import Modal from '../ui/Modal';
import API_CONFIG from '../../api/config/apiConfig';

const RequestDetailsModal = ({ 
  isOpen, 
  onClose, 
  selectedRequest, 
  messages, 
  newMessage, 
  setNewMessage, 
  sendMessage, 
  messagingLoading,
  paymentHistory,
  loadingPaymentHistory,
  getStatusColor,
  getPriorityColor,
  getProgressColor,
  getProgressPercentage
}) => {
  if (!selectedRequest) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Request Details - #${selectedRequest.id}`}
      maxWidth="max-w-6xl"
    >
      <div className="space-y-6">
        {/* Request Information */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Request Information
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                  {selectedRequest.status ? selectedRequest.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Priority</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedRequest.priority)}`}>
                  {selectedRequest.priority ? selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1) : 'Unknown'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="text-gray-900">
                  {new Date(selectedRequest.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Progress</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(getProgressPercentage(selectedRequest))}`}
                      style={{ width: `${getProgressPercentage(selectedRequest)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{getProgressPercentage(selectedRequest)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Information */}
        {selectedRequest.candidate && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Candidate Information
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              {/* Profile Header with Image */}
              <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-200">
                {selectedRequest.candidate.photo ? (
                  <img
                    src={selectedRequest.candidate.photo.startsWith('http') 
                      ? selectedRequest.candidate.photo 
                      : `${API_CONFIG.BASE_URL}/${selectedRequest.candidate.photo.replace(/^\//, '')}`
                    }
                    alt={selectedRequest.candidate.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/64/64';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-600" />
                  </div>
                )}
                <div>
                  <h5 className="text-lg font-semibold text-gray-900">{selectedRequest.candidate.name}</h5>
                  <p className="text-sm text-gray-600">{selectedRequest.candidate.skills}</p>
                  <p className="text-sm font-medium text-green-600">{selectedRequest.candidate.monthlyRate}</p>
                </div>
              </div>

              {/* Candidate Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Experience</p>
                  <p className="text-gray-900">{selectedRequest.candidate.experience}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-900">
                    {typeof selectedRequest.candidate.location === 'object' 
                      ? `${selectedRequest.candidate.location.city || ''}, ${selectedRequest.candidate.location.country || ''}`.replace(/^,\s*|,\s*$/g, '') 
                      : selectedRequest.candidate.location || 'Not specified'}
                  </p>
                </div>
                {selectedRequest.candidate.contactNumber && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contact</p>
                    <p className="text-gray-900">{selectedRequest.candidate.contactNumber}</p>
                  </div>
                )}
                {selectedRequest.candidate.email && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{selectedRequest.candidate.email}</p>
                  </div>
                )}
              </div>

              {/* Access Control */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">Access Control</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Image Access</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedRequest.imageAccessGranted 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedRequest.imageAccessGranted ? 'Granted' : 'Not Granted'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contact Access</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedRequest.contactAccessGranted 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedRequest.contactAccessGranted ? 'Granted' : 'Not Granted'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Access Level</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedRequest.candidate?.accessLevel === 'full' ? 'bg-green-100 text-green-800' :
                      selectedRequest.candidate?.accessLevel === 'photo' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedRequest.candidate?.accessLevel === 'full' ? 'Full Access' :
                       selectedRequest.candidate?.accessLevel === 'photo' ? 'Photo Access' : 'No Access'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment History */}
        {selectedRequest.paymentRequired && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <History className="h-5 w-5 mr-2 text-blue-600" />
              Payment History
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount Required</p>
                  <p className="text-lg font-semibold text-green-600">
                    {selectedRequest.paymentAmount} {selectedRequest.paymentCurrency}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Due Date</p>
                  <p className="text-gray-900">
                    {selectedRequest.paymentDueDate ? new Date(selectedRequest.paymentDueDate).toLocaleDateString() : 'Not specified'}
                  </p>
                </div>
                {selectedRequest.paymentDescription && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="text-gray-900">{selectedRequest.paymentDescription}</p>
                  </div>
                )}
              </div>
              
              {/* Payment History List */}
              {loadingPaymentHistory ? (
                <div className="text-center py-4">
                  <RefreshCw className="animate-spin h-6 w-6 text-blue-500 mx-auto" />
                  <p className="text-gray-600">Loading payment history...</p>
                </div>
              ) : paymentHistory.length === 0 ? (
                <div className="text-center py-4">
                  <CreditCard className="h-10 w-10 text-gray-400 mx-auto" />
                  <p className="text-gray-600">No payments made yet for this request.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h5 className="text-sm font-semibold text-gray-700">All Payments</h5>
                  {paymentHistory.map((payment, index) => (
                    <div key={payment.id || index} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Amount</p>
                          <p className="text-base font-semibold text-gray-900">
                            {payment.amount} {payment.currency}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Status</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            payment.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {payment.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : 'Unknown'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date</p>
                          <p className="text-sm text-gray-900">
                            {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'Not specified'}
                          </p>
                        </div>
                      </div>
                      {payment.confirmationName && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-500">Confirmed by:</span>
                              <span className="ml-2 text-gray-900">{payment.confirmationName}</span>
                            </div>
                            {payment.confirmationPhone && (
                              <div>
                                <span className="font-medium text-gray-500">Phone:</span>
                                <span className="ml-2 text-gray-900">{payment.confirmationPhone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages Section */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
            Messages
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            {messagingLoading ? (
              <div className="text-center py-4">
                <RefreshCw className="animate-spin h-6 w-6 text-blue-500 mx-auto" />
                <p className="text-gray-600">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-4">
                <MessageSquare className="h-10 w-10 text-gray-400 mx-auto" />
                <p className="text-gray-600">No messages yet for this request.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.fromAdmin ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.fromAdmin
                          ? 'bg-white text-gray-900 border border-gray-200'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div className={`text-xs mt-1 ${
                        message.fromAdmin ? 'text-gray-500' : 'text-blue-100'
                      }`}>
                        {new Date(message.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Message Input */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || messagingLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RequestDetailsModal;
