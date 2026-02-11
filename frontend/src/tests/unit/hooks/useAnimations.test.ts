import { renderHook, act } from '@testing-library/react';
import { useAnimations } from '../hooks/useAnimations';

describe('useAnimations Hook', () => {
  it('should initialize with isAnimating as false', () => {
    const { result } = renderHook(() => useAnimations());
    expect(result.current.isAnimating).toBe(false);
  });

  it('should start animation when startAnimation is called', () => {
    const { result } = renderHook(() => useAnimations());
    
    act(() => {
      result.current.startAnimation({ type: 'fade-in', duration: 300 });
    });
    
    expect(result.current.isAnimating).toBe(true);
  });

  it('should stop animation when stopAnimation is called', () => {
    const { result } = renderHook(() => useAnimations());
    
    // Start an animation
    act(() => {
      result.current.startAnimation({ type: 'fade-in', duration: 300 });
    });
    
    expect(result.current.isAnimating).toBe(true);
    
    // Stop the animation
    act(() => {
      result.current.stopAnimation();
    });
    
    expect(result.current.isAnimating).toBe(false);
  });

  it('should have animation variants available', () => {
    const { result } = renderHook(() => useAnimations());
    
    expect(result.current.animationVariants).toBeDefined();
    expect(result.current.animationVariants.fadeIn).toBeDefined();
    expect(result.current.animationVariants.slideIn).toBeDefined();
    expect(result.current.animationVariants.scaleUp).toBeDefined();
  });

  it('should stop animation after specified duration', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useAnimations());
    
    // Start an animation with a duration
    act(() => {
      result.current.startAnimation({ type: 'fade-in', duration: 500 });
    });
    
    expect(result.current.isAnimating).toBe(true);
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    expect(result.current.isAnimating).toBe(false);
    
    jest.useRealTimers();
  });
});