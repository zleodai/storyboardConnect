import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { FilterProvider } from './contexts/FilterContext';
import { ModalProvider } from './contexts/ModalContext';
import { useApp } from './hooks/useApp';
import { useModal } from './hooks/useModal';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './components/pages/LandingPage';
import { GridView } from './components/pages/GridView';
import { CommunityPage } from './components/pages/CommunityPage';
import { NewsPage } from './components/pages/NewsPage';
import { EventsPage } from './components/pages/EventsPage';
import { ArtistProfileModal } from './components/modals/ArtistProfileModal';
import { ProjectDetailModal } from './components/modals/ProjectDetailModal';
import { Artist } from './types/artist.types';
import { Project } from './types/project.types';

const AppContent: React.FC = () => {
  const { hasEnteredSite, currentPage } = useApp();
  const { modalState, closeModal } = useModal();

  // Render current page based on state
  const renderPage = () => {
    if (!hasEnteredSite) {
      return <LandingPage />;
    }

    switch (currentPage) {
      case 'grid':
        return <GridView />;
      case 'community':
        return <CommunityPage />;
      case 'news':
        return <NewsPage />;
      case 'events':
        return <EventsPage />;
      default:
        return <GridView />;
    }
  };

  return (
    <Layout showNavbar={hasEnteredSite}>
      {renderPage()}

      {/* Modals */}
      {modalState.type === 'artist' && (
        <ArtistProfileModal
          artist={modalState.data as Artist}
          isOpen={modalState.isOpen}
          onClose={closeModal}
        />
      )}

      {modalState.type === 'project' && (
        <ProjectDetailModal
          project={modalState.data as Project}
          isOpen={modalState.isOpen}
          onClose={closeModal}
        />
      )}
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <FilterProvider>
        <ModalProvider>
          <AppContent />
        </ModalProvider>
      </FilterProvider>
    </AppProvider>
  );
}

export default App;
