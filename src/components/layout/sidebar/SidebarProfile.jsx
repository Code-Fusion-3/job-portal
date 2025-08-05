import { LogOut } from 'lucide-react';
import Avatar from '../../ui/Avatar';

const SidebarProfile = ({ 
  user, 
  onLogout 
}) => {
  return (
    <div className="mt-auto border-t border-slate-200">
      {/* Profile Section */}
      <div className="border-b border-slate-200 bg-slate-50/30 p-3">
        <div className="flex items-center px-3 py-2 rounded-md bg-white hover:bg-slate-50 transition-colors duration-200">
          <Avatar
            src={user?.avatar}
            alt={user?.name}
            size="sm"
            fallback={user?.name}
            className="w-8 h-8"
          />
          <div className="flex-1 min-w-0 ml-2.5">
            <p className="text-sm font-medium text-slate-800 truncate">
              {user?.name || 'Administrator'}
            </p>
            <p className="text-xs text-slate-500 truncate">Senior Administrator</p>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full ml-2" title="Online" />
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-3">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-md text-left transition-all duration-200 group text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <div className="flex items-center justify-center min-w-[24px]">
            <LogOut className="h-4.5 w-4.5 flex-shrink-0 text-red-500 group-hover:text-red-600" />
          </div>
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarProfile; 