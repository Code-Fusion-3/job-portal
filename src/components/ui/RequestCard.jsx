import { Mail, Phone, Eye } from 'lucide-react';
import Badge from './Badge';
import Button from './Button';
import { getStatusLabel } from '../../utils/adminHelpers';

const RequestCard = ({ 
  request, 
  onContactEmployer, 
  onViewDetails,
  getStatusColor,
  getPriorityColor,
  compact = false
}) => {
  // Add null check for request
  if (!request) {
    return (
      <div className="p-4 text-center text-gray-500">
        No request data available
      </div>
    );
  }

  // Map API response properties to component expectations
  const employerName = request.name || request.employerName || 'Unknown Employer';
  const companyName = request.companyName || 'Unknown Company';
  const status = request.status || 'pending';
  const priority = request.priority || 'normal';
  const message = request.message || 'No message provided';
  const email = request.email || '';
  const phoneNumber = request.phoneNumber || '';
  const createdAt = request.createdAt || new Date().toISOString();
  
  // Handle candidate data - check for both selected and requested candidates
  const hasSelectedCandidate = request.selectedUser || request.hasSelectedCandidate;
  const requestedCandidate = request.requestedCandidate;
  const selectedCandidate = request.selectedUser;
  
  // Determine candidate name and info
  let candidateName = 'No candidate selected';
  let candidateInfo = null;
  
  if (hasSelectedCandidate && selectedCandidate?.profile) {
    // Has selected candidate
    candidateName = `${selectedCandidate.profile.firstName} ${selectedCandidate.profile.lastName}`;
    candidateInfo = selectedCandidate;
  } else if (requestedCandidate?.profile) {
    // Has requested candidate but not selected
    candidateName = `${requestedCandidate.profile.firstName} ${requestedCandidate.profile.lastName}`;
    candidateInfo = requestedCandidate;
  }
  
  const position = request.position || 'General position';

  if (compact) {
    return (
      <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 text-sm truncate">{employerName}</h4>
            <p className="text-xs text-gray-600 truncate">{companyName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              size="xs"
              className={getStatusColor ? getStatusColor(status) : 'bg-gray-100 text-gray-800'}
            >
              {getStatusLabel(status)}
            </Badge>
            <Badge 
              variant="outline" 
              size="xs"
              className={getPriorityColor ? getPriorityColor(priority) : 'bg-gray-100 text-gray-800'}
            >
              {priority}
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
          {hasSelectedCandidate ? (
            <div className="flex items-center space-x-2">
              <span className="text-green-600 text-xs font-medium">✓ Selected:</span>
              <span className="text-sm font-medium text-gray-900">{candidateName}</span>
              <span className="text-xs text-gray-600">for {position}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-orange-600 text-xs font-medium">⏳ Requesting:</span>
              <span className="text-sm font-medium text-gray-900">{candidateName}</span>
              <span className="text-xs text-gray-600">for {position}</span>
            </div>
          )}
          
          {/* Show candidate skills if available */}
          {candidateInfo?.profile?.skills && (
            <div className="mt-1">
              <span className="text-xs text-gray-500">Skills: </span>
              <span className="text-xs text-gray-700">{candidateInfo.profile.skills}</span>
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
          <h3 className="font-medium text-gray-900">{employerName}</h3>
          <p className="text-sm text-gray-600">{companyName}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            variant="outline" 
            size="sm"
            className={getStatusColor ? getStatusColor(status) : 'bg-gray-100 text-gray-800'}
          >
            {getStatusLabel(status)}
          </Badge>
          <Badge 
            variant="outline" 
            size="sm"
            className={getPriorityColor ? getPriorityColor(priority) : 'bg-gray-100 text-gray-800'}
          >
            {priority}
          </Badge>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">
        {message}
      </p>
      
      <div className="flex items-center space-x-4 mb-3">
        {email && (
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{email}</span>
          </div>
        )}
        {phoneNumber && (
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{phoneNumber}</span>
          </div>
        )}
      </div>
      
      {/* Candidate Information */}
      <div className="border-t pt-3">
        <h4 className="font-medium text-gray-900 mb-2">Candidate Information</h4>
        {hasSelectedCandidate ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-green-600 text-sm font-medium">✓ Selected Candidate:</span>
              <span className="text-sm font-medium text-gray-900">{candidateName}</span>
            </div>
            {candidateInfo?.profile?.skills && (
              <div>
                <span className="text-xs text-gray-500">Skills: </span>
                <span className="text-sm text-gray-700">{candidateInfo.profile.skills}</span>
              </div>
            )}
            {candidateInfo?.profile?.experience && (
              <div>
                <span className="text-xs text-gray-500">Experience: </span>
                <span className="text-sm text-gray-700">{candidateInfo.profile.experience}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            No candidate selected yet
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-xs text-gray-500">
          Created: {new Date(createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center space-x-2">
          {onContactEmployer && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onContactEmployer(request)}
            >
              Contact Employer
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onViewDetails?.(request)}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequestCard; 