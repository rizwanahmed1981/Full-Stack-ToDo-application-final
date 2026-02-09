import { safeParseDate } from '@/utils/dateUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface ApiResponse<T> {
  data: T;
  error?: {
    code: string;
    message: string;
    details: any;
  };
}

export class ApiService {
  static async getTasks(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/tasks`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rawData = await response.json();
      
      // Transform the raw data to match frontend expectations
      const transformedData = {
        tasks: rawData.map((task: any) => ({
          ...task,
          // Convert snake_case to camelCase and string IDs to numbers
          id: Number(task.id),
          isCompleted: task.is_completed,  // Convert snake_case to camelCase
          priority: task.priority && ['low', 'medium', 'high', 'critical'].includes(task.priority) 
          ? task.priority 
          : 'medium', // Default to medium if not provided or invalid
          createdAt: safeParseDate(task.created_at),  // Convert snake_case to camelCase
          // Use created_at as fallback for updatedAt if not present
          updatedAt: safeParseDate(task.updated_at || task.created_at),
          // Convert scheduled_date to scheduledDate if present
          scheduledDate: task.scheduled_date ? safeParseDate(task.scheduled_date) : null
        }))
      };
      
      return { data: transformedData };
    } catch (error: any) {
      return {
        data: { tasks: [] },
        error: {
          code: 'FETCH_ERROR',
          message: error.message || 'Failed to fetch tasks',
          details: error
        }
      };
    }
  }

  static async createTask(task: Omit<any, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rawData = await response.json();

      // Transform the raw data to match frontend expectations
      const transformedData = {
        ...rawData,
        // Convert snake_case to camelCase and string ID to number
        id: Number(rawData.id),
        isCompleted: rawData.is_completed,  // Convert snake_case to camelCase
        priority: rawData.priority && ['low', 'medium', 'high', 'critical'].includes(rawData.priority) 
          ? rawData.priority 
          : 'medium', // Default to medium if not provided or invalid
        createdAt: safeParseDate(rawData.created_at),  // Convert snake_case to camelCase
        // Use created_at as fallback for updatedAt if not present
        updatedAt: safeParseDate(rawData.updated_at || rawData.created_at),
        // Convert scheduled_date to scheduledDate if present
        scheduledDate: rawData.scheduled_date ? safeParseDate(rawData.scheduled_date) : null
      };

      return { data: transformedData };
    } catch (error: any) {
      return {
        data: {} as any,
        error: {
          code: 'CREATE_ERROR',
          message: error.message || 'Failed to create task',
          details: error
        }
      };
    }
  }

  static async updateTask(id: string, task: Partial<Omit<any, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rawData = await response.json();

      // Transform the raw data to match frontend expectations
      const transformedData = {
        ...rawData,
        // Convert snake_case to camelCase and string ID to number
        id: Number(rawData.id),
        isCompleted: rawData.is_completed,  // Convert snake_case to camelCase
        priority: rawData.priority && ['low', 'medium', 'high', 'critical'].includes(rawData.priority) 
          ? rawData.priority 
          : 'medium', // Default to medium if not provided or invalid
        createdAt: safeParseDate(rawData.created_at),  // Convert snake_case to camelCase
        // Use created_at as fallback for updatedAt if not present
        updatedAt: safeParseDate(rawData.updated_at || rawData.created_at),
        // Convert scheduled_date to scheduledDate if present
        scheduledDate: rawData.scheduled_date ? safeParseDate(rawData.scheduled_date) : null
      };

      return { data: transformedData };
    } catch (error: any) {
      return {
        data: {} as any,
        error: {
          code: 'UPDATE_ERROR',
          message: error.message || 'Failed to update task',
          details: error
        }
      };
    }
  }

  static async toggleTaskCompletion(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rawData = await response.json();

      // Transform the raw data to match frontend expectations
      const transformedData = {
        ...rawData,
        // Convert snake_case to camelCase and string ID to number
        id: Number(rawData.id),
        isCompleted: rawData.is_completed,  // Convert snake_case to camelCase
        priority: rawData.priority && ['low', 'medium', 'high', 'critical'].includes(rawData.priority) 
          ? rawData.priority 
          : 'medium', // Default to medium if not provided or invalid
        createdAt: safeParseDate(rawData.created_at),  // Convert snake_case to camelCase
        // Use created_at as fallback for updatedAt if not present
        updatedAt: safeParseDate(rawData.updated_at || rawData.created_at),
        // Convert scheduled_date to scheduledDate if present
        scheduledDate: rawData.scheduled_date ? safeParseDate(rawData.scheduled_date) : null
      };

      return { data: transformedData };
    } catch (error: any) {
      return {
        data: {} as any,
        error: {
          code: 'TOGGLE_ERROR',
          message: error.message || 'Failed to toggle task completion',
          details: error
        }
      };
    }
  }

  static async deleteTask(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Return success response for deletion
      return { data: { success: true, message: 'Task deleted successfully' } };
    } catch (error: any) {
      return {
        data: {},
        error: {
          code: 'DELETE_ERROR',
          message: error.message || 'Failed to delete task',
          details: error
        }
      };
    }
  }

  static async getCalendarTasks(startDate: Date, endDate: Date): Promise<ApiResponse<any>> {
    try {
      // For now, just return all tasks since the backend doesn't have date filtering
      // In a real implementation, the backend would have a specific endpoint for calendar tasks
      const response = await this.getTasks();
      return response;
    } catch (error: any) {
      return {
        data: {},
        error: {
          code: 'CALENDAR_FETCH_ERROR',
          message: error.message || 'Failed to fetch calendar tasks',
          details: error
        }
      };
    }
  }
}