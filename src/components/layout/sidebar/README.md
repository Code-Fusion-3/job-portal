# Admin Sidebar Components

This directory contains modular, reusable components for the admin sidebar.

## Components

### `SidebarHeader.jsx`
- **Purpose**: Header section with logo, title, and collapse button
- **Props**:
  - `isCollapsed`: Boolean for collapsed state
  - `onToggleCollapse`: Function to toggle collapse
  - `logo`: String for logo text (default: "J")
  - `title`: String for main title (default: "Admin Panel")
  - `subtitle`: String for subtitle (default: "Job Portal Management")

### `SidebarSearch.jsx`
- **Purpose**: Search input field (hidden when collapsed)
- **Props**:
  - `isCollapsed`: Boolean for collapsed state
  - `searchValue`: String for search input value
  - `onSearchChange`: Function called when search value changes
  - `placeholder`: String for placeholder text (default: "Search...")

### `SidebarNavigation.jsx`
- **Purpose**: Navigation menu with items
- **Props**:
  - `navigationItems`: Array of navigation items
  - `activeItem`: String ID of active item
  - `isCollapsed`: Boolean for collapsed state
  - `onItemClick`: Function called when item is clicked

### `SidebarItem.jsx`
- **Purpose**: Individual navigation item
- **Props**:
  - `item`: Object with `{id, label, icon, badge?}` structure
  - `isActive`: Boolean for active state
  - `isCollapsed`: Boolean for collapsed state
  - `onClick`: Function called when clicked

### `SidebarProfile.jsx`
- **Purpose**: User profile section with logout button
- **Props**:
  - `isCollapsed`: Boolean for collapsed state
  - `user`: User object with `{name, avatar}` properties
  - `onLogout`: Function called when logout is clicked

## Usage

```jsx
import AdminSidebar from '../components/layout/AdminSidebar';

// In your component
<AdminSidebar
  sidebarOpen={sidebarOpen}
  setSidebarOpen={setSidebarOpen}
  navigationItems={navigationItems}
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  user={user}
  onLogout={handleLogout}
/>
```

## Features

- ✅ **Modular Design**: Each component is self-contained and reusable
- ✅ **Responsive**: Works on mobile and desktop
- ✅ **Collapsible**: Can be collapsed to save space
- ✅ **Search Functionality**: Built-in search input
- ✅ **Badge Support**: Navigation items can have badges
- ✅ **Tooltips**: Tooltips for collapsed state
- ✅ **Smooth Animations**: CSS transitions for all interactions
- ✅ **Accessibility**: Proper ARIA labels and keyboard navigation

## Customization

Each component can be customized by modifying its props or styling. The components use Tailwind CSS classes for consistent styling. 