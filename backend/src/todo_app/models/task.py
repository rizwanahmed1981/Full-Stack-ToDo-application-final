from datetime import datetime
from sqlmodel import SQLModel, Field
from typing import Optional
from enum import Enum


class PriorityEnum(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class TaskBase(SQLModel):
    """Base model for task fields."""
    title: str
    description: Optional[str] = None
    is_completed: bool = False
    priority: PriorityEnum = PriorityEnum.MEDIUM


class Task(TaskBase, table=True):
    """Task model for database storage."""
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    scheduled_date: Optional[datetime] = None


class TaskCreate(TaskBase):
    """Model for creating a new task."""
    scheduled_date: Optional[datetime] = None


class TaskUpdate(SQLModel):
    """Model for updating a task."""
    description: Optional[str] = None
    scheduled_date: Optional[datetime] = None
    priority: Optional[PriorityEnum] = None


class TaskPublic(TaskBase):
    """Model for public task representation."""
    id: int
    created_at: datetime
    updated_at: datetime
    scheduled_date: Optional[datetime] = None


class SearchQuery(SQLModel):
    """Model representing search parameters for querying tasks."""
    keyword: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None