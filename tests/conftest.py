import sys
import os
import pytest
from sqlmodel import create_engine, Session
from sqlmodel.pool import StaticPool
from fastapi.testclient import TestClient

# Add the backend source directory to the path so we can import modules
backend_src_path = os.path.join(os.path.dirname(__file__), '../backend/src')
if backend_src_path not in sys.path:
    sys.path.insert(0, backend_src_path)

from todo_app.main import app  # Import the app instance directly
from contextlib import contextmanager


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    from todo_app.models.task import Task
    from sqlmodel import SQLModel
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session):
    def get_session_override():
        yield session

    # Override the get_session dependency with our test session
    from todo_app.main import get_session
    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client

    # Clean up the overrides after the test
    app.dependency_overrides.clear()