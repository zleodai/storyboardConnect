import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { ModalState } from '../types/common.types';
import { Artist } from '../types/artist.types';
import { Project } from '../types/project.types';

interface ModalContextType {
  modalState: ModalState;
  openArtistModal: (artist: Artist) => void;
  openProjectModal: (project: Project) => void;
  closeModal: () => void;
}

const initialModalState: ModalState = {
  isOpen: false,
  type: null,
  data: null,
};

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<ModalState>(initialModalState);

  const openArtistModal = (artist: Artist) => {
    setModalState({
      isOpen: true,
      type: 'artist',
      data: artist,
    });
  };

  const openProjectModal = (project: Project) => {
    setModalState({
      isOpen: true,
      type: 'project',
      data: project,
    });
  };

  const closeModal = () => {
    setModalState(initialModalState);
  };

  // Lock/unlock body scroll when modal opens/closes
  useEffect(() => {
    if (modalState.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modalState.isOpen]);

  return (
    <ModalContext.Provider
      value={{
        modalState,
        openArtistModal,
        openProjectModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
