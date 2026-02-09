# Quickstart Guide: Todo App with Persistent Storage

## Prerequisites

- Python 3.14+
- PostgreSQL database
- uv package manager

## Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd <repo-directory>
```

2. Install dependencies using uv:
```bash
uv init
uv add fastapi sqlmodel psycopg2-binary pydantic
```

3. Set up the database:
```bash
# Create PostgreSQL database
createdb todo_app

# Set environment variables (create .env file)
echo "DATABASE_URL=postgresql://username:password@localhost/todo_app" > .env
```

4. Run database migrations (if applicable):
```bash
# This would typically involve running alembic or similar migration tool
```

## Running the Application

1. Start the development server:
```bash
uv run python src/todo_app/main.py
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
curl -X POST "http://localhost:8000/tasks" \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Python", "description": "Study FastAPI and SQLModel"}'
```

### List All Tasks
```bash
curl -X GET "http://localhost:8000/tasks"
```

### Update Task Completion Status
```bash
curl -X PATCH "http://localhost:8000/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{"is_completed": true}'
```

### Delete a Task
```bash
curl -X DELETE "http://localhost:8000/tasks/1"
```

## Testing

Run tests using pytest:
```bash
uv run pytest tests/
```

## Development Guidelines

- Follow the layered architecture (models, services, API)
- All database operations use transactions for data integrity
- Implement proper error handling and validation
- Maintain test-first approach with pytest
- Follow Python 3.14+ standards and uv package management