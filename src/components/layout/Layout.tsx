import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showNavbar = false }) => {
  return (
    <div className="h-screen flex flex-col">
      {showNavbar && <Navbar />}
      {children}
    </div>
  );
};
