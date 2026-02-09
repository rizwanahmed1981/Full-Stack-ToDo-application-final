# Data Model: Frontend Implementation

## Entities

### Task
- **id**: string (unique identifier from backend)
- **title**: string (required, max 255 chars)
- **description**: string | null (optional, max 1000 chars)
- **isCompleted**: boolean (default: false)
- **createdAt**: Date (timestamp from backend)
- **updatedAt**: Date (timestamp from backend)
- **scheduledDate**: Date | null (optional, for calendar organization)

### TaskList
- **tasks**: Array<Task> (collection of tasks)
- **filters**: { status: 'all' | 'active' | 'completed', dateRange?: [Date, Date] }
- **sortOrder**: 'asc' | 'desc' (default: desc by createdAt)

### CalendarView
- **selectedDate**: Date (currently viewed date)
- **viewMode**: 'day' | 'week' | 'month' (default: month)
- **tasksByDate**: Map<Date, Task[]> (tasks organized by date)

### UserSession
- **isLoggedIn**: boolean (authentication state)
- **userId**: string | null (user identifier if logged in)
- **preferences**: { theme: 'light' | 'dark', notifications: boolean }

### LocalCache
- **tasks**: Task[] (locally cached tasks)
- **lastSyncTime**: Date | null (timestamp of last successful sync)
- **pendingOperations**: Array<{ type: 'create' | 'update' | 'delete', data: any }> (operations pending sync)