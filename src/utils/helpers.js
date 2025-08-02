// Utility functions for the Job Portal application

// Filter job seekers based on search criteria
export const filterJobSeekers = (jobSeekers, filters) => {
  return jobSeekers.filter(seeker => {
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const fullName = `${seeker.firstName || ''} ${seeker.lastName || ''}`.toLowerCase();
      const categoryName = seeker.jobCategory?.name_en?.toLowerCase() || '';
      const skills = seeker.skills?.toLowerCase() || '';
      const experience = seeker.experience?.toLowerCase() || '';
      const location = seeker.location?.toLowerCase() || '';
      
      const matchesSearch = 
        fullName.includes(searchLower) ||
        categoryName.includes(searchLower) ||
        skills.includes(searchLower) ||
        experience.includes(searchLower) ||
        location.includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Location filter
    if (filters.location && filters.location !== 'All Locations') {
      if (seeker.location !== filters.location && seeker.city !== filters.location) return false;
    }

    // Category filter
    if (filters.category && filters.category !== 'All Categories') {
      const categoryName = seeker.jobCategory?.name_en || '';
      if (categoryName.toLowerCase() !== filters.category.toLowerCase()) return false;
    }

    // Experience filter - simplified since experience is now a string
    if (filters.experience && filters.experience !== 'All Experience') {
      const experienceText = seeker.experience?.toLowerCase() || '';
      const filterText = filters.experience.toLowerCase();
      
      // Simple text matching for experience
      if (!experienceText.includes(filterText.replace('all experience', '').trim())) {
        return false;
      }
    }

    // Skills filter
    if (filters.skills && filters.skills.length > 0) {
      const seekerSkills = seeker.skills?.toLowerCase() || '';
      const hasMatchingSkill = filters.skills.some(skill => 
        seekerSkills.includes(skill.toLowerCase())
      );
      if (!hasMatchingSkill) return false;
    }

    // For now, skip rate filters since the new API doesn't provide rate information
    // Daily Rate Range filter - disabled
    // if (filters.dailyRateRange && filters.dailyRateRange !== 'All Rates') {
    //   // Rate filtering disabled for now
    // }

    // Monthly Rate Range filter - disabled  
    // if (filters.monthlyRateRange && filters.monthlyRateRange !== 'All Monthly Rates') {
    //   // Rate filtering disabled for now
    // }

    // Availability filter - disabled since not in new API
    // if (filters.availability && filters.availability !== 'All Availability') {
    //   // Availability filtering disabled for now
    // }

    // Education filter - disabled since not in new API
    // if (filters.education && filters.education !== 'All Education') {
    //   // Education filtering disabled for now
    // }

    return true;
  });
};

// Sort job seekers based on criteria
export const sortJobSeekers = (jobSeekers, sortBy) => {
  const sorted = [...jobSeekers];
  
  switch (sortBy) {
    case 'Most Recent':
      // Sort by memberSince date
      return sorted.sort((a, b) => new Date(b.memberSince) - new Date(a.memberSince));
    
    case 'Highest Rated':
      // Rating not available in new API, fallback to memberSince
      return sorted.sort((a, b) => new Date(b.memberSince) - new Date(a.memberSince));
    
    case 'Most Experienced':
      // Experience is now a string, sort by memberSince as fallback
      return sorted.sort((a, b) => new Date(b.memberSince) - new Date(a.memberSince));
    
    case 'Name A-Z':
      return sorted.sort((a, b) => {
        const nameA = `${a.firstName || ''} ${a.lastName || ''}`.trim();
        const nameB = `${b.firstName || ''} ${b.lastName || ''}`.trim();
        return nameA.localeCompare(nameB);
      });
    
    case 'Lowest Rate':
      // Rate not available in new API, fallback to memberSince
      return sorted.sort((a, b) => new Date(b.memberSince) - new Date(a.memberSince));
    
    case 'Highest Rate':
      return sorted.sort((a, b) => (b.dailyRate || 0) - (a.dailyRate || 0));
    
    default:
      return sorted;
  }
};

// Format experience text
export const formatExperience = (years) => {
  if (years === 1) return '1 year';
  return `${years} years`;
};

// Format daily rate
export const formatDailyRate = (rate) => {
  if (!rate || isNaN(rate)) return 'Rate not specified';
  return `${rate.toLocaleString()} RWF/day`;
};

// Format monthly rate
export const formatMonthlyRate = (rate) => {
  if (!rate || isNaN(rate)) return 'Rate not specified';
  return `${rate.toLocaleString()} RWF/month`;
};

// Format rate display (shows both daily and monthly)
export const formatRateDisplay = (dailyRate, monthlyRate) => {
  const daily = dailyRate && !isNaN(dailyRate) ? dailyRate.toLocaleString() : 'Not specified';
  const monthly = monthlyRate && !isNaN(monthlyRate) ? monthlyRate.toLocaleString() : 'Not specified';
  return `${daily} RWF/day • ${monthly} RWF/month`;
};

// Format hourly rate (for backward compatibility)
export const formatHourlyRate = (rate) => {
  return `$${rate}/hr`;
};

// Generate initials from name
export const getInitials = (name) => {
  if (!name || typeof name !== 'string') {
    return '';
  }
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  // Handle null, undefined, or non-string values
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return '';
  }
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if can't format
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

// Calculate average rating
export const calculateAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Get time ago
export const getTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}; 