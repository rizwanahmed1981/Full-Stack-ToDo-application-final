# Data Model: CLI Todo App

## Task Entity

### Fields
- **id**: Integer (unique identifier, auto-incrementing)
- **description**: String (task description text, required)
- **completed**: Boolean (completion status, default: false)
- **created_at**: DateTime (timestamp when task was created)

### Validation Rules
- Description must not be empty or null
- ID must be unique within the todo list
- ID must be a positive integer
- Completed status must be boolean

### State Transitions
- **Created**: `completed = false` (default state when added)
- **Completed**: `completed = true` (when complete command is executed)
- **Updated**: `description` can be modified (when update command is executed)

## Todo List Collection

### Structure
- **tasks**: Dictionary/Map with ID as key and Task object as value
- **next_id**: Integer (auto-incrementing counter for new task IDs)

### Operations
- **Add**: Insert new Task with next available ID
- **Get All**: Return all Task objects
- **Get by ID**: Return specific Task by ID
- **Update**: Modify existing Task by ID
- **Delete**: Remove Task by ID
- **Complete**: Update completion status by ID