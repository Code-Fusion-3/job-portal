import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import {
  SidebarHeader,
  SidebarSearch,
  SidebarNavigation,
  SidebarProfile
} from './sidebar';

const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  navigationItems,
  activeTab,
  setActiveTab,
  user,
  onLogout,
  className = ""
}) => {
  const [searchValue, setSearchValue] = useState('');

  // Auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleItemClick = (itemId) => {
    // Sidebar item clicked
    setActiveTab(itemId);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
    // You can implement search functionality here
    // Search value changed
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-6 left-6 z-50 p-3 rounded-lg bg-white shadow-md border border-slate-100 md:hidden hover:bg-slate-50 transition-all duration-200"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? 
          <X className="h-5 w-5 text-slate-600" /> : 
          <Menu className="h-5 w-5 text-slate-600" />
        }
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300" 
          onClick={toggleSidebar} 
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-40 transition-all duration-300 ease-in-out flex flex-col w-64
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:z-auto
          ${className}
        `}
      >
        {/* Header */}
        <SidebarHeader
          logo="J"
          title="Admin Panel"
          subtitle="Job Portal Management"
        />

        {/* Search Bar */}
        <SidebarSearch
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          placeholder="Search..."
        />

        {/* Navigation */}
        <SidebarNavigation
          navigationItems={navigationItems}
          activeItem={activeTab}
          onItemClick={handleItemClick}
        />

        {/* Profile and Logout */}
        <SidebarProfile
          user={user}
          onLogout={onLogout}
        />
      </div>
    </>
  );
};

export default AdminSidebar; 