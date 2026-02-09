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
        const newTask = response.data;
        setTasks(prev => [newTask, ...prev]);
        await CacheService.setAllTasks([newTask, ...tasks]);
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

  const updateTask = async (id: string, taskData: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setLoading(true);
      const response = await ApiService.updateTask(id, taskData);
      if (!response.error) {
        const updatedTask = response.data;
        setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
        await CacheService.setAllTasks(tasks.map(task => task.id === id ? updatedTask : task));
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

  const toggleTaskCompletion = async (id: string) => {
    try {
      setLoading(true);
      const response = await ApiService.toggleTaskCompletion(id);
      if (!response.error) {
        const updatedTask = response.data;
        setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
        await CacheService.setAllTasks(tasks.map(task => task.id === id ? updatedTask : task));
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

  const deleteTask = async (id: string) => {
    try {
      setLoading(true);
      const response = await ApiService.deleteTask(id);
      if (!response.error) {
        setTasks(prev => prev.filter(task => task.id !== id));
        await CacheService.setAllTasks(tasks.filter(task => task.id !== id));
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