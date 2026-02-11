# End-to-End Testing for Search & Filter Functionality

## Test Plan

This document outlines the end-to-end testing for the search and filter functionality in the todo app.

### Test Environment
- Backend server running on http://localhost:8000
- Frontend running on http://localhost:3000
- Test data with various tasks having different statuses, priorities, and dates

### Test Scenarios

#### 1. Keyword Search
1. Navigate to the todo app
2. Add multiple tasks with different titles and descriptions
3. Enter a keyword in the search bar
4. Verify that only tasks containing the keyword in title or description are displayed
5. Clear the search term and verify all tasks are displayed again

#### 2. Status Filtering
1. Create tasks with both active and completed statuses
2. Select "Active" status filter
3. Verify only active tasks are displayed
4. Select "Completed" status filter
5. Verify only completed tasks are displayed
6. Reset filter and verify all tasks are displayed

#### 3. Priority Filtering
1. Create tasks with different priority levels (low, medium, high, critical)
2. Select a priority filter
3. Verify only tasks with the selected priority are displayed
4. Reset filter and verify all tasks are displayed

#### 4. Date Range Filtering
1. Create tasks with different scheduled dates
2. Set a date range in the filter
3. Verify only tasks within the date range are displayed
4. Clear date filters and verify all tasks are displayed

#### 5. Combined Search and Filter
1. Apply a keyword search
2. Apply a status filter
3. Verify results match both criteria
4. Apply a priority filter
5. Verify results match all three criteria
6. Clear all filters and verify all tasks are displayed

#### 6. Edge Cases
1. Search for a term that matches no tasks
2. Verify "no results" message is displayed
3. Apply filters that result in no matches
4. Verify "no results" message is displayed
5. Test with special characters in search terms
6. Verify proper handling without errors

### Expected Results
- All search and filter operations complete within 1 second
- UI remains responsive during operations
- No errors in console during operations
- All filter combinations work correctly
- State is preserved during navigation