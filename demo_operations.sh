#!/bin/bash

# Demo script to showcase all operations of the Todo application
BASE_URL="http://localhost:8000"

echo "🚀 Starting Demo of Todo Application Operations"
echo "================================================"

# 1. Health check
echo "✅ Checking API health..."
curl -s $BASE_URL/health
echo
echo

# 2. Create tasks
echo "📝 Creating sample tasks..."
TASK1=$(curl -s -X POST $BASE_URL/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Setup development environment","description":"Install required dependencies and configure the development environment","priority":"high"}')

TASK2=$(curl -s -X POST $BASE_URL/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Implement user authentication","description":"Create login and registration functionality","priority":"critical"}')

TASK3=$(curl -s -X POST $BASE_URL/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write documentation","description":"Document the API endpoints and usage instructions","priority":"medium"}')

TASK4=$(curl -s -X POST $BASE_URL/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Deploy to production","description":"Prepare and deploy the application to production servers","priority":"high"}')

TASK5=$(curl -s -X POST $BASE_URL/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Unit testing","description":"Write and run unit tests for all components","priority":"medium"}')

# Extract IDs manually from the JSON response
TASK1_ID=$(echo $TASK1 | grep -o '"id":[0-9]*' | cut -d':' -f2)
TASK2_ID=$(echo $TASK2 | grep -o '"id":[0-9]*' | cut -d':' -f2)
TASK3_ID=$(echo $TASK3 | grep -o '"id":[0-9]*' | cut -d':' -f2)
TASK4_ID=$(echo $TASK4 | grep -o '"id":[0-9]*' | cut -d':' -f2)
TASK5_ID=$(echo $TASK5 | grep -o '"id":[0-9]*' | cut -d':' -f2)

echo "Created tasks with IDs: $TASK1_ID, $TASK2_ID, $TASK3_ID, $TASK4_ID, $TASK5_ID"
echo

# 3. Get all tasks
echo "📚 Retrieving all tasks..."
curl -s $BASE_URL/api/v1/tasks
echo
echo

# 4. Get a specific task
echo "🔍 Retrieving specific task (ID: $TASK1_ID)..."
curl -s $BASE_URL/api/v1/tasks/$TASK1_ID
echo
echo

# 5. Update a task
echo "✏️ Updating task (ID: $TASK2_ID)..."
UPDATED_TASK=$(curl -s -X PUT $BASE_URL/api/v1/tasks/$TASK2_ID \
  -H "Content-Type: application/json" \
  -d '{"description":"Create login and registration functionality with OAuth support","priority":"critical"}')
echo $UPDATED_TASK
echo

# 6. Toggle task completion
echo "✅ Toggling completion status for task (ID: $TASK3_ID)..."
TOGGLED_TASK=$(curl -s -X PATCH $BASE_URL/api/v1/tasks/$TASK3_ID \
  -H "Content-Type: application/json")
echo $TOGGLED_TASK
echo

# 7. Toggle completion again to revert
echo "↩️ Toggling completion status again for task (ID: $TASK3_ID) to revert..."
TOGGLED_TASK_AGAIN=$(curl -s -X PATCH $BASE_URL/api/v1/tasks/$TASK3_ID \
  -H "Content-Type: application/json")
echo $TOGGLED_TASK_AGAIN
echo

# 8. Get all tasks again to see changes
echo "📋 Retrieving all tasks after updates..."
curl -s $BASE_URL/api/v1/tasks
echo
echo

# 9. Delete a task
echo "🗑️ Deleting task (ID: $TASK5_ID)..."
DELETE_RESULT=$(curl -s -X DELETE $BASE_URL/api/v1/tasks/$TASK5_ID)
echo $DELETE_RESULT
echo

# 10. Get all tasks to confirm deletion
echo "📋 Retrieving all tasks after deletion..."
curl -s $BASE_URL/api/v1/tasks
echo
echo

echo "🎉 Demo completed! All operations demonstrated successfully."
echo
echo "Summary of operations performed:"
echo "- GET /health: Health check"
echo "- POST /api/v1/tasks: Created 5 tasks"
echo "- GET /api/v1/tasks: Retrieved all tasks"
echo "- GET /api/v1/tasks/{id}: Retrieved specific task"
echo "- PUT /api/v1/tasks/{id}: Updated task"
echo "- PATCH /api/v1/tasks/{id}: Toggled task completion"
echo "- DELETE /api/v1/tasks/{id}: Deleted task"