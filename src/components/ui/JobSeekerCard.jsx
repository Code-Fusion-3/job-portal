import { Eye } from 'lucide-react';
import Avatar from './Avatar';
import Badge from './Badge';
import Button from './Button';

const JobSeekerCard = ({ 
  jobSeeker, 
  onViewDetails,
  getCategoryColor 
}) => {
  return (
    <div className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <Avatar 
        src={jobSeeker.avatar} 
        alt={jobSeeker.name} 
        size="md"
        fallback={jobSeeker.name}
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{jobSeeker.name}</h3>
        <p className="text-sm text-gray-600">{jobSeeker.title}</p>
        <div className="flex items-center space-x-4 mt-1">
          <span className="text-xs text-gray-500">{jobSeeker.location}</span>
          <span className="text-xs text-gray-500">{jobSeeker.experience} years</span>
          <Badge 
            variant="outline" 
            size="sm"
            className={getCategoryColor(jobSeeker.category)}
          >
            {jobSeeker.category}
          </Badge>
        </div>
        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
          <span>Daily: {jobSeeker.dailyRate.toLocaleString()} RWF</span>
          <span>Monthly: {jobSeeker.monthlyRate.toLocaleString()} RWF</span>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onViewDetails(jobSeeker)}
        title="View Details"
      >
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default JobSeekerCard; 