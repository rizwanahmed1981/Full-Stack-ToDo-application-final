from datetime import datetime
from sqlmodel import SQLModel, Field, Column
from typing import Optional


class TaskBase(SQLModel):
    """Base model for task fields."""
    title: str
    description: Optional[str] = None
    is_completed: bool = False


class Task(TaskBase, table=True):
    """Task model for database storage."""
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class TaskCreate(TaskBase):
    """Model for creating a new task."""
    pass


class TaskUpdate(SQLModel):
    """Model for updating a task."""
    description: Optional[str] = None


class TaskPublic(TaskBase):
    """Model for public task representation."""
    id: int
    created_at: datetime