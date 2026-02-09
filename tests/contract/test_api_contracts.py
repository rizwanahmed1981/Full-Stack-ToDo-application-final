import pytest
from fastapi.testclient import TestClient
from src.todo_app.main import create_app


def test_post_tasks_contract(client: TestClient):
    """Test the POST /tasks endpoint contract"""
    response = client.post("/api/v1/tasks/", json={
        "title": "Test Task",
        "description": "Test Description"
    })
    
    # Check status code
    assert response.status_code == 201
    
    # Check response structure
    data = response.json()
    assert "id" in data
    assert "title" in data
    assert "description" in data
    assert "is_completed" in data
    assert "created_at" in data
    assert "updated_at" in data
    
    # Check data types and values
    assert isinstance(data["id"], int)
    assert data["title"] == "Test Task"
    assert data["description"] == "Test Description"
    assert isinstance(data["is_completed"], bool)
    assert data["is_completed"] is False


def test_get_tasks_contract(client: TestClient):
    """Test the GET /tasks endpoint contract"""
    # First create a task
    client.post("/api/v1/tasks/", json={
        "title": "Test Task",
        "description": "Test Description"
    })
    
    response = client.get("/api/v1/tasks/")
    
    # Check status code
    assert response.status_code == 200
    
    # Check response structure
    data = response.json()
    assert isinstance(data, list)
    
    if len(data) > 0:
        task = data[0]
        assert "id" in task
        assert "title" in task
        assert "description" in task
        assert "is_completed" in task
        assert "created_at" in task
        assert "updated_at" in task


def test_patch_task_contract(client: TestClient):
    """Test the PATCH /tasks/{id} endpoint contract"""
    # First create a task
    create_response = client.post("/api/v1/tasks/", json={
        "title": "Test Task",
        "description": "Test Description"
    })
    task_id = create_response.json()["id"]
    
    response = client.patch(f"/api/v1/tasks/{task_id}", json={
        "is_completed": True
    })
    
    # Check status code
    assert response.status_code == 200
    
    # Check response structure
    data = response.json()
    assert "id" in data
    assert "title" in data
    assert "description" in data
    assert "is_completed" in data
    assert "created_at" in data
    assert "updated_at" in data
    
    # Check that completion status was updated
    assert data["is_completed"] is True


def test_put_task_contract(client: TestClient):
    """Test the PUT /tasks/{id} endpoint contract"""
    # First create a task
    create_response = client.post("/api/v1/tasks/", json={
        "title": "Test Task",
        "description": "Test Description"
    })
    task_id = create_response.json()["id"]
    
    response = client.put(f"/api/v1/tasks/{task_id}", json={
        "title": "Updated Task",
        "description": "Updated Description",
        "is_completed": True
    })
    
    # Check status code
    assert response.status_code == 200
    
    # Check response structure
    data = response.json()
    assert "id" in data
    assert "title" in data
    assert "description" in data
    assert "is_completed" in data
    assert "created_at" in data
    assert "updated_at" in data
    
    # Check that the task was updated
    assert data["title"] == "Updated Task"
    assert data["is_completed"] is True


def test_delete_task_contract(client: TestClient):
    """Test the DELETE /tasks/{id} endpoint contract"""
    # First create a task
    create_response = client.post("/api/v1/tasks/", json={
        "title": "Test Task",
        "description": "Test Description"
    })
    task_id = create_response.json()["id"]
    
    response = client.delete(f"/api/v1/tasks/{task_id}")
    
    # Check status code
    assert response.status_code == 204


def test_error_handling_contract(client: TestClient):
    """Test error handling for non-existent task"""
    # Try to get a non-existent task
    response = client.get("/api/v1/tasks/99999")
    assert response.status_code == 404
    
    # Try to update a non-existent task
    response = client.put("/api/v1/tasks/99999", json={
        "title": "Updated Task"
    })
    assert response.status_code == 404
    
    # Try to delete a non-existent task
    response = client.delete("/api/v1/tasks/99999")
    assert response.status_code == 404