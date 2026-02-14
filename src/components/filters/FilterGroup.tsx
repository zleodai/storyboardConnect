import React from 'react';

interface FilterGroupProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({ title, children, className = '' }) => {
  return (
    <div className={className}>
      <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">
        {title}
      </h3>
      {children}
    </div>
  );
};
