# Quickstart: Search & Filter for Todo App

## Overview
This guide explains how to implement and use the search and filter functionality in the todo app.

## Implementation Steps

### 1. Backend Implementation
1. Extend the TodoService to support search and filtering operations
2. Add new API endpoints for search functionality
3. Update the database queries to support filtering by keyword, status, priority, and date

### 2. Frontend Implementation
1. Create a SearchBar component with keyword input and filter controls
2. Integrate the search and filter functionality with the existing TaskList component
3. Update the API service to support the new search endpoint
4. Add UI elements for status, priority, and date filtering

### 3. Testing
1. Write unit tests for the backend search and filter functions
2. Write integration tests for the API endpoints
3. Write component tests for the frontend search and filter UI
4. Perform end-to-end tests to verify the complete flow

## Usage Guide

### Searching Tasks
1. Enter a keyword in the search bar
2. The task list will automatically update to show matching results
3. The search matches keywords in both task titles and descriptions

### Filtering Tasks
1. Use the status filter to show only active, completed, or all tasks
2. Use the priority filter to show tasks of specific priority levels
3. Use the date range picker to show tasks within a specific date range
4. Multiple filters can be combined for more specific results

## API Integration

### Search Endpoint
```javascript
// Search tasks with keyword and filters
const searchTasks = async (keyword, status, priority, startDate, endDate) => {
  const params = new URLSearchParams();
  if (keyword) params.append('q', keyword);
  if (status) params.append('status', status);
  if (priority) params.append('priority', priority);
  if (startDate) params.append('start_date', startDate.toISOString().split('T')[0]);
  if (endDate) params.append('end_date', endDate.toISOString().split('T')[0]);

  const response = await fetch(`/api/v1/tasks/search?${params}`);
  return response.json();
};
```

### Filter Endpoint
```javascript
// Get tasks with filters only
const getFilteredTasks = async (status, priority, startDate, endDate) => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (priority) params.append('priority', priority);
  if (startDate) params.append('start_date', startDate.toISOString().split('T')[0]);
  if (endDate) params.append('end_date', endDate.toISOString().split('T')[0]);

  const response = await fetch(`/api/v1/tasks?${params}`);
  return response.json();
};
```

## Best Practices

1. Use debounced search to prevent excessive API calls
2. Implement proper error handling for search failures
3. Show clear messaging when no results are found
4. Maintain filter state during navigation
5. Allow users to easily clear all filters