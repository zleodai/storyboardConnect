import { apiClient } from './api';
import { Project } from '../types/project.types';
import { FilterState } from '../types/filter.types';
import { mockProjects } from '../utils/mockData';

const USE_MOCK_DATA = true; // Set to false when backend is ready

export const projectService = {
  // GET /projects - with filters
  getProjects: async (filters?: Partial<FilterState>): Promise<Project[]> => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockProjects;
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
