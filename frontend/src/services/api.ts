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
      const data = await response.json();
      return { data };
    } catch (error: any) {
      return {
        data: [],
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
      const data = await response.json();
      return { data };
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
      const data = await response.json();
      return { data };
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
        body: JSON.stringify({ isCompleted: true }), // This would need to be dynamic based on current state
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data };
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
      return { data: {} };
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
      const response = await fetch(
        `${API_BASE_URL}/api/v1/tasks/calendar?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data };
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