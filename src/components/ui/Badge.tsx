import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'gold';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const baseStyles = 'px-2 py-1 text-xs rounded';

  const variantStyles = {
    default: 'bg-gray-800 text-gray-300 border border-gray-700',
    accent: 'bg-accent/10 text-accent border border-accent/20',
    gold: 'bg-accent-gold/10 text-accent-gold border border-accent-gold/20',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
