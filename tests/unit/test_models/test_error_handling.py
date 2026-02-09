import pytest
from fastapi.testclient import TestClient
from src.todo_app.main import create_app


def test_empty_title_validation(client: TestClient):
    """Test validation for empty task titles during creation"""
    response = client.post("/api/v1/tasks/", json={
        "title": "",
        "description": "Test Description"
    })
    assert response.status_code == 400
    
    response = client.post("/api/v1/tasks/", json={
        "title": "   ",  # Only spaces
        "description": "Test Description"
    })
    assert response.status_code == 400


def test_invalid_task_id_format(client: TestClient):
    """Test handling of invalid task ID formats"""
    # Test with non-numeric ID (should return 422 due to type validation)
    response = client.get("/api/v1/tasks/invalid-id")
    assert response.status_code == 422


def test_non_existent_task_operations(client: TestClient):
    """Test operations on non-existent tasks"""
    # Test getting non-existent task
    response = client.get("/api/v1/tasks/99999")
    assert response.status_code == 404
    
    # Test updating non-existent task
    response = client.put("/api/v1/tasks/99999", json={
        "title": "Updated Task"
    })
    assert response.status_code == 404
    
    # Test toggling completion of non-existent task
    response = client.patch("/api/v1/tasks/99999", json={
        "is_completed": True
    })
    assert response.status_code == 404
    
    # Test deleting non-existent task
    response = client.delete("/api/v1/tasks/99999")
    assert response.status_code == 404


def test_empty_list_scenario(client: TestClient):
    """Test GET /tasks endpoint when no tasks exist"""
    response = client.get("/api/v1/tasks/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0