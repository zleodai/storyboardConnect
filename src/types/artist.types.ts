export interface PortfolioProject {
  id: string;
  title: string;
  image: string;
  tags: string[];
  category: string;
}

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  school: string;
  major?: string;
  graduationYear?: string;
  about: string;
  topSkills: string[];
  boardTypes: string[];
  portfolio: PortfolioProject[];
  availability?: {
    status: 'open' | 'busy' | 'unavailable';
    nextAvailable?: string;
    rate?: number;
  };
  isPremium?: boolean;
  uploadDate: string;
  viewCount: number;
}
