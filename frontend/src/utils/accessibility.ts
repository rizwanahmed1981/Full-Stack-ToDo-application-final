import React from 'react';

/**
 * Focus trap utility to keep focus within a specific element
 * @param containerRef - Reference to the container element
 * @param isActive - Whether the focus trap is active
 */
export const useFocusTrap = (containerRef: React.RefObject<HTMLElement>, isActive: boolean) => {
  React.useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus the first element when activated
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, containerRef]);
};

/**
 * Generates a unique ID for accessibility purposes
 * @param prefix - Optional prefix for the ID
 * @returns A unique ID string
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Manages focus when components mount or unmount
 * @param ref - Reference to the element that should receive focus
 * @param shouldFocus - Whether the element should be focused
 */
export const useAutoFocus = (ref: React.RefObject<HTMLElement>, shouldFocus: boolean) => {
  React.useEffect(() => {
    if (shouldFocus && ref.current) {
      ref.current.focus();
    }
  }, [shouldFocus, ref]);
};

/**
 * Announces content to screen readers
 * @param message - The message to announce
 */
export const announceToScreenReader = (message: string) => {
  // Create a temporary element to hold the announcement
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove the element after a delay to ensure it's announced
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Checks if the user has enabled reduced motion preference
 * @returns True if reduced motion is enabled, false otherwise
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Checks if the user has enabled high contrast preference
 * @returns True if high contrast is enabled, false otherwise
 */
export const prefersHighContrast = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Check for high contrast media query (may not be supported in all browsers)
  return window.matchMedia('(prefers-contrast: high)').matches;
};

/**
 * Adds ARIA attributes for loading states
 * @param isLoading - Whether the component is in a loading state
 * @returns ARIA attributes object
 */
export const getAriaAttributes = (isLoading: boolean) => {
  if (isLoading) {
    return {
      'aria-busy': 'true',
      'aria-label': 'Loading...',
    };
  }
  
  return {};
};

/**
 * Creates a visually hidden but accessible element for screen readers
 * @returns CSS styles for visually hidden content
 */
export const visuallyHiddenStyles = {
  position: 'absolute' as const,
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0',
};

/**
 * Handles keyboard navigation for custom components
 * @param onKeyDown - Custom key down handler
 * @returns A keyboard event handler
 */
export const createKeyboardHandler = (
  onKeyDown?: (e: React.KeyboardEvent) => void
) => {
  return (e: React.KeyboardEvent) => {
    // Handle Enter and Space keys for activation
    if ((e.key === 'Enter' || e.key === ' ') && e.currentTarget) {
      e.preventDefault();
      (e.currentTarget as HTMLElement).click();
    }
    
    // Call custom handler if provided
    onKeyDown?.(e);
  };
};

/**
 * Validates if an element meets accessibility contrast requirements
 * @param backgroundColor - Background color in hex format
 * @param textColor - Text color in hex format
 * @returns True if the contrast ratio meets WCAG AA standards
 */
export const hasSufficientContrast = (backgroundColor: string, textColor: string): boolean => {
  // Convert hex colors to RGB
  const bgRgb = hexToRgb(backgroundColor);
  const textRgb = hexToRgb(textColor);
  
  if (!bgRgb || !textRgb) return false;
  
  // Calculate luminance for each color
  const bgLuminance = calculateLuminance(bgRgb);
  const textLuminance = calculateLuminance(textRgb);
  
  // Calculate contrast ratio
  const brightest = Math.max(bgLuminance, textLuminance);
  const darkest = Math.min(bgLuminance, textLuminance);
  const contrastRatio = (brightest + 0.05) / (darkest + 0.05);
  
  // WCAG AA standard requires 4.5:1 for normal text, 3:1 for large text
  return contrastRatio >= 4.5;
};

/**
 * Converts hex color to RGB
 * @param hex - Hex color string
 * @returns RGB object or null if invalid
 */
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Calculates the relative luminance of a color
 * @param rgb - RGB color object
 * @returns Luminance value
 */
const calculateLuminance = (rgb: { r: number; g: number; b: number }): number => {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    const c = val / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Gets the appropriate focus indicator style based on user preferences
 * @returns CSS style object for focus indicators
 */
export const getFocusIndicatorStyle = (): React.CSSProperties => {
  if (prefersHighContrast()) {
    return {
      outline: '2px solid #000',
      outlineOffset: '2px',
    };
  }
  
  return {
    outline: '2px solid #2563eb',
    outlineOffset: '2px',
  };
};