import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, X, Eye } from 'lucide-react';
import Button from './Button';

const BackendErrorModal = ({ 
  isOpen, 
  onClose, 
  errors = [], 
  onScrollToField 
}) => {
  if (!isOpen || !errors.length) return null;

  // Group errors by field type for better organization
  const groupErrorsByType = (errors) => {
    const grouped = {
      required: [],
      additional: [],
      professional: [],
      general: []
    };

    errors.forEach(error => {
      // Map backend field names to frontend sections
      const field = error.field?.toLowerCase() || '';
      
      if (['firstname', 'lastname', 'password', 'contactnumber'].includes(field)) {
        grouped.required.push(error);
      } else if (['email', 'skills', 'languages', 'gender', 'dateofbirth', 'idnumber', 'maritalstatus', 'location', 'city', 'country'].includes(field)) {
        grouped.additional.push(error);
      } else if (['experience', 'experiencelevel', 'monthlyrate', 'jobcategoryid', 'educationlevel', 'availability', 'certifications', 'references'].includes(field)) {
        grouped.professional.push(error);
      } else {
        grouped.general.push(error);
      }
    });

    // Remove empty sections
    Object.keys(grouped).forEach(key => {
      if (grouped[key].length === 0) {
        delete grouped[key];
      }
    });

    return grouped;
  };

  const groupedErrors = groupErrorsByType(errors);

  const getSectionTitle = (section) => {
    const titles = {
      required: 'Required Information',
      additional: 'Additional Information', 
      professional: 'Professional Information',
      general: 'General Issues'
    };
    return titles[section] || section;
  };

  const getFieldLabel = (fieldName) => {
    const labels = {
      firstname: 'First Name',
      lastname: 'Last Name',
      password: 'Password',
      contactnumber: 'Phone Number',
      email: 'Email',
      skills: 'Skills',
      languages: 'Languages',
      gender: 'Gender',
      dateofbirth: 'Date of Birth',
      idnumber: 'ID Number',
      maritalstatus: 'Marital Status',
      location: 'Location',
      city: 'City',
      country: 'Country',
      experience: 'Experience',
      experiencelevel: 'Experience Level',
      monthlyrate: 'Monthly Rate',
      jobcategoryid: 'Job Category',
      educationlevel: 'Education Level',
      availability: 'Availability',
      certifications: 'Certifications',
      references: 'References'
    };
    return labels[fieldName?.toLowerCase()] || fieldName || 'Unknown Field';
  };

  const handleScrollToField = (fieldName) => {
    if (onScrollToField) {
      // Map backend field names to frontend field IDs
      const fieldMapping = {
        firstname: 'firstName',
        lastname: 'lastName',
        contactnumber: 'contactNumber',
        dateofbirth: 'dateOfBirth',
        idnumber: 'idNumber',
        maritalstatus: 'maritalStatus',
        jobcategoryid: 'jobCategoryId',
        educationlevel: 'educationLevel',
        experiencelevel: 'experienceLevel',
        monthlyrate: 'monthlyRate',
        // These fields are already correctly named
        email: 'email',
        password: 'password',
        skills: 'skills',
        languages: 'languages',
        gender: 'gender',
        location: 'location',
        city: 'city',
        country: 'country',
        experience: 'experience',
        certifications: 'certifications',
        references: 'references',
        availability: 'availability'
      };
      
      const frontendFieldId = fieldMapping[fieldName?.toLowerCase()] || fieldName;
      onScrollToField(frontendFieldId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="bg-white rounded-xl shadow-2xl border border-gray-200/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Backend Validation Errors
              </h2>
              <p className="text-sm text-gray-500">
                Please fix the following issues to continue
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Summary */}
            <div className="text-center">
              <p className="text-lg text-gray-600 mb-1">
                Found {errors.length} validation error{errors.length !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-gray-500">
                Click on any error to navigate to the corresponding field
              </p>
            </div>
            
            {/* Grouped Errors */}
            {Object.entries(groupedErrors).map(([section, sectionErrors]) => (
              <div key={section} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  {getSectionTitle(section)}
                  <span className="ml-2 text-sm text-gray-500">({sectionErrors.length})</span>
                </h3>
                <div className="space-y-2">
                  {sectionErrors.map((error, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">
                          {getFieldLabel(error.field)}:
                        </span>
                        <span className="text-red-600 ml-2">{error.message}</span>
                      </div>
                      <button
                        onClick={() => handleScrollToField(error.field)}
                        className="ml-3 px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center gap-1"
                        title="Go to field"
                      >
                        <Eye className="w-3 h-3" />
                        Go to Field
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Action Buttons */}
            <div className="flex justify-center pt-4 border-t border-gray-200">
              <Button 
                variant="primary" 
                onClick={onClose}
                className="px-6 py-2 bg-red-600 hover:bg-red-700"
              >
                Fix Errors
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BackendErrorModal;
