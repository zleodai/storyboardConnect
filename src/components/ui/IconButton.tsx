import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string; // Font Awesome icon class
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon, className = '', ...props }) => {
  return (
    <button
      className={`w-10 h-10 rounded-full flex items-center justify-center transition ${className}`}
      {...props}
    >
      <i className={icon}></i>
    </button>
  );
};
