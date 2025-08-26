import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  DollarSign,
  Eye,
  MessageSquare,
  FileText
} from 'lucide-react';

const RequestProgressTracker = ({ request, className = '' }) => {
  const getProgressSteps = () => {
    const steps = [
      {
        id: 'request_submitted',
        title: 'Request Submitted',
        description: 'Your request has been received',
        icon: FileText,
        status: 'completed'
      },
      {
        id: 'admin_review',
        title: 'Admin Review',
        description: 'Admin is reviewing your request',
        icon: User,
        status: request.status === 'pending' ? 'current' : 'completed'
      },
      {
        id: 'payment_requested',
        title: 'Payment Requested',
        description: 'Payment required for access',
        icon: DollarSign,
        status: request.status === 'payment_required' ? 'current' : 
               ['payment_confirmed', 'approved', 'completed'].includes(request.status) ? 'completed' : 'pending'
      },
      {
        id: 'payment_confirmed',
        title: 'Payment Confirmed',
        description: 'Payment received, awaiting approval',
        icon: CheckCircle,
        status: request.status === 'payment_confirmed' ? 'current' : 
               ['approved', 'completed'].includes(request.status) ? 'completed' : 'pending'
      },
      {
        id: 'access_granted',
        title: 'Access Granted',
        description: 'Candidate information available',
        icon: Eye,
        status: request.status === 'approved' ? 'current' : 
               request.status === 'completed' ? 'completed' : 'pending'
      }
    ];

    return steps;
  };

  const getStepIcon = (step) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'current':
        return <Clock className="h-6 w-6 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="h-6 w-6 text-gray-400" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStepColor = (step) => {
    switch (step.status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'current':
        return 'border-blue-200 bg-blue-50';
      case 'pending':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getStepTextColor = (step) => {
    switch (step.status) {
      case 'completed':
        return 'text-green-800';
      case 'current':
        return 'text-blue-800';
      case 'pending':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const getNextSteps = () => {
    if (request.status === 'pending') {
      return [
        'Admin will review your request within 24 hours',
        'You will receive payment instructions via email',
        'Prepare payment details for the requested amount'
      ];
    }
    
    if (request.status === 'payment_required') {
      return [
        'Make payment using the provided account details',
        'Ensure transfer amount matches exactly',
        'Submit payment confirmation with transfer details'
      ];
    }
    
    if (request.status === 'payment_confirmed') {
      return [
        'Admin will review your payment confirmation',
        'Approval usually takes 2-4 hours',
        'You will be notified when access is granted'
      ];
    }
    
    if (request.status === 'approved') {
      return [
        'View candidate photo and basic information',
        'Contact candidate if interested',
        'Request full details if needed (additional payment)'
      ];
    }
    
    return ['Request completed successfully'];
  };

  const getCurrentStage = () => {
    const currentStep = getProgressSteps().find(step => step.status === 'current');
    return currentStep ? currentStep.title : 'Request Submitted';
  };

  const getEstimatedTime = () => {
    switch (request.status) {
      case 'pending':
        return '24 hours';
      case 'payment_required':
        return 'Immediate (after payment)';
      case 'payment_confirmed':
        return '2-4 hours';
      case 'approved':
        return 'Immediate';
      default:
        return 'Varies';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Request Progress</h3>
          <p className="text-sm text-gray-600">Track your request through each stage</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Current Stage</div>
          <div className="text-lg font-semibold text-blue-600">{getCurrentStage()}</div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="space-y-4 mb-8">
        {getProgressSteps().map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative border rounded-lg p-4 ${getStepColor(step)}`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getStepIcon(step)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-medium ${getStepTextColor(step)}`}>
                    {step.title}
                  </h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    step.status === 'completed' ? 'bg-green-100 text-green-800' :
                    step.status === 'current' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {step.status === 'completed' ? 'Completed' :
                     step.status === 'current' ? 'In Progress' : 'Pending'}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${getStepTextColor(step)}`}>
                  {step.description}
                </p>
                
                {/* Additional info for current step */}
                {step.status === 'current' && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 text-sm text-blue-700">
                      <Clock className="h-4 w-4" />
                      <span>Estimated time: {getEstimatedTime()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Progress line */}
            {index < getProgressSteps().length - 1 && (
              <div className="absolute left-7 top-16 w-0.5 h-8 bg-gray-200 transform -translate-x-1/2" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Next Steps */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Next Steps</h4>
        <div className="space-y-2">
          {getNextSteps().map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-2"
            >
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <span className="text-sm text-gray-600">{step}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Status Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Need help?</span>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestProgressTracker;
