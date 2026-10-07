import { apiClient } from './api';
import { Teacher } from '../types';

export const teacherService = {
  getAll: async (params?: { department?: string; search?: string }): Promise<Teacher[]> => {
    const response = await apiClient.get<Teacher[]>('/teachers/', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Teacher> => {
    const response = await apiClient.get<Teacher>(`/teachers/${id}/`);
    return response.data;
  },

  create: async (teacherData: Omit<Teacher, 'id'>): Promise<Teacher> => {
    const payload = {
      ...teacherData,
      full_name: teacherData.name,
      emp_code: teacherData.empCode || '',
      photo_url: teacherData.photoUrl || '',
      joining_date: teacherData.joiningDate || null,
      experience_years: teacherData.experienceYears || 0,
      date_of_birth: teacherData.dob || null,
      pay_scale: teacherData.payScale || '',
      promotion_status: teacherData.promotionStatus || '',
      blood_group: teacherData.bloodGroup || '',
      staff_type: teacherData.staffType || 'Teaching',
      work_description: teacherData.workDescription || ''
    };
    const response = await apiClient.post<Teacher>('/teachers/', payload);
    return response.data;
  },

  update: async (id: string, teacherData: Partial<Teacher>): Promise<Teacher> => {
    const payload: any = { ...teacherData };
    if (teacherData.name) payload.full_name = teacherData.name;
    if (teacherData.empCode !== undefined) payload.emp_code = teacherData.empCode;
    if (teacherData.photoUrl !== undefined) payload.photo_url = teacherData.photoUrl;
    if (teacherData.joiningDate !== undefined) payload.joining_date = teacherData.joiningDate;
    if (teacherData.experienceYears !== undefined) payload.experience_years = teacherData.experienceYears;
    if (teacherData.dob !== undefined) payload.date_of_birth = teacherData.dob;
    if (teacherData.bloodGroup !== undefined) payload.blood_group = teacherData.bloodGroup;
    if (teacherData.staffType !== undefined) payload.staff_type = teacherData.staffType;
    if (teacherData.workDescription !== undefined) payload.work_description = teacherData.workDescription;
    const response = await apiClient.patch<Teacher>(`/teachers/${id}/`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/teachers/${id}/`);
  },
};
