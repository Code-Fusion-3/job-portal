import { Search, Filter, Menu, Bell, User } from 'lucide-react';
import Button from '../ui/Button';

const AdminHeader = ({
  user,
  onLogout,
  onSearch,
  onFilter,
  onSidebarToggle,
  searchTerm = ''
}) => {
  // Navigation items for tab labels
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'job-seekers', label: 'Job Seekers' },
    { id: 'requests', label: 'Employer Requests' },
    { id: 'categories', label: 'Categories' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' },
    { id: 'test', label: 'Integration Test' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-4 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        {/* Left side - Menu button and title */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarToggle}
            className="md:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              Welcome back, {user?.firstName || user?.email || 'Admin'}
            </p>
          </div>
        </div>

        {/* Center - Search bar */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side - User menu and notifications */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <Button variant="ghost" size="sm">
            <Bell className="w-5 h-5" />
          </Button>

          {/* User menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-red-600" />
              </div>
              <span className="hidden md:block text-sm font-medium">
                {user?.firstName || user?.email || 'Admin'}
              </span>
            </Button>
          </div>

          {/* Logout button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="hidden md:block"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 