import React from 'react';
import { motion } from 'framer-motion';

// FadeIn props interface
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  triggerOnce?: boolean;
  distance?: string;
}

/**
 * FadeIn animation component
 */
const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.3,
  className = '',
  triggerOnce = true,
  distance = '20px',
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: triggerOnce }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;