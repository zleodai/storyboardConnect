import { apiClient } from './api';
import { Artist } from '../types/artist.types';
import { FilterState } from '../types/filter.types';
import { mockArtists } from '../utils/mockData';

const USE_MOCK_DATA = true; // Set to false when backend is ready

export const artistService = {
  // GET /artists - with filters as query params
  getArtists: async (filters?: Partial<FilterState>): Promise<Artist[]> => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockArtists;
    }

    const response = await apiClient.get<Artist[]>('/artists', {
      params: filters,
    });
    return response.data;
  },

  // GET /artists/:id
  getArtistById: async (id: string): Promise<Artist> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const artist = mockArtists.find((a) => a.id === id);
      if (!artist) throw new Error('Artist not found');
      return artist;
    }

    const response = await apiClient.get<Artist>(`/artists/${id}`);
    return response.data;
  },

  // GET /artists/featured
  getFeaturedArtists: async (): Promise<Artist[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockArtists;
    }

    const response = await apiClient.get<Artist[]>('/artists/featured');
    return response.data;
  },
};
