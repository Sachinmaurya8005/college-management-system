import { apiClient } from './api';

export const dashboardService = {
  getMetrics: async (): Promise<any> => {
    const response = await apiClient.get('/dashboard/');
    return response.data;
  },
};
