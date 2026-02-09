import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { ApiService } from '@/services/api';
import { CacheService } from '@/services/cache';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks from cache on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        // Try to load from cache first
        const cachedTasks = await CacheService.getAllTasks();
        if (cachedTasks.length > 0) {
          setTasks(cachedTasks);
        }

        // Then try to fetch fresh data from API
        const response = await ApiService.getTasks();
        if (!response.error) {
          setTasks(response.data.tasks);
          // Update cache with fresh data
          await CacheService.setAllTasks(response.data.tasks);
        } else {
          setError(response.error.message);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading tasks');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const refreshTasks = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getTasks();
      if (!response.error) {
        setTasks(response.data.tasks);
        await CacheService.setAllTasks(response.data.tasks);
        setError(null); // Reset error after successful operation
      } else {
        setError(response.error.message);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while refreshing tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted'>) => {
    try {
      setLoading(true);
      const response = await ApiService.createTask(taskData);
      if (!response.error) {
        const newTask = response.data as Task;
        setTasks(prev => {
          const updatedTasks = [newTask, ...prev];
          // Update cache with error handling
          try {
            CacheService.setAllTasks(updatedTasks); // Update cache with the same data as state
          } catch (cacheError) {
            console.error('Failed to update cache after creating task:', cacheError);
            // Don't throw the error as it shouldn't affect the main operation
          }
          return updatedTasks;
        });
        setError(null); // Reset error after successful operation
        return newTask;
      } else {
        setError(response.error.message);
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating task');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: number, taskData: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setLoading(true);
      // Prepare the data to send to the API
      const apiData: any = {};
      if (taskData.description !== undefined) {
        apiData.description = taskData.description;
      }
      if (taskData.scheduledDate !== undefined) {
        apiData.scheduled_date = taskData.scheduledDate;
      }
      if (taskData.priority !== undefined) {
        // Validate priority value before sending
        if (['low', 'medium', 'high', 'critical'].includes(taskData.priority)) {
          apiData.priority = taskData.priority;
        }
      }
      
      const response = await ApiService.updateTask(id.toString(), apiData);
      if (!response.error) {
        const updatedTask = response.data;
        setTasks(prev => {
          const updatedTasks = prev.map(task => task.id === id ? updatedTask : task);
          // Update cache with error handling
          try {
            CacheService.setAllTasks(updatedTasks); // Update cache with the same data as state
          } catch (cacheError) {
            console.error('Failed to update cache after updating task:', cacheError);
            // Don't throw the error as it shouldn't affect the main operation
          }
          return updatedTasks;
        });
        setError(null); // Reset error after successful operation
        return updatedTask;
      } else {
        setError(response.error.message);
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating task');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = async (id: number) => {
    try {
      setLoading(true);
      const response = await ApiService.toggleTaskCompletion(id.toString());
      if (!response.error) {
        const updatedTask = response.data;
        setTasks(prev => {
          const updatedTasks = prev.map(task => task.id === id ? updatedTask : task);
          // Update cache with error handling
          try {
            CacheService.setAllTasks(updatedTasks); // Update cache with the same data as state
          } catch (cacheError) {
            console.error('Failed to update cache after toggling task completion:', cacheError);
            // Don't throw the error as it shouldn't affect the main operation
          }
          return updatedTasks;
        });
        setError(null); // Reset error after successful operation
        return updatedTask;
      } else {
        setError(response.error.message);
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while toggling task completion');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      setLoading(true);
      const response = await ApiService.deleteTask(id.toString());
      if (!response.error) {
        setTasks(prev => {
          const updatedTasks = prev.filter(task => task.id !== id);
          // Update cache with error handling
          try {
            CacheService.setAllTasks(updatedTasks); // Update cache with the same data as state
          } catch (cacheError) {
            console.error('Failed to update cache after deleting task:', cacheError);
            // Don't throw the error as it shouldn't affect the main operation
          }
          return updatedTasks;
        });
        setError(null); // Reset error after successful operation
        return true;
      } else {
        setError(response.error.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting task');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    error,
    refreshTasks,
    createTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
  };
};