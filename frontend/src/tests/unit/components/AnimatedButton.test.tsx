import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AnimatedButton from '../Dashboard/AnimatedButton';

// Mock the modules that might cause issues in testing
vi.mock('../hooks/useAnimations', () => ({
  useAnimations: () => ({
    animationVariants: {},
  }),
}));

vi.mock('../../services/analytics/user-interactions', () => ({
  trackButtonClick: vi.fn(),
}));

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      button: ({ children, onClick, ...props }: any) => (
        <button onClick={onClick} data-motion-button {...props}>
          {children}
        </button>
      ),
    },
  };
});

describe('AnimatedButton Component', () => {
  const mockAction = vi.fn();

  beforeEach(() => {
    mockAction.mockClear();
    vi.clearAllMocks();
  });

  it('renders with the correct label', () => {
    render(<AnimatedButton label="Test Button" action={mockAction} />);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('calls the action function when clicked', () => {
    render(<AnimatedButton label="Test Button" action={mockAction} />);
    fireEvent.click(screen.getByText('Test Button'));
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('does not call the action function when disabled', () => {
    render(<AnimatedButton label="Test Button" action={mockAction} disabled={true} />);
    fireEvent.click(screen.getByText('Test Button'));
    expect(mockAction).toHaveBeenCalledTimes(0);
  });

  it('applies the correct variant classes', () => {
    const { rerender } = render(<AnimatedButton label="Test Button" action={mockAction} variant="primary" />);
    expect(screen.getByRole('button')).toHaveClass('bg-indigo-600');

    rerender(<AnimatedButton label="Test Button" action={mockAction} variant="secondary" />);
    expect(screen.getByRole('button')).toHaveClass('bg-white');
  });

  it('tracks button clicks', () => {
    const { trackButtonClick } = require('../../services/analytics/user-interactions');
    render(<AnimatedButton label="Test Button" action={mockAction} />);
    fireEvent.click(screen.getByText('Test Button'));
    expect(trackButtonClick).toHaveBeenCalledWith('test-button', { buttonLabel: 'Test Button' });
  });

  it('renders with an icon when provided', () => {
    const icon = <span data-testid="test-icon">Icon</span>;
    render(<AnimatedButton label="Test Button" action={mockAction} icon={icon} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });
});