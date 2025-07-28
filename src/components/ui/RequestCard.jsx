import { Mail, Phone, Eye } from 'lucide-react';
import Badge from './Badge';
import Button from './Button';

const RequestCard = ({ 
  request, 
  onContactEmployer, 
  onViewDetails,
  getStatusColor,
  getPriorityColor 
}) => {
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
        Requesting: <span className="font-medium">{request.candidateName}</span> for {request.position}
      </p>
      
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