# Todo App Backend

Backend API for the Todo application built with FastAPI and SQLModel.

## Features

- REST API for task management
- PostgreSQL database integration (using SQLModel ORM)
- SQLite support for local development
- Full CRUD operations for tasks
- Environment-based configuration
- Automatic table creation on startup

## Setup

1. Install dependencies:
```bash
uv pip install -e .
```

2. Set up environment variables:
```bash
cp .env.example .env  # If .env.example exists
# Or create .env with your database URL:
echo "DATABASE_URL=postgresql://neondb_owner:npg_KvaQtrnI93Nh@ep-silent-resonance-ahzco9xe-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require" > .env
```

3. Run the development server:
```bash
uv run python src/todo_app/main.py
```

Or with uvicorn directly:
```bash
uvicorn src.todo_app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `PATCH /tasks/{id}` - Toggle task completion
- `PUT /tasks/{id}` - Update a task
- `DELETE /tasks/{id}` - Delete a task
- `GET /health` - Health check endpoint

## Database

- Uses PostgreSQL with SQLModel ORM
- By default connects to Neon PostgreSQL database
- To use local SQLite, set `DATABASE_URL` to `sqlite:///./database.db`
- Automatically creates tables on startup

## Hackathon Demo

For convenience during the hackathon, you can use the combined startup script:

```bash
../START.sh
```

This will start both backend and frontend servers simultaneously.