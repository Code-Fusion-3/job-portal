import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Briefcase, 
  Star, 
  Calendar, 
  BookOpen, 
  Award, 
  Globe, 
  Heart, 
  Eye 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import GlowingEffect from '../ui/GlowingEffect';
import { truncateText, formatExperience, formatDailyRate, formatMonthlyRate } from '../../utils/helpers';

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

  // Defensive programming: ensure seeker object exists
  if (!seeker) {
    console.warn('JobSeekerCard: seeker prop is undefined or null');
    return null;
  }

  // Debug logging
  console.log('JobSeekerCard rendering:', { 
    id: seeker.id, 
    name: seeker.name, 
    dailyRate: seeker.dailyRate,
    monthlyRate: seeker.monthlyRate 
  });

  // Ensure required fields exist with fallbacks
  const {
    name = 'Unknown',
    title = 'No Title',
    location = 'Unknown Location',
    experience = 0,
    skills = [],
    avatar = null,
    dailyRate = 0,
    monthlyRate = 0,
    availability = 'Unknown',
    languages = ['English'],
    education = 'Not specified',
    certifications = [],
    bio = 'No description available'
  } = seeker;

  const compactVariant = (
    <Card className={`job-seeker-card relative overflow-visible group ${className}`} {...props}>
      <GlowingEffect 
        className="rounded-xl"
      />
      <div className="p-6 relative z-10">
        <div className="flex items-center mb-4">
          <Avatar 
            src={avatar} 
            alt={name} 
            size="lg" 
            fallback={name}
            className="mr-4"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">{name}</h3>
            <p className="text-sm text-gray-600">{title}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {location}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="w-4 h-4 mr-2" />
            {formatExperience(experience)} experience
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Star className="w-4 h-4 mr-2" />
            {formatDailyRate(dailyRate)}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="primary" size="sm">
                {skill}
              </Badge>
            ))}
            {skills.length > 3 && (
              <Badge variant="outline" size="sm">
                +{skills.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {showActions && (
          <div className="space-y-2">
            <Link to={`/view-profile/${seeker.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="w-full group"
              >
                <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                {t('jobSeekers.actions.viewProfile', 'View Profile')}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );

  const detailedVariant = (
    <Card className={`job-seeker-card relative overflow-visible group ${className}`} {...props}>
      <GlowingEffect 
        className="rounded-xl"
      />
      <div className="p-6 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center">
            <Avatar 
              src={avatar} 
              alt={name} 
              size="xl" 
              fallback={name}
              className="mr-4"
            />
            <div>
              <h3 className="font-semibold text-gray-900 text-xl">{name}</h3>
              <p className="text-gray-600">{title}</p>
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => onFavorite?.(seeker)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isFavorite 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </motion.button>
            </div>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-3" />
              {location}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Briefcase className="w-4 h-4 mr-3" />
              {formatExperience(experience)} experience
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="w-4 h-4 mr-3" />
              {formatDailyRate(dailyRate)}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-3" />
              Available {availability}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <BookOpen className="w-4 h-4 mr-3" />
              {education}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Award className="w-4 h-4 mr-3" />
              {certifications.length} certifications
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Globe className="w-4 h-4 mr-3" />
              {languages.join(', ')}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="primary" size="sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-2">About</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            {truncateText(bio, 200)}
          </p>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 group"
              onClick={() => onViewProfile?.(seeker)}
            >
              <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              {t('jobSeekers.actions.viewProfile', 'View Profile')}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );

  return variant === 'detailed' ? detailedVariant : compactVariant;
};

export default JobSeekerCard; 