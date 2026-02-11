# Data Model: Sort Tasks for Todo App

## Overview
This document defines the data structures and relationships needed to support sorting functionality in the todo app.

## Entities

### Task (Extended)
Represents a todo item with enhanced sorting capabilities.

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

### SortCriteria
Represents the sorting parameters for querying tasks.

**Fields**:
- `sortBy`: Field to sort by (enum: "due_date", "priority", "alphabetical", "created_date")
- `direction`: Sort direction (enum: "asc", "desc", default: "asc")
- `secondarySort`: Secondary sort field when primary sort values are equal (optional)

### SortOptions
Represents the available sorting options in the UI.

**Fields**:
- `options`: Array of available sort options (array of objects with label and value)
- `currentOption`: Currently selected sort option (object with sortBy and direction)

## Relationships
- A SortCriteria may apply to zero or more Tasks
- A SortOptions controls how Tasks are ordered in the UI

## State Transitions
- SortCriteria can transition from one sort field to another as user selects different options
- Sort direction can toggle between ascending and descending
- Task order changes based on the active SortCriteria