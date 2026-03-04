export interface UserProfile {
  id: string;
  email: string;
  role: string;
  name: string;
  avatarUrl?: string;
  banner: string;
  school: string;
  major?: string;
  graduationYear?: string;
  about: string;
  topSkills: string[];
  boardTypes: string[];
  availability?: {
    status: 'open' | 'busy' | 'unavailable';
    nextAvailable?: string;
    rate?: number;
  };
  isPremium?: boolean;
  onboardingRequired: boolean;
}

export interface UpdateUserProfileInput {
  name: string;
  avatarUrl?: string;
  school: string;
  major?: string;
  graduationYear?: string;
  about: string;
  topSkills: string[];
  boardTypes: string[];
  availability?: {
    status?: 'open' | 'busy' | 'unavailable';
    nextAvailable?: string;
    rate?: number;
  };
}
