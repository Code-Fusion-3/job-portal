import { ChevronLeft, ChevronRight } from 'lucide-react';

const SidebarHeader = ({ 
  isCollapsed, 
  onToggleCollapse, 
  logo = "J", 
  title = "Admin Panel", 
  subtitle = "Job Portal Management" 
}) => {
  return (
    <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/60">
      {!isCollapsed && (
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-base">{logo}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800 text-base">{title}</span>
            <span className="text-xs text-slate-500">{subtitle}</span>
          </div>
        </div>
      )}

      {isCollapsed && (
        <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center mx-auto shadow-sm">
          <span className="text-white font-bold text-base">{logo}</span>
        </div>
      )}

      {/* Desktop collapse button */}
      <button
        onClick={onToggleCollapse}
        className="hidden md:flex p-1.5 rounded-md hover:bg-slate-100 transition-all duration-200"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-slate-500" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-slate-500" />
        )}
      </button>
    </div>
  );
};

export default SidebarHeader; 