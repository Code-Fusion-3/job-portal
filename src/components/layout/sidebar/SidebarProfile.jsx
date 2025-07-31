import { LogOut } from 'lucide-react';
import Avatar from '../../ui/Avatar';

const SidebarProfile = ({ 
  isCollapsed, 
  user, 
  onLogout 
}) => {
  return (
    <div className="mt-auto border-t border-slate-200">
      {/* Profile Section */}
      <div className={`border-b border-slate-200 bg-slate-50/30 ${isCollapsed ? 'py-3 px-2' : 'p-3'}`}>
        {!isCollapsed ? (
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
        ) : (
          <div className="flex justify-center">
            <div className="relative">
              <Avatar
                src={user?.avatar}
                alt={user?.name}
                size="sm"
                fallback={user?.name}
                className="w-9 h-9"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="p-3">
        <button
          onClick={onLogout}
          className={`
            w-full flex items-center rounded-md text-left transition-all duration-200 group
            text-red-600 hover:bg-red-50 hover:text-red-700
            ${isCollapsed ? "justify-center p-2.5" : "space-x-2.5 px-3 py-2.5"}
          `}
          title={isCollapsed ? "Logout" : undefined}
        >
          <div className="flex items-center justify-center min-w-[24px]">
            <LogOut className="h-4.5 w-4.5 flex-shrink-0 text-red-500 group-hover:text-red-600" />
          </div>
          
          {!isCollapsed && (
            <span className="text-sm">Logout</span>
          )}
          
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
              Logout
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-slate-800 rotate-45" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default SidebarProfile; 