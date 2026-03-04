import { useEffect, useState } from 'react';
import { artistService } from '../services/artistService';
import { FilterOption } from '../types/filter.types';

export const useSchoolCounts = (enabled: boolean) => {
  const [schools, setSchools] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) {
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
  }, [enabled]);

  return { schools, loading };
};
