import React, { useState } from 'react';
import {
  User,
  MessageSquare,
  Send,
  RefreshCw,
  FileText,
  CreditCard,
  History,
  Download,
  Eye,
  EyeOff,
  Shield,
  ShieldCheck,
  ShieldX,
  AlertCircle,
  CheckCircle,
  Clock,
  Lock,
  Unlock
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
  const [showFullImage, setShowFullImage] = useState(false);

  if (!selectedRequest) return null;

  // Function to download candidate information as PDF
  const downloadCandidatePDF = (request) => {
    if (!request.candidate) return;

    const candidate = request.candidate;
    const accessInfo = getAccessInfo();

    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${candidate.name} - Candidate Information</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px; }
            .header h1 { color: #2563eb; margin: 0; }
            .section { margin-bottom: 20px; }
            .section h2 { color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
            .field { margin-bottom: 8px; }
            .field strong { color: #4b5563; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .sensitive { background-color: #f0f9ff; padding: 15px; border-left: 4px solid #10b981; margin-top: 20px; }
            .sensitive h3 { color: #065f46; margin-top: 0; }
            .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${candidate.name}</h1>
            <p>Candidate Information Report - Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="section">
            <h2>Basic Information</h2>
            <div class="grid">
              <div class="field"><strong>Name:</strong> ${candidate.name}</div>
              <div class="field"><strong>Skills:</strong> ${candidate.skills || 'Not specified'}</div>
              <div class="field"><strong>Experience:</strong> ${candidate.experience || 'Not specified'}</div>
              <div class="field"><strong>Experience Level:</strong> ${candidate.experienceLevel || 'Not specified'}</div>
              <div class="field"><strong>Education Level:</strong> ${candidate.educationLevel || 'Not specified'}</div>
              <div class="field"><strong>Monthly Rate:</strong> ${candidate.monthlyRate || 'Not specified'}</div>
              <div class="field"><strong>Location:</strong> ${typeof candidate.location === 'object' ?
        `${candidate.location.city || ''}, ${candidate.location.country || ''}`.replace(/^,\\s*|,\\s*$/g, '') :
        candidate.location || 'Not specified'}</div>
              <div class="field"><strong>Availability:</strong> ${candidate.availability || 'Not specified'}</div>
              <div class="field"><strong>Languages:</strong> ${candidate.languages || 'Not specified'}</div>
            </div>
          </div>

          ${candidate.description ? `
            <div class="section">
              <h2>Description</h2>
              <p>${candidate.description}</p>
            </div>
          ` : ''}

          ${candidate.certifications ? `
            <div class="section">
              <h2>Certifications</h2>
              <p>${candidate.certifications}</p>
            </div>
          ` : ''}

          ${accessInfo.canViewContact ? `
            <div class="section">
              <h2>Contact Information</h2>
              <div class="field"><strong>Phone:</strong> ${candidate.contactNumber || 'Not provided'}</div>
            </div>
          ` : ''}

          ${(accessInfo.hasFullAccess || candidate.accessLevel === 'full') ? `
            <div class="sensitive">
              <h3>🔒 Sensitive Information (Full Access)</h3>
              <div class="grid">
                ${candidate.idNumber ? `<div class="field"><strong>ID Number:</strong> ${candidate.idNumber}</div>` : ''}
                ${candidate.dateOfBirth ? `<div class="field"><strong>Date of Birth:</strong> ${new Date(candidate.dateOfBirth).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        })}</div>` : ''}
                ${candidate.maritalStatus ? `<div class="field"><strong>Marital Status:</strong> ${candidate.maritalStatus}</div>` : ''}
                ${candidate.gender ? `<div class="field"><strong>Gender:</strong> ${candidate.gender}</div>` : ''}
              </div>
              ${candidate.references ? `
                <div style="margin-top: 15px;">
                  <strong>References:</strong><br>
                  <p>${candidate.references}</p>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <div class="footer">
            <p>This document contains confidential information. Please handle with care.</p>
            <p>Generated by Braziconnect Portal System - Request ID: ${request.id}</p>
          </div>
        </body>
      </html>
    `;

    // Create and download PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load then trigger print
    printWindow.onload = () => {
      printWindow.print();
      // Close the window after a delay to allow printing
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    };
  };

  // Helper function to determine payment status based on payment data and request status
  const getPaymentStatusText = (payment, requestStatus) => {
    if (!payment) return 'Unknown';

    // Debug logging
    console.log('🔍 Payment Status Debug:', {
      paymentType: payment.paymentType,
      paymentStatus: payment.status,
      requestStatus: requestStatus,
      paymentId: payment.id
    });

    // Check if payment is approved based on request status
    // Handle both explicit paymentType and implicit type based on request status
    const isPhotoPaymentApproved = (
      (payment.paymentType === 'photo_access' || payment.paymentType === 'photo' ||
        (!payment.paymentType && ['photo_access_granted', 'second_payment_required', 'second_payment_confirmed', 'full_access_granted', 'completed'].includes(requestStatus))) &&
      ['photo_access_granted', 'second_payment_required', 'second_payment_confirmed', 'full_access_granted', 'completed'].includes(requestStatus)
    );

    const isFullPaymentApproved = (
      (payment.paymentType === 'full_details' || payment.paymentType === 'full' ||
        (!payment.paymentType && ['full_access_granted', 'completed'].includes(requestStatus))) &&
      ['full_access_granted', 'completed'].includes(requestStatus)
    );

    console.log('🔍 Approval Check:', {
      isPhotoPaymentApproved,
      isFullPaymentApproved,
      finalResult: isPhotoPaymentApproved || isFullPaymentApproved ? 'Approved by Admin' : 'Not approved'
    });

    if (isPhotoPaymentApproved || isFullPaymentApproved) {
      return 'Approved by Admin';
    }

    switch (payment.status) {
      case 'confirmed':
        return 'Confirmed - Pending Admin Approval';
      case 'approved':
        return 'Approved by Admin';
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending Payment';
      case 'rejected':
        return 'Rejected';
      case 'failed':
        return 'Failed';
      default:
        return payment.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : 'Unknown';
    }
  };

  // Helper function to get payment status color
  const getPaymentStatusColor = (payment, requestStatus) => {
    if (!payment) return 'bg-gray-100 text-gray-800';

    // Check if payment is approved based on request status
    // Handle both explicit paymentType and implicit type based on request status
    const isPhotoPaymentApproved = (
      (payment.paymentType === 'photo_access' || payment.paymentType === 'photo' ||
        (!payment.paymentType && ['photo_access_granted', 'second_payment_required', 'second_payment_confirmed', 'full_access_granted', 'completed'].includes(requestStatus))) &&
      ['photo_access_granted', 'second_payment_required', 'second_payment_confirmed', 'full_access_granted', 'completed'].includes(requestStatus)
    );

    const isFullPaymentApproved = (
      (payment.paymentType === 'full_details' || payment.paymentType === 'full' ||
        (!payment.paymentType && ['full_access_granted', 'completed'].includes(requestStatus))) &&
      ['full_access_granted', 'completed'].includes(requestStatus)
    );

    if (isPhotoPaymentApproved || isFullPaymentApproved) {
      return 'bg-green-100 text-green-800';
    }

    switch (payment.status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function for Access Control payment status text
  const getAccessControlStatusText = () => {
    const status = selectedRequest.status;

    // Debug logging for Access Control
    console.log('🎯 Access Control Debug:', {
      requestStatus: status,
      selectedRequest: selectedRequest
    });

    switch (status) {
      case 'pending':
      case 'approved':
      case 'first_payment_required':
      case 'second_payment_required':
        return (
          <>
            <Clock className="h-3 w-3 mr-1" />
            Payment Required
          </>
        );
      case 'first_payment_confirmed':
      case 'second_payment_confirmed':
      case 'payment_confirmed': // Legacy status
        return (
          <>
            <AlertCircle className="h-3 w-3 mr-1" />
            Paid - Pending Approval
          </>
        );
      case 'photo_access_granted':
        return (
          <>
            <CheckCircle className="h-3 w-3 mr-1" />
            Photo Access Approved
          </>
        );
      case 'full_access_granted':
      case 'completed':
        return (
          <>
            <CheckCircle className="h-3 w-3 mr-1" />
            Fully Paid & Approved
          </>
        );
      default:
        return (
          <>
            <Clock className="h-3 w-3 mr-1" />
            Payment Required
          </>
        );
    }
  };

  // Helper function for Access Control payment status color
  const getAccessControlStatusColor = () => {
    const status = selectedRequest.status;

    switch (status) {
      case 'photo_access_granted':
      case 'full_access_granted':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'first_payment_confirmed':
      case 'second_payment_confirmed':
      case 'payment_confirmed': // Legacy status
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  // Helper functions to determine access status based on request status
  const getAccessInfo = () => {
    const status = selectedRequest.status;
    const hasPhotoAccess = selectedRequest.imageAccessGranted || selectedRequest.candidate?.accessGranted?.photo;
    const hasContactAccess = selectedRequest.contactAccessGranted || selectedRequest.candidate?.accessGranted?.contact;
    const hasFullAccess = selectedRequest.candidate?.accessGranted?.full || (hasPhotoAccess && hasContactAccess);

    const paymentStatuses = [
      'first_payment_confirmed', 'photo_access_granted',
      'second_payment_confirmed', 'full_details_granted',
      'payment_confirmed', 'completed'
    ];

    const photoAccessStatuses = [
      'photo_access_granted', 'second_payment_confirmed',
      'full_details_granted', 'completed'
    ];

    const isPaid = paymentStatuses.includes(status);

    // More comprehensive photo access logic
    const canViewPhoto = hasPhotoAccess ||
      photoAccessStatuses.includes(status) ||
      selectedRequest.candidate?.accessLevel === 'photo' ||
      selectedRequest.candidate?.accessLevel === 'full';

    // Access logic improved to handle status-based permissions

    return {
      canViewPhoto,
      canViewContact: hasContactAccess || ['full_details_granted', 'completed'].includes(status) || selectedRequest.candidate?.accessLevel === 'full',
      canDownloadPhoto: canViewPhoto && isPaid,
      hasFullAccess,
      isPaid,
      status
    };
  };

  const downloadImage = async (imageUrl, candidateName) => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${candidateName.replace(/\s+/g, '_')}_photo.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const accessInfo = getAccessInfo();

  // Photo access and display logic resolved

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
              <div className="ml-auto flex items-center space-x-2">
                {(accessInfo.hasFullAccess || selectedRequest.candidate?.accessLevel === 'full') && (
                  <button
                    onClick={() => downloadCandidatePDF(selectedRequest)}
                    className="flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    title="Download Full Candidate Information as PDF"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download PDF
                  </button>
                )}
                {accessInfo.hasFullAccess && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Full Access
                  </span>
                )}
                {accessInfo.canViewPhoto && !accessInfo.hasFullAccess && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Eye className="h-3 w-3 mr-1" />
                    Photo Access
                  </span>
                )}
                {!accessInfo.canViewPhoto && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <ShieldX className="h-3 w-3 mr-1" />
                    No Access
                  </span>
                )}
              </div>
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              {/* Profile Header with Image */}
              <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-200">
                {accessInfo.canViewPhoto ? (
                  selectedRequest.candidate.photo ? (
                    <div className="relative group">
                      <img
                        src={(() => {
                          const photo = selectedRequest.candidate.photo;
                          if (!photo) return '/api/placeholder/64/64';
                          if (photo.startsWith('http')) return photo;
                          const cleanPath = photo.replace(/^\/+/, '');
                          const fullUrl = `${API_CONFIG.BASE_URL}/${cleanPath}`;
                          return fullUrl;
                        })()}
                        alt={selectedRequest.candidate.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/64/64';
                        }}
                        onClick={() => setShowFullImage(true)}
                      />
                      {accessInfo.canDownloadPhoto && (
                        <button
                          onClick={() => {
                            const photo = selectedRequest.candidate.photo;
                            const imageUrl = photo.startsWith('http')
                              ? photo
                              : `${API_CONFIG.BASE_URL}/${photo.replace(/^\/+/, '')}`;
                            downloadImage(imageUrl, selectedRequest.candidate.name);
                          }}
                          className="absolute -top-1 -right-1 p-1 bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-700"
                          title="Download Image"
                        >
                          <Download className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ) : (
                    // Photo access granted but no photo available
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300 relative">
                      <User className="h-8 w-8 text-gray-500" />
                      <div className="absolute -bottom-1 -right-1 p-1 bg-green-500 text-white rounded-full">
                        <Eye className="h-3 w-3" />
                      </div>
                    </div>
                  )
                ) : (
                  // No photo access
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center relative">
                    <Lock className="h-6 w-6 text-gray-500" />
                    <div className="absolute -bottom-1 -right-1 p-1 bg-red-500 text-white rounded-full">
                      <ShieldX className="h-3 w-3" />
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <h5 className="text-lg font-semibold text-gray-900">{selectedRequest.candidate.name}</h5>
                  <p className="text-sm text-gray-600">{selectedRequest.candidate.skills}</p>
                  <p className="text-sm font-medium text-green-600">{selectedRequest.candidate.monthlyRate}</p>
                  {!accessInfo.canViewPhoto && (
                    <div className="mt-2 flex items-center text-xs text-orange-600">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Photo access requires payment approval
                    </div>
                  )}
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
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    Phone Number
                    {!accessInfo.canViewContact && (
                      <Lock className="h-3 w-3 ml-1 text-red-500" />
                    )}
                  </p>
                  <p className="text-gray-900">
                    {accessInfo.canViewContact
                      ? (selectedRequest.candidate.contactNumber || 'Not provided')
                      : '***-***-***'}
                  </p>
                  {!accessInfo.canViewContact && (
                    <p className="text-xs text-orange-600 mt-1">Requires full details access</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    Email Address
                    {!accessInfo.canViewContact && (
                      <Lock className="h-3 w-3 ml-1 text-red-500" />
                    )}
                  </p>
                  <p className="text-gray-900">
                    {accessInfo.canViewContact
                      ? (selectedRequest.candidate.email || 'Not provided')
                      : '***@***.***'}
                  </p>
                  {!accessInfo.canViewContact && (
                    <p className="text-xs text-orange-600 mt-1">Requires full details access</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Education Level</p>
                  <p className="text-gray-900">{selectedRequest.candidate.educationLevel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Experience Level</p>
                  <p className="text-gray-900">{selectedRequest.candidate.experienceLevel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Availability</p>
                  <p className="text-gray-900">{selectedRequest.candidate.availability}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Languages</p>
                  <p className="text-gray-900">{selectedRequest.candidate.languages}</p>
                </div>
              </div>

              {/* Additional Information */}
              {selectedRequest.candidate.description && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                  <p className="text-gray-900 text-sm leading-relaxed">{selectedRequest.candidate.description}</p>
                </div>
              )}

              {selectedRequest.candidate.certifications && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-500 mb-2">Certifications</p>
                  <p className="text-gray-900 text-sm">{selectedRequest.candidate.certifications}</p>
                </div>
              )}

              {/* Sensitive Information - Only shown with full access */}
              {accessInfo.canViewContact && (accessInfo.hasFullAccess || selectedRequest.candidate?.accessLevel === 'full') && (
                <div className="mt-6 pt-4 border-t-2 border-green-200 bg-green-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <ShieldCheck className="h-5 w-5 text-green-600 mr-2" />
                    <h6 className="text-sm font-semibold text-green-900">Full Access Information</h6>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRequest.candidate.idNumber && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">ID Number</p>
                        <p className="text-gray-900 font-mono text-sm">{selectedRequest.candidate.idNumber}</p>
                      </div>
                    )}
                    {selectedRequest.candidate.dateOfBirth && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                        <p className="text-gray-900 text-sm">
                          {new Date(selectedRequest.candidate.dateOfBirth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                    {selectedRequest.candidate.maritalStatus && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Marital Status</p>
                        <p className="text-gray-900 text-sm capitalize">{selectedRequest.candidate.maritalStatus}</p>
                      </div>
                    )}
                    {selectedRequest.candidate.gender && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Gender</p>
                        <p className="text-gray-900 text-sm capitalize">{selectedRequest.candidate.gender}</p>
                      </div>
                    )}
                  </div>
                  {selectedRequest.candidate.references && (
                    <div className="mt-4 pt-3 border-t border-green-300">
                      <p className="text-sm font-medium text-gray-600 mb-2">References</p>
                      <p className="text-gray-900 text-sm leading-relaxed">{selectedRequest.candidate.references}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Access Control Status */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Access Control & Status
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="text-sm font-medium">Photo Access</span>
                      </div>
                      <div className="flex items-center">
                        {accessInfo.canViewPhoto ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <Clock className="h-4 w-4 text-orange-500 mr-1" />
                        )}
                        <span className={`text-xs font-medium ${accessInfo.canViewPhoto ? 'text-green-600' : 'text-orange-600'
                          }`}>
                          {accessInfo.canViewPhoto ? 'Granted' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-purple-500" />
                        <span className="text-sm font-medium">Contact Access</span>
                      </div>
                      <div className="flex items-center">
                        {accessInfo.canViewContact ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <Clock className="h-4 w-4 text-orange-500 mr-1" />
                        )}
                        <span className={`text-xs font-medium ${accessInfo.canViewContact ? 'text-green-600' : 'text-orange-600'
                          }`}>
                          {accessInfo.canViewContact ? 'Granted' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border">
                      <div className="flex items-center mb-2">
                        <Unlock className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm font-medium">Current Access Level</span>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${accessInfo.hasFullAccess ? 'bg-green-100 text-green-800' :
                        accessInfo.canViewPhoto ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {accessInfo.hasFullAccess ? (
                          <>
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Full Access
                          </>
                        ) : accessInfo.canViewPhoto ? (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Photo Only
                          </>
                        ) : (
                          <>
                            <ShieldX className="h-3 w-3 mr-1" />
                            No Access
                          </>
                        )}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border">
                      <div className="flex items-center mb-2">
                        <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="text-sm font-medium">Payment Status</span>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAccessControlStatusColor()
                        }`}>
                        {getAccessControlStatusText()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status-based Information */}
                {!accessInfo.canViewPhoto && (
                  <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-orange-500 mr-3 mt-0.5" />
                      <div>
                        <h6 className="text-sm font-medium text-orange-800">Photo Access Required</h6>
                        <p className="text-sm text-orange-700 mt-1">
                          Complete the first payment to unlock candidate photo and basic information.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {accessInfo.canViewPhoto && !accessInfo.canViewContact && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                      <div>
                        <h6 className="text-sm font-medium text-blue-800">Full Details Access Available</h6>
                        <p className="text-sm text-blue-700 mt-1">
                          Complete the second payment to unlock contact information and full candidate details.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {accessInfo.hasFullAccess && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                      <div>
                        <h6 className="text-sm font-medium text-green-800">Full Access Granted</h6>
                        <p className="text-sm text-green-700 mt-1">
                          You have complete access to all candidate information including contact details.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
        }

        {/* Payment History */}
        {
          selectedRequest.paymentRequired && (
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
                              {payment.payment?.amount && payment.payment?.currency ? `${payment.payment.amount} ${payment.payment.currency}` : 'Not specified'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Status</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.payment, selectedRequest.status)
                              }`}>
                              {getPaymentStatusText(payment.payment, selectedRequest.status)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Date</p>
                            <p className="text-sm text-gray-900">
                              {payment.payment?.createdAt ? new Date(payment.payment.createdAt).toLocaleDateString() : 'Not specified'}
                            </p>
                          </div>
                        </div>

                        {/* Payment Type and Method */}
                        {(payment.payment?.paymentType || payment.payment?.paymentMethod) && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              {payment.payment?.paymentType && (
                                <div>
                                  <span className="font-medium text-gray-500">Payment Type:</span>
                                  <span className="ml-2 text-gray-900 capitalize">
                                    {payment.payment.paymentType === 'photo_access' ? 'Photo Access' :
                                      payment.payment.paymentType === 'full_details' ? 'Full Details Access' :
                                        payment.payment.paymentType}
                                  </span>
                                </div>
                              )}
                              {payment.payment?.paymentMethod && (
                                <div>
                                  <span className="font-medium text-gray-500">Payment Method:</span>
                                  <span className="ml-2 text-gray-900">{payment.payment.paymentMethod}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Confirmation Details */}
                        {payment.payment?.confirmationName && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <h6 className="text-sm font-semibold text-gray-700 mb-2">Payment Confirmation Details</h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-500">Confirmed by:</span>
                                <span className="ml-2 text-gray-900">{payment.payment.confirmationName}</span>
                              </div>
                              {payment.payment?.confirmationPhone && (
                                <div>
                                  <span className="font-medium text-gray-500">Phone:</span>
                                  <span className="ml-2 text-gray-900">{payment.payment.confirmationPhone}</span>
                                </div>
                              )}
                              {payment.payment?.confirmationReference && (
                                <div>
                                  <span className="font-medium text-gray-500">Reference:</span>
                                  <span className="ml-2 text-gray-900">{payment.payment.confirmationReference}</span>
                                </div>
                              )}
                              {payment.payment?.confirmationDate && (
                                <div>
                                  <span className="font-medium text-gray-500">Confirmed on:</span>
                                  <span className="ml-2 text-gray-900">
                                    {new Date(payment.payment.confirmationDate).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {payment.payment?.status === 'confirmed' && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-start">
                                <div className="flex-shrink-0">
                                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div className="ml-3">
                                  <h4 className="text-sm font-medium text-blue-800">Waiting for Admin Approval</h4>
                                  <p className="mt-1 text-sm text-blue-700">
                                    Your payment has been confirmed and is now waiting for admin approval.
                                    If this takes longer than expected, please message the admin or call for assistance.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        }

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
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.fromAdmin
                        ? 'bg-white text-gray-900 border border-gray-200'
                        : 'bg-blue-600 text-white'
                        }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div className={`text-xs mt-1 ${message.fromAdmin ? 'text-gray-500' : 'text-blue-100'
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
      </div >

      {/* Full Image Modal */}
      {
        showFullImage && accessInfo.canViewPhoto && selectedRequest.candidate.photo && (
          <Modal
            isOpen={showFullImage}
            onClose={() => setShowFullImage(false)}
            title={`${selectedRequest.candidate.name} - Profile Photo`}
            maxWidth="max-w-3xl"
          >
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={(() => {
                    const photo = selectedRequest.candidate.photo;
                    if (!photo) return '/api/placeholder/400/400';
                    if (photo.startsWith('http')) return photo;
                    return `${API_CONFIG.BASE_URL}/${photo.replace(/^\/+/, '')}`;
                  })()}
                  alt={selectedRequest.candidate.name}
                  className="w-full max-h-96 object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/400/400';
                  }}
                />
                {accessInfo.canDownloadPhoto && (
                  <button
                    onClick={() => {
                      const photo = selectedRequest.candidate.photo;
                      const imageUrl = photo.startsWith('http')
                        ? photo
                        : `${API_CONFIG.BASE_URL}/${photo.replace(/^\/+/, '')}`;
                      downloadImage(imageUrl, selectedRequest.candidate.name);
                    }}
                    className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">{selectedRequest.candidate.name}</h5>
                  <p className="text-sm text-gray-600">{selectedRequest.candidate.skills}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">{selectedRequest.candidate.monthlyRate}</p>
                  <p className="text-xs text-gray-500">Monthly Rate</p>
                </div>
              </div>

              {!accessInfo.canDownloadPhoto && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                    <span className="text-sm text-orange-700">
                      Download requires payment approval
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Modal>
        )
      }
    </Modal >
  );
};

export default RequestDetailsModal;
