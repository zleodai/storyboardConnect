import { FilterOption } from '../types/filter.types';

export const SCHOOLS: FilterOption[] = [
  { label: 'LMU', value: 'LMU' },
  { label: 'Cal Arts', value: 'CalArts' },
  { label: 'UCLA', value: 'UCLA' },
  { label: 'USC', value: 'USC' },
  { label: 'NYU', value: 'NYU' },
  { label: 'Others', value: 'Others' },
];

export const BOARD_TYPES: FilterOption[] = [
  { label: 'Action Boards', value: 'action' },
  { label: 'Comedy Boards', value: 'comedy' },
  { label: 'Cinematic Boards', value: 'cinematic' },
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
  { label: '> 1 Month', value: '>1month' },
  { label: '1 Month', value: '1month' },
  { label: '2-3 Weeks', value: '2-3weeks' },
  { label: '1 Week', value: '1week' },
];
