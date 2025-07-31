import SidebarItem from './SidebarItem';

const SidebarNavigation = ({ 
  navigationItems, 
  activeItem, 
  isCollapsed, 
  onItemClick 
}) => {
  return (
    <nav className="flex-1 px-3 py-2 overflow-y-auto">
      <ul className="space-y-0.5">
        {navigationItems.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isActive={activeItem === item.id}
            isCollapsed={isCollapsed}
            onClick={onItemClick}
          />
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNavigation; 