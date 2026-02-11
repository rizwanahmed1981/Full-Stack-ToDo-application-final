# Quickstart: Sort Tasks for Todo App

## Overview
This guide explains how to implement and use the sorting functionality in the todo app.

## Implementation Steps

### 1. Backend Implementation
1. Extend the TodoService to support sorting operations
2. Update existing API endpoints to accept sorting parameters
3. Update the database queries to support sorting by different fields

### 2. Frontend Implementation
1. Create a SortControls component with sorting options
2. Integrate the sorting functionality with the existing TaskList component
3. Update the API service to support sorting parameters
4. Add UI elements for sort direction (ascending/descending)

### 3. Testing
1. Write unit tests for the backend sorting functions
2. Write integration tests for the API endpoints with sorting
3. Write component tests for the frontend sorting UI
4. Perform end-to-end tests to verify the complete flow

## Usage Guide

### Sorting Tasks
1. Select a sorting option from the sort controls (due date, priority, or alphabetical)
2. Choose the sort direction (ascending or descending)
3. The task list will automatically update to reflect the selected sorting

### Combining with Filters
1. Apply filters (status, priority, date range) as usual
2. Apply sorting to the filtered results
3. The sorting will only affect the currently visible tasks

## API Integration

### Get Tasks with Sorting
```javascript
// Get tasks sorted by priority (descending)
const getSortedTasks = async (sortBy, sortDirection) => {
  const params = new URLSearchParams();
  if (sortBy) params.append('sortBy', sortBy);
  if (sortDirection) params.append('sortDirection', sortDirection);

  const response = await fetch(`/api/v1/tasks?${params}`);
  return response.json();
};
```

### Search Tasks with Sorting
```javascript
// Search and sort tasks
const searchAndSortTasks = async (searchTerm, sortBy, sortDirection) => {
  const params = new URLSearchParams();
  if (searchTerm) params.append('q', searchTerm);
  if (sortBy) params.append('sortBy', sortBy);
  if (sortDirection) params.append('sortDirection', sortDirection);

  const response = await fetch(`/api/v1/tasks/search?${params}`);
  return response.json();
};
```

## Best Practices

1. Use efficient database queries with ORDER BY clauses for sorting
2. Implement proper error handling for sorting operations
3. Provide visual indicators of the current sort method
4. Maintain sort state during navigation
5. Allow users to easily reset to default sorting