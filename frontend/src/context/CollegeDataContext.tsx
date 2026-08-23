import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Teacher,
  FeeRecord,
  ExamSchedule,
  StudentResult,
  TimetableSlot,
  NoticeItem,
  Course,
  CollegeSettings,
  NotificationItem,
  AttendanceSession,
  PaymentTransaction,
  TeacherDailyAttendance,
  MonthlyTeacherSalarySummary,
  GeoLocationRecord,
  AttendanceStatusCode,
  CollegeBankAccount,
  TeacherBankAccount,
  SalaryDisbursementRecord,
  LiveActivityItem
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_COURSES,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_FEES,
  INITIAL_EXAMS,
  INITIAL_RESULTS,
  INITIAL_TIMETABLE,
  INITIAL_NOTICES,
  INITIAL_NOTIFICATIONS,
  INITIAL_TEACHER_ATTENDANCE,
  INITIAL_COLLEGE_BANK_ACCOUNT,
  INITIAL_SALARY_DISBURSEMENTS
} from '../data/mockData';
import { generateReceiptNumber } from '../utils/helpers';

// API Services
import { studentService } from '../services/studentService';
import { teacherService } from '../services/teacherService';
import { courseService } from '../services/courseService';
import { attendanceService } from '../services/attendanceService';
import { feeService } from '../services/feeService';
import { examService } from '../services/examService';
import { timetableService } from '../services/timetableService';
import { noticeService } from '../services/noticeService';
import { settingsService } from '../services/settingsService';

interface CollegeDataContextType {
  // Data lists
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  fees: FeeRecord[];
  exams: ExamSchedule[];
  results: StudentResult[];
  timetable: TimetableSlot[];
  notices: NoticeItem[];
  notifications: NotificationItem[];
  settings: CollegeSettings;
  attendanceSessions: AttendanceSession[];
  teacherAttendance: TeacherDailyAttendance[];
  principalTodayAttendance: { date: string; status: AttendanceStatusCode; inTime?: string; geoRecord?: GeoLocationRecord };
  collegeBankAccount: CollegeBankAccount;
  salaryDisbursements: SalaryDisbursementRecord[];
  isLoading: boolean;

  // Student CRUD
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;

  // Teacher CRUD & Payroll
  addTeacher: (teacher: Omit<Teacher, 'id'>) => Promise<void>;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  markTeacherAttendance: (
    teacherId: string,
    date: string,
    status: AttendanceStatusCode,
    geoRecord?: GeoLocationRecord,
    markedBy?: 'self_geofenced' | 'principal_override' | 'biometric_sync',
    remarks?: string
  ) => void;
  calculateTeacherMonthlySalary: (teacherId: string, monthStr: string) => MonthlyTeacherSalarySummary;
  markPrincipalTodayAttendance: (status: AttendanceStatusCode, geoRecord?: GeoLocationRecord) => void;
  updateCollegeBankAccount: (data: Partial<CollegeBankAccount>) => void;
  updateTeacherBankDetails: (teacherId: string, bankDetails: TeacherBankAccount) => void;
  disburseTeacherSalary: (teacherId: string, month: string, remarks?: string) => Promise<SalaryDisbursementRecord>;
  disburseAllMonthlySalaries: (month: string) => Promise<SalaryDisbursementRecord[]>;

  // Course CRUD
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;

  // Fee CRUD
  addPayment: (feeId: string, payment: Omit<PaymentTransaction, 'id' | 'receiptNo'>) => Promise<PaymentTransaction>;
  addFeeRecord: (fee: Omit<FeeRecord, 'id' | 'receiptNo'>) => void;

  // Attendance
  saveAttendance: (session: Omit<AttendanceSession, 'id'>) => Promise<void>;

  // Exam & Result CRUD
  addExam: (exam: Omit<ExamSchedule, 'id'>) => Promise<void>;
  updateExam: (id: string, exam: Partial<ExamSchedule>) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  updateResult: (id: string, result: Partial<StudentResult>) => void;

  // Timetable
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => Promise<void>;
  deleteTimetableSlot: (id: string) => Promise<void>;

  // Notice CRUD
  addNotice: (notice: Omit<NoticeItem, 'id'>) => Promise<void>;
  updateNotice: (id: string, notice: Partial<NoticeItem>) => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'time' | 'read'>) => void;

  // Real-Time Live Sync & Activity Stream
  lastLiveSyncTime: Date;
  liveActivityLog: LiveActivityItem[];
  dismissLiveActivity: (id: string) => void;
  broadcastLiveEvent: (type: LiveActivityItem['type'], message: string, detail?: string) => void;

  // Settings
  updateSettings: (newSettings: Partial<CollegeSettings>) => Promise<void>;
  resetAllData: () => void;
  refreshFromApi: () => Promise<void>;
}

const CollegeDataContext = createContext<CollegeDataContextType | undefined>(undefined);

export const CollegeDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loadState = <T,>(key: string, defaultVal: T): T => {
    const saved = localStorage.getItem(`gpb_portal_${key}`);
    if (saved) {
      try {
        let str = saved;
        // Purge old stale names in cached local storage
        if (str.includes('Bansdeeh') || str.includes('Ballia') || str.includes('बांसडीह') || str.includes('बलिया')) {
          str = str.replace(/Bansdeeh/gi, '').replace(/Ballia/gi, '').replace(/बांसडीह/g, '').replace(/बलिया/g, '');
        }
        const parsed = JSON.parse(str);
        if (Array.isArray(defaultVal) && !Array.isArray(parsed)) {
          return defaultVal;
        }
        return parsed;
      } catch (e) {
        console.error(`Error parsing state for ${key}:`, e);
      }
    }
    return defaultVal;
  };

  const [students, setStudents] = useState<Student[]>(() => loadState('students', INITIAL_STUDENTS));
  const [teachers, setTeachers] = useState<Teacher[]>(() => loadState('teachers', INITIAL_TEACHERS));
  const [courses, setCourses] = useState<Course[]>(() => loadState('courses', INITIAL_COURSES));
  const [fees, setFees] = useState<FeeRecord[]>(() => loadState('fees', INITIAL_FEES));
  const [exams, setExams] = useState<ExamSchedule[]>(() => loadState('exams', INITIAL_EXAMS));
  const [results, setResults] = useState<StudentResult[]>(() => loadState('results', INITIAL_RESULTS));
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => loadState('timetable', INITIAL_TIMETABLE));
  const [notices, setNotices] = useState<NoticeItem[]>(() => loadState('notices', INITIAL_NOTICES));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadState('notifications', INITIAL_NOTIFICATIONS));
  const [settings, setSettings] = useState<CollegeSettings>(() => {
    const raw = loadState('settings', INITIAL_SETTINGS);
    const cleaned: CollegeSettings = {
      ...raw,
      collegeName: 'GOVERNMENT POLYTECHNIC',
      hindiName: 'राजकीय पॉलिटेक्निक',
      principalName: 'Er. Sachin Maurya',
      address: 'Polytechnic Campus, Uttar Pradesh - 277202',
      district: 'Uttar Pradesh',
      email: 'principal.polytechnic@gmail.com',
      website: 'https://polytechnic.up.gov.in'
    };
    try {
      localStorage.setItem('gpb_portal_settings', JSON.stringify(cleaned));
    } catch (e) {}
    return cleaned;
  });
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>(() => loadState('attendance_sessions', []));
  const [teacherAttendance, setTeacherAttendance] = useState<TeacherDailyAttendance[]>(() => loadState('teacher_attendance', INITIAL_TEACHER_ATTENDANCE));
  const [principalTodayAttendance, setPrincipalTodayAttendance] = useState<{ date: string; status: AttendanceStatusCode; inTime?: string; geoRecord?: GeoLocationRecord }>(() =>
    loadState('principal_attendance', {
      date: new Date().toISOString().slice(0, 10),
      status: 'P',
      inTime: '09:05 AM',
      geoRecord: {
        latitude: 25.86472,
        longitude: 84.22153,
        accuracy: 5.0,
        distanceToCampusMeters: 8,
        isInsideCampus: true,
        timestamp: new Date().toISOString(),
        deviceInfo: 'Principal Official Terminal (GPB In-Campus)'
      }
    })
  );
  const [collegeBankAccount, setCollegeBankAccount] = useState<CollegeBankAccount>(() =>
    loadState('college_bank_account', INITIAL_COLLEGE_BANK_ACCOUNT)
  );
  const [salaryDisbursements, setSalaryDisbursements] = useState<SalaryDisbursementRecord[]>(() =>
    loadState('salary_disbursements', INITIAL_SALARY_DISBURSEMENTS)
  );
  const [isLoading, setIsLoading] = useState(false);

  // Sync to localStorage as offline cache
  useEffect(() => { localStorage.setItem('gpb_portal_students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('gpb_portal_teachers', JSON.stringify(teachers)); }, [teachers]);
  useEffect(() => { localStorage.setItem('gpb_portal_courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('gpb_portal_fees', JSON.stringify(fees)); }, [fees]);
  useEffect(() => { localStorage.setItem('gpb_portal_exams', JSON.stringify(exams)); }, [exams]);
  useEffect(() => { localStorage.setItem('gpb_portal_results', JSON.stringify(results)); }, [results]);
  useEffect(() => { localStorage.setItem('gpb_portal_timetable', JSON.stringify(timetable)); }, [timetable]);
  useEffect(() => { localStorage.setItem('gpb_portal_notices', JSON.stringify(notices)); }, [notices]);
  useEffect(() => { localStorage.setItem('gpb_portal_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('gpb_portal_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('gpb_portal_attendance_sessions', JSON.stringify(attendanceSessions)); }, [attendanceSessions]);
  useEffect(() => { localStorage.setItem('gpb_portal_teacher_attendance', JSON.stringify(teacherAttendance)); }, [teacherAttendance]);
  useEffect(() => { localStorage.setItem('gpb_portal_principal_attendance', JSON.stringify(principalTodayAttendance)); }, [principalTodayAttendance]);
  useEffect(() => { localStorage.setItem('gpb_portal_college_bank_account', JSON.stringify(collegeBankAccount)); }, [collegeBankAccount]);
  useEffect(() => { localStorage.setItem('gpb_portal_salary_disbursements', JSON.stringify(salaryDisbursements)); }, [salaryDisbursements]);

  // Initial fetch from backend API if available
  const refreshFromApi = async () => {
    try {
      setIsLoading(true);
      const [apiStudents, apiTeachers, apiCourses, apiNotices] = await Promise.allSettled([
        studentService.getAll(),
        teacherService.getAll(),
        courseService.getAll(),
        noticeService.getAll(),
      ]);

      if (apiStudents.status === 'fulfilled' && Array.isArray(apiStudents.value) && apiStudents.value.length > 0) {
        setStudents(apiStudents.value);
      }
      if (apiTeachers.status === 'fulfilled' && Array.isArray(apiTeachers.value) && apiTeachers.value.length > 0) {
        setTeachers(apiTeachers.value);
      }
      if (apiCourses.status === 'fulfilled' && Array.isArray(apiCourses.value) && apiCourses.value.length > 0) {
        setCourses(apiCourses.value);
      }
      if (apiNotices.status === 'fulfilled' && Array.isArray(apiNotices.value) && apiNotices.value.length > 0) {
        setNotices(apiNotices.value);
      }
    } catch (e) {
      console.warn('Backend API refresh silent catch, keeping local state:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const [lastLiveSyncTime, setLastLiveSyncTime] = useState<Date>(new Date());
  const [liveActivityLog, setLiveActivityLog] = useState<LiveActivityItem[]>(() => [
    {
      id: 'act-init',
      type: 'general',
      message: 'Real-Time College Data Gateway Active',
      detail: 'Government Polytechnic Live Hub',
      timestamp: 'Just now'
    }
  ]);

  const dismissLiveActivity = (id: string) => {
    setLiveActivityLog(prev => prev.filter(item => item.id !== id));
  };

  const broadcastLiveEvent = (
    type: LiveActivityItem['type'],
    message: string,
    detail?: string
  ) => {
    const newActivity: LiveActivityItem = {
      id: `live-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      message,
      detail,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setLiveActivityLog(prev => [newActivity, ...prev.slice(0, 6)]);
    setLastLiveSyncTime(new Date());

    // Broadcast across other browser tabs/windows
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('gpb_realtime_broadcast_channel');
        channel.postMessage({
          type: 'LIVE_DATA_PULSE',
          activity: newActivity,
          timestamp: new Date().toISOString()
        });
        channel.close();
      }
    } catch (err) {
      console.warn('BroadcastChannel sync note:', err);
    }
  };

  // Cross-Tab Live Synchronization Listener
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;

    const channel = new BroadcastChannel('gpb_realtime_broadcast_channel');
    channel.onmessage = (event) => {
      if (event.data?.type === 'LIVE_DATA_PULSE') {
        // Re-read updated state from localStorage
        setStudents(loadState('students', INITIAL_STUDENTS));
        setTeachers(loadState('teachers', INITIAL_TEACHERS));
        setCourses(loadState('courses', INITIAL_COURSES));
        setFees(loadState('fees', INITIAL_FEES));
        setExams(loadState('exams', INITIAL_EXAMS));
        setResults(loadState('results', INITIAL_RESULTS));
        setTimetable(loadState('timetable', INITIAL_TIMETABLE));
        setNotices(loadState('notices', INITIAL_NOTICES));
        setNotifications(loadState('notifications', INITIAL_NOTIFICATIONS));
        setSettings(loadState('settings', INITIAL_SETTINGS));
        setAttendanceSessions(loadState('attendance_sessions', []));
        setTeacherAttendance(loadState('teacher_attendance', INITIAL_TEACHER_ATTENDANCE));
        setCollegeBankAccount(loadState('college_bank_account', INITIAL_COLLEGE_BANK_ACCOUNT));
        setSalaryDisbursements(loadState('salary_disbursements', INITIAL_SALARY_DISBURSEMENTS));

        setLastLiveSyncTime(new Date());
        if (event.data?.activity) {
          setLiveActivityLog(prev => [event.data.activity, ...prev.slice(0, 6)]);
        }
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  useEffect(() => {
    refreshFromApi();
  }, []);

  // Student Actions
  const addStudent = async (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now().toString(36)}`
    };
    setStudents(prev => [newStudent, ...prev]);

    // Also auto create fee record for new student
    const newFeeRecord: FeeRecord = {
      id: `fee-${Date.now().toString(36)}`,
      receiptNo: generateReceiptNumber(),
      studentId: newStudent.id,
      studentName: newStudent.name,
      rollNo: newStudent.rollNo,
      branch: newStudent.branch,
      semester: newStudent.semester,
      academicYear: '2025-2026',
      totalFee: 12450,
      paidAmount: 0,
      pendingAmount: 12450,
      dueDate: '2026-04-30',
      paymentStatus: 'Pending',
      transactions: []
    };
    setFees(prev => [newFeeRecord, ...prev]);

    addNotification({
      title: 'New Student Admitted',
      message: `${newStudent.name} (${newStudent.rollNo}) admitted to ${newStudent.branch}.`,
      type: 'success',
      linkView: 'students'
    });

    try {
      await studentService.create(studentData);
    } catch (e) {
      console.warn('Student saved locally:', e);
    }
  };

  const updateStudent = async (id: string, updatedData: Partial<Student>) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...updatedData } : s)));
    try {
      await studentService.update(id, updatedData);
    } catch (e) {
      console.warn('Student updated locally:', e);
    }
  };

  const deleteStudent = async (id: string) => {
    const student = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    if (student) {
      addNotification({
        title: 'Student Record Removed',
        message: `Student record of ${student.name} was removed.`,
        type: 'warning',
        linkView: 'students'
      });
    }
    try {
      await studentService.delete(id);
    } catch (e) {
      console.warn('Student deleted locally:', e);
    }
  };

  // Teacher Actions
  const addTeacher = async (teacherData: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: `fac-${Date.now().toString(36)}`
    };
    setTeachers(prev => [newTeacher, ...prev]);
    addNotification({
      title: 'New Faculty Appointed',
      message: `${newTeacher.name} appointed to Department of ${newTeacher.department}.`,
      type: 'success',
      linkView: 'teachers'
    });
    try {
      await teacherService.create(teacherData);
    } catch (e) {
      console.warn('Teacher saved locally:', e);
    }
  };

  const updateTeacher = async (id: string, updatedData: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => (t.id === id ? { ...t, ...updatedData } : t)));
    try {
      await teacherService.update(id, updatedData);
    } catch (e) {
      console.warn('Teacher updated locally:', e);
    }
  };

  const deleteTeacher = async (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    try {
      await teacherService.delete(id);
    } catch (e) {
      console.warn('Teacher deleted locally:', e);
    }
  };

  // Course Actions
  const addCourse = async (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now().toString(36)}`
    };
    setCourses(prev => [...prev, newCourse]);
    try {
      await courseService.create(courseData);
    } catch (e) {
      console.warn('Course created locally:', e);
    }
  };

  const updateCourse = async (id: string, updatedData: Partial<Course>) => {
    setCourses(prev => prev.map(c => (c.id === id ? { ...c, ...updatedData } : c)));
    try {
      await courseService.update(id, updatedData);
    } catch (e) {
      console.warn('Course updated locally:', e);
    }
  };

  const deleteCourse = async (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    try {
      await courseService.delete(id);
    } catch (e) {
      console.warn('Course deleted locally:', e);
    }
  };

  // Fee Actions
  const addPayment = async (feeId: string, paymentData: Omit<PaymentTransaction, 'id' | 'receiptNo'>): Promise<PaymentTransaction> => {
    const receiptNo = generateReceiptNumber();
    const newTx: PaymentTransaction = {
      ...paymentData,
      id: `tx-${Date.now().toString(36)}`,
      receiptNo
    };

    setFees(prev =>
      prev.map(f => {
        if (f.id === feeId) {
          const newPaid = f.paidAmount + paymentData.amount;
          const newPending = Math.max(0, f.totalFee - newPaid);
          const newStatus = newPending === 0 ? 'Paid' : newPaid > 0 ? 'Partial' : 'Pending';

          setStudents(stdPrev =>
            stdPrev.map(s => (s.id === f.studentId ? { ...s, feeStatus: newStatus } : s))
          );

          return {
            ...f,
            paidAmount: newPaid,
            pendingAmount: newPending,
            paymentStatus: newStatus,
            transactions: [newTx, ...f.transactions]
          };
        }
        return f;
      })
    );

    addNotification({
      title: 'Fee Payment Received',
      message: `Payment of ₹${paymentData.amount} received (Receipt: ${receiptNo}).`,
      type: 'success',
      linkView: 'fees'
    });

    try {
      await feeService.recordPayment(feeId, paymentData);
    } catch (e) {
      console.warn('Fee payment recorded locally:', e);
    }

    return newTx;
  };

  const addFeeRecord = (feeData: Omit<FeeRecord, 'id' | 'receiptNo'>) => {
    const newFee: FeeRecord = {
      ...feeData,
      id: `fee-${Date.now().toString(36)}`,
      receiptNo: generateReceiptNumber()
    };
    setFees(prev => [newFee, ...prev]);
  };

  // Attendance Actions
  const saveAttendance = async (sessionData: Omit<AttendanceSession, 'id'>) => {
    const newSession: AttendanceSession = {
      ...sessionData,
      id: `att-${Date.now().toString(36)}`
    };
    setAttendanceSessions(prev => [newSession, ...prev]);

    setStudents(prev =>
      prev.map(s => {
        const record = sessionData.records.find(r => r.studentId === s.id);
        if (record) {
          const currentP = s.attendancePercentage;
          const newP = record.status === 'present' ? Math.min(100, currentP + 1) : Math.max(30, currentP - 2);
          return { ...s, attendancePercentage: newP };
        }
        return s;
      })
    );

    addNotification({
      title: 'Attendance Recorded',
      message: `Marked attendance for ${sessionData.branch} Sem-${sessionData.semester} (${sessionData.percentage}% Present).`,
      type: 'info',
      linkView: 'attendance'
    });

    try {
      await attendanceService.markAttendance(sessionData);
    } catch (e) {
      console.warn('Attendance marked locally:', e);
    }
  };

  const markTeacherAttendance = (
    teacherId: string,
    date: string,
    status: AttendanceStatusCode,
    geoRecord?: GeoLocationRecord,
    markedBy: 'self_geofenced' | 'principal_override' | 'biometric_sync' = 'self_geofenced',
    remarks?: string
  ) => {
    const teacher = teachers.find(t => t.id === teacherId);
    const existingIndex = teacherAttendance.findIndex(
      r => r.teacherId === teacherId && r.date === date
    );

    const updatedRecord: TeacherDailyAttendance = {
      id: existingIndex >= 0 ? teacherAttendance[existingIndex].id : `att-${teacherId}-${date}`,
      teacherId,
      teacherName: teacher?.name || 'Staff Member',
      empCode: teacher?.empCode || 'FAC-00',
      date,
      status,
      inTime: status === 'P' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
      outTime: status === 'P' ? '04:45 PM' : '-',
      geoRecord,
      markedBy,
      verifiedByPrincipal: markedBy === 'principal_override' || markedBy === 'biometric_sync',
      remarks
    };

    if (existingIndex >= 0) {
      setTeacherAttendance(prev => {
        const copy = [...prev];
        copy[existingIndex] = updatedRecord;
        return copy;
      });
    } else {
      setTeacherAttendance(prev => [...prev, updatedRecord]);
    }

    if (markedBy === 'principal_override') {
      broadcastLiveEvent('attendance', `Principal updated attendance for ${teacher?.name} to '${status}'`, `${date}`);
      addNotification({
        title: 'Faculty Attendance Updated',
        message: `Principal updated attendance for ${teacher?.name} on ${date} to status '${status}'.`,
        type: 'info',
        linkView: 'attendance'
      });
    } else {
      broadcastLiveEvent('attendance', `${teacher?.name || 'Faculty'} punched attendance: ${status}`, `${date} • Geo-verified`);
    }
  };

  const markPrincipalTodayAttendance = (
    status: AttendanceStatusCode,
    geoRecord?: GeoLocationRecord
  ) => {
    const today = new Date().toISOString().slice(0, 10);
    setPrincipalTodayAttendance({
      date: today,
      status,
      inTime: status === 'P' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
      geoRecord
    });
    broadcastLiveEvent('attendance', `Principal Attendance Logged: ${status}`, `GPB 50m Geo-Fenced (${today})`);
    addNotification({
      title: 'Principal Campus Attendance Logged',
      message: `Principal Er. Sachin Maurya attendance recorded as '${status}' on ${today}.`,
      type: 'success',
      linkView: 'attendance'
    });
  };

  const calculateTeacherMonthlySalary = (
    teacherId: string,
    monthStr: string = '2026-08'
  ): MonthlyTeacherSalarySummary => {
    const teacher = teachers.find(t => t.id === teacherId);
    const monthlyBase = teacher?.salary || 78500;

    const [yStr, mStr] = monthStr.split('-');
    const year = parseInt(yStr);
    const month = parseInt(mStr);
    const totalDaysInMonth = new Date(year, month, 0).getDate();

    // Filter attendance records for this teacher in this month
    const records = teacherAttendance.filter(
      r => r.teacherId === teacherId && r.date.startsWith(monthStr)
    );

    let presentDays = 0;
    let leaveDays = 0;
    let absentDays = 0;
    let holidays = 0;

    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dStr = `${monthStr}-${String(d).padStart(2, '0')}`;
      const rec = records.find(r => r.date === dStr);
      const isSun = new Date(year, month - 1, d).getDay() === 0;

      if (rec) {
        if (rec.status === 'P') presentDays++;
        else if (rec.status === 'L') leaveDays++;
        else if (rec.status === 'A') absentDays++;
        else if (rec.status === 'H') holidays++;
      } else {
        if (isSun) holidays++;
        else absentDays++; // Default untracked future days or absent
      }
    }

    const workingDays = totalDaysInMonth - holidays;
    const dailyRate = Math.round(monthlyBase / totalDaysInMonth);
    const payableDays = presentDays + leaveDays + holidays; // Govt norms: paid Sundays + Leave
    const earnedSalaryToDate = Math.min(monthlyBase, payableDays * dailyRate);
    const deductions = Math.max(0, absentDays * dailyRate);
    const netPayableSalary = Math.max(0, monthlyBase - deductions);

    return {
      teacherId,
      teacherName: teacher?.name || 'Staff Member',
      empCode: teacher?.empCode || 'FAC-00',
      department: teacher?.department || 'General',
      designation: teacher?.designation || 'Lecturer',
      month: monthStr,
      totalDaysInMonth,
      workingDays,
      presentDays,
      leaveDays,
      absentDays,
      holidays,
      monthlyBaseSalary: monthlyBase,
      dailyRate,
      earnedSalaryToDate,
      deductions,
      netPayableSalary,
      status: 'Accruing'
    };
  };

  // College Treasury Bank Account Actions
  const updateCollegeBankAccount = (data: Partial<CollegeBankAccount>) => {
    const newBal = data.availableBalance ?? collegeBankAccount.availableBalance;
    setCollegeBankAccount(prev => ({
      ...prev,
      ...data,
      lastUpdated: new Date().toISOString().slice(0, 10)
    }));
    broadcastLiveEvent('treasury', `College Treasury Balance Updated: ₹${newBal.toLocaleString('en-IN')}`, 'Govt Polytechnic Institutional Account');
    addNotification({
      title: 'College Bank Treasury Updated',
      message: `Updated ${collegeBankAccount.bankName} Account balance: ₹${newBal.toLocaleString('en-IN')}`,
      type: 'success',
      linkView: 'payroll'
    });
  };

  // Teacher Bank Account Actions
  const updateTeacherBankDetails = (teacherId: string, bankDetails: TeacherBankAccount) => {
    setTeachers(prev =>
      prev.map(t => (t.id === teacherId ? { ...t, bankAccount: bankDetails } : t))
    );
    const teacher = teachers.find(t => t.id === teacherId);
    broadcastLiveEvent('salary', `Bank Linked for ${teacher?.name}`, `${bankDetails.bankName} (A/C: ${bankDetails.accountNumber.slice(-4).padStart(bankDetails.accountNumber.length, '•')})`);
    addNotification({
      title: 'Faculty Bank Details Linked',
      message: `Bank account for ${teacher?.name} linked: ${bankDetails.bankName} (A/C: ${bankDetails.accountNumber.slice(-4).padStart(bankDetails.accountNumber.length, '•')})`,
      type: 'info',
      linkView: 'payroll'
    });
  };

  // Salary Disbursal Actions
  const disburseTeacherSalary = async (
    teacherId: string,
    monthStr: string = '2026-08',
    remarks?: string
  ): Promise<SalaryDisbursementRecord> => {
    const teacher = teachers.find(t => t.id === teacherId);
    const salarySummary = calculateTeacherMonthlySalary(teacherId, monthStr);
    const netAmount = salarySummary.netPayableSalary;

    const teacherBank = teacher?.bankAccount || {
      bankName: 'State Bank of India',
      accountNumber: '30481920491',
      ifscCode: 'SBIN0004412',
      accountHolderName: teacher?.name || 'Staff Member'
    };

    const dateSuffix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const transactionRef = `TRX-SAL-${dateSuffix}-${randCode}`;
    const payslipNumber = `GPB/PAY/${monthStr.replace('-', '/')}/${String(salaryDisbursements.length + 1).padStart(3, '0')}`;

    const newRecord: SalaryDisbursementRecord = {
      id: `sal-disb-${teacherId}-${monthStr}`,
      teacherId,
      teacherName: teacher?.name || 'Staff Member',
      empCode: teacher?.empCode || 'FAC-00',
      designation: teacher?.designation || 'Lecturer',
      department: teacher?.department || 'General',
      month: monthStr,
      baseSalary: salarySummary.monthlyBaseSalary,
      presentDays: salarySummary.presentDays,
      leaveDays: salarySummary.leaveDays,
      absentDays: salarySummary.absentDays,
      holidays: salarySummary.holidays,
      deductions: salarySummary.deductions,
      netPayableAmount: netAmount,
      disbursedAmount: netAmount,
      disbursementDate: new Date().toISOString().slice(0, 10),
      transactionRef,
      status: 'Approved_Disbursed',
      collegeAccountDebited: `${collegeBankAccount.bankName} (A/C: ${collegeBankAccount.accountNumber})`,
      teacherAccountCredited: {
        bankName: teacherBank.bankName,
        accountNumber: teacherBank.accountNumber,
        ifscCode: teacherBank.ifscCode
      },
      approvedBy: 'Er. Sachin Maurya (Principal)',
      payslipNumber,
      remarks: remarks || `Monthly salary for ${monthStr} approved and disbursed by Principal Er. Sachin Maurya.`
    };

    // 1. Deduct from college treasury balance
    setCollegeBankAccount(prev => ({
      ...prev,
      availableBalance: Math.max(0, prev.availableBalance - netAmount),
      lastUpdated: new Date().toISOString().slice(0, 10)
    }));

    // 2. Add / replace disbursement record
    setSalaryDisbursements(prev => {
      const filtered = prev.filter(r => !(r.teacherId === teacherId && r.month === monthStr));
      return [newRecord, ...filtered];
    });

    broadcastLiveEvent('salary', `Salary Disbursed: ₹${netAmount.toLocaleString('en-IN')} to ${teacher?.name}`, `Ref: ${transactionRef}`);
    addNotification({
      title: 'Salary Transferred Successfully',
      message: `₹${netAmount.toLocaleString('en-IN')} transferred to ${teacher?.name} (${teacherBank.bankName} A/C). Ref: ${transactionRef}`,
      type: 'success',
      linkView: 'payroll'
    });

    return newRecord;
  };

  const disburseAllMonthlySalaries = async (monthStr: string = '2026-08'): Promise<SalaryDisbursementRecord[]> => {
    const results: SalaryDisbursementRecord[] = [];
    for (const teacher of teachers) {
      const alreadyDisbursed = salaryDisbursements.some(
        r => r.teacherId === teacher.id && r.month === monthStr && r.status === 'Approved_Disbursed'
      );
      if (!alreadyDisbursed) {
        const record = await disburseTeacherSalary(teacher.id, monthStr, `Batch end-of-month salary disbursement approved by Principal.`);
        results.push(record);
      }
    }
    return results;
  };

  // Exam Actions
  const addExam = async (examData: Omit<ExamSchedule, 'id'>) => {
    const newExam: ExamSchedule = {
      ...examData,
      id: `exam-${Date.now().toString(36)}`
    };
    setExams(prev => [...prev, newExam]);
    addNotification({
      title: 'Exam Scheduled',
      message: `${newExam.examName} scheduled for ${newExam.subject} on ${newExam.examDate}.`,
      type: 'info',
      linkView: 'examination'
    });
    try {
      await examService.createSchedule(examData);
    } catch (e) {
      console.warn('Exam scheduled locally:', e);
    }
  };

  const updateExam = async (id: string, updatedData: Partial<ExamSchedule>) => {
    setExams(prev => prev.map(e => (e.id === id ? { ...e, ...updatedData } : e)));
    try {
      await examService.updateSchedule(id, updatedData);
    } catch (e) {
      console.warn('Exam updated locally:', e);
    }
  };

  const deleteExam = async (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
    try {
      await examService.deleteSchedule(id);
    } catch (e) {
      console.warn('Exam deleted locally:', e);
    }
  };

  const updateResult = (id: string, updatedData: Partial<StudentResult>) => {
    setResults(prev => prev.map(r => (r.id === id ? { ...r, ...updatedData } : r)));
  };

  // Timetable Actions
  const addTimetableSlot = async (slotData: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = {
      ...slotData,
      id: `tt-${Date.now().toString(36)}`
    };
    setTimetable(prev => [...prev, newSlot]);
    try {
      await timetableService.create(slotData);
    } catch (e) {
      console.warn('Timetable slot added locally:', e);
    }
  };

  const deleteTimetableSlot = async (id: string) => {
    setTimetable(prev => prev.filter(t => t.id !== id));
    try {
      await timetableService.delete(id);
    } catch (e) {
      console.warn('Timetable slot deleted locally:', e);
    }
  };

  // Notice Actions
  const addNotice = async (noticeData: Omit<NoticeItem, 'id'>) => {
    const newNotice: NoticeItem = {
      ...noticeData,
      id: `not-${Date.now().toString(36)}`
    };
    setNotices(prev => [newNotice, ...prev]);
    broadcastLiveEvent('notice', `New Notice: ${newNotice.title}`, newNotice.category);
    addNotification({
      title: 'New Notice Published',
      message: `${newNotice.title} has been posted.`,
      type: 'info',
      linkView: 'notices'
    });
    try {
      await noticeService.create(noticeData);
    } catch (e) {
      console.warn('Notice created locally:', e);
    }
  };

  const updateNotice = async (id: string, updatedData: Partial<NoticeItem>) => {
    setNotices(prev => prev.map(n => (n.id === id ? { ...n, ...updatedData } : n)));
    try {
      await noticeService.update(id, updatedData);
    } catch (e) {
      console.warn('Notice updated locally:', e);
    }
  };

  const deleteNotice = async (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
    try {
      await noticeService.delete(id);
    } catch (e) {
      console.warn('Notice deleted locally:', e);
    }
  };

  // Notification Actions
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (notifData: Omit<NotificationItem, 'id' | 'time' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notifData,
      id: `nt-${Date.now().toString(36)}`,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Settings Actions
  const updateSettings = async (newSettings: Partial<CollegeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    try {
      await settingsService.updateSettings(newSettings);
    } catch (e) {
      console.warn('Settings updated locally:', e);
    }
  };

  const resetAllData = () => {
    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setCourses(INITIAL_COURSES);
    setFees(INITIAL_FEES);
    setExams(INITIAL_EXAMS);
    setResults(INITIAL_RESULTS);
    setTimetable(INITIAL_TIMETABLE);
    setNotices(INITIAL_NOTICES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_SETTINGS);
    setAttendanceSessions([]);
    localStorage.clear();
  };

  return (
    <CollegeDataContext.Provider
      value={{
        students,
        teachers,
        courses,
        fees,
        exams,
        results,
        timetable,
        notices,
        notifications,
        settings,
        attendanceSessions,
        teacherAttendance,
        principalTodayAttendance,
        collegeBankAccount,
        salaryDisbursements,
        isLoading,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        markTeacherAttendance,
        calculateTeacherMonthlySalary,
        markPrincipalTodayAttendance,
        updateCollegeBankAccount,
        updateTeacherBankDetails,
        disburseTeacherSalary,
        disburseAllMonthlySalaries,
        addCourse,
        updateCourse,
        deleteCourse,
        addPayment,
        addFeeRecord,
        saveAttendance,
        addExam,
        updateExam,
        deleteExam,
        updateResult,
        addTimetableSlot,
        deleteTimetableSlot,
        addNotice,
        updateNotice,
        deleteNotice,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        updateSettings,
        resetAllData,
        refreshFromApi,
        lastLiveSyncTime,
        liveActivityLog,
        dismissLiveActivity,
        broadcastLiveEvent
      }}
    >
      {children}
    </CollegeDataContext.Provider>
  );
};

export const useCollegeData = () => {
  const context = useContext(CollegeDataContext);
  if (!context) {
    throw new Error('useCollegeData must be used within a CollegeDataProvider');
  }
  return context;
};
