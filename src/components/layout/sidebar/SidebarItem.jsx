import React from 'react';
import { 
  Home, 
  Users, 
  MessageSquare, 
  Briefcase, 
  BarChart3, 
  Settings, 
  TestTube,
  User,
  FileText,
  Calendar,
  Star,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

const SidebarItem = ({ 
  item, 
  isActive, 
  isCollapsed, 
  onClick 
}) => {
  // Map icon names to actual components
  const iconMap = {
    'Home': Home,
    'Users': Users,
    'MessageSquare': MessageSquare,
    'Briefcase': Briefcase,
    'BarChart3': BarChart3,
    'Settings': Settings,
    'TestTube': TestTube,
    'User': User,
    'FileText': FileText,
    'Calendar': Calendar,
    'Star': Star,
    'MapPin': MapPin,
    'Mail': Mail,
    'Phone': Phone
  };

  const Icon = iconMap[item.icon] || Home; // Default to Home if icon not found

  return (
    <li>
      <button
        onClick={() => onClick(item.id)}
        className={`
          relative w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-md text-left transition-all duration-200 group
          ${isActive
            ? "bg-red-50 text-red-700"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }
          ${isCollapsed ? "justify-center px-2" : ""}
        `}
        title={isCollapsed ? item.label : undefined}
      >
        <div className="flex items-center justify-center min-w-[24px]">
          <Icon
            className={`
              h-4.5 w-4.5 flex-shrink-0
              ${isActive 
                ? "text-red-600" 
                : "text-slate-500 group-hover:text-slate-700"
              }
            `}
          />
        </div>
        
        {!isCollapsed && (
          <div className="flex items-center justify-between w-full">
            <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>
              {item.label}
            </span>
            {item.badge && (
              <span className={`
                px-1.5 py-0.5 text-xs font-medium rounded-full
                ${isActive
                  ? "bg-red-100 text-red-700"
                  : "bg-slate-100 text-slate-600"
                }
              `}>
                {item.badge}
              </span>
            )}
          </div>
        )}

        {/* Badge for collapsed state */}
        {isCollapsed && item.badge && (
          <div className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full bg-red-100 border border-white">
            <span className="text-[10px] font-medium text-red-700">
              {parseInt(item.badge) > 9 ? '9+' : item.badge}
            </span>
          </div>
        )}

        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
            {item.label}
            {item.badge && (
              <span className="ml-1.5 px-1 py-0.5 bg-slate-700 rounded-full text-[10px]">
                {item.badge}
              </span>
            )}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-slate-800 rotate-45" />
          </div>
        )}
      </button>
    </li>
  );
};

export default SidebarItem; 