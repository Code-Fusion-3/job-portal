import { MoreHorizontal, LogOut } from 'lucide-react';
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
  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 ease-in-out sticky top-0 h-screen`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            {sidebarOpen && (
              <span className="text-xl font-bold text-gray-900">Admin Panel</span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar 
              src={user?.avatar} 
              alt={user?.name} 
              size="sm"
              fallback={user?.name}
            />
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar; 