import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { FilterProvider } from './contexts/FilterContext';
import { ModalProvider } from './contexts/ModalContext';
import { useApp } from './hooks/useApp';
import { useAuth } from './hooks/useAuth';
import { useModal } from './hooks/useModal';
import { Layout } from './components/layout/Layout';
import { SignInPage } from './components/pages/SignInPage';
import { LandingPage } from './components/pages/LandingPage';
import { GridView } from './components/pages/GridView';
import { ProfilePage } from './components/pages/ProfilePage';
import { CommunityPage } from './components/pages/CommunityPage';
import { NewsPage } from './components/pages/NewsPage';
import { EventsPage } from './components/pages/EventsPage';
import { ArtistProfileModal } from './components/modals/ArtistProfileModal';
import { ProjectDetailModal } from './components/modals/ProjectDetailModal';
import { Artist } from './types/artist.types';
import { Project } from './types/project.types';

const AppContent: React.FC = () => {
  const { hasEnteredSite, currentPage } = useApp();
  const { user, loading } = useAuth();
  const { modalState, closeModal } = useModal();
  const [hasDismissedSignIn, setHasDismissedSignIn] = React.useState(false);

  // Render current page based on state
  const renderPage = () => {
    if (!hasEnteredSite) {
      if (loading) {
        return (
          <div className="flex flex-1 items-center justify-center bg-[#090909] text-gray-400">
            Loading...
          </div>
        );
      }

      if (!user && !hasDismissedSignIn) {
        return <SignInPage onContinueWithoutSignIn={() => setHasDismissedSignIn(true)} />;
      }

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
      case 'profile':
        return <ProfilePage />;
      default:
        return <GridView />;
    }
  };

  React.useEffect(() => {
    if (user && hasDismissedSignIn) {
      setHasDismissedSignIn(false);
    }
  }, [user, hasDismissedSignIn]);

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
    <AuthProvider>
      <AppProvider>
        <FilterProvider>
          <ModalProvider>
            <AppContent />
          </ModalProvider>
        </FilterProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
