'use client';

import { useState, useEffect } from 'react';
import { apiClient, Task } from '@/lib/api';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks. Please check if the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new task
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const newTask = await apiClient.createTask(newTaskTitle);
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
      setError(null);
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task. Please check if the backend is running.');
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (id: number) => {
    try {
      const updatedTask = await apiClient.toggleTaskCompletion(id);
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, is_completed: updatedTask.is_completed } : task
      ));
      setError(null);
    } catch (err) {
      console.error('Error toggling task:', err);
      setError('Failed to update task. Please check if the backend is running.');
    }
  };

  // Delete a task
  const deleteTask = async (id: number) => {
    try {
      await apiClient.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please check if the backend is running.');
    }
  };

  // Delete all completed tasks
  const deleteAllCompleted = async () => {
    try {
      const completedTasks = tasks.filter(task => task.is_completed);
      for (const task of completedTasks) {
        await apiClient.deleteTask(task.id);
      }
      setTasks(tasks.filter(task => !task.is_completed));
      setError(null);
    } catch (err) {
      console.error('Error deleting completed tasks:', err);
      setError('Failed to delete completed tasks.');
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.is_completed;
    if (filter === 'completed') return task.is_completed;
    return true;
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading tasks...</h2>
          <p className="text-gray-500 mt-2">Connecting to the backend server</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Todo App</h1>
              <p className="text-gray-600">Manage your tasks efficiently</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={deleteAllCompleted}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Delete Completed
              </button>
            </div>
          </div>

          <form onSubmit={addTask} className="mb-8">
            <div className="flex gap-3">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
              >
                Add Task
              </button>
            </div>
          </form>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">Connection Error</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-yellow-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active ({tasks.filter(t => !t.is_completed).length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed ({tasks.filter(t => t.is_completed).length})
            </button>
          </div>

          {/* Tasks list */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
                <p className="text-gray-500">
                  {filter === 'completed'
                    ? "You haven't completed any tasks yet."
                    : "Add your first task to get started!"}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-5 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md ${
                    task.is_completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={task.is_completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className="mt-1 h-5 w-5 text-blue-500 rounded focus:ring-blue-400 border-gray-300"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`${task.is_completed ? 'line-through text-gray-500' : 'text-gray-800 font-medium'}`}>
                          {task.title}
                        </span>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-red-500 hover:text-red-700 transition-colors ml-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-3">
                        Created: {new Date(task.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stats footer */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              {tasks.length} total tasks • {tasks.filter(t => !t.is_completed).length} active • {tasks.filter(t => t.is_completed).length} completed
            </div>
            <div className="text-sm text-gray-500">
              Powered by Next.js & FastAPI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}