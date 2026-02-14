import React from 'react';
import { useApp } from '../../hooks/useApp';
import { useModal } from '../../hooks/useModal';
import { useArtists } from '../../hooks/useArtists';
import { useProjects } from '../../hooks/useProjects';
import { ArtistCard } from '../cards/ArtistCard';
import { ProjectCard } from '../cards/ProjectCard';
import { Sidebar } from '../layout/Sidebar';

export const GridView: React.FC = () => {
  const { viewMode } = useApp();
  const { openArtistModal, openProjectModal } = useModal();
  const { artists, loading: artistsLoading } = useArtists();
  const { projects, loading: projectsLoading } = useProjects();

  const isArtistMode = viewMode === 'artist';
  const loading = isArtistMode ? artistsLoading : projectsLoading;
  const resultCount = isArtistMode ? artists.length : projects.length;

  return (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-64px)]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8 bg-[#121212] relative">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex justify-between items-center fade-in">
            <h2 className="text-2xl font-bold text-white">
              {isArtistMode ? 'Featured Artists' : 'Project Opportunities'}
            </h2>
            <div className="text-sm text-gray-400">
              {loading ? 'Loading...' : `Showing ${resultCount} results`}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-400">Loading...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12 fade-in">
              {isArtistMode ? (
                artists.length > 0 ? (
                  artists.map((artist) => (
                    <ArtistCard
                      key={artist.id}
                      artist={artist}
                      onClick={() => openArtistModal(artist)}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-400 py-12">
                    No artists found. Connect your backend API to see results.
                  </div>
                )
              ) : projects.length > 0 ? (
                projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => openProjectModal(project)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400 py-12">
                  No projects found. Connect your backend API to see results.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
