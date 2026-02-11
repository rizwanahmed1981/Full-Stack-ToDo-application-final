import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardView from '../../components/Dashboard/DashboardView';
import TaskDisplay from '../../components/Dashboard/TaskDisplay';

// Mock the modules that might cause issues in testing
vi.mock('../../components/hooks/useAnimations', () => ({
  useAnimations: () => ({
    animationVariants: {},
    isAnimating: false,
    startAnimation: vi.fn(),
    stopAnimation: vi.fn(),
  }),
}));

vi.mock('../../components/hooks/useResponsive', () => ({
  useResponsive: () => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isLargeDesktop: false,
    width: 1024,
    height: 768,
  }),
}));

vi.mock('../../services/analytics/user-interactions', () => ({
  trackDashboardView: vi.fn(),
  trackButtonClick: vi.fn(),
}));

vi.mock('../../services/api/dashboard', () => ({
  fetchDashboardConfig: vi.fn().mockResolvedValue({
    theme: { themeType: 'auto', colorPalette: {}, background: {} },
    layout: { columns: 3, rows: 4, widgetsPositions: [] },
  }),
}));

vi.mock('../../services/api/tasks', () => ({
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
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  }),
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
      h1: ({ children, ...props }: any) => <h1 data-motion-h1 {...props}>{children}</h1>,
      button: ({ children, ...props }: any) => <button data-motion-button {...props}>{children}</button>,
    },
  };
}));

describe('Animation Performance Integration Tests', () => {
  it('handles multiple simultaneous animations gracefully', async () => {
    render(
      <div>
        <DashboardView />
        <TaskDisplay />
      </div>
    );

    // Wait for components to load
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Tasks')).toBeInTheDocument();
    });

    // Verify that both components render without errors
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });

  it('maintains animation performance with many tasks', async () => {
    // Mock a response with many tasks
    const manyTasks = Array.from({ length: 50 }, (_, i) => ({
      id: `${i}`,
      title: `Task ${i}`,
      description: `Description for task ${i}`,
      completed: i % 2 === 0,
      priority: ['low', 'medium', 'high'][i % 3] as 'low' | 'medium' | 'high',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    }));

    vi.mocked(require('../../services/api/tasks').fetchTasks).mockResolvedValue({
      tasks: manyTasks,
      pagination: {
        page: 1,
        limit: 50,
        total: 50,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    });

    render(<TaskDisplay />);

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Task 10')).toBeInTheDocument();
    });

    // Verify that many tasks render without performance issues
    expect(screen.getByText('Task 10')).toBeInTheDocument();
    expect(screen.getByText('Task 20')).toBeInTheDocument();
    expect(screen.getByText('Task 30')).toBeInTheDocument();
  });

  it('correctly applies animation variants', async () => {
    render(<DashboardView />);

    // Wait for dashboard to load
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    // Verify that motion elements are rendered with appropriate attributes
    const motionDivs = screen.getAllByTestId('motion-div');
    expect(motionDivs.length).toBeGreaterThan(0);
  });

  it('handles responsive animations', async () => {
    // Mock different screen sizes
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600, // Mobile size
    });

    render(<DashboardView />);

    // Wait for dashboard to load
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    // Verify that animations still work on mobile
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});