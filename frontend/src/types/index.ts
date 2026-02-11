export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type StatusFilter = 'all' | 'active' | 'completed';

export interface Task {
  id: number;  // Backend returns integer IDs
  title: string;
  description: string | null;
  isCompleted: boolean;
  priority: Priority; // low, medium, high, critical
  createdAt: Date;
  updatedAt: Date;
  scheduledDate: Date | null;
}

export interface SearchQuery {
  keyword?: string;
  status?: StatusFilter;
  priority?: Priority | 'all';
  startDate?: Date;
  endDate?: Date;
}

export interface FilterCriteria {
  status: StatusFilter;
  priority: Priority | 'all';
  dateRange?: { startDate: Date | null; endDate: Date | null };
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