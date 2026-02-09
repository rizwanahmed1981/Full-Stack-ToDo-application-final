from fastapi.testclient import TestClient
from src.todo_app.main import create_app


def test_create_task(client: TestClient):
    response = client.post("/api/v1/tasks/", json={
        "title": "Test Task",
        "description": "Test Description"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["description"] == "Test Description"
    assert data["is_completed"] is False
    assert "id" in data


def test_get_tasks(client: TestClient):
    # First create a task
    client.post("/api/v1/tasks/", json={
        "title": "Test Task",
        "description": "Test Description"
    })
    
    # Then get all tasks
    response = client.get("/api/v1/tasks/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Test Task"


def test_get_task_by_id(client: TestClient):
    # First create a task
    create_response = client.post("/api/v1/tasks/", json={
        "title": "Test Task",
        "description": "Test Description"
    })
    task_id = create_response.json()["id"]
    
    # Then get the specific task
    response = client.get(f"/api/v1/tasks/{task_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Task"


def test_update_task(client: TestClient):
    # First create a task
    create_response = client.post("/api/v1/tasks/", json={
        "title": "Test Task",
        "description": "Test Description"
    })
    task_id = create_response.json()["id"]
    
    # Then update the task
    response = client.put(f"/api/v1/tasks/{task_id}", json={
        "title": "Updated Task",
        "description": "Updated Description",
        "is_completed": True
    })
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Task"
    assert data["is_completed"] is True


def test_toggle_task_completion(client: TestClient):
    # First create a task
    create_response = client.post("/api/v1/tasks/", json={
        "title": "Test Task",
        "description": "Test Description"
    })
    task_id = create_response.json()["id"]
    
    # Then toggle the task completion
    response = client.patch(f"/api/v1/tasks/{task_id}", json={
        "is_completed": True
    })
    assert response.status_code == 200
    data = response.json()
    assert data["is_completed"] is True


def test_delete_task(client: TestClient):
    # First create a task
    create_response = client.post("/api/v1/tasks/", json={
        "title": "Test Task",
        "description": "Test Description"
    })
    task_id = create_response.json()["id"]
    
    # Then delete the task
    response = client.delete(f"/api/v1/tasks/{task_id}")
    assert response.status_code == 204
    
    # Verify the task is gone
    get_response = client.get(f"/api/v1/tasks/{task_id}")
    assert get_response.status_code == 404