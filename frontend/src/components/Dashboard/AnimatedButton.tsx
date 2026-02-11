import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimations } from '../hooks/useAnimations';
import { trackButtonClick } from '../../services/analytics/user-interactions';

interface AnimatedButtonProps {
  label: string;
  action?: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  animationType?: 'fade-in' | 'slide-in' | 'scale-up' | 'bounce' | 'rotate' | 'pulse';
  // Feature reveal properties
  featureContent?: React.ReactNode;
  revealOnClick?: boolean;
  revealOnHover?: boolean;
  revealDuration?: number;
  closeable?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  label,
  action,
  variant = 'primary',
  icon,
  disabled = false,
  className = '',
  animationType = 'scale-up',
  featureContent,
  revealOnClick = false,
  revealOnHover = false,
  revealDuration = 0.3,
  closeable = true
}) => {
  const { animationVariants } = useAnimations();
  const [isRevealed, setIsRevealed] = useState(false);

  const getVariantClasses = () => {
    switch(variant) {
      case 'primary':
        return 'bg-indigo-600 hover:bg-indigo-700 text-white';
      case 'secondary':
        return 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300';
      case 'tertiary':
        return 'bg-transparent hover:bg-indigo-50 text-indigo-600';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 text-gray-700';
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-indigo-600 hover:bg-indigo-700 text-white';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      trackButtonClick(label.toLowerCase().replace(/\s+/g, '-'), { buttonLabel: label });
      
      if (revealOnClick) {
        setIsRevealed(!isRevealed);
      }
      
      if (action) {
        action();
      }
    }
  };

  const handleClose = () => {
    if (closeable) {
      setIsRevealed(false);
    }
  };

  // Define animation based on type
  const getAnimationProps = () => {
    switch(animationType) {
      case 'fade-in':
        return {
          whileHover: disabled ? {} : { scale: 1.02, transition: { duration: 0.2 } },
          whileTap: disabled ? {} : { scale: 0.98 },
        };
      case 'slide-in':
        return {
          whileHover: disabled ? {} : { x: 5, transition: { duration: 0.2 } },
          whileTap: disabled ? {} : { x: -2 },
        };
      case 'scale-up':
        return {
          whileHover: disabled ? {} : { scale: 1.03, transition: { duration: 0.2 } },
          whileTap: disabled ? {} : { scale: 0.98 },
        };
      case 'bounce':
        return {
          whileHover: disabled ? {} : { 
            y: [-2, 2, -2, 0],
            transition: { duration: 0.5, times: [0, 0.33, 0.66, 1] }
          },
          whileTap: disabled ? {} : { scale: 0.98 },
        };
      case 'rotate':
        return {
          whileHover: disabled ? {} : { rotate: 5, transition: { duration: 0.3 } },
          whileTap: disabled ? {} : { rotate: -5, scale: 0.98 },
        };
      case 'pulse':
        return {
          animate: {
            scale: [1, 1.02, 1],
            transition: { 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }
          },
          whileTap: disabled ? {} : { scale: 0.98 },
        };
      default:
        return {
          whileHover: disabled ? {} : { scale: 1.03, transition: { duration: 0.2 } },
          whileTap: disabled ? {} : { scale: 0.98 },
        };
    }
  };

  const animationProps = getAnimationProps();

  return (
    <div className="relative inline-block">
      <motion.button
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${getVariantClasses()} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${className}`}
        onClick={handleClick}
        onMouseEnter={() => revealOnHover && !disabled && setIsRevealed(true)}
        onMouseLeave={() => revealOnHover && !disabled && setIsRevealed(false)}
        disabled={disabled}
        aria-label={label}
        {...animationProps}
      >
        {icon && <span>{icon}</span>}
        <span>{label}</span>
      </motion.button>

      <AnimatePresence>
        {isRevealed && featureContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: revealDuration }}
            className="absolute left-0 mt-2 z-10 w-64 bg-white rounded-lg shadow-xl p-4 border border-gray-200"
          >
            {featureContent}
            {closeable && (
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedButton;