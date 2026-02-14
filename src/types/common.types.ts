import { Artist } from './artist.types';
import { Project } from './project.types';

export interface ModalState {
  isOpen: boolean;
  type: 'artist' | 'project' | null;
  data: Artist | Project | null;
}
