import typer
from typing import Optional
from rich.console import Console
from rich.table import Table
from sqlmodel import create_engine
from todo_app.services.todo_service import TodoService
from todo_app.models.task import Task

app = typer.Typer()
console = Console()

# Create database engine (using environment variable for database)
import os
from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./database.db")
engine = create_engine(DATABASE_URL, echo=True, pool_pre_ping=True)
service = TodoService(engine)


def print_tasks(tasks, title="Tasks"):
    """Print tasks in a formatted table."""
    table = Table(title=title)
    table.add_column("ID", style="cyan", no_wrap=True)
    table.add_column("Status", style="magenta")
    table.add_column("Title", style="green")
    table.add_column("Description", style="dim")

    if not tasks:
        if title == "All Tasks":
            console.print("No tasks found.", style="yellow")
        else:
            console.print(f"No {title.lower()} found.", style="yellow")
        return

    for task in tasks:
        status = "✓" if task.is_completed else "○"
        description = task.description if task.description else ""
        table.add_row(str(task.id), status, task.title, description)

    console.print(table)


@app.command()
def add(
    title: str = typer.Argument(..., help="Task title"),
    description: str = typer.Argument("", help="Task description (optional)")
):
    """Add a new task."""
    try:
        task = service.add_task(title, description if description else None)
        console.print(f"Added task [bold cyan]{task.id}[/bold cyan]: {task.title}")
    except ValueError as e:
        console.print(f"Error: {e}", style="red")


@app.command()
def list_tasks(
    completed: Optional[bool] = typer.Option(None, "--completed", help="Show only completed tasks"),
    pending: Optional[bool] = typer.Option(None, "--pending", help="Show only pending tasks")
):
    """List all tasks."""
    if completed is True:
        tasks = service.get_completed_tasks()
        print_tasks(tasks, "Completed Tasks")
    elif pending is True:
        tasks = service.get_pending_tasks()
        print_tasks(tasks, "Pending Tasks")
    else:
        tasks = service.get_all_tasks()
        print_tasks(tasks, "All Tasks")


@app.command()
def complete(task_id: int = typer.Argument(..., help="Task ID to complete")):
    """Mark a task as completed."""
    task = service.toggle_task_completion(task_id)
    if task:
        status = "completed" if task.is_completed else "marked as incomplete"
        console.print(f"Task [bold cyan]{task_id}[/bold cyan] {status}")
    else:
        console.print(f"Task [bold cyan]{task_id}[/bold cyan] not found", style="red")


@app.command()
def update(
    task_id: int = typer.Argument(..., help="Task ID to update"),
    description: str = typer.Argument(..., help="New task description")
):
    """Update a task description."""
    # Use the service to update the task in the database
    updated_task = service.update_task(task_id, description)
    if updated_task:
        console.print(f"Task [bold cyan]{task_id}[/bold cyan] updated")
    else:
        console.print(f"Task [bold cyan]{task_id}[/bold cyan] not found", style="red")


@app.command()
def delete(task_id: int = typer.Argument(..., help="Task ID to delete")):
    """Delete a task."""
    if service.delete_task(task_id):
        console.print(f"Task [bold cyan]{task_id}[/bold cyan] deleted")
    else:
        console.print(f"Task [bold cyan]{task_id}[/bold cyan] not found", style="red")


@app.callback()
def main():
    """CLI Todo Application"""
    pass


if __name__ == "__main__":
    app()