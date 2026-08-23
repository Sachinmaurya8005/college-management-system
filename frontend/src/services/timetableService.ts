import { apiClient } from './api';
import { TimetableSlot, NoticeItem, CollegeSettings } from '../types';

export const timetableService = {
  getAll: async (params?: { branch?: string; semester?: number; day?: string }): Promise<TimetableSlot[]> => {
    const response = await apiClient.get<TimetableSlot[]>('/timetable/', { params });
    return response.data;
  },

  create: async (slotData: Omit<TimetableSlot, 'id'>): Promise<TimetableSlot> => {
    const response = await apiClient.post<TimetableSlot>('/timetable/', slotData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/timetable/${id}/`);
  },
};

export const noticeService = {
  getAll: async (params?: { category?: string; targetAudience?: string }): Promise<NoticeItem[]> => {
    const response = await apiClient.get<NoticeItem[]>('/notices/', { params });
    return response.data;
  },

  create: async (noticeData: Omit<NoticeItem, 'id'>): Promise<NoticeItem> => {
    const response = await apiClient.post<NoticeItem>('/notices/', noticeData);
    return response.data;
  },

  update: async (id: string, noticeData: Partial<NoticeItem>): Promise<NoticeItem> => {
    const response = await apiClient.patch<NoticeItem>(`/notices/${id}/`, noticeData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/notices/${id}/`);
  },
};

export const dashboardService = {
  getMetrics: async (): Promise<any> => {
    const response = await apiClient.get('/dashboard/');
    return response.data;
  },
};

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
