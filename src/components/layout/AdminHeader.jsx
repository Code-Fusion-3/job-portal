import { Search, Filter } from 'lucide-react';
import Button from '../ui/Button';

const AdminHeader = ({ 
  activeTab, 
  navigationItems, 
  onSearch, 
  onFilter 
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </h1>
          <p className="text-gray-600">
            Manage your lower-skilled worker platform
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" size="sm" onClick={onFilter}>
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 