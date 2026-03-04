import { useEffect, useState } from 'react';
import { artistService } from '../services/artistService';
import { FilterOption } from '../types/filter.types';
import { ViewMode } from '../types/filter.types';

export const useSchoolCounts = (viewMode: ViewMode | null) => {
  const [schools, setSchools] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!viewMode) {
      setSchools([]);
      setLoading(false);
      return;
    }

    const loadSchools = async () => {
      setLoading(true);
      try {
        const data = await artistService.getSchoolCounts();
        setSchools(data);
      } catch (error) {
        console.error('Failed to load school counts:', error);
        setSchools([]);
      } finally {
        setLoading(false);
      }
    };

    loadSchools();
  }, [viewMode]);

  return { schools, loading };
};
