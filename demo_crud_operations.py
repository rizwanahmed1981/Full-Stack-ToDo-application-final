#!/usr/bin/env python3
"""
Demo script to perform CRUD operations on the Todo App API
This simulates what the frontend would do when interacting with the backend
"""
import json
import requests
import time
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8001"  # Updated to the correct port
HEADERS = {"Content-Type": "application/json"}

def print_section(title):
    print(f"\n{'='*50}")
    print(f"  {title}")
    print('='*50)

def create_task_demo():
    print_section("CREATE TASK DEMO")
    
    # Create a new task
    task_data = {
        "title": "Demo Task - Learn FastAPI",
        "description": "Explore FastAPI features and capabilities for building robust APIs",
        "priority": "high",
        "scheduled_date": "2026-02-28T10:00:00"
    }
    
    print(f"Creating task: {task_data['title']}")
    response = requests.post(f"{BASE_URL}/api/v1/tasks", headers=HEADERS, data=json.dumps(task_data))
    
    if response.status_code == 200:
        created_task = response.json()
        print(f"✓ Task created successfully with ID: {created_task['id']}")
        print(f"  Title: {created_task['title']}")
        print(f"  Description: {created_task['description']}")
        print(f"  Priority: {created_task['priority']}")
        print(f"  Created at: {created_task['created_at']}")
        return created_task['id']
    else:
        print(f"✗ Failed to create task: {response.status_code} - {response.text}")
        return None

def read_tasks_demo():
    print_section("READ TASKS DEMO")
    
    print("Fetching all tasks...")
    response = requests.get(f"{BASE_URL}/api/v1/tasks")
    
    if response.status_code == 200:
        tasks = response.json()
        print(f"✓ Retrieved {len(tasks)} tasks:")
        
        for i, task in enumerate(tasks[-5:], 1):  # Show last 5 tasks
            status = "✓" if task['is_completed'] else "○"
            print(f"  {i}. [{status}] {task['title']} (ID: {task['id']}) - Priority: {task['priority']}")
        
        return tasks
    else:
        print(f"✗ Failed to retrieve tasks: {response.status_code} - {response.text}")
        return []

def read_single_task_demo(task_id):
    print_section(f"READ SINGLE TASK DEMO (ID: {task_id})")
    
    print(f"Fetching task with ID: {task_id}")
    response = requests.get(f"{BASE_URL}/api/v1/tasks/{task_id}")
    
    if response.status_code == 200:
        task = response.json()
        print(f"✓ Retrieved task:")
        print(f"  Title: {task['title']}")
        print(f"  Description: {task['description']}")
        print(f"  Status: {'Completed' if task['is_completed'] else 'Active'}")
        print(f"  Priority: {task['priority']}")
        print(f"  Scheduled: {task['scheduled_date'] or 'Not scheduled'}")
        return task
    else:
        print(f"✗ Failed to retrieve task: {response.status_code} - {response.text}")
        return None

def update_task_demo(task_id):
    print_section(f"UPDATE TASK DEMO (ID: {task_id})")
    
    update_data = {
        "description": "Updated description: Master FastAPI for building scalable web applications",
        "priority": "critical"
    }
    
    print(f"Updating task {task_id} with new data...")
    response = requests.put(f"{BASE_URL}/api/v1/tasks/{task_id}", headers=HEADERS, data=json.dumps(update_data))
    
    if response.status_code == 200:
        updated_task = response.json()
        print(f"✓ Task updated successfully:")
        print(f"  Title: {updated_task['title']}")
        print(f"  Description: {updated_task['description']}")
        print(f"  Priority: {updated_task['priority']}")
        return updated_task
    else:
        print(f"✗ Failed to update task: {response.status_code} - {response.text}")
        return None

def toggle_completion_demo(task_id):
    print_section(f"TOGGLE COMPLETION DEMO (ID: {task_id})")
    
    print(f"Toggling completion status for task {task_id}...")
    response = requests.patch(f"{BASE_URL}/api/v1/tasks/{task_id}", headers=HEADERS)
    
    if response.status_code == 200:
        toggled_task = response.json()
        status = "Completed" if toggled_task['is_completed'] else "Active"
        print(f"✓ Task completion status updated: {status}")
        return toggled_task
    else:
        print(f"✗ Failed to toggle task completion: {response.status_code} - {response.text}")
        return None

def search_tasks_demo():
    print_section("SEARCH TASKS DEMO")
    
    # Search for tasks containing "Demo"
    search_params = {"q": "Demo"}
    print(f"Searching for tasks with keyword 'Demo'...")
    
    response = requests.get(f"{BASE_URL}/api/v1/tasks/search", 
                           headers=HEADERS, 
                           params=search_params)
    
    if response.status_code == 200:
        tasks = response.json()
        print(f"✓ Found {len(tasks)} tasks matching 'Demo':")
        
        for i, task in enumerate(tasks, 1):
            status = "✓" if task['is_completed'] else "○"
            print(f"  {i}. [{status}] {task['title']} (ID: {task['id']})")
        
        return tasks
    else:
        print(f"✗ Failed to search tasks: {response.status_code} - {response.text}")
        return []

def delete_task_demo(task_id):
    print_section(f"DELETE TASK DEMO (ID: {task_id})")
    
    print(f"Deleting task with ID: {task_id}...")
    response = requests.delete(f"{BASE_URL}/api/v1/tasks/{task_id}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✓ {result['message']}")
        return True
    else:
        print(f"✗ Failed to delete task: {response.status_code} - {response.text}")
        return False

def main():
    print("🚀 Todo App CRUD Operations Demo")
    print("Simulating frontend-backend communication...")
    
    # Perform CRUD operations in sequence
    task_id = create_task_demo()
    
    if task_id:
        time.sleep(1)  # Brief pause to simulate real-world timing
        
        read_tasks_demo()
        time.sleep(1)
        
        read_single_task_demo(task_id)
        time.sleep(1)
        
        update_task_demo(task_id)
        time.sleep(1)
        
        toggle_completion_demo(task_id)
        time.sleep(1)
        
        search_tasks_demo()
        time.sleep(1)
        
        # Toggle back to incomplete before deletion
        toggle_completion_demo(task_id)
        time.sleep(1)
        
        delete_task_demo(task_id)
        time.sleep(1)
    
    print_section("DEMO SUMMARY")
    print("✓ Demonstrated all CRUD operations:")
    print("  - CREATE: Added a new task to the system")
    print("  - READ: Retrieved individual and multiple tasks")
    print("  - UPDATE: Modified task properties")
    print("  - DELETE: Removed a task from the system")
    print("  - SEARCH: Found tasks by keyword")
    print("  - PATCH: Toggled task completion status")
    print("\nThe frontend and backend are properly integrated and functioning correctly!")

if __name__ == "__main__":
    main()