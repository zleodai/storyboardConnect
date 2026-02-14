import { useState, useEffect } from 'react';
import { Artist } from '../types/artist.types';
import { artistService } from '../services/artistService';
import { useFilters } from './useFilters';

export const useArtists = () => {
  const { filters } = useFilters();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await artistService.getArtists(filters);
        setArtists(data);
      } catch (err) {
        setError('Failed to fetch artists');
        console.error('Error fetching artists:', err);
        // For now, use empty array if API fails
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [filters]);

  return { artists, loading, error };
};
