import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PhoneInput = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = '',
  ...props
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  // Initialize with existing value if provided
  useEffect(() => {
    if (value) {
      setPhoneNumber(value);
    }
  }, [value]);

  // Handle phone number input
  const handlePhoneChange = (e) => {
    const phoneValue = e.target.value;
    setPhoneNumber(phoneValue);
    
    // Call onChange with the phone value
    onChange({
      target: {
        name,
        value: phoneValue,
        type: 'text',
      }
    });
  };

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="flex items-center bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-red-500">
        {/* Phone input */}
        <input
          type="tel"
          id={id}
          name={name}
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder || "Enter phone number"}
          className="flex-1 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
          inputMode="numeric"
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
      
      {/* Help text */}
      <p className="mt-1 text-xs text-gray-500">
        Enter your phone number (minimum 9 digits)
      </p>
    </div>
  );
};

export default PhoneInput;

