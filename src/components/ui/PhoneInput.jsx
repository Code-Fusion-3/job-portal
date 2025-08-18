import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Phone, ChevronDown } from 'lucide-react';

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
  const [selectedCountry, setSelectedCountry] = useState('250'); // Default to Rwanda
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Country codes with flags and names
  const countries = [
    { code: '250', name: 'Rwanda', flag: '🇷🇼' },
    { code: '254', name: 'Kenya', flag: '🇰🇪' },
    { code: '255', name: 'Tanzania', flag: '🇹🇿' },
    { code: '256', name: 'Uganda', flag: '🇺🇬' },
    { code: '257', name: 'Burundi', flag: '🇧🇮' },
    { code: '27', name: 'South Africa', flag: '🇿🇦' },
    { code: '234', name: 'Nigeria', flag: '🇳🇬' },
    { code: '233', name: 'Ghana', flag: '🇬🇭' },
    { code: '1', name: 'USA/Canada', flag: '🇺🇸' },
    { code: '44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '33', name: 'France', flag: '🇫🇷' },
    { code: '49', name: 'Germany', flag: '🇩🇪' },
    { code: '86', name: 'China', flag: '🇨🇳' },
    { code: '91', name: 'India', flag: '🇮🇳' },
    { code: '81', name: 'Japan', flag: '🇯🇵' },
    { code: '82', name: 'South Korea', flag: '🇰🇷' },
    { code: '61', name: 'Australia', flag: '🇦🇺' },
    { code: '64', name: 'New Zealand', flag: '🇳🇿' },
  ];

  // Initialize with existing value if provided
  useEffect(() => {
    if (value) {
      // Extract country code and phone number from existing value
      const countryCode = countries.find(country => value.startsWith(country.code))?.code || '250';
      const phone = value.substring(countryCode.length);
      setSelectedCountry(countryCode);
      setPhoneNumber(phone);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSearchTerm(''); // Clear search term when closing
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle country selection
  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
    setIsDropdownOpen(false);
    setSearchTerm(''); // Clear search term
    
    // Combine country code with phone number and call onChange
    const fullNumber = countryCode + phoneNumber;
    onChange({
      target: {
        name,
        value: fullNumber,
        type: 'text',
      }
    });
  };

  // Handle phone number input
  const handlePhoneChange = (e) => {
    const phoneValue = e.target.value.replace(/[^\d]/g, '').slice(0, 9); // Max 9 digits
    setPhoneNumber(phoneValue);
    
    // Combine country code with phone number and call onChange
    const fullNumber = selectedCountry + phoneValue;
    onChange({
      target: {
        name,
        value: fullNumber,
        type: 'text',
      }
    });
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isDropdownOpen) {
      e.preventDefault();
      const firstCountry = filteredCountries[0];
      if (firstCountry) {
        handleCountrySelect(firstCountry.code);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setSearchTerm('');
    }
  };

  const selectedCountryData = countries.find(country => country.code === selectedCountry);
  
  // Filter countries based on search term
  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.includes(searchTerm)
  );

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="flex items-center bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-red-500">
        {/* Country code selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-gray-50 text-gray-800 text-sm px-3 py-2 focus:outline-none focus:ring-0 border-r border-gray-300 flex items-center space-x-2 hover:bg-gray-100 transition-colors duration-200"
          >
            <span className="text-lg">{selectedCountryData?.flag}</span>
            <span>+{selectedCountryData?.code}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Country Dropdown */}
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-30 max-h-60 overflow-y-auto"
            >
              {/* Search Input */}
              <div className="p-3 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country.code)}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150"
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="font-medium">+{country.code}</span>
                  <span className="text-gray-600 text-sm">{country.name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Phone input */}
        <input
          type="tel"
          id={id}
          name={name}
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="7XXXXXXXX"
          className="flex-1 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
          maxLength={9}
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
        Select your country code and enter your phone number (max 9 digits)
      </p>
    </div>
  );
};

export default PhoneInput;

