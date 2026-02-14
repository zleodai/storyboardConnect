import React from 'react';
import { Artist } from '../../types/artist.types';
import { Badge } from '../ui/Badge';

interface ArtistCardProps {
  artist: Artist;
  onClick?: () => void;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onClick }) => {
  return (
    <div
      className="bg-[#1a1a1a] rounded-xl overflow-hidden hover:ring-2 ring-accent cursor-pointer transition group shadow-lg"
      onClick={onClick}
    >
      {/* Banner */}
      <div className="h-48 w-full relative overflow-hidden">
        <img
          src={artist.banner}
          alt={`${artist.name} banner`}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#1a1a1a] to-transparent"></div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5 relative -top-8">
        <div className="flex justify-between items-end mb-2">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gray-300 border-4 border-[#1a1a1a] overflow-hidden">
            <img
              src={artist.avatar}
              alt={artist.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {/* School Badge */}
          <div className="mb-1">
            <Badge variant="accent">{artist.school}</Badge>
          </div>
        </div>

        {/* Name */}
        <h3 className="font-bold text-lg text-white group-hover:text-accent transition">
          {artist.name}
        </h3>

        {/* Board Types */}
        <p className="text-xs text-gray-400 mt-1">
          {artist.boardTypes.join(' • ')}
        </p>
      </div>
    </div>
  );
};
