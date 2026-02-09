import { useState } from 'react';
import { Task } from '@/types';

interface SearchBarProps {
  tasks: Task[];
  onSearchResults: (results: Task[]) => void;
  onClear: () => void;
}

export const SearchBar = ({ tasks, onSearchResults, onClear }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      onClear();
      return;
    }

    // Try to parse as number to check if it's an ID
    const numericId = parseInt(term, 10);
    const isNumericId = !isNaN(numericId);

    // Filter tasks based on search term
    const results = tasks.filter(task => {
      // Check if it matches the ID
      if (isNumericId && task.id === numericId) {
        return true;
      }
      
      // Check if it matches title or description (case insensitive)
      return (
        task.title.toLowerCase().includes(term.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(term.toLowerCase()))
      );
    });

    onSearchResults(results);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onClear();
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search tasks by keyword or ID..."
          className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};