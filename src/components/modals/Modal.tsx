import React, { useEffect } from 'react';
import { IconButton } from '../ui/IconButton';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-cinema-black z-50 overflow-y-auto">
      {/* Close Button */}
      <IconButton
        icon="fas fa-times"
        onClick={onClose}
        className="fixed top-6 right-8 z-50 bg-black/50 hover:bg-accent text-white backdrop-blur-md border border-gray-600"
      />

      {/* Content */}
      {children}
    </div>
  );
};
