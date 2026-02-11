#!/usr/bin/env python3
"""
Integration test to validate frontend-backend communication
"""
import json
import requests
import time

# Configuration
BASE_URL = "http://localhost:8000"
HEADERS = {"Content-Type": "application/json"}

def test_api_endpoints():
    print("Testing API endpoints...")
    
    # Test 1: Health check
    print("\n1. Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["database"] == "connected"
        print("   ✓ Health check passed")
    except Exception as e:
        print(f"   ✗ Health check failed: {e}")
        return False
    
    # Test 2: Create a task
    print("\n2. Testing task creation...")
    try:
        task_data = {
            "title": "Integration Test Task",
            "description": "This is a test task for integration validation",
            "priority": "medium"
        }
        response = requests.post(f"{BASE_URL}/api/v1/tasks", 
                                headers=HEADERS, 
                                data=json.dumps(task_data))
        assert response.status_code == 200
        created_task = response.json()
        assert created_task["title"] == task_data["title"]
        assert created_task["description"] == task_data["description"]
        assert created_task["priority"] == task_data["priority"]
        assert "id" in created_task
        task_id = created_task["id"]
        print(f"   ✓ Task created successfully with ID: {task_id}")
    except Exception as e:
        print(f"   ✗ Task creation failed: {e}")
        return False
    
    # Test 3: Get all tasks
    print("\n3. Testing task retrieval...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/tasks")
        assert response.status_code == 200
        tasks = response.json()
        assert len(tasks) >= 1
        task_found = any(task["id"] == task_id for task in tasks)
        assert task_found, f"Created task with ID {task_id} not found in task list"
        print(f"   ✓ Found {len(tasks)} tasks, including our test task")
    except Exception as e:
        print(f"   ✗ Task retrieval failed: {e}")
        return False
    
    # Test 4: Update task
    print("\n4. Testing task update...")
    try:
        update_data = {
            "description": "Updated description for integration test",
            "priority": "high"
        }
        response = requests.put(f"{BASE_URL}/api/v1/tasks/{task_id}", 
                               headers=HEADERS, 
                               data=json.dumps(update_data))
        assert response.status_code == 200
        updated_task = response.json()
        assert updated_task["id"] == task_id
        assert updated_task["description"] == update_data["description"]
        assert updated_task["priority"] == update_data["priority"]
        print("   ✓ Task updated successfully")
    except Exception as e:
        print(f"   ✗ Task update failed: {e}")
        return False
    
    # Test 5: Toggle task completion
    print("\n5. Testing task completion toggle...")
    try:
        response = requests.patch(f"{BASE_URL}/api/v1/tasks/{task_id}", 
                                 headers=HEADERS)
        assert response.status_code == 200
        toggled_task = response.json()
        assert toggled_task["id"] == task_id
        assert toggled_task["is_completed"] == True  # Should be true after first toggle
        print("   ✓ Task completion toggled successfully")
        
        # Toggle back to false for cleanup
        response = requests.patch(f"{BASE_URL}/api/v1/tasks/{task_id}", 
                                 headers=HEADERS)
        assert response.status_code == 200
        toggled_back_task = response.json()
        assert toggled_back_task["is_completed"] == False  # Should be false after second toggle
        print("   ✓ Task completion toggled back to false")
    except Exception as e:
        print(f"   ✗ Task completion toggle failed: {e}")
        return False
    
    # Test 6: Delete task
    print("\n6. Testing task deletion...")
    try:
        response = requests.delete(f"{BASE_URL}/api/v1/tasks/{task_id}")
        assert response.status_code == 200
        delete_response = response.json()
        assert "message" in delete_response
        assert "deleted successfully" in delete_response["message"]
        print("   ✓ Task deleted successfully")
    except Exception as e:
        print(f"   ✗ Task deletion failed: {e}")
        return False
    
    # Final verification: ensure task is gone
    print("\n7. Verifying task deletion...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/tasks")
        assert response.status_code == 200
        tasks = response.json()
        task_exists = any(task["id"] == task_id for task in tasks)
        assert not task_exists, f"Task with ID {task_id} still exists after deletion"
        print("   ✓ Task successfully removed from list")
    except Exception as e:
        print(f"   ✗ Task deletion verification failed: {e}")
        return False
    
    print("\n✓ All integration tests passed!")
    return True

def test_data_transformation():
    """
    Test that data transformations between frontend and backend are handled properly
    This simulates what happens in the frontend's api.ts file
    """
    print("\nTesting data transformation compatibility...")
    
    # Create a test task
    task_data = {
        "title": "Data Transformation Test",
        "description": "Test for data transformation between frontend and backend",
        "priority": "medium"
    }
    
    # Create task
    response = requests.post(f"{BASE_URL}/api/v1/tasks", 
                            headers=HEADERS, 
                            data=json.dumps(task_data))
    assert response.status_code == 200
    created_task = response.json()
    task_id = created_task["id"]
    
    # Simulate frontend transformation of backend response
    # Backend returns snake_case, frontend expects camelCase
    transformed_task = {
        "id": int(created_task["id"]),  # Ensure ID is number
        "title": created_task["title"],
        "description": created_task["description"],
        "isCompleted": created_task["is_completed"],  # snake_case to camelCase
        "priority": created_task["priority"],  # Priority field
        "createdAt": created_task["created_at"],  # snake_case to camelCase
        "updatedAt": created_task["updated_at"],  # snake_case to camelCase
        "scheduledDate": created_task["scheduled_date"]  # snake_case to camelCase
    }
    
    # Verify transformation is correct
    assert isinstance(transformed_task["id"], int)
    assert "isCompleted" in transformed_task  # camelCase property exists
    assert "createdAt" in transformed_task    # camelCase property exists
    assert "updatedAt" in transformed_task    # camelCase property exists
    assert "scheduledDate" in transformed_task # camelCase property exists
    assert "priority" in transformed_task      # priority property exists
    
    print("   ✓ Data transformation compatibility verified")
    
    # Clean up
    requests.delete(f"{BASE_URL}/api/v1/tasks/{task_id}")
    
    return True

if __name__ == "__main__":
    print("Starting Frontend-Backend Integration Validation...")
    print("=" * 50)
    
    # Wait a moment to ensure server is ready
    time.sleep(2)
    
    success = True
    success &= test_api_endpoints()
    success &= test_data_transformation()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 ALL INTEGRATION TESTS PASSED!")
        print("The frontend and backend are properly integrated.")
    else:
        print("❌ SOME TESTS FAILED!")
        print("There are issues with the frontend-backend integration.")
    
    print("=" * 50)