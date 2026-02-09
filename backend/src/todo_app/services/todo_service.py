from sqlmodel import Session, select, func
from datetime import datetime
from typing import List, Optional
from ..models.task import Task, TaskCreate, TaskUpdate, PriorityEnum


class TodoService:
    """Service for managing todo tasks with database persistence."""

    def __init__(self, engine):
        self.engine = engine

    def add_task(self, title: str, description: Optional[str] = None, scheduled_date: Optional[datetime] = None, priority: Optional[str] = None) -> Task:
        """Add a new task to the database."""
        if not title or not title.strip():
            raise ValueError("Task title cannot be empty")

        current_time = datetime.utcnow()

        # Validate and convert priority string to enum if provided
        priority_enum = None
        if priority is not None and priority != "":
            try:
                priority_enum = PriorityEnum(priority)
            except ValueError:
                raise ValueError(f"Invalid priority value: {priority}. Must be one of: {list(PriorityEnum)}")
        else:
            priority_enum = PriorityEnum.MEDIUM

        # Create new task
        task = Task(
            title=title.strip(), 
            description=description, 
            scheduled_date=scheduled_date,
            priority=priority_enum,
            created_at=current_time,
            updated_at=current_time
        )

        # Save to database
        with Session(self.engine) as session:
            session.add(task)
            session.commit()
            session.refresh(task)

        return task

    def get_task(self, task_id: int) -> Optional[Task]:
        """Get a task by ID from database."""
        with Session(self.engine) as session:
            statement = select(Task).where(Task.id == task_id)
            result = session.execute(statement)
            return result.scalar_one_or_none()

    def get_all_tasks(self) -> List[Task]:
        """Get all tasks from the database."""
        with Session(self.engine) as session:
            statement = select(Task).order_by(Task.created_at.desc())
            result = session.execute(statement)
            return result.scalars().all()

    def toggle_task_completion(self, task_id: int) -> Optional[Task]:
        """Toggle a task's completion status."""
        with Session(self.engine) as session:
            task = self.get_task(task_id)
            if task:
                task.is_completed = not task.is_completed
                task.updated_at = datetime.utcnow()  # Update timestamp
                session.add(task)
                session.commit()
                session.refresh(task)
                return task
            return None

    def update_task(self, task_id: int, new_description: str = None, new_scheduled_date: Optional[datetime] = None, new_priority: Optional[str] = None) -> Optional[Task]:
        """Update a task description and/or scheduled date and/or priority."""
        if new_description is not None and (not new_description or not new_description.strip()):
            raise ValueError("Task description cannot be empty")

        with Session(self.engine) as session:
            task = self.get_task(task_id)
            if task:
                if new_description is not None:
                    task.description = new_description.strip()
                if new_scheduled_date is not None:
                    task.scheduled_date = new_scheduled_date
                if new_priority is not None:
                    # Validate and convert priority string to enum
                    try:
                        validated_priority = PriorityEnum(new_priority)
                        task.priority = validated_priority
                    except ValueError:
                        raise ValueError(f"Invalid priority value: {new_priority}. Must be one of: {list(PriorityEnum)}")
                task.updated_at = datetime.utcnow()  # Update timestamp
                session.add(task)
                session.commit()
                session.refresh(task)
                return task
            return None

    def delete_task(self, task_id: int) -> bool:
        """Delete a task by ID."""
        with Session(self.engine) as session:
            task = self.get_task(task_id)
            if task:
                session.delete(task)
                session.commit()
                return True
            return False

    def get_pending_tasks(self) -> List[Task]:
        """Get all pending (non-completed) tasks."""
        with Session(self.engine) as session:
            statement = select(Task).where(Task.is_completed == False).order_by(Task.created_at.desc())
            result = session.execute(statement)
            return result.scalars().all()

    def get_completed_tasks(self) -> List[Task]:
        """Get all completed tasks."""
        with Session(self.engine) as session:
            statement = select(Task).where(Task.is_completed == True).order_by(Task.created_at.desc())
            result = session.execute(statement)
            return result.scalars().all()

    def get_task_count(self) -> int:
        """Get total number of tasks."""
        with Session(self.engine) as session:
            statement = select(func.count(Task.id))
            result = session.execute(statement)
            return result.scalar_one()