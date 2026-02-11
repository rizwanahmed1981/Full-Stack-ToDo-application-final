import sys
import os
# Add the backend/src directory to the Python path to ensure correct imports
backend_src_dir = os.path.join(os.path.dirname(__file__), '..')
if backend_src_dir not in sys.path:
    sys.path.insert(0, backend_src_dir)

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import create_engine, Session, select, SQLModel
from typing import List
import logging
from dotenv import load_dotenv

# Import models and services using absolute paths
from todo_app.models.task import Task, TaskCreate, TaskUpdate, TaskPublic, SearchQuery
from todo_app.services.todo_service import TodoService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Todo App API", version="0.1.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add middleware for logging requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"{request.method} {request.url}")
    response = await call_next(request)
    return response

# Create database engine (using environment variable for Neon PostgreSQL)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./database.db")
engine = create_engine(DATABASE_URL, echo=True, pool_pre_ping=True)

# Initialize service
todo_service = TodoService(engine)

# Create tables on startup
@app.on_event("startup")
def create_tables():
    try:
        SQLModel.metadata.create_all(engine)
        logger.info("Database tables created successfully.")
    except Exception as e:
        logger.error(f"Error creating database tables: {str(e)}")
        raise

# Dependency for database session
def get_session():
    with Session(engine) as session:
        yield session

@app.get("/")
async def root():
    return {"message": "Welcome to Todo App API"}

@app.get("/health")
async def health_check():
    try:
        # Test database connectivity
        with Session(engine) as session:
            session.exec(select(1))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {"status": "unhealthy", "database": "disconnected"}

# API v1 routes
@app.get("/api/v1/tasks", response_model=List[TaskPublic])
async def read_tasks(
    status: str = None,
    priority: str = None,
    start_date: str = None,
    end_date: str = None
):
    """Get all tasks with optional filtering."""
    try:
        # Create a SearchQuery object from the parameters
        search_query = SearchQuery(
            status=status,
            priority=priority,
            start_date=start_date,
            end_date=end_date
        )
        
        # Use the search functionality which handles all filters
        tasks = todo_service.search_tasks(search_query)
        logger.info(f"Retrieved {len(tasks)} tasks with filters: status='{status}', priority='{priority}', start_date='{start_date}', end_date='{end_date}'")
        return tasks
    except Exception as e:
        logger.error(f"Error retrieving tasks: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/api/v1/tasks/{task_id}", response_model=TaskPublic)
async def read_task(task_id: int):
    """Get a specific task by ID."""
    try:
        task = todo_service.get_task(task_id)
        if not task:
            logger.warning(f"Task with ID {task_id} not found")
            raise HTTPException(status_code=404, detail="Task not found")
        
        logger.info(f"Retrieved task with ID: {task_id}")
        return task
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        logger.error(f"Error retrieving task with ID {task_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/v1/tasks", response_model=TaskPublic)
async def create_task(task: TaskCreate):
    """Create a new task."""
    try:
        db_task = todo_service.add_task(task.title, task.description, task.scheduled_date, task.priority)
        logger.info(f"Created task with ID: {db_task.id}")
        return db_task
    except ValueError as e:
        logger.warning(f"Invalid input when creating task: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating task: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.patch("/api/v1/tasks/{task_id}", response_model=TaskPublic)
async def toggle_task_completion(task_id: int):
    """Toggle task completion status."""
    try:
        db_task = todo_service.toggle_task_completion(task_id)
        if not db_task:
            logger.warning(f"Attempt to toggle non-existent task with ID: {task_id}")
            raise HTTPException(status_code=404, detail="Task not found")
        
        logger.info(f"Toggled completion status for task ID: {task_id}, now is_completed: {db_task.is_completed}")
        return db_task
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        logger.error(f"Error toggling task completion for ID {task_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.put("/api/v1/tasks/{task_id}", response_model=TaskPublic)
async def update_task(task_id: int, task_update: TaskUpdate):
    """Update a task."""
    try:
        db_task = todo_service.update_task(task_id, task_update.description, task_update.scheduled_date, task_update.priority)
        if not db_task:
            logger.warning(f"Attempt to update non-existent task with ID: {task_id}")
            raise HTTPException(status_code=404, detail="Task not found")

        logger.info(f"Updated task with ID: {task_id}")
        return db_task
    except ValueError as e:
        logger.warning(f"Invalid input when updating task {task_id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        logger.error(f"Error updating task with ID {task_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.delete("/api/v1/tasks/{task_id}")
async def delete_task(task_id: int):
    """Delete a task."""
    try:
        success = todo_service.delete_task(task_id)
        if not success:
            logger.warning(f"Attempt to delete non-existent task with ID: {task_id}")
            raise HTTPException(status_code=404, detail="Task not found")

        logger.info(f"Deleted task with ID: {task_id}")
        return {"message": "Task deleted successfully"}
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        logger.error(f"Error deleting task with ID {task_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Search and filter endpoints
@app.get("/api/v1/tasks/search")
async def search_tasks(
    q: str = None,
    status: str = None,
    priority: str = None,
    start_date: str = None,
    end_date: str = None
):
    """Search and filter tasks based on various criteria."""
    try:
        # Create a SearchQuery object from the parameters
        search_query = SearchQuery(
            keyword=q,
            status=status,
            priority=priority,
            start_date=start_date,
            end_date=end_date
        )
        
        tasks = todo_service.search_tasks(search_query)
        logger.info(f"Searched tasks with criteria: q='{q}', status='{status}', priority='{priority}', start_date='{start_date}', end_date='{end_date}'. Found {len(tasks)} tasks.")
        return tasks
    except Exception as e:
        logger.error(f"Error searching tasks: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)