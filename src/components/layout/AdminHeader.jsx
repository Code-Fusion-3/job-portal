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
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">
            {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </h1>
        </div>
        <div className="flex-1" />
      </div>
    </header>
  );
};

export default AdminHeader; 