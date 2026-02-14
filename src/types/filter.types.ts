export interface FilterState {
  searchQuery: string;
  selectedSchools: string[];
  selectedBoardTypes: string[];
  selectedFormats: string[];
  selectedProductionTypes: string[];
  selectedTimelines: string[];
}

export type ViewMode = 'artist' | 'project';

export type PageType = 'grid' | 'community' | 'news' | 'events';

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}
