# Search & Filter Feature Documentation

## Overview
This document describes the search and filter functionality implemented in the todo app. Users can search tasks by keyword and filter by status, priority, or date.

## Features

### 1. Keyword Search
- Search tasks by entering keywords in the search bar
- Searches both task titles and descriptions
- Results update in real-time with debouncing to prevent excessive API calls

### 2. Status Filtering
- Filter tasks by completion status (active/completed)
- Dropdown selector available in the search bar

### 3. Priority Filtering
- Filter tasks by priority level (low, medium, high, critical)
- Dropdown selector available in the search bar

### 4. Date Range Filtering
- Filter tasks by scheduled date range
- Date pickers available in the search bar for start and end dates

### 5. Combined Search and Filter
- All filters can be used together
- Results reflect all active filters simultaneously

## API Endpoints

### Search Tasks
**Endpoint**: `GET /api/v1/tasks/search`

**Parameters**:
- `q` (optional): Search keyword to match in title or description
- `status` (optional): Filter by completion status (values: "all", "active", "completed")
- `priority` (optional): Filter by priority level (values: "all", "low", "medium", "high", "critical")
- `start_date` (optional): Filter by scheduled date range start (format: YYYY-MM-DD)
- `end_date` (optional): Filter by scheduled date range end (format: YYYY-MM-DD)

### Get Tasks with Filtering
**Endpoint**: `GET /api/v1/tasks`

**Parameters**:
- `status` (optional): Filter by completion status (values: "all", "active", "completed")
- `priority` (optional): Filter by priority level (values: "all", "low", "medium", "high", "critical")
- `start_date` (optional): Filter by scheduled date range start (format: YYYY-MM-DD)
- `end_date` (optional): Filter by scheduled date range end (format: YYYY-MM-DD)

## Frontend Components

### SearchBar Component
Located at `frontend/src/components/SearchBar.tsx`
- Provides input fields for search and filter controls
- Implements debouncing for search input
- Handles all filter selections

### TaskList Component
Located at `frontend/src/components/TaskList.tsx`
- Integrates with SearchBar to display filtered results
- Shows appropriate messages when no results are found

## Error Handling
- Proper error handling implemented for search and filter operations
- User-friendly error messages displayed when operations fail

## Performance Considerations
- Search input is debounced (300ms delay) to prevent excessive API calls
- Filtering is optimized for performance
- Backend supports efficient querying of large task lists