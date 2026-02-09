# Data Model: Todo App with Persistent Storage

## Entity Definitions

### Task
**Description**: Represents a single todo item with a unique ID, title, description text, and completion status (done/undone).

**Fields**:
- `id`: int (Primary Key, Auto-increment)
- `title`: str (Required, max length 255)
- `description`: str (Optional, max length 1000)
- `is_completed`: bool (Default False)
- `created_at`: datetime (Auto-generated timestamp)
- `updated_at`: datetime (Auto-updated timestamp)

**Relationships**: None (standalone entity)

**Validation Rules**:
- Title must be provided and not empty
- Title length must be 1-255 characters
- Description length must not exceed 1000 characters if provided

**State Transitions**:
- `is_completed`: False → True (when task is completed)
- `is_completed`: True → False (when task is uncompleted)
- `updated_at`: Updates on any modification

## Database Schema

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes
- Primary key index on `id`
- Index on `is_completed` for filtering performance

## Constraints
- NOT NULL constraints on required fields
- Length constraints on text fields
- Automatic timestamps for creation and updates