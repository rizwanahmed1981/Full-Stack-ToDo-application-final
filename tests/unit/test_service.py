import pytest
from todo_app.services.todo_service import TodoService
from todo_app.models.task import Task


def test_todo_service_add_task():
    """Test adding tasks to the service."""
    service = TodoService()

    # Add first task
    task1 = service.add_task("Test task 1")
    assert task1.id == 1
    assert task1.description == "Test task 1"
    assert task1.completed is False

    # Add second task
    task2 = service.add_task("Test task 2")
    assert task2.id == 2
    assert task2.description == "Test task 2"

    # Check all tasks
    tasks = service.get_all_tasks()
    assert len(tasks) == 2
    assert tasks[0].id == 1
    assert tasks[1].id == 2


def test_todo_service_get_task():
    """Test getting a specific task."""
    service = TodoService()
    task = service.add_task("Test task")

    # Get existing task
    retrieved_task = service.get_task(1)
    assert retrieved_task is not None
    assert retrieved_task.id == 1
    assert retrieved_task.description == "Test task"

    # Get non-existing task
    non_existing = service.get_task(999)
    assert non_existing is None


def test_todo_service_complete_task():
    """Test completing a task."""
    service = TodoService()
    task = service.add_task("Test task")

    # Initially not completed
    assert task.completed is False

    # Complete the task
    result = service.complete_task(1)
    assert result is True

    # Check task is completed
    completed_task = service.get_task(1)
    assert completed_task.completed is True

    # Try to complete non-existing task
    result = service.complete_task(999)
    assert result is False


def test_todo_service_update_task():
    """Test updating a task."""
    service = TodoService()
    task = service.add_task("Original description")

    # Update task
    result = service.update_task(1, "Updated description")
    assert result is True

    # Check updated description
    updated_task = service.get_task(1)
    assert updated_task.description == "Updated description"

    # Try to update non-existing task
    result = service.update_task(999, "Should not work")
    assert result is False


def test_todo_service_delete_task():
    """Test deleting a task."""
    service = TodoService()
    task = service.add_task("Test task")

    # Delete existing task
    result = service.delete_task(1)
    assert result is True

    # Verify task is gone
    deleted_task = service.get_task(1)
    assert deleted_task is None

    # Try to delete non-existing task
    result = service.delete_task(999)
    assert result is False


def test_todo_service_task_counts():
    """Test task counting methods."""
    service = TodoService()

    # Add some tasks
    service.add_task("Task 1")
    service.add_task("Task 2")
    service.add_task("Task 3")

    # Complete one task
    service.complete_task(2)

    # Check counts
    assert service.get_task_count() == 3
    assert len(service.get_pending_tasks()) == 2
    assert len(service.get_completed_tasks()) == 1