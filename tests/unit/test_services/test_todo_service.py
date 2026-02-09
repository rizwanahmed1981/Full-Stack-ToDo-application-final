import pytest
from sqlmodel import Session
from src.todo_app.models.task import TaskCreate, TaskUpdate
from src.todo_app.services.todo_service import TodoService


def test_create_task(session: Session):
    service = TodoService()
    task_create = TaskCreate(title="Test Task", description="Test Description")
    task = service.create_task(session, task_create)
    
    assert task.id is not None
    assert task.title == "Test Task"
    assert task.description == "Test Description"
    assert task.is_completed is False


def test_get_tasks(session: Session):
    service = TodoService()
    # Create a task first
    task_create = TaskCreate(title="Test Task", description="Test Description")
    created_task = service.create_task(session, task_create)
    
    # Get all tasks
    tasks = service.get_tasks(session)
    
    assert len(tasks) == 1
    assert tasks[0].id == created_task.id


def test_get_task_by_id(session: Session):
    service = TodoService()
    # Create a task first
    task_create = TaskCreate(title="Test Task", description="Test Description")
    created_task = service.create_task(session, task_create)
    
    # Get the specific task
    retrieved_task = service.get_task_by_id(session, created_task.id)
    
    assert retrieved_task is not None
    assert retrieved_task.id == created_task.id
    assert retrieved_task.title == "Test Task"


def test_update_task(session: Session):
    service = TodoService()
    # Create a task first
    task_create = TaskCreate(title="Test Task", description="Test Description")
    created_task = service.create_task(session, task_create)
    
    # Update the task
    task_update = TaskUpdate(title="Updated Task", is_completed=True)
    updated_task = service.update_task(session, created_task.id, task_update)
    
    assert updated_task is not None
    assert updated_task.title == "Updated Task"
    assert updated_task.is_completed is True


def test_toggle_task_completion(session: Session):
    service = TodoService()
    # Create a task first
    task_create = TaskCreate(title="Test Task", description="Test Description")
    created_task = service.create_task(session, task_create)
    
    # Toggle the task completion
    toggled_task = service.toggle_task_completion(session, created_task.id, True)
    
    assert toggled_task is not None
    assert toggled_task.is_completed is True


def test_delete_task(session: Session):
    service = TodoService()
    # Create a task first
    task_create = TaskCreate(title="Test Task", description="Test Description")
    created_task = service.create_task(session, task_create)
    
    # Delete the task
    success = service.delete_task(session, created_task.id)
    
    assert success is True
    
    # Verify the task is gone
    deleted_task = service.get_task_by_id(session, created_task.id)
    assert deleted_task is None