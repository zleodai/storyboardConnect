import { useEffect, useState } from 'react';
import { artistService } from '../services/artistService';
import { FilterOption } from '../types/filter.types';

export const useArtistSkillCounts = (enabled: boolean) => {
  const [skills, setSkills] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setSkills([]);
      setLoading(false);
      return;
    }

    const loadSkills = async () => {
      setLoading(true);
      try {
        const data = await artistService.getSkillCounts();
        setSkills(data);
      } catch (error) {
        console.error('Failed to load artist skills:', error);
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, [enabled]);

  return { skills, loading };
};
