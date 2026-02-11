import { useState, useEffect } from 'react';

// Define animation types
export type AnimationType = 'fade-in' | 'slide-in' | 'scale-up' | 'bounce' | 'rotate' | 'pulse' | 'custom';

// Define easing functions
export type EasingFunction = 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'custom';

// Animation configuration interface
export interface AnimationConfig {
  type: AnimationType;
  duration?: number; // in milliseconds
  easing?: EasingFunction;
  delay?: number; // in milliseconds
  repeat?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}

// Hook return type
export interface UseAnimationsReturn {
  isAnimating: boolean;
  startAnimation: (config: AnimationConfig) => void;
  stopAnimation: () => void;
  animationVariants: any; // Framer Motion compatible variants
}

/**
 * Custom hook for managing animations in the dashboard
 */
export const useAnimations = (): UseAnimationsReturn => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [currentAnimation, setCurrentAnimation] = useState<AnimationConfig | null>(null);

  // Framer Motion compatible variants
  const animationVariants = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.3 } },
    },
    slideIn: {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    },
    scaleUp: {
      hidden: { scale: 0.8, opacity: 0 },
      visible: { scale: 1, opacity: 1, transition: { duration: 0.2 } },
    },
    bounce: {
      hidden: { y: 0 },
      visible: { 
        y: [-10, 0, -5, 0],
        transition: { duration: 0.5, times: [0, 0.33, 0.66, 1] }
      },
    },
    rotate: {
      hidden: { rotate: -180 },
      visible: { rotate: 0, transition: { duration: 0.3 } },
    },
    pulse: {
      hidden: { scale: 1 },
      visible: { 
        scale: [1, 1.05, 1],
        transition: { duration: 0.5, repeat: Infinity }
      },
    },
  };

  /**
   * Starts an animation with the provided configuration
   */
  const startAnimation = (config: AnimationConfig) => {
    setIsAnimating(true);
    setCurrentAnimation(config);
    
    // Stop animation after the specified duration plus delay
    if (config.duration) {
      setTimeout(() => {
        setIsAnimating(false);
      }, config.duration + (config.delay || 0));
    }
  };

  /**
   * Stops the current animation
   */
  const stopAnimation = () => {
    setIsAnimating(false);
    setCurrentAnimation(null);
  };

  // Effect to handle animation cleanup
  useEffect(() => {
    if (!isAnimating && currentAnimation) {
      // Perform any cleanup if needed
    }
  }, [isAnimating, currentAnimation]);

  return {
    isAnimating,
    startAnimation,
    stopAnimation,
    animationVariants,
  };
};