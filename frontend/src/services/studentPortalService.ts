import { apiClient } from './api';
import {
  Student,
  StudentPortalAttendancePayload,
  FeeRecord,
  StudentResult,
  TimetableSlot
} from '../types';

export const studentPortalService = {
  getMyProfile: async (): Promise<Student> => {
    const res = await apiClient.get<Student>('/student-portal/my-profile/');
    return res.data;
  },

  getMyAttendance: async (): Promise<StudentPortalAttendancePayload> => {
    const res = await apiClient.get<StudentPortalAttendancePayload>('/student-portal/my-attendance/');
    return res.data;
  },

  getMyFees: async (): Promise<FeeRecord> => {
    const res = await apiClient.get<FeeRecord>('/student-portal/my-fees/');
    return res.data;
  },

  getMyResults: async (): Promise<{
    student_name: string;
    roll_number: string;
    enrollment_number: string;
    branch: string;
    semester: number;
    results: StudentResult[];
  }> => {
    const res = await apiClient.get('/student-portal/my-results/');
    return res.data;
  },

  getMyTimetable: async (): Promise<{
    branch: string;
    semester: number;
    slots: TimetableSlot[];
  }> => {
    const res = await apiClient.get('/student-portal/my-timetable/');
    return res.data;
  }
};
