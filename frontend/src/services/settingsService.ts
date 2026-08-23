import { apiClient } from './api';
import { CollegeSettings } from '../types';

export const settingsService = {
  getSettings: async (): Promise<CollegeSettings> => {
    const response = await apiClient.get<CollegeSettings>('/settings/');
    return response.data;
  },

  updateSettings: async (settingsData: Partial<CollegeSettings>): Promise<CollegeSettings> => {
    const response = await apiClient.patch<CollegeSettings>('/settings/', settingsData);
    return response.data;
  },
};
