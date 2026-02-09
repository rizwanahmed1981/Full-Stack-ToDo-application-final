import { useState, useMemo } from 'react';
import { Task } from '@/types';
import { TaskItem } from '@/components/TaskItem';
import { useTasks } from '@/hooks/useTasks';

interface CalendarViewProps {
  tasks: Task[];
}

// Helper functions to replace date-fns
const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

const subMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() - months);
  return result;
};

const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const startOfWeek = (date: Date): Date => {
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.getFullYear(), date.getMonth(), diff);
};

const endOfWeek = (date: Date): Date => {
  const start = startOfWeek(date);
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const isSameMonth = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const formatDate = (date: Date, format: string): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const monthName = date.toLocaleDateString('en-US', { month: 'long' });
  const fullMonthName = date.toLocaleDateString('en-US', { month: 'short' });
  
  if (format === 'yyyy-MM-dd') {
    return `${year}-${month}-${day}`;
  } else if (format === 'MMMM yyyy') {
    return `${monthName} ${year}`;
  } else if (format === 'd') {
    return String(date.getDate());
  } else if (format === 'EEE') {
    return dayName;
  } else if (format === 'EEEE, MMMM d, yyyy') {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  } else if (format === 'MMM dd') {
    return `${fullMonthName} ${String(date.getDate()).padStart(2, '0')}`;
  } else if (format === 'MMM d') {
    return `${fullMonthName} ${date.getDate()}`;
  } else if (format === 'yyyy MMM dd') {
    return `${year} ${fullMonthName} ${String(date.getDate()).padStart(2, '0')}`;
  }
  
  return date.toString(); // fallback
};

const parseISO = (dateString: string): Date => {
  return new Date(dateString);
};

export const CalendarView = ({ tasks }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('month');

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    
    tasks.forEach(task => {
      if (task.scheduledDate) {
        const dateStr = formatDate(parseISO(task.scheduledDate as unknown as string), 'yyyy-MM-dd');
        if (!grouped[dateStr]) {
          grouped[dateStr] = [];
        }
        grouped[dateStr].push(task);
      }
    });
    
    return grouped;
  }, [tasks]);

  // Get days for the current month view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = [];
  let day = startDate;
  while (day <= endDate) {
    calendarDays.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold">
            {formatDate(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex space-x-2">
            <button 
              onClick={prevMonth}
              className="p-2 rounded hover:bg-gray-100"
            >
              &lt;
            </button>
            <button 
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
            >
              Today
            </button>
            <button 
              onClick={nextMonth}
              className="p-2 rounded hover:bg-gray-100"
            >
              &gt;
            </button>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded text-sm ${
              viewMode === 'day' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setViewMode('day')}
          >
            Day
          </button>
          <button
            className={`px-3 py-1 rounded text-sm ${
              viewMode === 'week' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setViewMode('week')}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 rounded text-sm ${
              viewMode === 'month' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setViewMode('month')}
          >
            Month
          </button>
        </div>
      </div>

      {viewMode === 'month' && (
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium py-2 text-gray-600 text-sm">
              {day}
            </div>
          ))}
          
          {calendarDays.map(day => {
            const dateStr = formatDate(day, 'yyyy-MM-dd');
            const dayTasks = tasksByDate[dateStr] || [];
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <div 
                key={dateStr}
                className={`min-h-24 p-1 border rounded ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
                } ${isSameDay(day, new Date()) ? 'border-blue-500' : 'border-gray-200'}`}
              >
                <div className="text-right text-sm font-medium p-1">
                  {formatDate(day, 'd')}
                </div>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {dayTasks.slice(0, 3).map(task => (
                    <div 
                      key={task.id} 
                      className={`text-xs p-1 rounded truncate ${
                        task.isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500 p-1">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === 'day' && (
        <div>
          <h3 className="text-lg font-medium mb-4">
            {formatDate(currentDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          <div className="space-y-4">
            {tasks
              .filter(task => task.scheduledDate && isSameDay(parseISO(task.scheduledDate as unknown as string), currentDate))
              .map(task => (
                <div key={task.id} className="p-3 border rounded bg-gray-50">
                  <TaskItem 
                    task={task} 
                    onToggleComplete={() => {}} 
                    onUpdate={() => {}} 
                    onDelete={() => {}} 
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {viewMode === 'week' && (
        <div>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {Array.from({ length: 7 }).map((_, i) => {
              const day = addDays(startOfWeek(currentDate), i);
              return (
                <div key={i} className="text-center">
                  <div className="font-medium text-sm">{formatDate(day, 'EEE')}</div>
                  <div className={`text-lg ${
                    isSameDay(day, new Date()) ? 'bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''
                  }`}>
                    {formatDate(day, 'd')}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => {
              const day = addDays(startOfWeek(currentDate), i);
              const dateStr = formatDate(day, 'yyyy-MM-dd');
              const dayTasks = tasksByDate[dateStr] || [];
              
              return (
                <div key={i} className="min-h-40 p-2 border rounded">
                  <div className="text-center font-medium text-sm mb-2">
                    {formatDate(day, 'MMM d')}
                  </div>
                  <div className="space-y-2">
                    {dayTasks.map(task => (
                      <div 
                        key={task.id} 
                        className={`p-2 rounded text-xs ${
                          task.isCompleted ? 'bg-green-100' : 'bg-blue-100'
                        }`}
                      >
                        <div className="font-medium truncate">{task.title}</div>
                        <div className="truncate">{task.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};