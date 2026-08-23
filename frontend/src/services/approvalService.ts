import { apiClient } from './api';

export interface StaffApprovalRequest {
  id: number;
  request_no: string;
  request_type: 'NEW_STUDENT' | 'FEE_UPDATE' | 'STUDENT_UPDATE' | 'ATTENDANCE_UPDATE';
  submitted_by_name: string;
  submitted_by_email: string;
  student?: number;
  student_name: string;
  roll_number: string;
  branch: string;
  semester: number;
  payload: Record<string, any>;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  admin_remarks: string;
  reviewed_by: string;
  created_at: string;
  updated_at: string;
}

export const approvalService = {
  getRequests: async (params?: { status?: string; request_type?: string }): Promise<StaffApprovalRequest[]> => {
    const res = await apiClient.get<StaffApprovalRequest[]>('/students/approval-requests/', { params });
    return res.data;
  },

  createRequest: async (data: Partial<StaffApprovalRequest>): Promise<StaffApprovalRequest> => {
    const res = await apiClient.post<StaffApprovalRequest>('/students/approval-requests/', data);
    return res.data;
  },

  approveRequest: async (id: number, admin_remarks?: string): Promise<StaffApprovalRequest> => {
    const res = await apiClient.post<StaffApprovalRequest>(`/students/approval-requests/${id}/approve/`, {
      admin_remarks: admin_remarks || 'Approved by Admin.'
    });
    return res.data;
  },

  rejectRequest: async (id: number, admin_remarks: string): Promise<StaffApprovalRequest> => {
    const res = await apiClient.post<StaffApprovalRequest>(`/students/approval-requests/${id}/reject/`, {
      admin_remarks: admin_remarks || 'Rejected by Admin.'
    });
    return res.data;
  }
};
