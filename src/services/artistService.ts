import { apiClient } from './api';
import { Artist } from '../types/artist.types';
import { FilterState } from '../types/filter.types';
import { mockArtists } from '../utils/mockData';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

function filterAndSortArtists(artists: Artist[], filters?: Partial<FilterState>): Artist[] {
  let result = [...artists];

  if (!filters) return result;

  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    result = result.filter((a) => a.name.toLowerCase().includes(q));
  }
  if (filters.selectedSchools && filters.selectedSchools.length > 0) {
    result = result.filter((a) => filters.selectedSchools!.includes(a.school));
  }
  if (filters.selectedBoardTypes && filters.selectedBoardTypes.length > 0) {
    result = result.filter((a) =>
      a.boardTypes.some((bt) => filters.selectedBoardTypes!.includes(bt)),
    );
  }

  // Artists always sort by date joined (newest first)
  result.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

  return result;
}

export const artistService = {
  // GET /artists - with filters as query params
  getArtists: async (filters?: Partial<FilterState>): Promise<Artist[]> => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return filterAndSortArtists(mockArtists, filters);
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
