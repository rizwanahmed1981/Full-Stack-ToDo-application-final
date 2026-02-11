import { renderHook } from '@testing-library/react';
import { useResponsive } from '../hooks/useResponsive';

// Mock window.innerWidth and window.innerHeight
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

describe('useResponsive Hook', () => {
  beforeEach(() => {
    // Reset window dimensions to default
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('should correctly identify desktop breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useResponsive());
    
    expect(result.current.breakpoint).toBe('desktop');
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isLargeDesktop).toBe(false);
  });

  it('should correctly identify mobile breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });

    const { result } = renderHook(() => useResponsive());
    
    expect(result.current.breakpoint).toBe('mobile');
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isLargeDesktop).toBe(false);
  });

  it('should correctly identify tablet breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { result } = renderHook(() => useResponsive());
    
    expect(result.current.breakpoint).toBe('tablet');
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.isLargeDesktop).toBe(false);
  });

  it('should correctly identify large desktop breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    const { result } = renderHook(() => useResponsive());
    
    expect(result.current.breakpoint).toBe('largeDesktop');
    expect(result.current.isLargeDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });

  it('should return correct dimensions', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { result } = renderHook(() => useResponsive());
    
    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
  });
});