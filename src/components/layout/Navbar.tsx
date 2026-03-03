import React from 'react';
import { useApp } from '../../hooks/useApp';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { viewMode, setViewMode, setCurrentPage, currentPage } = useApp();
  const { user, loading, loginWithGoogle, logout } = useAuth();

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

        {loading ? (
          <span className="text-gray-500">Loading...</span>
        ) : user ? (
          <>
            <button
              type="button"
              onClick={logout}
              className="text-gray-400 hover:text-white transition"
            >
              Sign Out
            </button>
            <div
              className="w-8 h-8 rounded-full border border-gray-500 overflow-hidden flex items-center justify-center text-xs font-bold text-white"
              title={user.email}
            >
              {user.email.slice(0, 1).toUpperCase()}
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={loginWithGoogle}
            className="text-gray-400 hover:text-white transition"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};
