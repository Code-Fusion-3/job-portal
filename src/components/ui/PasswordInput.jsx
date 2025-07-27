import { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock } from 'lucide-react';

const PasswordInput = forwardRef(({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  showStrength = false,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-blue-500', 'text-green-500'];
    
    return {
      score: Math.min(score, 4),
      label: labels[score - 1] || '',
      color: colors[score - 1] || ''
    };
  };

  const passwordStrength = showStrength ? getPasswordStrength(value) : null;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        
        <input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`
            w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent 
            transition-colors duration-200 text-gray-900 placeholder-gray-500
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
          placeholder={placeholder}
          {...props}
        />
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      
      {/* Password Strength Indicator */}
      {showStrength && value && (
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  passwordStrength.score === 0 ? 'bg-gray-300' :
                  passwordStrength.score === 1 ? 'bg-red-500' :
                  passwordStrength.score === 2 ? 'bg-orange-500' :
                  passwordStrength.score === 3 ? 'bg-yellow-500' :
                  passwordStrength.score === 4 ? 'bg-green-500' : 'bg-green-500'
                }`}
                style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
              />
            </div>
            <span className={`text-sm font-medium ${passwordStrength.color}`}>
              {passwordStrength.label}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Must contain uppercase, lowercase, number, and be at least 8 characters
          </div>
        </div>
      )}
      
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

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput; 