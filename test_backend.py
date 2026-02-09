#!/usr/bin/env python3
"""
Simple test script to check if there are any import errors with the backend
"""

import sys
import os

# Add the backend/src directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend/src'))

try:
    print("Testing imports...")
    
    # Test importing the models
    from todo_app.models.task import Task, TaskCreate, TaskUpdate, TaskPublic
    print("✓ Models imported successfully")
    
    # Test importing the service
    from todo_app.services.todo_service import TodoService
    print("✓ Service imported successfully")
    
    # Test creating a sample task object
    sample_task = Task(
        title="Test",
        description="Test description",
        is_completed=False,
        created_at=os.__import__('datetime').datetime.utcnow(),
        updated_at=os.__import__('datetime').datetime.utcnow()
    )
    print("✓ Task object created successfully:", sample_task.title)
    
    # Test importing main
    from todo_app.main import app
    print("✓ Main app imported successfully")
    
    print("\nAll tests passed! No import errors found.")
    
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()