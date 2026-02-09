# CLI Contract: Todo App

## Command Structure
```
todo_app [COMMAND] [OPTIONS] [ARGUMENTS]
```

## Commands

### `add`
**Description**: Add a new task to the todo list
**Usage**: `todo_app add [TASK_DESCRIPTION]`
**Arguments**:
- `TASK_DESCRIPTION` (required): The task description text
**Options**: None
**Output**: Success message with assigned task ID
**Exit Codes**:
- 0: Success
- 1: Error (invalid input, etc.)

### `list`
**Description**: Show all tasks with their IDs
**Usage**: `todo_app list`
**Arguments**: None
**Options**:
- `--completed`: Show only completed tasks
- `--pending`: Show only pending tasks
**Output**: Formatted table with ID, Description, and Status columns
**Exit Codes**:
- 0: Success
- 1: Error

### `complete`
**Description**: Mark a task as done by ID
**Usage**: `todo_app complete [TASK_ID]`
**Arguments**:
- `TASK_ID` (required): The ID of the task to complete
**Options**: None
**Output**: Success confirmation message
**Exit Codes**:
- 0: Success
- 1: Error (invalid ID, etc.)

### `update`
**Description**: Update a task description by ID
**Usage**: `todo_app update [TASK_ID] [NEW_DESCRIPTION]`
**Arguments**:
- `TASK_ID` (required): The ID of the task to update
- `NEW_DESCRIPTION` (required): The new task description
**Options**: None
**Output**: Success confirmation message
**Exit Codes**:
- 0: Success
- 1: Error (invalid ID, etc.)

### `delete`
**Description**: Remove a task by ID
**Usage**: `todo_app delete [TASK_ID]`
**Arguments**:
- `TASK_ID` (required): The ID of the task to delete
**Options**: None
**Output**: Success confirmation message
**Exit Codes**:
- 0: Success
- 1: Error (invalid ID, etc.)

## Error Handling
- Invalid task ID: Display error message and exit with code 1
- Missing required arguments: Display help message and exit with code 1
- Empty task descriptions: Display error message and exit with code 1