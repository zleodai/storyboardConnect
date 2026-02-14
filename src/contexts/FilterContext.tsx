import React, { createContext, useState, ReactNode } from 'react';
import { FilterState } from '../types/filter.types';

interface FilterContextType {
  filters: FilterState;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  toggleArrayFilter: (key: keyof FilterState, value: string) => void;
  resetFilters: () => void;
}

const initialFilters: FilterState = {
  searchQuery: '',
  selectedSchools: [],
  selectedBoardTypes: [],
  selectedFormats: [],
  selectedProductionTypes: [],
  selectedTimelines: [],
};

export const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const currentArray = prev[key] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];

      return {
        ...prev,
        [key]: newArray,
      };
    });
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        updateFilter,
        toggleArrayFilter,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
