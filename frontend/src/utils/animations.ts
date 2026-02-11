// Animation utility functions for the dashboard

/**
 * Calculates the animation delay based on the element's position in a sequence
 * @param index - The position of the element in the sequence
 * @param baseDelay - The base delay value
 * @param stagger - The stagger amount between elements
 * @returns The calculated delay in milliseconds
 */
export const calculateAnimationDelay = (index: number, baseDelay: number = 0, stagger: number = 50): number => {
  return baseDelay + (index * stagger);
};

/**
 * Generates a random animation duration within a range
 * @param min - Minimum duration in milliseconds
 * @param max - Maximum duration in milliseconds
 * @returns A random duration within the specified range
 */
export const randomDuration = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Creates a bounce animation effect
 * @param amplitude - The bounce amplitude
 * @param frequency - The bounce frequency
 * @returns An animation configuration object
 */
export const createBounceEffect = (amplitude: number = 10, frequency: number = 1) => {
  return {
    y: [0, -amplitude, 0],
    transition: {
      duration: 1 / frequency,
      times: [0, 0.5, 1],
    },
  };
};

/**
 * Creates a pulse animation effect
 * @param minScale - Minimum scale value
 * @param maxScale - Maximum scale value
 * @param duration - Duration of the animation
 * @returns An animation configuration object
 */
export const createPulseEffect = (minScale: number = 1, maxScale: number = 1.05, duration: number = 1) => {
  return {
    scale: [minScale, maxScale, minScale],
    transition: {
      duration,
      repeat: Infinity,
      ease: "easeInOut"
    },
  };
};

/**
 * Creates a shake animation effect
 * @param intensity - The shake intensity
 * @param duration - Duration of the animation
 * @returns An animation configuration object
 */
export const createShakeEffect = (intensity: number = 5, duration: number = 0.5) => {
  return {
    x: [0, -intensity, intensity, -intensity, intensity, 0],
    transition: {
      duration,
      times: [0, 0.1, 0.3, 0.5, 0.7, 1],
    },
  };
};

/**
 * Creates a fade in animation effect
 * @param duration - Duration of the animation
 * @returns An animation configuration object
 */
export const createFadeInEffect = (duration: number = 0.3) => {
  return {
    opacity: [0, 1],
    transition: {
      duration,
      ease: "easeOut"
    },
  };
};

/**
 * Creates a slide in animation effect
 * @param direction - Direction of the slide ('left', 'right', 'top', 'bottom')
 * @param distance - Distance to slide in pixels
 * @param duration - Duration of the animation
 * @returns An animation configuration object
 */
export const createSlideInEffect = (
  direction: 'left' | 'right' | 'top' | 'bottom',
  distance: number = 20,
  duration: number = 0.3
) => {
  const position = {
    x: 0,
    y: 0,
  };

  switch (direction) {
    case 'left':
      position.x = -distance;
      break;
    case 'right':
      position.x = distance;
      break;
    case 'top':
      position.y = -distance;
      break;
    case 'bottom':
      position.y = distance;
      break;
  }

  return {
    x: [position.x, 0],
    y: [position.y, 0],
    opacity: [0, 1],
    transition: {
      duration,
      ease: "easeOut"
    },
  };
};

/**
 * Checks if the user prefers reduced motion
 * @returns True if reduced motion is preferred, false otherwise
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Gets the appropriate animation duration based on user preferences
 * @param normalDuration - Normal animation duration
 * @param reducedMotionDuration - Duration when reduced motion is preferred
 * @returns The appropriate animation duration
 */
export const getAnimationDuration = (
  normalDuration: number,
  reducedMotionDuration: number = 0.01
): number => {
  return prefersReducedMotion() ? reducedMotionDuration : normalDuration;
};

/**
 * Creates an animation configuration that respects user preferences for reduced motion
 * @param normalConfig - Animation configuration for normal motion
 * @param reducedMotionConfig - Animation configuration for reduced motion
 * @returns The appropriate animation configuration
 */
export const createMotionAwareAnimation = (
  normalConfig: any,
  reducedMotionConfig: any = { duration: 0.01 }
): any => {
  return prefersReducedMotion() ? reducedMotionConfig : normalConfig;
};