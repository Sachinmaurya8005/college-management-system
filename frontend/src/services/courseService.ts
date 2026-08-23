import { apiClient } from './api';
import { Course } from '../types';

export const courseService = {
  getAll: async (): Promise<Course[]> => {
    const response = await apiClient.get<Course[]>('/courses/');
    return response.data;
  },

  create: async (courseData: Omit<Course, 'id'>): Promise<Course> => {
    const response = await apiClient.post<Course>('/courses/', courseData);
    return response.data;
  },

  update: async (id: string, courseData: Partial<Course>): Promise<Course> => {
    const response = await apiClient.patch<Course>(`/courses/${id}/`, courseData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/courses/${id}/`);
  },
};
