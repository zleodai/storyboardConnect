import { apiClient } from './api';
import { Project } from '../types/project.types';
import { FilterState } from '../types/filter.types';
import { mockProjects } from '../utils/mockData';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

function filterAndSortProjects(projects: Project[], filters?: Partial<FilterState>): Project[] {
  let result = [...projects];

  if (!filters) return result;

  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    result = result.filter(
      (p) => p.title.toLowerCase().includes(q) || p.logline.toLowerCase().includes(q),
    );
  }
  if (filters.selectedSchools && filters.selectedSchools.length > 0) {
    result = result.filter((p) => filters.selectedSchools!.includes(p.school));
  }
  if (filters.selectedFormats && filters.selectedFormats.length > 0) {
    result = result.filter((p) => filters.selectedFormats!.includes(p.format));
  }
  if (filters.selectedProductionTypes && filters.selectedProductionTypes.length > 0) {
    result = result.filter((p) => filters.selectedProductionTypes!.includes(p.productionType));
  }
  if (filters.selectedTimelines && filters.selectedTimelines.length > 0) {
    result = result.filter((p) => filters.selectedTimelines!.includes(p.timeline));
  }

  const sortBy = filters.sortBy ?? 'date';
  if (sortBy === 'views') {
    result.sort((a, b) => b.viewCount - a.viewCount);
  } else {
    result.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
  }

  return result;
}

export const projectService = {
  // GET /projects - with filters
  getProjects: async (filters?: Partial<FilterState>): Promise<Project[]> => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return filterAndSortProjects(mockProjects, filters);
    }

    const response = await apiClient.get<Project[]>('/projects', {
      params: filters,
    });
    return response.data;
  },

  // GET /projects/:id
  getProjectById: async (id: string): Promise<Project> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const project = mockProjects.find((p) => p.id === id);
      if (!project) throw new Error('Project not found');
      return project;
    }

    const response = await apiClient.get<Project>(`/projects/${id}`);
    return response.data;
  },

  // GET /projects/featured
  getFeaturedProjects: async (): Promise<Project[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockProjects;
    }

    const response = await apiClient.get<Project[]>('/projects/featured');
    return response.data;
  },

  // GET /projects/schools
  getSchoolCounts: async (): Promise<Array<{ label: string; value: string; count?: number }>> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const counts = mockProjects.reduce<Record<string, number>>((acc, project) => {
        acc[project.school] = (acc[project.school] ?? 0) + 1;
        return acc;
      }, {});

      return Object.entries(counts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([school, count]) => ({
          label: school,
          value: school,
          count,
        }));
    }

    const response = await apiClient.get<Array<{ label: string; value: string; count?: number }>>(
      '/projects/schools',
    );
    return response.data;
  },

  // GET /projects/filter-counts
  getFilterCounts: async (): Promise<{
    schools: Array<{ label: string; value: string; count?: number }>;
    formats: Array<{ label: string; value: string; count?: number }>;
    productionTypes: Array<{ label: string; value: string; count?: number }>;
    timelines: Array<{ label: string; value: string; count?: number }>;
  }> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const schools: Record<string, number> = {};
      const formats: Record<string, number> = {};
      const productionTypes: Record<string, number> = {};
      const timelines: Record<string, number> = {};

      mockProjects.forEach((project) => {
        schools[project.school] = (schools[project.school] ?? 0) + 1;
        formats[project.format] = (formats[project.format] ?? 0) + 1;
        productionTypes[project.productionType] = (productionTypes[project.productionType] ?? 0) + 1;
        timelines[project.timeline] = (timelines[project.timeline] ?? 0) + 1;
      });

      const mapCounts = (counts: Record<string, number>) =>
        Object.entries(counts)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([value, count]) => ({
            label: value,
            value,
            count,
          }));

      return {
        schools: mapCounts(schools),
        formats: mapCounts(formats),
        productionTypes: mapCounts(productionTypes),
        timelines: mapCounts(timelines),
      };
    }

    const response = await apiClient.get<{
      schools: Array<{ label: string; value: string; count?: number }>;
      formats: Array<{ label: string; value: string; count?: number }>;
      productionTypes: Array<{ label: string; value: string; count?: number }>;
      timelines: Array<{ label: string; value: string; count?: number }>;
    }>('/projects/filter-counts');
    return response.data;
  },

  // POST /projects/:id/apply
  applyToProject: async (projectId: string, applicationData: any): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      console.log('Applied to project:', projectId, applicationData);
      return;
    }

    const response = await apiClient.post(`/projects/${projectId}/apply`, applicationData);
    return response.data;
  },
};
