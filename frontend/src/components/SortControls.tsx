import { useState } from 'react';
import { SortCriteria, SortField, SortDirection } from '@/types';

interface SortControlsProps {
  onSortChange: (criteria: SortCriteria) => void;
}

export const SortControls = ({ onSortChange }: SortControlsProps) => {
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [direction, setDirection] = useState<SortDirection>('asc');

  const handleSortByChange = (field: SortField) => {
    setSortBy(field);
    onSortChange({ sortBy: field, direction });
  };

  const handleDirectionChange = (dir: SortDirection) => {
    setDirection(dir);
    onSortChange({ sortBy, direction: dir });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => handleSortByChange(e.target.value as SortField)}
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="createdAt">Date Created</option>
          <option value="scheduledDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700">Direction:</label>
        <div className="flex space-x-1">
          <button
            className={`px-3 py-2 rounded-md ${
              direction === 'asc'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handleDirectionChange('asc')}
          >
            Asc
          </button>
          <button
            className={`px-3 py-2 rounded-md ${
              direction === 'desc'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handleDirectionChange('desc')}
          >
            Desc
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Sorted by: <span className="font-medium">{sortBy.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</span> (
        {direction === 'asc' ? 'A-Z, Oldest First' : 'Z-A, Newest First'})
      </div>
    </div>
  );
};