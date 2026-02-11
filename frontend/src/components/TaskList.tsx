import { useState } from 'react';
import { TaskItem } from '@/components/TaskItem';
import { TaskForm } from '@/components/TaskForm';
import { SearchBar } from '@/components/SearchBar';
import { SortControls } from '@/components/SortControls';
import { useTasks } from '@/hooks/useTasks';
import { Task, SortCriteria } from '@/types';

interface TaskListProps {}

export const TaskList = ({}: TaskListProps = {}) => {
  const { tasks, loading, error, createTask, updateTask, toggleTaskCompletion, deleteTask, searchTasks, refreshTasksWithSorting } = useTasks();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [searchResults, setSearchResults] = useState<Task[] | null>(null);
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>({ sortBy: 'createdAt', direction: 'desc' });

  if (loading) {
    return <div className="text-center py-10">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  // Handle search results from SearchBar
  const handleSearchResults = (results: Task[]) => {
    setSearchResults(prev => {
      // Only update if the results are different to prevent infinite loops
      if (JSON.stringify(prev) === JSON.stringify(results)) {
        return prev;
      }
      return results;
    });
  };

  const handleClearSearch = () => {
    setSearchResults(null);
  };

  // Handle sort changes
  const handleSortChange = (criteria: SortCriteria) => {
    setSortCriteria(criteria);
    // Call the API to get sorted tasks
    refreshTasksWithSorting({
      sortBy: criteria.sortBy,
      sortDirection: criteria.direction
    });
  };

  // Use search results if available, otherwise use all tasks
  const displayTasks = searchResults !== null ? searchResults : tasks;

  // Filter tasks based on selected filters (only if not using search results)
  const filteredTasks = searchResults === null ? displayTasks.filter(task => {
    // Apply status filter
    if (filter === 'active') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;

    // Apply priority filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

    return true; // 'all' filter
  }) : displayTasks;

  // Sort tasks based on selected sort criteria
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let result = 0;

    switch (sortCriteria.sortBy) {
      case 'title':
        result = a.title.localeCompare(b.title);
        break;
      case 'scheduledDate':
        if (!a.scheduledDate && !b.scheduledDate) result = 0;
        else if (!a.scheduledDate) result = 1; // No date goes last
        else if (!b.scheduledDate) result = -1; // No date goes last
        else result = new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
        break;
      case 'priority':
        const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
        result = priorityOrder[b.priority] - priorityOrder[a.priority];
        break;
      case 'createdAt':
      default:
        result = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }

    // Reverse the result if descending order is selected
    return sortCriteria.direction === 'asc' ? result : -result;
  });

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted'>) => {
    await createTask(taskData);
  };

  const handleUpdateTask = async (id: number, updates: Partial<Task>) => {
    await updateTask(id, updates);
  };

  const handleToggleComplete = async (id: number) => {
    await toggleTaskCompletion(id);
  };

  const handleDeleteTask = async (id: number) => {
    await deleteTask(id);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <TaskForm onCreateTask={handleCreateTask} />
      </div>

      <div className="mb-6">
        <SearchBar
          tasks={tasks}
          onSearchResults={handleSearchResults}
          onClear={handleClearSearch}
        />
      </div>

      <div className="mb-6">
        <SortControls onSortChange={handleSortChange} />
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        {/* Status Filters - only show if not using search results */}
        {searchResults === null && (
          <div className="flex space-x-2">
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
        )}

        {/* Priority Filter - only show if not using search results */}
        {searchResults === null && (
          <div className="flex space-x-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="critical">Critical Priority</option>
            </select>
          </div>
        )}
      </div>

      {sortedTasks.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {searchResults !== null && searchResults.length === 0
            ? 'No tasks match your search criteria.'
            : filter === 'completed'
              ? 'No completed tasks yet.'
              : filter === 'active'
                ? 'No active tasks. Great job!'
                : 'No tasks yet. Add one above!'}
        </div>
      ) : (
        <div>
          {sortedTasks.map(task => (
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