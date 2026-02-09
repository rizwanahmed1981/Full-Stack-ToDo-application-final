import pytest
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../backend/src'))
from todo_app.models.task import Task, TaskCreate


def test_task_creation():
    task_create = TaskCreate(title="Test Task", description="Test Description")
    assert task_create.title == "Test Task"
    assert task_create.description == "Test Description"


def test_task_model():
    task = Task(title="Test Task", description="Test Description")
    assert task.title == "Test Task"
    assert task.description == "Test Description"
    assert task.is_completed is False