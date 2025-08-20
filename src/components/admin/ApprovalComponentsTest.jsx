import React, { useState } from 'react';
import StatusBadge from '../ui/StatusBadge';
import ApprovalActions from './ApprovalActions';
import RejectionReasonModal from './RejectionReasonModal';

const ApprovalComponentsTest = () => {
  const [currentStatus, setCurrentStatus] = useState('pending');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState({
    id: 1,
    name: 'John Doe',
    status: 'pending'
  });

  const handleApprovalChange = async (newStatus) => {
    if (newStatus === 'rejected') {
      // Open rejection modal
      setShowRejectionModal(true);
      return;
    }

    // Simulate API call
    console.log(`Changing status from ${currentStatus} to ${newStatus}`);
    
    // Update status
    setCurrentStatus(newStatus);
    setSelectedProfile(prev => ({ ...prev, status: newStatus }));
  };

  const handleRejectionSubmit = async (reason) => {
    console.log('Rejection reason submitted:', reason);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update status
    setCurrentStatus('rejected');
    setSelectedProfile(prev => ({ ...prev, status: 'rejected' }));
    setShowRejectionModal(false);
  };

  const resetToPending = () => {
    setCurrentStatus('pending');
    setSelectedProfile(prev => ({ ...prev, status: 'pending' }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Approval Components Test
        </h1>
        <p className="text-gray-600">
          Testing all three foundation components for the approval system
        </p>
      </div>

      {/* Status Badge Tests */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">StatusBadge Component Tests</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">All Statuses:</h3>
            <div className="flex flex-wrap gap-4">
              <StatusBadge status="pending" />
              <StatusBadge status="approved" />
              <StatusBadge status="rejected" />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Different Sizes:</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <StatusBadge status="pending" size="sm" />
              <StatusBadge status="approved" size="md" />
              <StatusBadge status="rejected" size="lg" />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Without Icons:</h3>
            <div className="flex flex-wrap gap-4">
              <StatusBadge status="pending" showIcon={false} />
              <StatusBadge status="approved" showIcon={false} />
              <StatusBadge status="rejected" showIcon={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Approval Actions Tests */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">ApprovalActions Component Tests</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Current Status: {currentStatus}</h3>
            <ApprovalActions
              profileId={selectedProfile.id}
              currentStatus={currentStatus}
              onApprovalChange={handleApprovalChange}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={resetToPending}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Reset to Pending
            </button>
            <button
              onClick={() => setCurrentStatus('approved')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Set to Approved
            </button>
            <button
              onClick={() => setCurrentStatus('rejected')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Set to Rejected
            </button>
          </div>
        </div>
      </div>

      {/* Rejection Modal Test */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">RejectionReasonModal Test</h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            Click the button below to test the rejection reason modal
          </p>
          <button
            onClick={() => setShowRejectionModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Open Rejection Modal
          </button>
        </div>
      </div>

      {/* Current Profile State */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Current Profile State:</h3>
        <pre className="text-sm text-gray-600 bg-white p-3 rounded border">
          {JSON.stringify(selectedProfile, null, 2)}
        </pre>
      </div>

      {/* Rejection Modal */}
      <RejectionReasonModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onSubmit={handleRejectionSubmit}
        profileName={selectedProfile.name}
      />
    </div>
  );
};

export default ApprovalComponentsTest;
