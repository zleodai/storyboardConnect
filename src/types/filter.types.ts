export type SortBy = 'date' | 'views';

export interface FilterState {
  searchQuery: string;
  selectedSchools: string[];
  selectedBoardTypes: string[];
  selectedFormats: string[];
  selectedProductionTypes: string[];
  selectedTimelines: string[];
  sortBy: SortBy;
}

export type ViewMode = 'artist' | 'project';

export type PageType = 'grid' | 'community' | 'news' | 'events' | 'profile';

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}
