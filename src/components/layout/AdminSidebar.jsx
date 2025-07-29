import { useState } from 'react';
import { MoreHorizontal, LogOut, Menu } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  navigationItems,
  activeTab,
  setActiveTab,
  user,
  onLogout
}) => {
  // Mobile overlay state
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
        onClick={handleSidebarToggle}
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Backdrop overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={handleSidebarToggle}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          ${sidebarOpen ? 'w-64' : 'w-16'}
          bg-white shadow-lg border-r border-gray-200
        `}
        style={{ minWidth: sidebarOpen ? '16rem' : '4rem' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo and collapse button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              {sidebarOpen && (
                <span className="text-xl font-bold text-gray-900 hidden md:inline">Admin Panel</span>
              )}
            </div>
            <button
              onClick={handleSidebarToggle}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all
                  ${activeTab === item.id
                    ? 'bg-red-50 text-red-600 border border-red-200 shadow'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'}
                  min-h-[44px] focus:outline-none focus:ring-2 focus:ring-red-500
                `}
                aria-label={item.label}
              >
                <item.icon className="w-6 h-6" />
                {sidebarOpen && <span className="font-medium hidden md:inline">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* User Info and Logout */}
          <div className="p-4 border-t border-gray-200 mt-auto">
            <div className="flex items-center space-x-3">
              <Avatar
                src={user?.avatar}
                alt={user?.name}
                size="sm"
                fallback={user?.name}
              />
              {sidebarOpen && (
                <div className="flex-1 min-w-0 hidden md:block">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-gray-600 hover:text-red-600"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar; 