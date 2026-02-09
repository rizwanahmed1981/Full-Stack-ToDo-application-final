export interface Task {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  scheduledDate: Date | null;
}

export interface TaskList {
  tasks: Array<Task>;
  filters: {
    status: 'all' | 'active' | 'completed';
    dateRange?: [Date, Date];
  };
  sortOrder: 'asc' | 'desc';
}

export interface CalendarView {
  selectedDate: Date;
  viewMode: 'day' | 'week' | 'month';
  tasksByDate: Map<Date, Task[]>;
}

export interface UserSession {
  isLoggedIn: boolean;
  userId: string | null;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

export interface LocalCache {
  tasks: Task[];
  lastSyncTime: Date | null;
  pendingOperations: Array<{
    type: 'create' | 'update' | 'delete';
    data: any;
  }>;
}