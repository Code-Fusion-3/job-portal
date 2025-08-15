import React from 'react';
import { Eye } from 'lucide-react';
import Avatar from './Avatar';
import defaultProfileImage from '../../assets/defaultProfileImage.jpeg';
import Badge from './Badge';
import Button from './Button';

const JobSeekerCard = ({ 
  jobSeeker, 
  onViewDetails,
  getCategoryColor,
  compact = false
}) => {
  // Add null check for jobSeeker
  if (!jobSeeker) {
    return (
      <div className="p-4 text-center text-gray-500">
        No job seeker data available
      </div>
    );
  }

  const defaultGetCategoryColor = (category) => {
    const colors = {
      'JavaScript': 'bg-yellow-100 text-yellow-800',
      'React': 'bg-blue-100 text-blue-800',
      'Node.js': 'bg-green-100 text-green-800',
      'Python': 'bg-blue-100 text-blue-800',
      'Django': 'bg-green-100 text-green-800',
      'PostgreSQL': 'bg-blue-100 text-blue-800',
      'AWS': 'bg-orange-100 text-orange-800',
      'Docker': 'bg-blue-100 text-blue-800',
      'Git': 'bg-red-100 text-red-800',
      'Java': 'bg-orange-100 text-orange-800',
      'Cooking': 'bg-red-100 text-red-800',
      'Housekeeping': 'bg-purple-100 text-purple-800',
      'Childcare': 'bg-pink-100 text-pink-800',
      'Gardening': 'bg-emerald-100 text-emerald-800',
      'Cleaning': 'bg-gray-100 text-gray-800',
      'Driving': 'bg-indigo-100 text-indigo-800',
      'Teaching': 'bg-yellow-100 text-yellow-800',
      'Nursing': 'bg-rose-100 text-rose-800',
      'Construction': 'bg-amber-100 text-amber-800',
      'Agriculture': 'bg-lime-100 text-lime-800',
      'Technology': 'bg-blue-100 text-blue-800',
      'Healthcare': 'bg-green-100 text-green-800',
      'Education': 'bg-purple-100 text-purple-800',
      'Manufacturing': 'bg-red-100 text-red-800',
      'Services': 'bg-gray-100 text-gray-800',
      'General': 'bg-gray-100 text-gray-800',
      'Job Seeker': 'bg-gray-100 text-gray-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.default;
  };

  const categoryColor = (getCategoryColor || defaultGetCategoryColor)(jobSeeker?.category || 'General');

  if (compact) {
    return (
      <div className="flex items-center space-x-3 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <Avatar 
          src={jobSeeker?.avatar} 
          alt={jobSeeker?.name || 'Job Seeker'} 
          size="sm"
          fallback={jobSeeker?.name || 'JS'}
          fallbackSrc={defaultProfileImage}
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm truncate">{jobSeeker?.name || 'Unknown'}</h4>
          <p className="text-xs text-gray-600 truncate">{jobSeeker?.title || 'Job Seeker'}</p>
          <div className="flex items-center space-x-2 mt-1">
            <Badge 
              variant="outline" 
              size="xs"
              className={categoryColor}
            >
              {jobSeeker?.category || 'General'}
            </Badge>
            <span className="text-xs text-gray-500">{jobSeeker?.location || 'Unknown'}</span>
          </div>
          {/* Display skills as small badges */}
          {jobSeeker?.category && jobSeeker.category.includes(',') && (
            <div className="flex flex-wrap gap-1 mt-1">
              {jobSeeker.category.split(',').slice(0, 3).map((skill, index) => (
                <span 
                  key={index}
                  className="inline-block px-1 py-0.5 text-xs bg-blue-100 text-blue-800 rounded"
                >
                  {skill.trim()}
                </span>
              ))}
              {jobSeeker.category.split(',').length > 3 && (
                <span className="text-xs text-gray-500">+{jobSeeker.category.split(',').length - 3} more</span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <Avatar 
        src={jobSeeker?.avatar} 
        alt={jobSeeker?.name || 'Job Seeker'} 
        size="md"
        fallback={jobSeeker?.name || 'JS'}
        fallbackSrc={defaultProfileImage}
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{jobSeeker?.name || 'Unknown'}</h3>
        <p className="text-sm text-gray-600">{jobSeeker?.title || 'Job Seeker'}</p>
        <div className="flex items-center space-x-4 mt-1">
          <span className="text-xs text-gray-500">{jobSeeker?.location || 'Unknown'}</span>
          <span className="text-xs text-gray-500">{jobSeeker?.experience || '0'} years</span>
          <Badge 
            variant="outline" 
            size="sm"
            className={categoryColor}
          >
            {jobSeeker?.category || 'General'}
          </Badge>
        </div>
        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
          <span>Daily: {jobSeeker?.dailyRate?.toLocaleString() || '0'} RWF</span>
          <span>Monthly: {jobSeeker?.monthlyRate?.toLocaleString() || '0'} RWF</span>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onViewDetails?.(jobSeeker)}
        title="View Details"
      >
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default JobSeekerCard; 