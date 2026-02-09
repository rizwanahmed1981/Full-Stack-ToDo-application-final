import pytest
import sys
import os

# Ensure the backend source is in the Python path before any other imports
backend_src_path = os.path.join(os.path.dirname(__file__), '../../backend/src')
if backend_src_path not in sys.path:
    sys.path.insert(0, backend_src_path)

from fastapi.testclient import TestClient
from sqlmodel import create_engine, Session
from sqlmodel.pool import StaticPool
from todo_app.main import app
from todo_app.models.task import Task, TaskCreate, TaskPublic
from todo_app.services.todo_service import TodoService


def override_get_session():
    # Create an in-memory SQLite database for testing
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    
    # Create tables
    from sqlmodel import SQLModel
    SQLModel.metadata.create_all(bind=engine)

    with Session(engine) as session:
        yield session


# Create a test client with overridden session
def create_test_client():
    app.dependency_overrides[app.dependencies.get('get_session')] = override_get_session
    client = TestClient(app)
    return client


def test_list_tasks_on_empty_database():
    """Test that listing tasks on an empty database returns an empty list."""
    app.dependency_overrides[override_get_session] = override_get_session
    client = TestClient(app)
    
    response = client.get("/api/v1/tasks/")
    assert response.status_code == 200
    assert response.json() == []