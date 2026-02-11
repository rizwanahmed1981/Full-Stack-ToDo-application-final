import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TaskDisplay from '../Dashboard/TaskDisplay';

// Mock the modules that might cause issues in testing
vi.mock('../services/api/tasks', () => ({
  fetchTasks: vi.fn().mockResolvedValue({
    tasks: [
      {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        priority: 'medium',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
      {
        id: '2',
        title: 'Another Task',
        description: 'Another Description',
        completed: true,
        priority: 'high',
        createdAt: '2023-01-02T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
      },
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 2,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  }),
  TaskFilters: {},
  TasksResponse: {},
}));

vi.mock('../services/analytics/user-interactions', () => ({
  trackTaskCreated: vi.fn(),
  trackTaskCompleted: vi.fn(),
  trackTaskDeleted: vi.fn(),
}));

vi.mock('react-intersection-observer', () => ({
  useInView: vi.fn().mockReturnValue({
    ref: vi.fn(),
    inView: true,
  }),
}));

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div data-motion-div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <div data-animate-presence>{children}</div>,
  };
}));

describe('TaskDisplay Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', async () => {
    render(<TaskDisplay />);
    
    // Wait for async operations to complete
    await waitFor(() => {
      expect(screen.getByText('Tasks')).toBeInTheDocument();
    });
  });

  it('displays tasks when loaded', async () => {
    render(<TaskDisplay />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('Another Task')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    render(<TaskDisplay />);
    
    // Initially, we should see the loading spinner
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('allows toggling task completion', async () => {
    render(<TaskDisplay />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
    
    const checkbox = screen.getAllByRole('checkbox')[0];
    expect(checkbox).not.toBeChecked();
    
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('allows deleting tasks', async () => {
    render(<TaskDisplay />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
    
    const deleteButtons = screen.getAllByText('Delete');
    expect(deleteButtons).toHaveLength(2);
    
    fireEvent.click(deleteButtons[0]);
    
    // After deletion, the task should no longer be in the list
    await waitFor(() => {
      expect(screen.queryByText('Test Task')).not.toBeInTheDocument();
    });
  });

  it('applies filters correctly', async () => {
    render(<TaskDisplay />);
    
    await waitFor(() => {
      expect(screen.getByText('All')).toBeInTheDocument();
    });
    
    // Click on the "Pending" filter
    fireEvent.click(screen.getByText('Pending'));
    
    // The filter should be applied (though we're not testing the actual API call in this unit test)
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });
});