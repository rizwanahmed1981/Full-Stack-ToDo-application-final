import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardView from '../Dashboard/DashboardView';

// Mock the modules that might cause issues in testing
vi.mock('../hooks/useAnimations', () => ({
  useAnimations: () => ({
    animationVariants: {},
  }),
}));

vi.mock('../hooks/useResponsive', () => ({
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
}));

vi.mock('../../services/api/dashboard', () => ({
  fetchDashboardConfig: vi.fn().mockResolvedValue({
    theme: { themeType: 'auto', colorPalette: {}, background: {} },
    layout: { columns: 3, rows: 4, widgetsPositions: [] },
  }),
}));

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div data-motion-div {...props}>{children}</div>,
      h1: ({ children, ...props }: any) => <h1 data-motion-h1 {...props}>{children}</h1>,
    },
  };
});

describe('DashboardView Component', () => {
  it('renders without crashing', async () => {
    render(<DashboardView />);
    
    // Wait for async operations to complete
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('displays the dashboard title', async () => {
    render(<DashboardView />);
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    render(<DashboardView />);
    
    // Initially, we should see the loading spinner
    expect(screen.getByRole('img', { name: /loading/i })).toBeInTheDocument();
  });

  it('renders animated buttons', async () => {
    render(<DashboardView />);
    
    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });
  });
});