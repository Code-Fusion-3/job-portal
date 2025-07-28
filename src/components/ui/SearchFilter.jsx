import { Search, Filter, X } from 'lucide-react';
import Button from './Button';

const SearchFilter = ({ 
  searchTerm = '',
  onSearchChange,
  filters = [],
  onFilterChange,
  onClearFilters,
  placeholder = 'Search...',
  className = ''
}) => {
  const hasActiveFilters = filters.some(filter => filter.value !== '');

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {filters.map((filter, index) => (
            <div key={index} className="flex items-center space-x-2">
              <select
                value={filter.value}
                onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              >
                <option value="">{filter.placeholder}</option>
                {filter.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-600 hover:text-red-600"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter, index) => {
              if (filter.value) {
                const selectedOption = filter.options.find(opt => opt.value === filter.value);
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    <span className="text-gray-600">{filter.label}:</span>
                    <span className="font-medium">{selectedOption?.label}</span>
                    <button
                      onClick={() => onFilterChange?.(filter.key, '')}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter; 