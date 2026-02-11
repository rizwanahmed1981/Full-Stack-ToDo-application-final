import React from 'react';
import { motion } from 'framer-motion';

// Define card variants
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';

// Card props interface
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  elevated?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Common Card component with animations
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', elevated = false, children, className = '', ...props }, ref) => {
    // Base classes
    const baseClasses = 'rounded-xl border bg-card text-card-foreground shadow';

    // Variant classes
    const variantClasses = {
      default: 'border-border',
      elevated: 'border-0 shadow-lg',
      outlined: 'bg-transparent shadow-sm',
      filled: 'bg-muted/50 border-0',
    };

    // Construct class names
    const cardClasses = `${baseClasses} ${variantClasses[variant]} ${elevated ? 'shadow-lg' : ''} ${className}`;

    return (
      <motion.div
        ref={ref}
        className={cardClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// CardHeader component
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

// CardTitle component
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className = '', ...props }, ref) => (
    <h3
      ref={ref}
      className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

// CardDescription component
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className = '', ...props }, ref) => (
    <p ref={ref} className={`text-sm text-muted-foreground ${className}`} {...props}>
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

// CardContent component
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

// CardFooter component
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`flex items-center p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };