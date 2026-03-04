import { useEffect, useState } from 'react';
import { projectService } from '../services/projectService';
import { FilterOption } from '../types/filter.types';

type ProjectFilterCounts = {
  schools: FilterOption[];
  formats: FilterOption[];
  productionTypes: FilterOption[];
  timelines: FilterOption[];
};

const EMPTY_COUNTS: ProjectFilterCounts = {
  schools: [],
  formats: [],
  productionTypes: [],
  timelines: [],
};

export const useProjectFilterCounts = (enabled: boolean) => {
  const [counts, setCounts] = useState<ProjectFilterCounts>(EMPTY_COUNTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setCounts(EMPTY_COUNTS);
      setLoading(false);
      return;
    }

    const loadCounts = async () => {
      setLoading(true);
      try {
        const data = await projectService.getFilterCounts();
        setCounts(data);
      } catch (error) {
        console.error('Failed to load project filter counts:', error);
        setCounts(EMPTY_COUNTS);
      } finally {
        setLoading(false);
      }
    };

    loadCounts();
  }, [enabled]);

  return { ...counts, loading };
};
