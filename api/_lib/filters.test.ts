import { describe, expect, it } from 'vitest';
import { parseArtistFilter, parseProjectFilter } from './filters.js';

describe('filters', () => {
  it('parses repeated and comma-separated artist params', () => {
    const params = new URLSearchParams(
      'searchQuery=test&selectedSchools=LMU,USC&selectedBoardTypes=Action%20Board&selectedBoardTypes=Cinematic',
    );
    const filter = parseArtistFilter(params);

    expect(filter.searchQuery).toBe('test');
    expect(filter.selectedSchools).toEqual(['LMU', 'USC']);
    expect(filter.selectedBoardTypes).toEqual(['Action Board', 'Cinematic']);
    expect(filter.sortBy).toBe('date');
  });

  it('defaults invalid project sort values to date', () => {
    const params = new URLSearchParams(
      'sortBy=invalid&selectedFormats=MV&selectedTimelines=1%20Month,2%20Weeks',
    );
    const filter = parseProjectFilter(params);

    expect(filter.sortBy).toBe('date');
    expect(filter.selectedFormats).toEqual(['MV']);
    expect(filter.selectedTimelines).toEqual(['1 Month', '2 Weeks']);
  });
});
