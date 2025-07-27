import { motion } from 'framer-motion';
import { User } from 'lucide-react';

const UserTypeSelector = ({
  value = 'jobseeker',
  onChange,
  label,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="w-full">
        <motion.button
          type="button"
          onClick={() => onChange('jobseeker')}
          className={`w-full p-4 border-2 rounded-lg text-center transition-all duration-200 ${
            value === 'jobseeker'
              ? 'border-red-500 bg-red-50 text-red-700'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          {...props}
        >
          <User className="w-6 h-6 mx-auto mb-2" />
          <div className="font-medium">Job Seeker</div>
          <div className="text-sm text-gray-500">Looking for opportunities</div>
        </motion.button>
      </div>
    </div>
  );
};

export default UserTypeSelector; 