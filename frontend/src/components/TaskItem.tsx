import { useState } from 'react';
import { Task, Priority } from '@/types';
import { formatDate } from '@/utils/dateUtils';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<Task>) => void;
  onDelete: (id: number) => void;
}

export const TaskItem = ({ task, onToggleComplete, onUpdate, onDelete }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(task.title);
  const [tempDescription, setTempDescription] = useState(task.description || '');

  const [tempScheduledDate, setTempScheduledDate] = useState<string>(
    task.scheduledDate ? new Date(task.scheduledDate).toISOString().split('T')[0] : ''
  );
  const [tempPriority, setTempPriority] = useState<Priority>(task.priority);

  const handleSaveEdit = () => {
    onUpdate(task.id, { 
      title: tempTitle, 
      description: tempDescription,
      scheduledDate: tempScheduledDate ? new Date(tempScheduledDate) : null,
      priority: tempPriority
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setTempTitle(task.title);
    setTempDescription(task.description || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div 
      className={`p-4 rounded-lg border mb-3 transition-all duration-200 ${
        task.isCompleted 
          ? 'bg-green-50 border-green-200 line-through text-gray-500' 
          : 'bg-white border-gray-200 hover:shadow-sm'
      }`}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-start">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => onToggleComplete(task.id)}
          className="mr-3 mt-1"
        />
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                autoFocus
              />
              <textarea
                value={tempDescription}
                onChange={(e) => setTempDescription(e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  value={tempScheduledDate}
                  onChange={(e) => setTempScheduledDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={tempPriority}
                  onChange={(e) => setTempPriority(e.target.value as Priority)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className={`font-medium ${task.isCompleted ? 'line-through' : ''}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`mt-1 text-gray-600 ${task.isCompleted ? 'line-through' : ''}`}>
                  {task.description}
                </p>
              )}
              <div className="flex justify-between items-center mt-2">
                {task.scheduledDate && (
                  <p className="text-sm text-gray-500">
                    Scheduled: {formatDate(new Date(task.scheduledDate))}
                  </p>
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.priority === 'low' ? 'bg-green-100 text-green-800' :
                  task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                  task.priority === 'high' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800' // critical
                }`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Created: {formatDate(new Date(task.createdAt))}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2 ml-4">
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-blue-700"
              aria-label="Edit task"
            >
              Edit
            </button>
          )}
          <button 
            onClick={() => onDelete(task.id)}
            className="text-red-500 hover:text-red-700"
            aria-label="Delete task"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};