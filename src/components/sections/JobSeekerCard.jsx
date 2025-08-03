import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Briefcase, 
  Calendar, 
  BookOpen, 
  Award, 
  Globe, 
  Eye 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

import { truncateText, formatExperience, maskName, formatExperienceDisplay } from '../../utils/helpers';
import defaultProfileImage from '../../assets/defaultProfileImage.jpeg';

const JobSeekerCard = ({ 
  seeker, 
  variant = 'compact',
  showActions = true,
  onViewProfile,
  className = '',
  ...props 
}) => {
  const { t } = useTranslation();
  const [showFullBio, setShowFullBio] = useState(false);

  // Defensive programming: ensure seeker object exists
  if (!seeker) {
    console.warn('JobSeekerCard: seeker prop is undefined or null');
    return null;
  }

  // Component rendering

  // Ensure required fields exist with fallbacks
  const {
    name = 'Unknown',
    title = 'No Title',
    location = 'Unknown Location',
    experience = 0,
    skills = [],
    avatar = null,
    availability = 'Unknown',
    languages = ['English'],
    education = 'Not specified',
    certifications = [],
    bio = 'No description available'
  } = seeker;

  const compactVariant = (
    <Card className={`job-seeker-card h-[380px] bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden group ${className}`} {...props}>
      <div className="h-full flex flex-col">
        {/* Header Section */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-xl overflow-hidden mr-4 shadow-lg">
                <img 
                  src={defaultProfileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{maskName(name)}</h3>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                    {title}
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            {showActions && (
              <Link to={`/view-profile/${seeker.id}`}>
                <button className="px-3 py-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium">
                  <Eye className="w-4 h-4" />
                  View Profile
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 flex-1 space-y-4">
          <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            <span className="font-medium">{location}</span>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1 block">Experience</span>
            <p className="text-sm text-gray-700 font-medium">{formatExperienceDisplay(experience)}</p>
          </div>



          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
                  +{skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>


      </div>
    </Card>
  );

  const detailedVariant = (
    <Card className={`job-seeker-card h-[480px] bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden group ${className}`} {...props}>
      <div className="h-full flex flex-col">
        {/* Header Section */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-xl overflow-hidden mr-4 shadow-lg">
                <img 
                  src={defaultProfileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-2xl mb-1 group-hover:text-blue-600 transition-colors">{maskName(name)}</h3>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full">
                    {title}
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            {showActions && (
              <Link to={`/view-profile/${seeker.id}`}>
                <button className="px-3 py-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium">
                  <Eye className="w-4 h-4" />
                  View Profile
                </button>
              </Link>
            )}

          </div>
        </div>

        {/* Info Grid */}
        <div className="px-6 flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                <span className="font-medium">{location}</span>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1 block">Experience</span>
                <p className="text-sm text-gray-700 font-medium">{formatExperienceDisplay(experience)}</p>
              </div>

              <div className="flex items-center text-sm text-gray-600 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-100">
                <Calendar className="w-4 h-4 mr-2 text-yellow-600" />
                <span className="font-medium">Available {availability}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600 bg-purple-50 px-3 py-2 rounded-lg border border-purple-100">
                <BookOpen className="w-4 h-4 mr-2 text-purple-500" />
                <span className="font-medium">{education}</span>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Certifications</span>
                  <div className="w-8 h-1 bg-purple-200 rounded-full overflow-hidden">
                    <div className="w-5 h-1 bg-purple-500 rounded-full"></div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 font-medium">{certifications.length} certifications</p>
              </div>
              <div className="flex items-center text-sm text-gray-600 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100">
                <Globe className="w-4 h-4 mr-2 text-indigo-500" />
                <span className="font-medium">{languages.join(', ')}</span>
              </div>

            </div>
          </div>
        </div>

        {/* Skills & Bio Section */}
        <div className="px-6 flex-1 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Skills</h4>
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-hidden">
              {skills.slice(0, 6).map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                  {skill}
                </span>
              ))}
              {skills.length > 6 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
                  +{skills.length - 6} more
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">About</h4>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-600 leading-relaxed">
                {showFullBio ? bio : truncateText(bio, 120)}
              </p>
              {bio.length > 120 && (
                <button
                  onClick={() => setShowFullBio(!showFullBio)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 transition-colors duration-200"
                >
                  {showFullBio ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>
          </div>
        </div>


      </div>
    </Card>
  );

  return variant === 'detailed' ? detailedVariant : compactVariant;
};

export default JobSeekerCard; 