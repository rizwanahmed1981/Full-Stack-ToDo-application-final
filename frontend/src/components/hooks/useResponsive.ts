import { useState, useEffect } from 'react';

// Define breakpoint types
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'largeDesktop';

// Hook return type
export interface UseResponsiveReturn {
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  width: number;
  height: number;
}

// Default breakpoints
const BREAKPOINTS = {
  mobile: 640,      // Max width for mobile
  tablet: 768,      // Max width for tablet
  desktop: 1024,    // Max width for desktop
};

/**
 * Custom hook for responsive design
 */
export const useResponsive = (): UseResponsiveReturn => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  // Update dimensions on resize
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener('resize', handleResize);

      // Clean up event listener
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Determine breakpoint based on width
  const getBreakpoint = (): Breakpoint => {
    if (dimensions.width < BREAKPOINTS.mobile) {
      return 'mobile';
    } else if (dimensions.width < BREAKPOINTS.tablet) {
      return 'tablet';
    } else if (dimensions.width < BREAKPOINTS.desktop) {
      return 'desktop';
    } else {
      return 'largeDesktop';
    }
  };

  const breakpoint = getBreakpoint();

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    isLargeDesktop: breakpoint === 'largeDesktop',
    width: dimensions.width,
    height: dimensions.height,
  };
};