# Data Model: Search & Filter for Todo App

## Overview
This document defines the data structures and relationships needed to support search and filter functionality in the todo app.

## Entities

### Task (Extended)
Represents a todo item with enhanced search and filter capabilities.

**Fields**:
- `id`: Unique identifier (integer, primary key)
- `title`: Task title (string, required)
- `description`: Task description (string, optional)
- `is_completed`: Completion status (boolean, default: false)
- `priority`: Task priority (enum: low, medium, high, critical, default: medium)
- `created_at`: Creation timestamp (datetime)
- `updated_at`: Last update timestamp (datetime)
- `scheduled_date`: Scheduled date/time (datetime, optional)

**Validation Rules**:
- Title must not be empty
- Priority must be one of the allowed values
- Dates must be valid

### SearchQuery
Represents the search parameters for querying tasks.

**Fields**:
- `keyword`: Text to search for in title or description (string, optional)
- `status`: Filter by completion status (enum: all, active, completed, optional)
- `priority`: Filter by priority level (enum: all, low, medium, high, critical, optional)
- `startDate`: Filter by scheduled date range start (datetime, optional)
- `endDate`: Filter by scheduled date range end (datetime, optional)

### FilterCriteria
Represents the active filters applied to the task list.

**Fields**:
- `status`: Active status filter (enum: all, active, completed)
- `priority`: Active priority filter (enum: all, low, medium, high, critical)
- `dateRange`: Active date range filter (object with startDate and endDate, optional)

## Relationships
- A SearchQuery may match zero or more Tasks
- A FilterCriteria applies to zero or more Tasks

## State Transitions
- SearchQuery can transition from empty to populated as user types
- FilterCriteria can be updated as user selects different filter options
- Task status can be toggled between active and completed