import React from 'react';
import { useApp } from '../../hooks/useApp';
import { useModal } from '../../hooks/useModal';
import { Artist } from '../../types/artist.types';

export const Navbar: React.FC = () => {
  const { viewMode, setViewMode, setCurrentPage, currentPage } = useApp();
  const { openArtistModal } = useModal();

  const handlePageSwitch = (page: 'grid' | 'community' | 'news' | 'events') => {
    setCurrentPage(page);
  };

  const handleModeSwitch = (mode: 'artist' | 'project') => {
    setViewMode(mode);
    setCurrentPage('grid');
  };

  const goHome = () => {
    window.location.reload();
  };

  // Mock current user data - in production this would come from auth context
  const mockCurrentUser: Artist = {
    id: '1',
    name: 'Nicholas Wu',
    avatar: '/images/nicholas_avatar.jpg',
    banner: '/images/banner_main.jpg',
    school: 'LMU',
    major: 'Film & TV Production',
    graduationYear: '2024',
    about: 'Nicholas Wu is a storyboard artist and animator in Los Angeles, California.',
    topSkills: ['Storyboard Pro', 'Blender', 'Photoshop'],
    boardTypes: ['Action Board', 'Cinematic'],
    portfolio: [],
  };

  const openProfile = () => {
    openArtistModal(mockCurrentUser);
  };

  return (
    <nav className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-cinema-gray z-50 shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <div
          className="text-xl font-bold tracking-widest uppercase cursor-pointer text-white flex items-center gap-2"
          onClick={goHome}
        >
          <i className="fas fa-film text-accent"></i> Storyboard Connect
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 text-sm text-gray-400">
          <a
            href="#"
            onClick={() => handlePageSwitch('community')}
            className={`hover:text-white transition ${
              currentPage === 'community' ? 'text-white font-bold' : ''
            }`}
          >
            Community
          </a>
          <a
            href="#"
            onClick={() => handlePageSwitch('news')}
            className={`hover:text-white transition ${
              currentPage === 'news' ? 'text-white font-bold' : ''
            }`}
          >
            News
          </a>
          <a
            href="#"
            onClick={() => handlePageSwitch('events')}
            className={`hover:text-white transition ${
              currentPage === 'events' ? 'text-white font-bold' : ''
            }`}
          >
            Events
          </a>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6 text-sm">
        <div className="hidden md:block h-4 w-px bg-gray-700"></div>

        {/* Mode Switches */}
        <a
          href="#"
          onClick={() => handleModeSwitch('artist')}
          className={`hover:text-accent transition ${
            viewMode === 'artist' ? 'text-white font-bold' : 'text-gray-400'
          }`}
        >
          Find Artists
        </a>
        <a
          href="#"
          onClick={() => handleModeSwitch('project')}
          className={`hover:text-accent transition ${
            viewMode === 'project' ? 'text-white font-bold' : 'text-gray-400'
          }`}
        >
          Find Projects
        </a>

        {/* User Avatar */}
        <div
          className="w-8 h-8 rounded-full border border-gray-500 overflow-hidden cursor-pointer"
          onClick={openProfile}
        >
          <img
            src={mockCurrentUser.avatar}
            className="w-full h-full object-cover"
            alt="User"
          />
        </div>
      </div>
    </nav>
  );
};
