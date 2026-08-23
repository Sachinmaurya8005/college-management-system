export type Role = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  designation?: string;
  department?: string;
  rollNo?: string;
  enrollmentNo?: string;
  dob?: string;
  fatherName?: string;
  motherName?: string;
  category?: string;
  bloodGroup?: string;
  address?: string;
  branch?: string;
  semester?: number;
  lastLogin?: string;
}

export interface Student {
  id: string;
  rollNo: string;
  enrollmentNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  branch: string;
  semester: number;
  mobile: string;
  email: string;
  address: string;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  bloodGroup: string;
  admissionYear: number;
  status: 'Active' | 'Suspended' | 'Alumni';
  photoUrl: string;
  attendancePercentage: number;
  feeStatus: 'Paid' | 'Partial' | 'Pending';
}

export interface Teacher {
  id: string;
  name: string;
  empCode: string;
  department: string;
  designation: string;
  qualification: string;
  email: string;
  mobile: string;
  joiningDate: string;
  subjects: string[];
  status: 'Active' | 'On Leave' | 'Relieved';
  photoUrl: string;
  experienceYears: number;
  // Enhanced Staff & Faculty Dossier
  age?: number;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other';
  salary?: number;
  payScale?: string;
  promotionStatus?: string;
  address?: string;
  bloodGroup?: string;
  staffType?: 'Teaching Faculty' | 'Technical Staff' | 'Administrative Staff' | 'Support Staff';
  workDescription?: string;
  bankAccount?: TeacherBankAccount;
}

export interface TeacherBankAccount {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  branchName?: string;
  panNumber?: string;
  upiId?: string;
}

export interface CollegeBankAccount {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  accountHolderName: string;
  availableBalance: number;
  treasuryCode: string;
  lastUpdated: string;
}

export interface SalaryDisbursementRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  empCode: string;
  designation: string;
  department: string;
  month: string; // e.g. "2026-08"
  baseSalary: number;
  presentDays: number;
  leaveDays: number;
  absentDays: number;
  holidays: number;
  deductions: number;
  netPayableAmount: number;
  disbursedAmount: number;
  disbursementDate: string;
  transactionRef: string;
  status: 'Approved_Disbursed' | 'Pending' | 'Rejected';
  collegeAccountDebited: string;
  teacherAccountCredited: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
  };
  approvedBy: string;
  payslipNumber: string;
  remarks?: string;
}

export interface PrincipalProfile {
  name: string;
  designation: string;
  department: string;
  age: number;
  dob: string;
  qualification: string;
  experienceYears: number;
  email: string;
  mobile: string;
  officeLocation: string;
  joiningDate: string;
  photoUrl: string;
  bio: string;
  achievements: string[];
}

export interface GeoLocationRecord {
  latitude: number;
  longitude: number;
  accuracy: number;
  distanceToCampusMeters: number;
  isInsideCampus: boolean;
  timestamp: string;
  deviceInfo?: string;
}

export type AttendanceStatusCode = 'P' | 'A' | 'L' | 'H'; // Present, Absent, Leave, Holiday

export interface TeacherDailyAttendance {
  id: string;
  teacherId: string;
  teacherName: string;
  empCode: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatusCode; // 'P' | 'A' | 'L' | 'H'
  inTime?: string;
  outTime?: string;
  geoRecord?: GeoLocationRecord;
  markedBy: 'self_geofenced' | 'principal_override' | 'biometric_sync';
  verifiedByPrincipal?: boolean;
  remarks?: string;
}

export interface MonthlyTeacherSalarySummary {
  teacherId: string;
  teacherName: string;
  empCode: string;
  department: string;
  designation: string;
  month: string; // e.g. "2026-08"
  totalDaysInMonth: number;
  workingDays: number;
  presentDays: number;
  leaveDays: number;
  absentDays: number;
  holidays: number;
  monthlyBaseSalary: number; // e.g. ₹30,000 or ₹78,500
  dailyRate: number; // Base / totalDays
  earnedSalaryToDate: number; // presentDays * dailyRate
  deductions: number; // absentDays * dailyRate
  netPayableSalary: number;
  status: 'Accruing' | 'Processed' | 'Disbursed';
}

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  rollNo: string;
  status: 'present' | 'absent' | 'late';
  geoRecord?: GeoLocationRecord;
}

export interface AttendanceSession {
  id: string;
  date: string;
  branch: string;
  semester: number;
  subject: string;
  records: AttendanceRecord[];
  presentCount: number;
  absentCount: number;
  percentage: number;
  markedBy: string;
}

export interface PaymentTransaction {
  id: string;
  receiptNo: string;
  amount: number;
  paymentDate: string;
  paymentMode: 'Online UPI' | 'Net Banking' | 'Cash' | 'Challan' | 'Debit Card';
  transactionRef: string;
  remarks: string;
  collectedBy: string;
}

export interface FeeRecord {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  branch: string;
  semester: number;
  academicYear: string;
  totalFee: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  paymentStatus: 'Paid' | 'Partial' | 'Pending';
  transactions: PaymentTransaction[];
}

export interface ExamSchedule {
  id: string;
  examName: string;
  branch: string;
  semester: number;
  subject: string;
  subjectCode: string;
  examDate: string;
  startTime: string;
  endTime: string;
  roomNo: string;
  maxMarks: number;
  examType: 'Mid Semester' | 'Final BTEUP' | 'Practical / Viva';
}

export interface SubjectMark {
  subjectCode: string;
  subjectName: string;
  theoryMax: number;
  theoryObtained: number;
  practicalMax: number;
  practicalObtained: number;
  totalMax: number;
  totalObtained: number;
  grade: string;
  gradePoint: number;
}

export interface StudentResult {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  enrollmentNo: string;
  branch: string;
  semester: number;
  examSession: string;
  marks: SubjectMark[];
  grandTotalMax: number;
  grandTotalObtained: number;
  percentage: number;
  cgpa: number;
  division: 'First Division with Distinction' | 'First Division' | 'Second Division' | 'Pass';
  status: 'PASS' | 'SUPPLEMENTARY' | 'FAIL';
}

export interface TimetableSlot {
  id: string;
  branch: string;
  semester: number;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  subject: string;
  subjectCode: string;
  teacherName: string;
  roomNo: string;
  type: 'Theory' | 'Practical Lab' | 'Tutorial';
}

export interface NoticeItem {
  id: string;
  title: string;
  content: string;
  category: 'Examination' | 'Fees' | 'Events' | 'Academic' | 'Holiday' | 'General';
  publishDate: string;
  priority: 'High' | 'Medium' | 'Low';
  targetAudience: 'All' | 'Students' | 'Teachers';
  issuedBy: string;
  referenceNo: string;
  attachmentName?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  shortCode: string;
  durationYears: number;
  totalSeats: number;
  activeStudents: number;
  facultyCount: number;
  hodName: string;
  labsCount: number;
  description: string;
  status: 'Active' | 'Under Review';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  time: string;
  read: boolean;
  targetRole?: Role;
  linkView?: string;
}

export interface CollegeSettings {
  collegeName: string;
  hindiName: string;
  tagline: string;
  code: string;
  bteupCode: string;
  aicteApproved: boolean;
  address: string;
  district: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  website: string;
  principalName: string;
  establishedYear: number;
  customLogoUrl?: string;
}

// -------------------------------------------------------------
// PUBLIC WEBSITE & CONTENT MANAGEMENT TYPES
// -------------------------------------------------------------

export interface FacilityPhoto {
  id?: number;
  image_url: string;
  caption: string;
  display_order?: number;
}

export interface Facility {
  id: number;
  title: string;
  category: string;
  cover_image: string;
  short_description: string;
  detailed_notes: string;
  equipment_list: string[];
  display_order: number;
  status: 'Draft' | 'Published';
  created_by?: string;
  photos?: FacilityPhoto[];
}

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  date?: string;
  uploaded_by?: string;
  status: 'Draft' | 'Published';
}

export interface ImportantLink {
  id: number;
  title: string;
  description: string;
  url: string;
  category: string;
  is_active: boolean;
  display_order: number;
}

export interface PublicFeeStructure {
  id: number;
  branch: string;
  academic_year: string;
  fee_type: string;
  amount: number;
  notes: string;
  effective_date?: string;
  is_published: boolean;
  display_order: number;
}

export interface AboutCollegeData {
  college_name: string;
  hindi_name?: string;
  bteup_code: string;
  aicte_approval: string;
  history: string;
  vision: string;
  mission: string;
  principal_name: string;
  principal_message: string;
  principal_photo: string;
  achievements: string[];
  key_highlights?: string[];
}

export interface CollegeLocationData {
  address: string;
  district: string;
  state: string;
  pincode: string;
  landmark: string;
  latitude: number;
  longitude: number;
  map_embed_url: string;
  map_view_url: string;
  directions_url: string;
  connectivity_bus: string;
  connectivity_train: string;
  contact_phone: string;
  contact_email: string;
}

export interface PublicHomePayload {
  college_name: string;
  bteup_code: string;
  aicte_approval: string;
  principal_name: string;
  principal_message: string;
  principal_photo: string;
  history_snippet: string;
  location?: CollegeLocationData;
  latest_notices: NoticeItem[];
  courses: Course[];
  featured_facilities: Facility[];
  gallery_preview: GalleryItem[];
  upcoming_exams: ExamSchedule[];
  important_links: ImportantLink[];
  public_fees: PublicFeeStructure[];
}

export interface StudentPortalAttendancePayload {
  student_name: string;
  roll_number: string;
  branch: string;
  semester: number;
  overall_percentage: number;
  is_exam_eligible: boolean;
  total_lectures: number;
  total_attended: number;
  subject_wise: {
    subject: string;
    present: number;
    total: number;
    percentage: number;
    is_eligible: boolean;
  }[];
  recent_logs: {
    id: number;
    date: string;
    subject: string;
    teacher: string;
    status: string;
    remarks: string;
  }[];
}

export interface LiveActivityItem {
  id: string;
  type: 'notice' | 'attendance' | 'fee' | 'salary' | 'treasury' | 'student' | 'exam' | 'course' | 'general';
  message: string;
  detail?: string;
  timestamp: string;
}

