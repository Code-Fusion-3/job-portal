import SidebarItem from './SidebarItem';

const SidebarNavigation = ({ 
  navigationItems, 
  activeItem, 
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
            onClick={onItemClick}
          />
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNavigation; 