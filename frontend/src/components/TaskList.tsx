import { useState } from 'react';
import { TaskItem } from '@/components/TaskItem';
import { TaskForm } from '@/components/TaskForm';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types';

export const TaskList = () => {
  const { tasks, loading, error, createTask, updateTask, toggleTaskCompletion, deleteTask } = useTasks();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  if (loading) {
    return <div className="text-center py-10">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return true; // 'all' filter
  });

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted'>) => {
    await createTask(taskData);
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    await updateTask(id, updates);
  };

  const handleToggleComplete = async (id: string) => {
    await toggleTaskCompletion(id);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <TaskForm onCreateTask={handleCreateTask} />
      </div>

      <div className="mb-6 flex space-x-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            filter === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('all')}
        >
          All Tasks ({tasks.length})
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            filter === 'active' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('active')}
        >
          Active ({tasks.filter(t => !t.isCompleted).length})
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            filter === 'completed' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('completed')}
        >
          Completed ({tasks.filter(t => t.isCompleted).length})
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {filter === 'completed' 
            ? 'No completed tasks yet.' 
            : filter === 'active' 
              ? 'No active tasks. Great job!' 
              : 'No tasks yet. Add one above!'}
        </div>
      ) : (
        <div>
          {filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};