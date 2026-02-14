import React from 'react';
import { useApp } from '../../hooks/useApp';
import { useFilters } from '../../hooks/useFilters';
import { SearchInput } from '../filters/SearchInput';
import { FilterGroup } from '../filters/FilterGroup';
import { FilterCheckbox } from '../filters/FilterCheckbox';
import { SCHOOLS, BOARD_TYPES, FORMATS, PRODUCTION_TYPES, TIMELINES } from '../../utils/constants';

export const Sidebar: React.FC = () => {
  const { viewMode } = useApp();
  const { filters, updateFilter, toggleArrayFilter } = useFilters();

  return (
    <aside className="w-72 bg-cinema-black border-r border-gray-800 flex flex-col p-6 overflow-y-auto shrink-0 transition-all duration-300">
      {/* Title */}
      <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <i className="fas fa-sliders-h text-accent"></i> Filters
      </h2>

      {/* Search */}
      <div className="mb-6">
        <SearchInput
          value={filters.searchQuery}
          onChange={(value) => updateFilter('searchQuery', value)}
          placeholder="Search..."
        />
      </div>

      {/* Filter Groups */}
      <div className="space-y-8 pb-10">
        {viewMode === 'artist' ? (
          <>
            {/* School Filter */}
            <FilterGroup title="School" className="border-b border-gray-800 pb-6">
              {SCHOOLS.map((school) => (
                <FilterCheckbox
                  key={school.value}
                  label={school.label}
                  checked={filters.selectedSchools.includes(school.value)}
                  onChange={() => toggleArrayFilter('selectedSchools', school.value)}
                />
              ))}
            </FilterGroup>

            {/* Board Type Filter */}
            <FilterGroup title="Board Type" className="pt-6">
              {BOARD_TYPES.map((type) => (
                <FilterCheckbox
                  key={type.value}
                  label={type.label}
                  checked={filters.selectedBoardTypes.includes(type.value)}
                  onChange={() => toggleArrayFilter('selectedBoardTypes', type.value)}
                />
              ))}
            </FilterGroup>
          </>
        ) : (
          <>
            {/* School / Origin Filter */}
            <FilterGroup title="School / Origin" className="border-b border-gray-800 pb-6">
              {SCHOOLS.map((school) => (
                <FilterCheckbox
                  key={school.value}
                  label={school.label}
                  checked={filters.selectedSchools.includes(school.value)}
                  onChange={() => toggleArrayFilter('selectedSchools', school.value)}
                />
              ))}
            </FilterGroup>

            {/* Format Filter */}
            <FilterGroup title="Format" className="border-b border-gray-800 pb-6 pt-6">
              {FORMATS.map((format) => (
                <FilterCheckbox
                  key={format.value}
                  label={format.label}
                  checked={filters.selectedFormats.includes(format.value)}
                  onChange={() => toggleArrayFilter('selectedFormats', format.value)}
                />
              ))}
            </FilterGroup>

            {/* Production Type Filter */}
            <FilterGroup title="Production Type" className="border-b border-gray-800 pb-6 pt-6">
              {PRODUCTION_TYPES.map((type) => (
                <FilterCheckbox
                  key={type.value}
                  label={type.label}
                  checked={filters.selectedProductionTypes.includes(type.value)}
                  onChange={() => toggleArrayFilter('selectedProductionTypes', type.value)}
                />
              ))}
            </FilterGroup>

            {/* Time Window Filter */}
            <FilterGroup title="Time Window" className="pt-6">
              {TIMELINES.map((timeline) => (
                <FilterCheckbox
                  key={timeline.value}
                  label={timeline.label}
                  checked={filters.selectedTimelines.includes(timeline.value)}
                  onChange={() => toggleArrayFilter('selectedTimelines', timeline.value)}
                />
              ))}
            </FilterGroup>
          </>
        )}
      </div>
    </aside>
  );
};
