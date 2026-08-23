import { apiClient } from './api';
import { NoticeItem } from '../types';

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
