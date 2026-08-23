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

export const INITIAL_APPROVAL_REQUESTS: StaffApprovalRequest[] = [
  {
    id: 1,
    request_no: 'REQ-2026-F89101',
    request_type: 'NEW_STUDENT',
    submitted_by_name: 'Dr. Alok Kumar Rai',
    submitted_by_email: 'teacher@polytechnic.edu',
    student_name: 'Aman Kumar Verma',
    roll_number: 'E224412355018',
    branch: 'Computer Science & Engineering',
    semester: 1,
    description: 'Requesting admission registration for newly allotted JEECUP student Aman Kumar Verma.',
    payload: {
      full_name: 'Aman Kumar Verma',
      roll_number: 'E224412355018',
      enrollment_number: 'E224412018',
      branch: 'Computer Science & Engineering',
      semester: 1,
      date_of_birth: '2006-04-12',
      father_name: 'Shri Rajesh Verma',
      mother_name: 'Smt. Anita Devi',
      mobile: '+91 94150 99881',
      email: 'aman.cse22@gpbansdeeh.ac.in',
      fee_status: 'Pending'
    },
    status: 'Pending',
    admin_remarks: '',
    reviewed_by: '',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 2,
    request_no: 'REQ-2026-B44012',
    request_type: 'FEE_UPDATE',
    submitted_by_name: 'Er. Pratibha Tiwari',
    submitted_by_email: 'pratibha.it@gpbansdeeh.ac.in',
    student_name: 'Priya Sharma',
    roll_number: 'E224412355002',
    branch: 'Computer Science & Engineering',
    semester: 4,
    description: 'Fee payment update of ₹12,450 (Paid via SBI Online Collect Challan #SBI991204)',
    payload: {
      student_name: 'Priya Sharma',
      roll_number: 'E224412355002',
      branch: 'Computer Science & Engineering',
      semester: 4,
      fee_status: 'Paid',
      paid_amount: 12450,
      payment_mode: 'Online UPI / Bank Transfer',
      transaction_ref: 'SBI/2026/UP091823',
      remarks: 'Full annual tuition fee verified in department ledger.'
    },
    status: 'Approved',
    admin_remarks: 'Verified against SBI Institutional Treasury statement. Approved.',
    reviewed_by: 'Er. Sachin Maurya (Principal)',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString()
  },
  {
    id: 3,
    request_no: 'REQ-2026-ME0921',
    request_type: 'NEW_STUDENT',
    submitted_by_name: 'Er. Vinay Pratap Singh',
    submitted_by_email: 'vinay.me@gpbansdeeh.ac.in',
    student_name: 'Suresh Kumar Chauhan',
    roll_number: 'E224412355019',
    branch: 'Mechanical Engineering (Production)',
    semester: 1,
    description: 'New Diploma Student Enrollment from Direct Lateral Counseling.',
    payload: {
      full_name: 'Suresh Kumar Chauhan',
      roll_number: 'E224412355019',
      enrollment_number: 'E224412019',
      branch: 'Mechanical Engineering (Production)',
      semester: 1,
      date_of_birth: '2005-09-22',
      father_name: 'Shri Virendra Chauhan',
      mother_name: 'Smt. Urmila Devi',
      mobile: '+91 98380 11223',
      email: 'suresh.me22@gpbansdeeh.ac.in',
      fee_status: 'Paid'
    },
    status: 'Pending',
    admin_remarks: '',
    reviewed_by: '',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

const STORAGE_KEY = 'gpb_portal_approval_requests';

function getLocalRequests(): StaffApprovalRequest[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore storage parse error
  }
  return INITIAL_APPROVAL_REQUESTS;
}

function saveLocalRequests(items: StaffApprovalRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel('gpb_realtime_broadcast_channel');
      bc.postMessage({ type: 'LIVE_DATA_PULSE', activity: { message: 'Approval Queue Updated', type: 'student' } });
      bc.close();
    }
  } catch (e) {
    // Ignore storage error
  }
}

export const approvalService = {
  getRequests: async (params?: { status?: string; request_type?: string }): Promise<StaffApprovalRequest[]> => {
    try {
      const res = await apiClient.get<StaffApprovalRequest[]>('/students/approval-requests/', { params });
      if (Array.isArray(res.data) && res.data.length > 0) {
        saveLocalRequests(res.data);
        return res.data;
      }
    } catch (e) {
      // Backend offline / unauthenticated fallback
    }

    let list = getLocalRequests();
    if (params?.status && params.status !== 'All') {
      list = list.filter(r => r.status.toLowerCase() === params.status!.toLowerCase());
    }
    if (params?.request_type && params.request_type !== 'All') {
      list = list.filter(r => r.request_type === params.request_type);
    }
    return list;
  },

  createRequest: async (data: Partial<StaffApprovalRequest>): Promise<StaffApprovalRequest> => {
    let currentUser: any = null;
    try {
      const stored = localStorage.getItem('gpb_portal_user');
      if (stored) currentUser = JSON.parse(stored);
    } catch (e) {}

    const newReq: StaffApprovalRequest = {
      id: Date.now(),
      request_no: `REQ-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      request_type: data.request_type || 'NEW_STUDENT',
      submitted_by_name: currentUser?.name || 'Faculty Member',
      submitted_by_email: currentUser?.email || 'teacher@polytechnic.edu',
      student_name: data.student_name || 'New Student',
      roll_number: data.roll_number || `E224412355${Math.floor(100 + Math.random() * 900)}`,
      branch: data.branch || 'Computer Science & Engineering',
      semester: Number(data.semester) || 1,
      payload: data.payload || {},
      description: data.description || 'Change request submitted by faculty.',
      status: 'Pending',
      admin_remarks: '',
      reviewed_by: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Save to local storage
    const currentList = getLocalRequests();
    const updatedList = [newReq, ...currentList];
    saveLocalRequests(updatedList);

    // Try background API call
    try {
      await apiClient.post('/students/approval-requests/', newReq);
    } catch (e) {
      // Offline fallback
    }

    return newReq;
  },

  approveRequest: async (id: number, admin_remarks?: string): Promise<StaffApprovalRequest> => {
    let currentUser: any = null;
    try {
      const stored = localStorage.getItem('gpb_portal_user');
      if (stored) currentUser = JSON.parse(stored);
    } catch (e) {}

    const currentList = getLocalRequests();
    const target = currentList.find(r => r.id === id);
    const reviewerName = currentUser?.name || 'Er. Sachin Maurya (Principal)';

    if (target) {
      target.status = 'Approved';
      target.admin_remarks = admin_remarks || 'Approved by Principal & Chief Administrator.';
      target.reviewed_by = reviewerName;
      target.updated_at = new Date().toISOString();

      // If approved was NEW_STUDENT, automatically add student to registered students list!
      if (target.request_type === 'NEW_STUDENT' && target.payload) {
        try {
          const rawStudents = localStorage.getItem('gpb_portal_students');
          const studentList = rawStudents ? JSON.parse(rawStudents) : [];
          const exists = studentList.some((s: any) => s.rollNo === target.roll_number);
          if (!exists) {
            studentList.unshift({
              id: `std-${Date.now()}`,
              rollNo: target.roll_number,
              enrollmentNo: target.payload.enrollment_number || target.roll_number.replace('355', ''),
              name: target.student_name,
              fatherName: target.payload.father_name || 'Guardian',
              motherName: target.payload.mother_name || 'Mother',
              dob: target.payload.date_of_birth || '2005-06-15',
              gender: target.payload.gender || 'Male',
              branch: target.branch,
              semester: target.semester,
              mobile: target.payload.mobile || '+91 98380 00000',
              email: target.payload.email || `${target.roll_number.toLowerCase()}@gpbansdeeh.ac.in`,
              address: target.payload.address || 'Bansdeeh, Ballia, UP',
              category: target.payload.category || 'OBC',
              bloodGroup: target.payload.bloodGroup || 'B+',
              admissionYear: 2026,
              status: 'Active',
              photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces',
              attendancePercentage: 100,
              feeStatus: target.payload.fee_status || 'Pending'
            });
            localStorage.setItem('gpb_portal_students', JSON.stringify(studentList));
          }
        } catch (e) {}
      }

      // If approved was FEE_UPDATE, update student fee
      if (target.request_type === 'FEE_UPDATE' && target.payload) {
        try {
          const rawFees = localStorage.getItem('gpb_portal_fees');
          const feeList = rawFees ? JSON.parse(rawFees) : [];
          const targetFee = feeList.find((f: any) => f.rollNo === target.roll_number);
          if (targetFee) {
            targetFee.paymentStatus = target.payload.fee_status || 'Paid';
            targetFee.paidAmount = target.payload.paid_amount || targetFee.totalFee;
            targetFee.pendingAmount = Math.max(0, targetFee.totalFee - targetFee.paidAmount);
            localStorage.setItem('gpb_portal_fees', JSON.stringify(feeList));
          }
        } catch (e) {}
      }

      saveLocalRequests(currentList);
    }

    try {
      const res = await apiClient.post<StaffApprovalRequest>(`/students/approval-requests/${id}/approve/`, {
        admin_remarks: admin_remarks || 'Approved by Admin.'
      });
      return res.data;
    } catch (e) {
      // Offline fallback
    }

    return target || currentList[0];
  },

  rejectRequest: async (id: number, admin_remarks: string): Promise<StaffApprovalRequest> => {
    let currentUser: any = null;
    try {
      const stored = localStorage.getItem('gpb_portal_user');
      if (stored) currentUser = JSON.parse(stored);
    } catch (e) {}

    const currentList = getLocalRequests();
    const target = currentList.find(r => r.id === id);
    const reviewerName = currentUser?.name || 'Er. Sachin Maurya (Principal)';

    if (target) {
      target.status = 'Rejected';
      target.admin_remarks = admin_remarks || 'Rejected by Admin.';
      target.reviewed_by = reviewerName;
      target.updated_at = new Date().toISOString();
      saveLocalRequests(currentList);
    }

    try {
      const res = await apiClient.post<StaffApprovalRequest>(`/students/approval-requests/${id}/reject/`, {
        admin_remarks: admin_remarks || 'Rejected by Admin.'
      });
      return res.data;
    } catch (e) {
      // Offline fallback
    }

    return target || currentList[0];
  }
};
