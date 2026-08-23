import { apiClient } from './api';
import { ExamSchedule, StudentResult } from '../types';

export const examService = {
  getSchedules: async (): Promise<ExamSchedule[]> => {
    const response = await apiClient.get<ExamSchedule[]>('/examinations/schedules/');
    return response.data;
  },

  createSchedule: async (data: Omit<ExamSchedule, 'id'>): Promise<ExamSchedule> => {
    const response = await apiClient.post<ExamSchedule>('/examinations/schedules/', data);
    return response.data;
  },

  updateSchedule: async (id: string, data: Partial<ExamSchedule>): Promise<ExamSchedule> => {
    const response = await apiClient.patch<ExamSchedule>(`/examinations/schedules/${id}/`, data);
    return response.data;
  },

  deleteSchedule: async (id: string): Promise<void> => {
    await apiClient.delete(`/examinations/schedules/${id}/`);
  },

  getResults: async (): Promise<StudentResult[]> => {
    const response = await apiClient.get<StudentResult[]>('/examinations/results/');
    return response.data;
  },

  getMarksheet: async (resultId: string): Promise<StudentResult> => {
    const response = await apiClient.get<StudentResult>(`/examinations/results/${resultId}/marksheet/`);
    return response.data;
  },
};
