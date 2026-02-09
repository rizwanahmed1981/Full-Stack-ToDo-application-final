# Persistent Todo Application

A REST API-based todo application with PostgreSQL backend for persistent storage.

## Features

- Create, read, update, and delete tasks
- Track task completion status
- Persistent storage with PostgreSQL
- RESTful API design
- Full CRUD operations

## API Endpoints

- `POST /api/v1/tasks/` - Create a new task
- `GET /api/v1/tasks/` - Retrieve all tasks
- `GET /api/v1/tasks/{id}` - Retrieve a specific task
- `PUT /api/v1/tasks/{id}` - Update a task's details
- `PATCH /api/v1/tasks/{id}` - Toggle task completion status
- `DELETE /api/v1/tasks/{id}` - Delete a task

## Getting Started

### Prerequisites

- Python 3.14+
- PostgreSQL database
- uv package manager

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd <repo-directory>
```

2. Install dependencies using uv:
```bash
uv sync
```

3. Set up the database:
```bash
# Create PostgreSQL database
createdb todo_app

# Set environment variables (create .env file)
echo "DATABASE_URL=postgresql://username:password@localhost/todo_app" > .env
```

### Running the Application

1. Start the development server:
```bash
uv run uvicorn src.todo_app.main:app --reload
```

2. The API will be available at:
```
http://localhost:8000
```

3. View API documentation at:
```
http://localhost:8000/docs
```

## API Usage Examples

### Create a Task
```bash
curl -X POST "http://localhost:8000/api/v1/tasks/" \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Python", "description": "Study FastAPI and SQLModel"}'
```

### List All Tasks
```bash
curl -X GET "http://localhost:8000/api/v1/tasks/"
```

### Update Task Completion Status
```bash
curl -X PATCH "http://localhost:8000/api/v1/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{"is_completed": true}'
```

### Delete a Task
```bash
curl -X DELETE "http://localhost:8000/api/v1/tasks/1"
```

## Testing

Run tests using pytest:
```bash
uv run pytest tests/
```

## Architecture

The application follows a layered architecture:

- **Models**: SQLModel entities with validation
- **Services**: Business logic and database operations
- **API**: HTTP endpoints and request/response handling
- **Database**: Connection management and session handling