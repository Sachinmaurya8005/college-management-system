import { apiClient } from './api';
import { AttendanceSession } from '../types';

export const attendanceService = {
  getAllSessions: async (): Promise<AttendanceSession[]> => {
    const response = await apiClient.get<AttendanceSession[]>('/attendance/');
    return response.data;
  },

  markAttendance: async (sessionData: Omit<AttendanceSession, 'id'>): Promise<AttendanceSession> => {
    const response = await apiClient.post<AttendanceSession>('/attendance/mark/', sessionData);
    return response.data;
  },
};
