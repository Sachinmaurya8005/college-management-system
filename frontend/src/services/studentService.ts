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
    const payload = {
      ...studentData,
      full_name: studentData.name,
      roll_number: studentData.rollNo,
      enrollment_number: studentData.enrollmentNo || '',
      father_name: studentData.fatherName || '',
      mother_name: studentData.motherName || '',
      date_of_birth: studentData.dob || null,
      blood_group: studentData.bloodGroup || 'B+',
      photo_url: studentData.photoUrl || '',
      admission_year: studentData.admissionYear || new Date().getFullYear(),
      attendance_percentage: studentData.attendancePercentage || 85.0,
      fee_status: studentData.feeStatus || 'Pending'
    };
    const response = await apiClient.post<Student>('/students/', payload);
    return response.data;
  },

  update: async (id: string, studentData: Partial<Student>): Promise<Student> => {
    const payload: any = { ...studentData };
    if (studentData.name) payload.full_name = studentData.name;
    if (studentData.rollNo) payload.roll_number = studentData.rollNo;
    if (studentData.enrollmentNo !== undefined) payload.enrollment_number = studentData.enrollmentNo;
    if (studentData.fatherName !== undefined) payload.father_name = studentData.fatherName;
    if (studentData.motherName !== undefined) payload.mother_name = studentData.motherName;
    if (studentData.dob !== undefined) payload.date_of_birth = studentData.dob;
    if (studentData.photoUrl !== undefined) payload.photo_url = studentData.photoUrl;
    if (studentData.bloodGroup !== undefined) payload.blood_group = studentData.bloodGroup;
    if (studentData.feeStatus !== undefined) payload.fee_status = studentData.feeStatus;
    const response = await apiClient.patch<Student>(`/students/${id}/`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/students/${id}/`);
  },
};
