import { apiClient } from './api';
import { UpdateUserProfileInput, UserProfile } from '../types/profile.types';

export const profileService = {
  getMyProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>('/me/profile');
    return response.data;
  },

  updateMyProfile: async (payload: UpdateUserProfileInput): Promise<UserProfile> => {
    const response = await apiClient.put<UserProfile>('/me/profile', payload);
    return response.data;
  },
};
