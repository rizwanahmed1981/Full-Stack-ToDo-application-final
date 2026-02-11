// Tasks API service for the dashboard frontend

import { Task } from '@/src/types/task';

// Base API URL - can be configured via environment variables
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

// Define filter options type
export interface TaskFilters {
  page?: number;
  limit?: number;
  status?: 'pending' | 'in-progress' | 'completed' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  search?: string;
}

// Define response type for tasks with pagination
export interface TasksResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Fetches tasks for the dashboard with pagination and filtering
 * @param filters - Task filters including pagination, status, priority, and search
 * @returns Promise resolving to tasks with pagination info
 */
export const fetchTasks = async (filters: TaskFilters = {}): Promise<TasksResponse> => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    if (filters.page !== undefined) queryParams.append('page', filters.page.toString());
    if (filters.limit !== undefined) queryParams.append('limit', filters.limit.toString());
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.priority) queryParams.append('priority', filters.priority);
    if (filters.search) queryParams.append('search', filters.search);

    const queryString = queryParams.toString();
    const url = `${BASE_API_URL}/dashboard/tasks${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${authToken}`,
      },
      credentials: 'include', // Include cookies if needed for auth
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

/**
 * Fetches a single task by ID
 * @param taskId - The ID of the task to fetch
 * @returns Promise resolving to the task
 */
export const fetchTaskById = async (taskId: string): Promise<Task> => {
  try {
    const response = await fetch(`${BASE_API_URL}/dashboard/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${authToken}`,
      },
      credentials: 'include', // Include cookies if needed for auth
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch task: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    throw error;
  }
};

/**
 * Updates a task
 * @param taskId - The ID of the task to update
 * @param taskData - The updated task data
 * @returns Promise resolving to the updated task
 */
export const updateTask = async (taskId: string, taskData: Partial<Task>): Promise<Task> => {
  try {
    const response = await fetch(`${BASE_API_URL}/dashboard/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${authToken}`,
      },
      credentials: 'include', // Include cookies if needed for auth
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update task: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

/**
 * Deletes a task
 * @param taskId - The ID of the task to delete
 * @returns Promise resolving when the task is deleted
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_API_URL}/dashboard/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${authToken}`,
      },
      credentials: 'include', // Include cookies if needed for auth
    });

    if (!response.ok) {
      throw new Error(`Failed to delete task: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

/**
 * Creates a new task
 * @param taskData - The task data to create
 * @returns Promise resolving to the created task
 */
export const createTask = async (taskData: Omit<Task, 'id'>): Promise<Task> => {
  try {
    const response = await fetch(`${BASE_API_URL}/dashboard/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${authToken}`,
      },
      credentials: 'include', // Include cookies if needed for auth
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create task: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};