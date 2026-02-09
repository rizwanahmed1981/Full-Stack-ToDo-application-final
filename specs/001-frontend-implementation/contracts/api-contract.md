# API Contracts: Frontend Implementation

## Task Management API

### GET /api/v1/tasks
**Description**: Retrieve all tasks for the user
**Response**:
```json
{
  "tasks": [
    {
      "id": "string",
      "title": "string",
      "description": "string | null",
      "isCompleted": "boolean",
      "createdAt": "ISO 8601 date string",
      "updatedAt": "ISO 8601 date string",
      "scheduledDate": "ISO 8601 date string | null"
    }
  ]
}
```

### POST /api/v1/tasks
**Description**: Create a new task
**Request Body**:
```json
{
  "title": "string",
  "description": "string | null",
  "scheduledDate": "ISO 8601 date string | null"
}
```
**Response**:
```json
{
  "id": "string",
  "title": "string",
  "description": "string | null",
  "isCompleted": "boolean",
  "createdAt": "ISO 8601 date string",
  "updatedAt": "ISO 8601 date string",
  "scheduledDate": "ISO 8601 date string | null"
}
```

### PUT /api/v1/tasks/{id}
**Description**: Update an existing task
**Request Body**:
```json
{
  "title": "string",
  "description": "string | null",
  "scheduledDate": "ISO 8601 date string | null"
}
```
**Response**:
```json
{
  "id": "string",
  "title": "string",
  "description": "string | null",
  "isCompleted": "boolean",
  "createdAt": "ISO 8601 date string",
  "updatedAt": "ISO 8601 date string",
  "scheduledDate": "ISO 8601 date string | null"
}
```

### PATCH /api/v1/tasks/{id}
**Description**: Toggle task completion status
**Request Body**:
```json
{
  "isCompleted": "boolean"
}
```
**Response**:
```json
{
  "id": "string",
  "title": "string",
  "description": "string | null",
  "isCompleted": "boolean",
  "createdAt": "ISO 8601 date string",
  "updatedAt": "ISO 8601 date string",
  "scheduledDate": "ISO 8601 date string | null"
}
```

### DELETE /api/v1/tasks/{id}
**Description**: Delete a task
**Response**: 204 No Content

## Calendar View API

### GET /api/v1/tasks/calendar?startDate=date&endDate=date
**Description**: Retrieve tasks organized by date for calendar view
**Query Parameters**:
- startDate: ISO 8601 date string
- endDate: ISO 8601 date string
**Response**:
```json
{
  "tasksByDate": {
    "2023-01-01": [
      {
        "id": "string",
        "title": "string",
        "description": "string | null",
        "isCompleted": "boolean",
        "scheduledDate": "ISO 8601 date string"
      }
    ],
    "2023-01-02": [...]
  }
}
```

## Error Response Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object | null"
  }
}
```