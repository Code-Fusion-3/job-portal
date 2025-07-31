# Admin Dashboard - Job Categories Management

## Overview
The Job Categories management page allows administrators to create, view, edit, and delete job categories for the platform. This feature supports both English and Kinyarwanda language names for each category.

## Features

### 📊 Dashboard Statistics
- **Total Categories**: Shows the total number of job categories
- **Total Job Seekers**: Displays total job seekers across all categories

### 🔍 Search
- **Search**: Search categories by English or Kinyarwanda names

### 📋 Category Management
- **View Categories**: Table view with category details
- **Add Category**: Create new job categories with bilingual names
- **Edit Category**: Update existing category names
- **Delete Category**: Remove categories with safety warnings

## API Integration

### Expected API Response Structure
Based on your Postman API, the system expects:

```json
{
  "message": "Job category created successfully",
  "category": {
    "id": 3,
    "name_en": "Graphic Design",
    "name_rw": "Ubwubatsi bw'Amashusho",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### API Endpoints
The system is configured to work with these endpoints:
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Fallback System
- If the API is not available, the system falls back to mock data
- All CRUD operations work seamlessly with or without API
- Console warnings indicate when API is unavailable

## File Structure

```
src/
├── pages/dashboard/
│   ├── JobCategoriesPage.jsx     # Main categories management page
│   └── AdminDashboard.jsx        # Updated with categories navigation
├── services/
│   └── categoryService.js        # API service functions
└── components/ui/
    ├── Button.jsx               # Updated with danger variant
    └── Badge.jsx                # Status indicators
```

## Usage

### Adding a New Category
1. Click "Add Category" button
2. Fill in both English and Kinyarwanda names
3. Click "Create Category"
4. Category appears in the list immediately

### Editing a Category
1. Click the edit icon (pencil) next to any category
2. Modify the names as needed
3. Click "Update Category"
4. Changes are reflected immediately

### Deleting a Category
1. Click the delete icon (trash) next to any category
2. Review the warning message
3. Confirm deletion if category has job seekers
4. Category is removed from the list

## Navigation
The Job Categories page is accessible through the admin sidebar:
- **Icon**: Briefcase
- **Label**: "Job Categories"
- **Route**: `/dashboard/admin` → Click "Job Categories" in sidebar

## Technical Details

### State Management
- Uses React hooks for local state
- Categories stored in component state
- Form data managed separately for modals

### Error Handling
- Graceful fallback to mock data
- User-friendly error messages
- Console logging for debugging

### Responsive Design
- Mobile-friendly table layout
- Responsive statistics grid
- Adaptive modal sizing

## Future Enhancements
- Bulk operations (delete multiple categories)
- Category sorting and pagination
- Category usage analytics
- Import/export functionality 