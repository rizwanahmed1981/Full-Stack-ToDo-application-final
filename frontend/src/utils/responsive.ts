// Responsive utility functions for the dashboard

// Breakpoint definitions
export const BREAKPOINTS = {
  xs: 475,      // Extra small screens
  sm: 640,      // Small screens (mobile)
  md: 768,      // Medium screens (tablet)
  lg: 1024,     // Large screens (desktop)
  xl: 1280,     // Extra large screens
  '2xl': 1536,  // 2x extra large screens
};

// Type for breakpoint keys
export type BreakpointKey = keyof typeof BREAKPOINTS;

/**
 * Checks if the current screen size is greater than the specified breakpoint
 * @param breakpoint - The breakpoint to compare against
 * @returns True if the screen is larger than the breakpoint, false otherwise
 */
export const isGreaterThan = (breakpoint: BreakpointKey): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return window.innerWidth > BREAKPOINTS[breakpoint];
};

/**
 * Checks if the current screen size is greater than or equal to the specified breakpoint
 * @param breakpoint - The breakpoint to compare against
 * @returns True if the screen is larger than or equal to the breakpoint, false otherwise
 */
export const isGreaterOrEqual = (breakpoint: BreakpointKey): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return window.innerWidth >= BREAKPOINTS[breakpoint];
};

/**
 * Checks if the current screen size is less than the specified breakpoint
 * @param breakpoint - The breakpoint to compare against
 * @returns True if the screen is smaller than the breakpoint, false otherwise
 */
export const isLessThan = (breakpoint: BreakpointKey): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return window.innerWidth < BREAKPOINTS[breakpoint];
};

/**
 * Checks if the current screen size is less than or equal to the specified breakpoint
 * @param breakpoint - The breakpoint to compare against
 * @returns True if the screen is smaller than or equal to the breakpoint, false otherwise
 */
export const isLessOrEqual = (breakpoint: BreakpointKey): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return window.innerWidth <= BREAKPOINTS[breakpoint];
};

/**
 * Checks if the current screen size is within a specified range
 * @param minBreakpoint - The minimum breakpoint (inclusive)
 * @param maxBreakpoint - The maximum breakpoint (inclusive)
 * @returns True if the screen is within the specified range, false otherwise
 */
export const isInRange = (minBreakpoint: BreakpointKey, maxBreakpoint: BreakpointKey): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const minWidth = BREAKPOINTS[minBreakpoint];
  const maxWidth = BREAKPOINTS[maxBreakpoint];
  
  return window.innerWidth >= minWidth && window.innerWidth <= maxWidth;
};

/**
 * Gets the current breakpoint based on the screen width
 * @returns The current breakpoint key
 */
export const getCurrentBreakpoint = (): BreakpointKey => {
  if (typeof window === 'undefined') {
    return 'md'; // Default to medium
  }
  
  const width = window.innerWidth;
  
  if (width < BREAKPOINTS.sm) return 'xs';
  if (width < BREAKPOINTS.md) return 'sm';
  if (width < BREAKPOINTS.lg) return 'md';
  if (width < BREAKPOINTS.xl) return 'lg';
  if (width < BREAKPOINTS['2xl']) return 'xl';
  
  return '2xl';
};

/**
 * Formats a responsive value based on the current screen size
 * @param value - An object with breakpoint keys and corresponding values
 * @returns The value for the current breakpoint
 */
export const getResponsiveValue = <T>(value: Partial<Record<BreakpointKey, T>>): T | undefined => {
  const currentBreakpoint = getCurrentBreakpoint();
  
  // Find the highest breakpoint that is less than or equal to the current breakpoint
  const breakpoints = Object.keys(BREAKPOINTS) as BreakpointKey[];
  const reversedBreakpoints = [...breakpoints].reverse();
  
  for (const bp of reversedBreakpoints) {
    if (isGreaterOrEqual(bp) && value[bp] !== undefined) {
      return value[bp];
    }
  }
  
  // Return the smallest breakpoint value if none matched
  return value[breakpoints[0]];
};

/**
 * Gets the number of columns for a grid based on the current screen size
 * @param columnConfig - An object specifying the number of columns for each breakpoint
 * @returns The number of columns for the current screen size
 */
export const getGridColumns = (columnConfig: Partial<Record<BreakpointKey, number>> = {}): number => {
  const defaultColumns = {
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
    '2xl': 4,
  };
  
  const mergedConfig = { ...defaultColumns, ...columnConfig };
  return getResponsiveValue(mergedConfig) || 1;
};

/**
 * Determines if the current device is a touch device
 * @returns True if the device supports touch, false otherwise
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Determines if the current device is a mobile device
 * @returns True if the device is mobile, false otherwise
 */
export const isMobileDevice = (): boolean => {
  if (typeof navigator === 'undefined') {
    return false;
  }
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Gets the appropriate image size based on screen density and size
 * @param baseSize - The base image size
 * @returns The appropriate image size considering screen density
 */
export const getOptimizedImageSize = (baseSize: number): number => {
  if (typeof window === 'undefined') {
    return baseSize;
  }
  
  // Consider screen density for high-DPI displays
  const pixelRatio = window.devicePixelRatio || 1;
  return Math.round(baseSize * pixelRatio);
};