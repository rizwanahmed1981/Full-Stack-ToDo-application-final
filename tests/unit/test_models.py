import pytest
from src.todo_app.models.task import Task


def test_task_creation():
    """Test task creation."""
    task = Task(1, "Test task")
    assert task.id == 1
    assert task.description == "Test task"
    assert task.completed is False
    assert task.created_at is not None


def test_task_completion():
    """Test marking task as completed."""
    task = Task(1, "Test task")
    assert task.completed is False

    task.mark_completed()
    assert task.completed is True


def test_task_update():
    """Test updating task description."""
    task = Task(1, "Old description")
    assert task.description == "Old description"

    task.update_description("New description")
    assert task.description == "New description"


def test_task_to_dict():
    """Test converting task to dictionary."""
    task = Task(1, "Test task")
    task_dict = task.to_dict()

    assert task_dict['id'] == 1
    assert task_dict['description'] == "Test task"
    assert task_dict['completed'] is False
    assert 'created_at' in task_dict