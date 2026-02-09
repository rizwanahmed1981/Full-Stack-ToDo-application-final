import pytest
from fastapi.testclient import TestClient
from todo_app.models.task import Task, TaskCreate, TaskUpdate


# Tests use fixtures defined in conftest.py


def test_create_task_with_empty_title_should_fail(client: TestClient):
    """Test that creating a task with an empty title fails."""
    response = client.post("/api/v1/tasks/", json={
        "title": "",
        "description": "Test Description"
    })
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()


def test_create_task_with_whitespace_only_title_should_fail(client: TestClient):
    """Test that creating a task with a whitespace-only title fails."""
    response = client.post("/api/v1/tasks/", json={
        "title": "   ",
        "description": "Test Description"
    })
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()


def test_update_task_with_empty_description_should_fail(client: TestClient):
    """Test that updating a task with an empty description fails."""
    # First create a task
    create_response = client.post("/api/v1/tasks/", json={
        "title": "Test Task",
        "description": "Original Description"
    })
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]

    # Try to update with empty description
    response = client.put(f"/api/v1/tasks/{task_id}", json={
        "description": ""
    })
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()


def test_update_task_with_whitespace_only_description_should_fail(client: TestClient):
    """Test that updating a task with a whitespace-only description fails."""
    # First create a task
    create_response = client.post("/api/v1/tasks/", json={
        "title": "Test Task",
        "description": "Original Description"
    })
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]

    # Try to update with whitespace-only description
    response = client.put(f"/api/v1/tasks/{task_id}", json={
        "description": "   "
    })
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()


def test_get_nonexistent_task_returns_404(client: TestClient):
    """Test that getting a non-existent task returns 404."""
    response = client.get("/api/v1/tasks/99999")
    assert response.status_code == 404


def test_update_nonexistent_task_returns_404(client: TestClient):
    """Test that updating a non-existent task returns 404."""
    response = client.put("/api/v1/tasks/99999", json={
        "description": "Updated Description"
    })
    assert response.status_code == 404


def test_toggle_completion_for_nonexistent_task_returns_404(client: TestClient):
    """Test that toggling completion for a non-existent task returns 404."""
    response = client.patch("/api/v1/tasks/99999", json={
        "is_completed": True
    })
    assert response.status_code == 404


def test_delete_nonexistent_task_returns_404(client: TestClient):
    """Test that deleting a non-existent task returns 404."""
    response = client.delete("/api/v1/tasks/99999")
    assert response.status_code == 404


def test_list_tasks_on_empty_database(client: TestClient):
    """Test that listing tasks on an empty database returns an empty list."""
    response = client.get("/api/v1/tasks/")
    assert response.status_code == 200
    assert response.json() == []


def test_create_task_with_long_title_fails_validation(client: TestClient):
    """Test that creating a task with a very long title fails validation."""
    long_title = "x" * 300  # Assuming max length is 255
    response = client.post("/api/v1/tasks/", json={
        "title": long_title,
        "description": "Test Description"
    })
    # The response could be either 422 (validation error) or 400 (business logic error)
    assert response.status_code in [400, 422]


def test_create_task_with_long_description(client: TestClient):
    """Test that creating a task with a long description works."""
    long_description = "x" * 1000  # Max length is 1000
    response = client.post("/api/v1/tasks/", json={
        "title": "Test Task",
        "description": long_description
    })
    assert response.status_code == 201
    data = response.json()
    assert len(data["description"]) == len(long_description)


def test_create_multiple_tasks_and_verify_order(client: TestClient):
    """Test that multiple tasks are returned in the expected order."""
    # Create multiple tasks
    titles = ["Task 1", "Task 2", "Task 3"]
    for title in titles:
        response = client.post("/api/v1/tasks/", json={
            "title": title,
            "description": f"Description for {title}"
        })
        assert response.status_code == 201

    # Get all tasks
    response = client.get("/api/v1/tasks/")
    assert response.status_code == 200
    tasks = response.json()
    
    # Verify they are in descending order by creation time (most recent first)
    assert len(tasks) == 3
    assert tasks[0]["title"] == "Task 3"  # Most recent first
    assert tasks[2]["title"] == "Task 1"  # Oldest last