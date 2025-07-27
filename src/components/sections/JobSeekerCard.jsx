import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MapPin, Briefcase, Eye, Heart, Star, Mail, Phone, Globe, Calendar, BookOpen, Award } from 'lucide-react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Rating from '../ui/Rating';
import Button from '../ui/Button';
import { formatExperience, formatHourlyRate, truncateText } from '../../utils/helpers';

const JobSeekerCard = ({ 
  seeker, 
  variant = 'compact',
  showActions = true,
  onViewProfile,
  onFavorite,
  isFavorite = false,
  className = '',
  ...props 
}) => {
  const { t } = useTranslation();

  const compactVariant = (
    <Card className={`job-seeker-card ${className}`} {...props}>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Avatar 
            src={seeker.avatar} 
            alt={seeker.name} 
            size="lg" 
            fallback={seeker.name}
            className="mr-4"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">{seeker.name}</h3>
            <p className="text-sm text-gray-600">{seeker.title}</p>
            <div className="flex items-center mt-1">
              <Rating value={seeker.rating} size="sm" readonly />
              <span className="text-xs text-gray-500 ml-2">({seeker.reviews})</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {seeker.location}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="w-4 h-4 mr-2" />
            {formatExperience(seeker.experience)} experience
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Star className="w-4 h-4 mr-2" />
            {formatHourlyRate(seeker.hourlyRate)}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {seeker.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="primary" size="sm">
                {skill}
              </Badge>
            ))}
            {seeker.skills.length > 3 && (
              <Badge variant="outline" size="sm">
                +{seeker.skills.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {showActions && (
          <Button
            variant="outline"
            size="sm"
            className="w-full group"
            onClick={() => onViewProfile?.(seeker)}
          >
            <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            {t('jobSeekers.actions.viewProfile', 'View Profile')}
          </Button>
        )}
      </div>
    </Card>
  );

  const detailedVariant = (
    <Card className={`job-seeker-card ${className}`} {...props}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center">
            <Avatar 
              src={seeker.avatar} 
              alt={seeker.name} 
              size="xl" 
              fallback={seeker.name}
              className="mr-4"
            />
            <div>
              <h3 className="font-bold text-gray-900 text-xl">{seeker.name}</h3>
              <p className="text-lg text-gray-600">{seeker.title}</p>
              <div className="flex items-center mt-2">
                <Rating value={seeker.rating} size="md" readonly />
                <span className="text-sm text-gray-500 ml-2">({seeker.reviews} reviews)</span>
              </div>
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFavorite?.(seeker.id)}
                className={isFavorite ? 'text-red-500' : 'text-gray-400'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
          )}
        </div>

        {/* Key Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-3" />
              <span>{seeker.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Briefcase className="w-4 h-4 mr-3" />
              <span>{formatExperience(seeker.experience)} experience</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Star className="w-4 h-4 mr-3" />
              <span>{formatHourlyRate(seeker.hourlyRate)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-3" />
              <span>{seeker.availability}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <BookOpen className="w-4 h-4 mr-3" />
              <span>{seeker.education}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Award className="w-4 h-4 mr-3" />
              <span>{seeker.certifications.length} certifications</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Globe className="w-4 h-4 mr-3" />
              <span>{seeker.languages.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">About</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            {truncateText(seeker.bio, 200)}
          </p>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {seeker.skills.map((skill, index) => (
              <Badge key={index} variant="primary" size="md">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Contact & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <Mail className="w-4 h-4 mr-2" />
              {t('contact.email', 'Email')}
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <Phone className="w-4 h-4 mr-2" />
              {t('contact.phone', 'Call')}
            </Button>
          </div>
          
          {showActions && (
            <Button
              variant="primary"
              size="md"
              onClick={() => onViewProfile?.(seeker)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {t('jobSeekers.actions.viewProfile', 'View Full Profile')}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return variant === 'detailed' ? detailedVariant : compactVariant;
};

export default JobSeekerCard; 