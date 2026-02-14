import { useState, useEffect } from 'react';
import { Project } from '../types/project.types';
import { projectService } from '../services/projectService';
import { useFilters } from './useFilters';

export const useProjects = () => {
  const { filters } = useFilters();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await projectService.getProjects(filters);
        setProjects(data);
      } catch (err) {
        setError('Failed to fetch projects');
        console.error('Error fetching projects:', err);
        // For now, use empty array if API fails
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [filters]);

  return { projects, loading, error };
};
