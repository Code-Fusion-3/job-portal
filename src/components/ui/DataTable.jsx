import React, { useState, useMemo, useEffect, useRef } from 'react';
import Button from './Button';
import Badge from './Badge';
import { ChevronUp, ChevronDown, Search, MoreHorizontal } from 'lucide-react';

const DataTable = ({ 
  columns, 
  data, 
  onRowAction,
  actionButtons = [],
  searchTerm = '',
  onSearchChange,
  filters = [],
  onFilterChange,
  pagination = false,
  itemsPerPage = 10,
  className = ''
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [openDropdowns, setOpenDropdowns] = useState({});

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const toggleDropdown = (rowId) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };

  const closeDropdown = (rowId) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [rowId]: false
    }));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setOpenDropdowns({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter and sort data
  const filteredData = data.filter(item => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return columns.some(col => 
        col.searchable && 
        item[col.key] && 
        item[col.key].toString().toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = pagination ? sortedData.slice(startIndex, endIndex) : sortedData;

  const renderCell = (item, column) => {
    
    if (column.render) {
      return column.render(item);
    }
    
    if (column.type === 'badge') {
      return (
        <Badge 
          variant="outline" 
          size="sm"
          className={column.badgeColor ? column.badgeColor(item[column.key]) : ''}
        >
          {item[column.key]}
        </Badge>
      );
    }
    
    if (column.type === 'currency') {
      return new Intl.NumberFormat('en-RW', {
        style: 'currency',
        currency: 'RWF',
        minimumFractionDigits: 0
      }).format(item[column.key]);
    }
    
    if (column.type === 'date') {
      return new Date(item[column.key]).toLocaleDateString();
    }
    
    return item[column.key];
  };

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Search and Filters */}
      {(searchTerm !== undefined || filters.length > 0) && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {searchTerm !== undefined && (
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            )}
            {filters.map((filter, index) => (
              <div key={index} className="sm:w-48">
                <select
                  value={filter.value}
                  onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && sortColumn === column.key && (
                      sortDirection === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {renderCell(item, column)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative dropdown-container">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleDropdown(item.id || index)}
                      onMouseEnter={() => toggleDropdown(item.id || index)}
                      className="text-gray-600 hover:bg-gray-100"
                      title="Actions"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                    
                    {openDropdowns[item.id || index] && (
                      <div 
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                        onMouseLeave={() => closeDropdown(item.id || index)}
                      >
                        <div className="py-1">
                          {(typeof actionButtons === 'function' ? actionButtons(item) : actionButtons).map((action, actionIndex) => {
                      const IconComponent = action.icon;
                      return (
                              <button
                          key={actionIndex}
                                onClick={() => {
                                  onRowAction?.(action.key, item);
                                  closeDropdown(item.id || index);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${action.className}`}
                          title={action.title}
                        >
                                <IconComponent className="w-4 h-4" />
                                <span>{action.title}</span>
                              </button>
                      );
                    })}
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of {sortedData.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable; 