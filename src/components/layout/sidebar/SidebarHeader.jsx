import { ChevronLeft, ChevronRight } from 'lucide-react';

const SidebarHeader = ({ 
  logo = "J", 
  title = "Admin Panel", 
  subtitle = "Braziconnect Portal Management" 
}) => {
  return (
    <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/60">
      <div className="flex items-center space-x-2.5">
        <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-base">{logo}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800 text-base">{title}</span>
          <span className="text-xs text-slate-500">{subtitle}</span>
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader; 