import { Search, Filter, Menu } from 'lucide-react';
import Button from '../ui/Button';

const AdminHeader = ({
  activeTab,
  navigationItems,
  onSearch,
  onFilter,
  onSidebarToggle // new prop for hamburger
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-4 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        {/* Hamburger for mobile */}
        <button
          className="md:hidden p-2 rounded-md bg-white border border-gray-200 shadow focus:outline-none focus:ring-2 focus:ring-red-500 mr-2"
          onClick={onSidebarToggle}
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Manage your lower-skilled worker platform
          </p>
        </div>
        <div className="flex-1" />
        <div className="flex items-center space-x-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent w-full"
            />
          </div>
          <Button variant="outline" size="sm" onClick={onFilter} aria-label="Filter">
            <Filter className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 