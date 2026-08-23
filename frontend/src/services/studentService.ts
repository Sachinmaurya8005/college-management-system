import { apiClient } from './api';
import { Student } from '../types';

export const studentService = {
  getAll: async (params?: { branch?: string; semester?: number; search?: string; status?: string }): Promise<Student[]> => {
    const response = await apiClient.get<Student[]>('/students/', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Student> => {
    const response = await apiClient.get<Student>(`/students/${id}/`);
    return response.data;
  },

  create: async (studentData: Omit<Student, 'id'>): Promise<Student> => {
    const response = await apiClient.post<Student>('/students/', studentData);
    return response.data;
  },

  update: async (id: string, studentData: Partial<Student>): Promise<Student> => {
    const response = await apiClient.patch<Student>(`/students/${id}/`, studentData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/students/${id}/`);
  },
};
