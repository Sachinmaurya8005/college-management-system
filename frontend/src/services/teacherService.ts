import { apiClient } from './api';
import { Teacher } from '../types';

export const teacherService = {
  getAll: async (params?: { department?: string; search?: string }): Promise<Teacher[]> => {
    const response = await apiClient.get<Teacher[]>('/teachers/', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Teacher> => {
    const response = await apiClient.get<Teacher>(`/teachers/${id}/`);
    return response.data;
  },

  create: async (teacherData: Omit<Teacher, 'id'>): Promise<Teacher> => {
    const response = await apiClient.post<Teacher>('/teachers/', teacherData);
    return response.data;
  },

  update: async (id: string, teacherData: Partial<Teacher>): Promise<Teacher> => {
    const response = await apiClient.patch<Teacher>(`/teachers/${id}/`, teacherData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/teachers/${id}/`);
  },
};
