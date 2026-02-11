import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fetchTasks, TaskFilters, TasksResponse } from '../../services/api/tasks';
import { trackTaskCreated, trackTaskCompleted, trackTaskDeleted } from '../../services/analytics/user-interactions';
import { FadeIn } from '../ui/animations/FadeIn';
import { SlideIn } from '../ui/animations/SlideIn';
import { Card, CardContent } from '../common/Card';
import Button from '../common/Button';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface TaskDisplayProps {
  className?: string;
  initialPageSize?: number;
  infiniteScrollEnabled?: boolean;
}

const TaskDisplay: React.FC<TaskDisplayProps> = ({ 
  className = '', 
  initialPageSize = 10,
  infiniteScrollEnabled = true 
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [error, setError] = useState<string | null>(null);
  const { ref, inView } = useInView();
  const [filters, setFilters] = useState<TaskFilters>({});
  
  const loadTasks = useCallback(async (reset: boolean = false) => {
    if (loading && !reset) return;

    setLoading(true);
    setError(null);

    try {
      const params: TaskFilters = {
        ...filters,
        page: reset ? 1 : page,
        limit: pageSize,
      };

      const response: TasksResponse = await fetchTasks(params);
      
      if (reset) {
        setTasks(response.tasks);
        setPage(1);
      } else {
        setTasks(prev => [...prev, ...response.tasks]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(response.pagination.hasNext);
    } catch (err) {
      setError('Failed to load tasks. Please try again later.');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters, loading]);

  useEffect(() => {
    loadTasks(true); // Load first page on mount
  }, []);

  useEffect(() => {
    if (inView && hasMore && infiniteScrollEnabled) {
      loadTasks();
    }
  }, [inView, hasMore, infiniteScrollEnabled, loadTasks]);

  const handleFilterChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
    loadTasks(true); // Reset and reload with new filters
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadTasks();
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Tasks</h2>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={filters.status === undefined ? 'primary' : 'secondary'} 
              size="sm"
              onClick={() => handleFilterChange({...filters, status: undefined})}
            >
              All
            </Button>
            <Button 
              variant={filters.status === 'pending' ? 'primary' : 'secondary'} 
              size="sm"
              onClick={() => handleFilterChange({...filters, status: 'pending'})}
            >
              Pending
            </Button>
            <Button 
              variant={filters.status === 'in-progress' ? 'primary' : 'secondary'} 
              size="sm"
              onClick={() => handleFilterChange({...filters, status: 'in-progress'})}
            >
              In Progress
            </Button>
            <Button 
              variant={filters.status === 'completed' ? 'primary' : 'secondary'} 
              size="sm"
              onClick={() => handleFilterChange({...filters, status: 'completed'})}
            >
              Completed
            </Button>
          </div>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          <AnimatePresence>
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {
                        // Toggle task completion
                        setTasks(prev => 
                          prev.map(t => 
                            t.id === task.id ? { ...t, completed: !t.completed } : t
                          )
                        );
                        
                        if (task.completed) {
                          trackTaskCompleted(task.id);
                        }
                      }}
                      className="mt-1 h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <div>
                      <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      <div className="mt-2 flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      // Delete task
                      setTasks(prev => prev.filter(t => t.id !== task.id));
                      trackTaskDeleted(task.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {!hasMore && tasks.length > 0 && (
            <div className="text-center py-4 text-gray-500">
              You've reached the end
            </div>
          )}

          {!loading && !hasMore && tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No tasks found. Create your first task to get started!
            </div>
          )}

          {error && (
            <div className="text-center py-4 text-red-500">
              {error}
            </div>
          )}

          {!infiniteScrollEnabled && hasMore && (
            <div className="text-center py-4">
              <Button onClick={handleLoadMore} disabled={loading}>
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}

          <div ref={ref} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskDisplay;