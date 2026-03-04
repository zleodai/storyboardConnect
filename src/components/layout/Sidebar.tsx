import React from 'react';
import { useApp } from '../../hooks/useApp';
import { useFilters } from '../../hooks/useFilters';
import { useSchoolCounts } from '../../hooks/useSchoolCounts';
import { useArtistSkillCounts } from '../../hooks/useArtistSkillCounts';
import { useProjectFilterCounts } from '../../hooks/useProjectFilterCounts';
import { SearchInput } from '../filters/SearchInput';
import { FilterGroup } from '../filters/FilterGroup';

export const Sidebar: React.FC = () => {
  const { viewMode } = useApp();
  const { filters, updateFilter } = useFilters();
  const { schools, loading: schoolsLoading } = useSchoolCounts(viewMode === 'artist' ? viewMode : null);
  const { skills, loading: skillsLoading } = useArtistSkillCounts(viewMode === 'artist');
  const {
    schools: projectSchools,
    formats,
    productionTypes,
    timelines,
    loading: projectCountsLoading,
  } = useProjectFilterCounts(viewMode === 'project');

  const selectedSchool = filters.selectedSchools[0] ?? '';
  const selectedSkill = filters.selectedSkills[0] ?? '';
  const selectedFormat = filters.selectedFormats[0] ?? '';
  const selectedProductionType = filters.selectedProductionTypes[0] ?? '';
  const selectedTimeline = filters.selectedTimelines[0] ?? '';

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
              <select
                value={selectedSchool}
                onChange={(event) =>
                  updateFilter(
                    'selectedSchools',
                    event.target.value ? [event.target.value] : [],
                  )
                }
                className="w-full rounded-xl border border-gray-700 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition focus:border-white"
              >
                <option value="">
                  {schoolsLoading ? 'Loading schools...' : 'All schools'}
                </option>
                {schools.map((school) => (
                  <option key={school.value} value={school.value}>
                    {school.label} ({school.count ?? 0})
                  </option>
                ))}
              </select>
            </FilterGroup>

            {/* Skills Filter */}
            <FilterGroup title="Skills" className="pt-6">
              <select
                value={selectedSkill}
                onChange={(event) =>
                  updateFilter(
                    'selectedSkills',
                    event.target.value ? [event.target.value] : [],
                  )
                }
                className="w-full rounded-xl border border-gray-700 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition focus:border-white"
              >
                <option value="">
                  {skillsLoading ? 'Loading skills...' : 'All skills'}
                </option>
                {skills.map((skill) => (
                  <option key={skill.value} value={skill.value}>
                    {skill.label} ({skill.count ?? 0})
                  </option>
                ))}
              </select>
            </FilterGroup>
          </>
        ) : (
          <>
            {/* School / Origin Filter */}
            <FilterGroup title="School / Origin" className="border-b border-gray-800 pb-6">
              <select
                value={selectedSchool}
                onChange={(event) =>
                  updateFilter(
                    'selectedSchools',
                    event.target.value ? [event.target.value] : [],
                  )
                }
                className="w-full rounded-xl border border-gray-700 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition focus:border-white"
              >
                <option value="">
                  {projectCountsLoading ? 'Loading schools...' : 'All schools'}
                </option>
                {projectSchools.map((school) => (
                  <option key={school.value} value={school.value}>
                    {school.label} ({school.count ?? 0})
                  </option>
                ))}
              </select>
            </FilterGroup>

            {/* Format Filter */}
            <FilterGroup title="Format" className="border-b border-gray-800 pb-6 pt-6">
              <select
                value={selectedFormat}
                onChange={(event) =>
                  updateFilter(
                    'selectedFormats',
                    event.target.value ? [event.target.value] : [],
                  )
                }
                className="w-full rounded-xl border border-gray-700 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition focus:border-white"
              >
                <option value="">
                  {projectCountsLoading ? 'Loading formats...' : 'All formats'}
                </option>
                {formats.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label} ({format.count ?? 0})
                  </option>
                ))}
              </select>
            </FilterGroup>

            {/* Production Type Filter */}
            <FilterGroup title="Production Type" className="border-b border-gray-800 pb-6 pt-6">
              <select
                value={selectedProductionType}
                onChange={(event) =>
                  updateFilter(
                    'selectedProductionTypes',
                    event.target.value ? [event.target.value] : [],
                  )
                }
                className="w-full rounded-xl border border-gray-700 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition focus:border-white"
              >
                <option value="">
                  {projectCountsLoading ? 'Loading production types...' : 'All production types'}
                </option>
                {productionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} ({type.count ?? 0})
                  </option>
                ))}
              </select>
            </FilterGroup>

            {/* Time Window Filter */}
            <FilterGroup title="Time Window" className="pt-6">
              <select
                value={selectedTimeline}
                onChange={(event) =>
                  updateFilter(
                    'selectedTimelines',
                    event.target.value ? [event.target.value] : [],
                  )
                }
                className="w-full rounded-xl border border-gray-700 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition focus:border-white"
              >
                <option value="">
                  {projectCountsLoading ? 'Loading timelines...' : 'All time windows'}
                </option>
                {timelines.map((timeline) => (
                  <option key={timeline.value} value={timeline.value}>
                    {timeline.label} ({timeline.count ?? 0})
                  </option>
                ))}
              </select>
            </FilterGroup>
          </>
        )}
      </div>
    </aside>
  );
};
