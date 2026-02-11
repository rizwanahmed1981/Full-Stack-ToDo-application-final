import React from 'react';
import { motion } from 'framer-motion';

// Direction types for slide animation
export type SlideDirection = 'left' | 'right' | 'top' | 'bottom';

// SlideIn props interface
interface SlideInProps {
  children: React.ReactNode;
  direction?: SlideDirection;
  delay?: number;
  duration?: number;
  className?: string;
  triggerOnce?: boolean;
  distance?: string;
}

/**
 * SlideIn animation component
 */
const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = 'left',
  delay = 0,
  duration = 0.3,
  className = '',
  triggerOnce = true,
  distance = '20px',
}) => {
  // Map direction to transform values
  const getInitialTransform = () => {
    switch (direction) {
      case 'left':
        return { x: -distance, opacity: 0 };
      case 'right':
        return { x: distance, opacity: 0 };
      case 'top':
        return { y: -distance, opacity: 0 };
      case 'bottom':
        return { y: distance, opacity: 0 };
      default:
        return { x: -distance, opacity: 0 };
    }
  };

  return (
    <motion.div
      className={className}
      initial={getInitialTransform()}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: triggerOnce }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
};

export default SlideIn;