import { Mail, Phone, Eye } from 'lucide-react';
import Badge from './Badge';
import Button from './Button';

const RequestCard = ({ 
  request, 
  onContactEmployer, 
  onViewDetails,
  getStatusColor,
  getPriorityColor,
  compact = false
}) => {
  if (compact) {
    return (
      <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 text-sm truncate">{request.employerName}</h4>
            <p className="text-xs text-gray-600 truncate">{request.companyName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              size="xs"
              className={getStatusColor(request.status)}
            >
              {request.status}
            </Badge>
            <Badge 
              variant="outline" 
              size="xs"
              className={getPriorityColor(request.priority)}
            >
              {request.priority}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onViewDetails?.(request)}
              title="View Details"
            >
              <Eye className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        {/* Candidate Information in Compact Mode */}
        <div className="mt-2">
          {request.hasSelectedCandidate ? (
            <div className="flex items-center space-x-2">
              <span className="text-green-600 text-xs font-medium">✓ Selected:</span>
              <span className="text-sm font-medium text-gray-900">{request.candidateName}</span>
              <span className="text-xs text-gray-600">for {request.position}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-orange-600 text-xs font-medium">⏳ Requesting:</span>
              <span className="text-sm font-medium text-gray-900">{request.candidateName}</span>
              <span className="text-xs text-gray-600">for {request.position}</span>
            </div>
          )}
          
          {/* Show selected candidate skills if available */}
          {request.hasSelectedCandidate && request.selectedCandidate?.profile?.skills && (
            <div className="mt-1">
              <span className="text-xs text-gray-500">Skills: </span>
              <span className="text-xs text-gray-700">{request.selectedCandidate.profile.skills}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-medium text-gray-900">{request.employerName}</h3>
          <p className="text-sm text-gray-600">{request.companyName}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            variant="outline" 
            size="sm"
            className={getStatusColor(request.status)}
          >
            {request.status}
          </Badge>
          <Badge 
            variant="outline" 
            size="sm"
            className={getPriorityColor(request.priority)}
          >
            {request.priority}
          </Badge>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">
        {request.hasSelectedCandidate ? (
          <>
            <span className="text-green-600 font-medium">✓ Selected:</span> <span className="font-medium">{request.candidateName}</span> for {request.position}
          </>
        ) : (
          <>
            <span className="text-orange-600 font-medium">⏳ Requesting:</span> <span className="font-medium">{request.candidateName}</span> for {request.position}
          </>
        )}
      </p>
      
      {/* Selected Candidate Information */}
      {request.hasSelectedCandidate && request.selectedCandidate && (
        <div className="bg-green-50 p-3 rounded-lg mb-3">
          <h4 className="text-sm font-medium text-green-900 mb-2">Selected Candidate:</h4>
          <div className="space-y-1 text-sm">
            <p className="text-green-800">
              <span className="font-medium">Name:</span> {request.selectedCandidate.profile?.firstName} {request.selectedCandidate.profile?.lastName}
            </p>
            <p className="text-green-800">
              <span className="font-medium">Skills:</span> {request.selectedCandidate.profile?.skills}
            </p>
            {request.selectedCandidate.profile?.experience && (
              <p className="text-green-800">
                <span className="font-medium">Experience:</span> {request.selectedCandidate.profile.experience}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Requested Candidate Information (if different from selected) */}
      {request.requestedCandidate && request.selectedCandidate && 
       request.requestedCandidate.id !== request.selectedCandidate.id && (
        <div className="bg-blue-50 p-3 rounded-lg mb-3">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Originally Requested:</h4>
          <div className="space-y-1 text-sm">
            <p className="text-blue-800">
              <span className="font-medium">Name:</span> {request.requestedCandidate.profile?.firstName} {request.requestedCandidate.profile?.lastName}
            </p>
            <p className="text-blue-800">
              <span className="font-medium">Skills:</span> {request.requestedCandidate.profile?.skills}
            </p>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <span>Daily Rate: {request.dailyRate.toLocaleString()} RWF</span>
        <span>Monthly Rate: {request.monthlyRate.toLocaleString()} RWF</span>
      </div>
      
      {/* Employer Contact Information */}
      <div className="bg-gray-50 p-3 rounded-lg mb-3">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Employer Contact:</h4>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{request.employerContact.email}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Phone className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{request.employerContact.phone}</span>
          </div>
        </div>
      </div>

      {/* Admin Notes (if any) */}
      {request.adminNotes && (
        <div className="bg-blue-50 p-3 rounded-lg mb-3">
          <h4 className="text-sm font-medium text-blue-900 mb-1">Admin Notes:</h4>
          <p className="text-sm text-blue-800">{request.adminNotes}</p>
          {request.lastContactDate && (
            <p className="text-xs text-blue-600 mt-1">
              Last contact: {new Date(request.lastContactDate).toLocaleString()}
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{request.date}</span>
        <div className="flex space-x-2">
          {/* Contact Buttons */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 hover:bg-blue-50"
            onClick={() => onContactEmployer(request.employerContact, 'email')}
            title="Send Email"
          >
            <Mail className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-green-600 hover:bg-green-50"
            onClick={() => onContactEmployer(request.employerContact, 'phone')}
            title="Call Phone"
          >
            <Phone className="w-4 h-4" />
          </Button>
          
          {/* View Details Button */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onViewDetails(request)}
            title="View Details & Process"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequestCard; 