import React, { createContext, useState, ReactNode } from 'react';
import { ViewMode, PageType } from '../types/filter.types';

interface AppContextType {
  viewMode: ViewMode;
  currentPage: PageType;
  hasEnteredSite: boolean;
  setViewMode: (mode: ViewMode) => void;
  setCurrentPage: (page: PageType) => void;
  enterSite: (userType: 'artist' | 'filmmaker') => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('artist');
  const [currentPage, setCurrentPage] = useState<PageType>('grid');
  const [hasEnteredSite, setHasEnteredSite] = useState(false);

  const enterSite = (userType: 'artist' | 'filmmaker') => {
    setHasEnteredSite(true);
    // Filmmaker looks for artists, Artist looks for projects
    setViewMode(userType === 'filmmaker' ? 'artist' : 'project');
    setCurrentPage('grid');
  };

  return (
    <AppContext.Provider
      value={{
        viewMode,
        currentPage,
        hasEnteredSite,
        setViewMode,
        setCurrentPage,
        enterSite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
