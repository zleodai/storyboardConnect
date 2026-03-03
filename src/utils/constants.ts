import { FilterOption } from '../types/filter.types';

export const SCHOOLS: FilterOption[] = [
  { label: 'LMU', value: 'LMU' },
  { label: 'CalArts', value: 'CalArts' },
  { label: 'UCLA', value: 'UCLA' },
  { label: 'USC', value: 'USC' },
  { label: 'NYU', value: 'NYU' },
  { label: 'SVA', value: 'SVA' },
  { label: 'RISD', value: 'RISD' },
  { label: 'Others', value: 'Others' },
];

export const BOARD_TYPES: FilterOption[] = [
  { label: 'Action Board', value: 'Action Board' },
  { label: 'Comedy Board', value: 'Comedy Board' },
  { label: 'Cinematic', value: 'Cinematic' },
  { label: 'Horror', value: 'Horror' },
  { label: 'Dialogue Board', value: 'Dialogue Board' },
  { label: 'Character-Driven', value: 'Character-Driven' },
  { label: 'Drama', value: 'Drama' },
  { label: 'Commercial', value: 'Commercial' },
];

export const FORMATS: FilterOption[] = [
  { label: 'MV', value: 'MV' },
  { label: 'Commercial', value: 'Commercial' },
  { label: 'Short Film', value: 'Short Film' },
  { label: 'Feature', value: 'Feature' },
];

export const PRODUCTION_TYPES: FilterOption[] = [
  { label: 'Commercial', value: 'Commercial' },
  { label: 'Student', value: 'Student' },
  { label: 'Indie', value: 'Indie' },
  { label: 'Others', value: 'Others' },
];

export const TIMELINES: FilterOption[] = [
  { label: '1 Month', value: '1 Month' },
  { label: '2 Months', value: '2 Months' },
  { label: '3 Months', value: '3 Months' },
  { label: '2 Weeks', value: '2 Weeks' },
  { label: '3 Weeks', value: '3 Weeks' },
  { label: '6 Weeks', value: '6 Weeks' },
];

export const ARTIST_SORT_OPTIONS: FilterOption[] = [
  { label: 'Date Joined', value: 'date' },
];

export const PROJECT_SORT_OPTIONS: FilterOption[] = [
  { label: 'Date Added', value: 'date' },
  { label: 'Most Viewed', value: 'views' },
];
