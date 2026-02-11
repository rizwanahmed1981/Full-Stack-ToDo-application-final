import React from 'react';

interface MenuIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const MenuIcon: React.FC<MenuIconProps> = ({ className = '', size = 'md' }) => {
  // Size mapping
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
};

export default MenuIcon;