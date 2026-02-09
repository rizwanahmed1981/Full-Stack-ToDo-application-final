'use client';

import { useState } from 'react';
import { TaskList } from '@/components/TaskList';
import { CalendarView } from '@/components/CalendarView';
import { SearchBar } from '@/components/SearchBar';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types';

export default function HomePage() {
  const { tasks } = useTasks();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchResults, setSearchResults] = useState<Task[] | null>(null);

  const handleSearchResults = (results: Task[]) => {
    setSearchResults(results);
  };

  const handleClearSearch = () => {
    setSearchResults(null);
  };

  // Use search results if available, otherwise use all tasks
  const displayTasks = searchResults !== null ? searchResults : tasks;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Todo App</h1>

      <div className="max-w-2xl mx-auto mb-6">
        <SearchBar 
          tasks={tasks} 
          onSearchResults={handleSearchResults} 
          onClear={handleClearSearch} 
        />
      </div>

      <div className="mb-6 flex justify-center space-x-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'list'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setViewMode('list')}
        >
          List View
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'calendar'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setViewMode('calendar')}
        >
          Calendar View
        </button>
      </div>

      {viewMode === 'list' ? (
        <TaskList tasks={displayTasks} />
      ) : (
        <CalendarView tasks={displayTasks} />
      )}
    </div>
  );
}