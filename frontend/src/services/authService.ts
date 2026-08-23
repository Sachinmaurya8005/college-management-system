import { apiClient } from './api';
import { Role, User } from '../types';

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export const authService = {
  login: async (email: string, pass: string, role: Role): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login/', {
      email,
      password: pass,
      role,
    });
    const { access, refresh, user } = response.data;
    if (access) {
      localStorage.setItem('gpb_jwt_access_token', access);
      localStorage.setItem('gpb_jwt_refresh_token', refresh);
    }
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/profile/');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<User>('/auth/profile/', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    const refresh = localStorage.getItem('gpb_jwt_refresh_token');
    try {
      if (refresh) {
        await apiClient.post('/auth/logout/', { refresh });
      }
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('gpb_jwt_access_token');
      localStorage.removeItem('gpb_jwt_refresh_token');
    }
  },
};
