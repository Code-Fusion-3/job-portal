/**
 * Pagination Component
 * Provides comprehensive pagination functionality with search and filters
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Filter, SortAsc, SortDesc } from 'lucide-react';

const Pagination = ({
  pagination,
  onSearch,
  onFilter,
  onSort,
  searchPlaceholder = "Search...",
  showSearch = true,
  showFilters = true,
  showSort = true,
  className = ""
}) => {
  // Add null checks and default values
  if (!pagination) {
    return (
      <div className={`pagination-container ${className}`}>
        <div className="text-center py-4 text-gray-500">
          No pagination data available
        </div>
      </div>
    );
  }

  const {
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    searchTerm = '',
    filters = {},
    sortBy = '',
    sortOrder = 'asc',
    setSearchTerm = () => {},
    setFilters = () => {},
    setSortBy = () => {},
    setSortOrder = () => {},
    goToPage = () => {},
    nextPage = () => {},
    prevPage = () => {},
    goToFirstPage = () => {},
    goToLastPage = () => {},
    hasNextPage = false,
    hasPrevPage = false,
    pageInfo = { showing: 0, from: 0, to: 0 }
  } = pagination;

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Handle search with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      setSearchTerm(value);
      if (onSearch) onSearch(value);
    }, 300);
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilter) onFilter(newFilters);
  };

  // Handle sort change
  const handleSortChange = (field) => {
    const newSortOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newSortOrder);
    if (onSort) onSort(field, newSortOrder);
  };

  // Generate page numbers
  const generatePageNumbers = () => {
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfVisible = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end === totalPages) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className={`pagination-container ${className}`}>
      {/* Search and Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        {showSearch && (
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={localSearchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Sort */}
        {showSort && (
          <div className="flex gap-2">
            <button
              onClick={() => handleSortChange('name')}
              className={`px-3 py-2 border rounded-lg flex items-center gap-2 ${
                sortBy === 'name' ? 'bg-red-500 text-white border-red-500' : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              {sortBy === 'name' && sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              Name
            </button>
            <button
              onClick={() => handleSortChange('createdAt')}
              className={`px-3 py-2 border rounded-lg flex items-center gap-2 ${
                sortBy === 'createdAt' ? 'bg-red-500 text-white border-red-500' : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              {sortBy === 'createdAt' && sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              Date
            </button>
          </div>
        )}

        {/* Filters Toggle */}
        {showFilters && (
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-gray-700"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && showAdvancedFilters && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter location"
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <input
                type="text"
                placeholder="Enter skills"
                value={filters.skills || ''}
                onChange={(e) => handleFilterChange('skills', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience
              </label>
              <select
                value={filters.experienceLevel || ''}
                onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="Entry">Entry Level</option>
                <option value="Mid">Mid Level</option>
                <option value="Senior">Senior Level</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Info */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <div className="text-sm text-gray-600">
          Showing {pageInfo.showing || 0} of {totalItems} items
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            {/* First Page */}
            <button
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Previous Page */}
            <button
              onClick={prevPage}
              disabled={!hasPrevPage}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-2 border rounded-lg ${
                    page === currentPage
                      ? 'bg-red-500 text-white border-red-500'
                      : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next Page */}
            <button
              onClick={nextPage}
              disabled={!hasNextPage}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Last Page */}
            <button
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination; 