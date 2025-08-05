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
        `}
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
      </button>
    </li>
  );
};

export default SidebarItem; 