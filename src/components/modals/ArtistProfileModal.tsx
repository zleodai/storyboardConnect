import React from 'react';
import { Artist } from '../../types/artist.types';
import { Modal } from './Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { GlassPanel } from '../ui/GlassPanel';

interface ArtistProfileModalProps {
  artist: Artist | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArtistProfileModal: React.FC<ArtistProfileModalProps> = ({
  artist,
  isOpen,
  onClose,
}) => {
  if (!artist) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Banner */}
      <div className="h-64 w-full bg-gray-800 relative">
        <img
          src={artist.banner}
          alt="Banner"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black to-transparent"></div>
      </div>

      {/* Profile Content */}
      <div className="max-w-5xl mx-auto px-6 relative -top-16">
        {/* Avatar & Header */}
        <div className="flex flex-col md:flex-row items-end md:items-end gap-6 mb-8">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-300 rounded-full border-4 border-cinema-black flex-shrink-0 overflow-hidden relative z-10 shadow-xl">
            <img
              src={artist.avatar}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 pb-2">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{artist.name}</h1>
            <div className="text-gray-400 text-sm md:text-base flex flex-wrap gap-y-1 gap-x-3 items-center">
              <span className="text-accent">
                <i className="fas fa-graduation-cap mr-1"></i>
                {artist.school}
              </span>
              {artist.major && (
                <>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span>{artist.major}</span>
                </>
              )}
              {artist.graduationYear && (
                <>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span>Class of {artist.graduationYear}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-3 pb-3 w-full md:w-auto mt-4 md:mt-0">
            <Button variant="primary" className="flex-1 md:flex-none">
              Contact
            </Button>
            <Button variant="outline" className="flex-1 md:flex-none">
              <i className="fas fa-share-alt"></i>
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Left Column - About & Portfolio */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <section>
              <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-accent pl-3">
                About
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                {artist.about}
              </p>
            </section>

            {/* Portfolio Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white border-l-4 border-accent pl-3">
                  Portfolio
                </h3>
                <div className="flex gap-2 text-xs">
                  <button className="px-3 py-1 bg-gray-800 rounded-full text-white border border-gray-700 hover:border-accent">
                    All
                  </button>
                  <button className="px-3 py-1 bg-transparent rounded-full text-gray-400 hover:text-white">
                    Action
                  </button>
                  <button className="px-3 py-1 bg-transparent rounded-full text-gray-400 hover:text-white">
                    Cinematic
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                {artist.portfolio.length > 0 ? (
                  artist.portfolio.map((project) => (
                    <div
                      key={project.id}
                      className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition group cursor-pointer"
                    >
                      <div className="aspect-video w-full bg-gray-800 relative overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80 group-hover:opacity-100"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">
                          <h4 className="text-xl font-bold text-white">{project.title}</h4>
                        </div>
                      </div>
                      <div className="p-4 flex flex-wrap gap-2">
                        {project.tags.map((tag, idx) => (
                          <Badge key={idx}>{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-12">
                    No portfolio items yet
                  </div>
                )}
              </div>

              {artist.portfolio.length > 0 && (
                <div className="mt-8 text-center">
                  <button className="px-8 py-3 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 hover:text-white transition text-sm font-semibold tracking-wide">
                    LOAD MORE PROJECTS
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Right Column - Skills & Availability */}
          <div className="space-y-8">
            {/* Top Skills */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">
                Top Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {artist.topSkills.map((skill, idx) => (
                  <Badge key={idx}>{skill}</Badge>
                ))}
              </div>
            </div>

            {/* Availability (Premium Locked) */}
            <div className="relative rounded-xl overflow-hidden border border-gray-800">
              <div className="bg-gray-900 p-6 blur-sm select-none">
                <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">
                  Availability Status
                </h4>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-500 font-bold">
                    {artist.availability?.status === 'open' ? 'Open for Work' : 'Busy'}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Next Available:</span>
                    <span className="text-gray-300">
                      {artist.availability?.nextAvailable || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Rate:</span>
                    <span className="text-gray-300">
                      ${artist.availability?.rate || '450'}/day
                    </span>
                  </div>
                  <button className="w-full mt-4 py-2 bg-accent text-black font-bold rounded">
                    Book Now
                  </button>
                </div>
              </div>

              {/* Lock Overlay */}
              <div className="absolute inset-0 z-10 glass-lock flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3 border border-gray-600">
                  <i className="fas fa-lock text-accent-gold"></i>
                </div>
                <h4 className="text-white font-bold text-lg mb-1">View Availability</h4>
                <p className="text-xs text-gray-400 mb-4 max-w-[200px]">
                  Unlock artist schedules and booking rates with Connect+
                </p>
                <button className="px-6 py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black text-sm font-bold rounded shadow-lg hover:brightness-110 transition">
                  Get Storyboard Connect +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
