import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, SearchQuery, StatusFilter } from '@/types';

interface SearchBarProps {
  tasks: Task[];
  onSearchResults: (results: Task[]) => void;
  onClear: () => void;
}

export const SearchBar = ({ tasks, onSearchResults, onClear }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Debounced search function
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce delay

    // Cleanup function to clear the timeout
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Memoize the filtered tasks to prevent unnecessary recalculations
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Apply search term
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(term) || 
        (task.description && task.description.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(task => 
        statusFilter === 'active' ? !task.isCompleted : task.isCompleted
      );
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(task => task.priority === priorityFilter);
    }

    // Apply date range filter
    if (startDate) {
      const start = new Date(startDate);
      result = result.filter(task => 
        task.scheduledDate && new Date(task.scheduledDate) >= start
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      result = result.filter(task => 
        task.scheduledDate && new Date(task.scheduledDate) <= end
      );
    }

    return result;
  }, [debouncedSearchTerm, statusFilter, priorityFilter, startDate, endDate, tasks]);

  // Send the filtered results to parent component
  useEffect(() => {
    onSearchResults(filteredTasks);
  }, [filteredTasks, onSearchResults]); // Only re-run when filteredTasks changes

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setStartDate('');
    setEndDate('');
    onClear();
  };

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        {/* Priority filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as any)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        {/* Start date filter */}
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Start date"
        />

        {/* End date filter */}
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="End date"
        />

        {/* Clear filters button */}
        <button
          onClick={handleClearFilters}
          className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
};