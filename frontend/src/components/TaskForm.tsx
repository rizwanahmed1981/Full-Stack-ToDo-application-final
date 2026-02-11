import { useState } from 'react';
import { Task, Priority } from '@/types';
import { ValidationService } from '@/services/validation';
import notificationService from '@/services/notificationService'; // NEW: import notification service

interface TaskFormProps {
  onCreateTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted'>) => void;
}

export const TaskForm = ({ onCreateTask }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>(''); // NEW: due date state
  const [priority, setPriority] = useState<Priority>('medium'); // Default to medium
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the task
    const validation = ValidationService.validateTask({ title, description });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Clear errors
    setErrors({});

    // Validate priority value
    const validPriorities = ['low', 'medium', 'high', 'critical'];
    const selectedPriority = validPriorities.includes(priority) ? priority : 'medium';

    // Create the task
    const taskData = {
      title,
      description: description || null,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      dueDate: dueDate ? new Date(dueDate) : null, // NEW: include due date
      priority: selectedPriority as Priority, // Ensure type safety
    };

    onCreateTask(taskData);

    // NEW: Schedule a notification if due date is set
    if (dueDate) {
      const dueDateTime = new Date(dueDate);
      const now = new Date();
      const timeDiff = dueDateTime.getTime() - now.getTime();
      
      if (timeDiff > 0) {
        // Schedule a notification for 15 minutes before due date (if it's more than 15 mins away)
        const notificationTime = Math.max(timeDiff - 15 * 60 * 1000, 0);
        
        notificationService.scheduleNotification(
          'Task Due Soon',
          `Your task "${title}" is due soon.`,
          notificationTime
        ).then(() => {
          console.log(`Notification scheduled for task: ${title}`);
        }).catch(error => {
          console.error('Error scheduling notification:', error);
        });
      }
    }

    // Reset form
    setTitle('');
    setDescription('');
    setScheduledDate('');
    setDueDate(''); // NEW: reset due date
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              // Clear error when user starts typing
              if (errors.title) {
                setErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.title;
                  return newErrors;
                });
              }
            }}
            className={`w-full p-3 border rounded-lg ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="What needs to be done?"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              // Clear error when user starts typing
              if (errors.description) {
                setErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.description;
                  return newErrors;
                });
              }
            }}
            className={`w-full p-3 border rounded-lg ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Add details..."
            rows={3}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div>
          <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-1">
            Scheduled Date
          </label>
          <input
            type="date"
            id="scheduledDate"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
        >
          Add Task
        </button>
      </div>
    </form>
  );
};