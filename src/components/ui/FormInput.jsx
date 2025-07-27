import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const FormInput = forwardRef(({
  type = 'text',
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  required = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        )}
        
        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`
            w-full py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent 
            transition-colors duration-200 text-gray-900 placeholder-gray-500
            ${Icon ? 'pl-10' : 'pl-4'} 
            pr-4
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${className}
          `}
          placeholder={placeholder}
          {...props}
        />
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput; 