import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const FormCheckbox = forwardRef(({
  id,
  name,
  label,
  checked,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={className}>
      <div className="flex items-start">
        <input
          ref={ref}
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
          {...props}
        />
        <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
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

FormCheckbox.displayName = 'FormCheckbox';

export default FormCheckbox; 