import { Task } from '@/types';

const TASKS_CACHE_KEY = 'todo_app_tasks';
const LAST_SYNC_TIME_KEY = 'todo_app_last_sync_time';

export class CacheService {
  static async getAllTasks(): Promise<Task[]> {
    if (typeof window === 'undefined') {
      // Server-side, return empty array
      return [];
    }

    try {
      const cachedData = localStorage.getItem(TASKS_CACHE_KEY);
      if (cachedData) {
        const tasks = JSON.parse(cachedData);
        // Convert date strings back to Date objects
        return tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          scheduledDate: task.scheduledDate ? new Date(task.scheduledDate) : null,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error reading tasks from cache:', error);
      return [];
    }
  }

  static async setAllTasks(tasks: Task[]): Promise<void> {
    if (typeof window === 'undefined') {
      // Server-side, nothing to do
      return;
    }

    try {
      // Convert Date objects to strings for storage
      const serializableTasks = tasks.map(task => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
        scheduledDate: task.scheduledDate ? task.scheduledDate.toISOString() : null,
      }));
      localStorage.setItem(TASKS_CACHE_KEY, JSON.stringify(serializableTasks));
    } catch (error) {
      console.error('Error saving tasks to cache:', error);
    }
  }

  static async getLastSyncTime(): Promise<Date | null> {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const syncTimeString = localStorage.getItem(LAST_SYNC_TIME_KEY);
      if (syncTimeString) {
        return new Date(syncTimeString);
      }
      return null;
    } catch (error) {
      console.error('Error reading sync time from cache:', error);
      return null;
    }
  }

  static async setLastSyncTime(time: Date): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(LAST_SYNC_TIME_KEY, time.toISOString());
    } catch (error) {
      console.error('Error saving sync time to cache:', error);
    }
  }

  static async addPendingOperation(operation: { type: 'create' | 'update' | 'delete'; data: any }): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const key = 'todo_app_pending_operations';
      const existingOps = JSON.parse(localStorage.getItem(key) || '[]');
      existingOps.push({
        ...operation,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(key, JSON.stringify(existingOps));
    } catch (error) {
      console.error('Error adding pending operation to cache:', error);
    }
  }

  static async getPendingOperations(): Promise<Array<{ type: 'create' | 'update' | 'delete'; data: any; timestamp: string }>> {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const key = 'todo_app_pending_operations';
      const opsString = localStorage.getItem(key);
      return opsString ? JSON.parse(opsString) : [];
    } catch (error) {
      console.error('Error reading pending operations from cache:', error);
      return [];
    }
  }

  static async clearPendingOperations(): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.removeItem('todo_app_pending_operations');
    } catch (error) {
      console.error('Error clearing pending operations from cache:', error);
    }
  }

  static async clearCache(): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.removeItem(TASKS_CACHE_KEY);
      localStorage.removeItem(LAST_SYNC_TIME_KEY);
      localStorage.removeItem('todo_app_pending_operations');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}