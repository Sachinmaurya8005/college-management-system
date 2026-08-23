import React, { useState } from 'react';
import {
  CheckCircle2,
  Award,
  CreditCard,
  Calendar,
  Clock,
  BookOpen,
  FileText,
  AlertTriangle,
  Sparkles,
  Download,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCollegeData } from '../../context/CollegeDataContext';
import { StatCard } from '../common/StatCard';
import { formatCurrencyINR, formatDate } from '../../utils/helpers';

import { PrincipalProfileModal } from '../common/PrincipalProfileModal';
import { PRINCIPAL_DETAILS } from '../../data/mockData';

interface StudentDashboardProps {
  onNavigate: (view: string, metadata?: any) => void;
  onOpenReceipt: (feeId: string) => void;
  onOpenMarksheet: (resId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigate,
  onOpenReceipt,
  onOpenMarksheet
}) => {
  const { user } = useAuth();
  const { students, fees, results, exams, timetable, notices } = useCollegeData();
  const [isPrincipalModalOpen, setIsPrincipalModalOpen] = useState(false);

  // Find active student data strictly mapped to logged-in user
  const currentStudent =
    students.find(
      s => (user?.rollNo && s.rollNo.toLowerCase() === user.rollNo.toLowerCase()) ||
           (user?.email && s.email.toLowerCase() === user.email.toLowerCase()) ||
           (user?.name && s.name.toLowerCase() === user.name.toLowerCase())
    ) || {
      id: 'std-current',
      studentId: 'std-001',
      rollNo: user?.rollNo || 'E224412355001',
      enrollmentNo: user?.rollNo || '224412001',
      name: user?.name || 'Rahul Verma',
      fatherName: 'Shri Ramakant Verma',
      motherName: 'Smt. Shanti Devi',
      dob: '2004-05-14',
      gender: 'Male',
      mobile: '+91 98381 23450',
      email: user?.email || 'student@polytechnic.edu',
      address: 'Uttar Pradesh (U.P.) - 277202',
      branch: user?.branch || 'Computer Science & Engineering',
      semester: user?.semester || 4,
      admissionYear: 2023,
      category: 'OBC',
      bloodGroup: 'B+',
      status: 'Active',
      photoUrl: user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop',
      attendancePercentage: 88.5,
      feeStatus: 'Paid'
    };

  const studentFee = fees.find(
    f => (user?.rollNo && f.rollNo.toLowerCase() === user.rollNo.toLowerCase()) ||
         f.studentId === currentStudent?.id
  ) || {
    id: 'fee-1',
    receiptNo: 'GPB/FEE/2026/00142',
    studentId: currentStudent.id,
    studentName: currentStudent.name,
    rollNo: currentStudent.rollNo,
    branch: currentStudent.branch,
    semester: currentStudent.semester,
    academicYear: '2025-2026',
    totalFee: 12450,
    paidAmount: 12450,
    pendingAmount: 0,
    dueDate: '2026-04-30',
    paymentStatus: currentStudent.feeStatus as any || 'Paid',
    transactions: []
  };

  const studentResult = results.find(
    r => (user?.rollNo && r.rollNo.toLowerCase() === user.rollNo.toLowerCase()) ||
         r.studentId === currentStudent?.id
  );

  const upcomingExams = exams.filter(
    e => e.branch.toLowerCase().includes(currentStudent.branch.toLowerCase()) ||
         currentStudent.branch.toLowerCase().includes(e.branch.toLowerCase())
  );

  const attendance = currentStudent?.attendancePercentage || 88.5;
  const isAttendanceEligible = attendance >= 75;

  return (
    <div className="space-y-6">
      {/* Student Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-polytechnic-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4">
          <img
            src={currentStudent?.photoUrl}
            alt={currentStudent?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Roll: {currentStudent?.rollNo}</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              {currentStudent?.name} 🎓
            </h1>
            <p className="text-xs text-blue-200 mt-0.5">
              {currentStudent?.branch} • Semester {currentStudent?.semester} • Enr: <strong className="text-white font-mono">{currentStudent?.enrollmentNo}</strong> • DOB: <strong className="text-amber-300 font-mono">{currentStudent?.dob}</strong>
            </p>
          </div>
        </div>

        {/* Quick ID Card / Marksheet buttons */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          {studentResult && (
            <button
              onClick={() => onOpenMarksheet(studentResult.id)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md transition-all"
            >
              <Award className="w-4 h-4 text-amber-400" /> BTEUP Marksheet
            </button>
          )}
          {studentFee && (
            <button
              onClick={() => onOpenReceipt(studentFee.id)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
            >
              <FileText className="w-4 h-4" /> Fee Receipt
            </button>
          )}
        </div>
      </div>

      {/* Attendance & Performance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Ring Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">{attendance}%</div>
            <div className="flex items-center gap-1.5 mt-2">
              {isAttendanceEligible ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3 h-3" /> Eligible (≥75%)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-md">
                  <AlertTriangle className="w-3 h-3" /> Shortage Warning
                </span>
              )}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Academic Result Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Previous SGPA</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {studentResult?.cgpa || 8.92}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-semibold">
              {studentResult?.division || 'Distinction'} ({studentResult?.percentage || 87.4}%)
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Fee Status Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fee Balance</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {studentFee?.pendingAmount === 0 ? '₹0 (Cleared)' : formatCurrencyINR(studentFee?.pendingAmount || 0)}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Paid {formatCurrencyINR(studentFee?.paidAmount || 12450)}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Current Semester */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Sem</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              Sem {currentStudent?.semester}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-semibold">
              Batch {currentStudent?.admissionYear}–{currentStudent?.admissionYear + 3}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Class Schedule & Upcoming Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Classes (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Today's Lecture Timetable
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Department of Computer Science &amp; Engineering • 4th Semester
              </p>
            </div>
            <button
              onClick={() => onNavigate('timetable')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Full Week <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {timetable.slice(0, 4).map(slot => (
              <div
                key={slot.id}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 text-center py-1.5 px-2 rounded-lg bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-extrabold text-[11px]">
                    {slot.startTime}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {slot.subject} ({slot.subjectCode})
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {slot.teacherName} • {slot.roomNo} • <span className="font-semibold text-blue-600">{slot.type}</span>
                    </p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {slot.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Exam Schedule */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Upcoming BTEUP Exams
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Even Semester Theory &amp; Practical Schedule
            </p>

            <div className="space-y-3">
              {upcomingExams.map(ex => (
                <div
                  key={ex.id}
                  className="p-3 rounded-xl border border-rose-100 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-rose-600 dark:text-rose-400 mb-1">
                    <span>{ex.examType}</span>
                    <span>{ex.examDate}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{ex.subject}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {ex.startTime} - {ex.endTime} • {ex.roomNo}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {studentResult && (
            <button
              onClick={() => onOpenMarksheet(studentResult.id)}
              className="w-full mt-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Award className="w-4 h-4" /> View Official Diploma Marksheet
            </button>
          )}
        </div>
      </div>

      {/* Leadership & Principal Desk Spotlight for Student */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-slate-900 to-polytechnic-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-polytechnic-800">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={PRINCIPAL_DETAILS.photoUrl}
            alt={PRINCIPAL_DETAILS.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-400/80 shadow-md flex-shrink-0"
          />
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold mb-0.5">
              <Sparkles className="w-3 h-3" />
              <span>Institutional Leadership</span>
            </div>
            <h3 className="text-sm font-bold text-white">
              {PRINCIPAL_DETAILS.name} ({PRINCIPAL_DETAILS.designation})
            </h3>
            <p className="text-xs text-slate-300">
              Age: {PRINCIPAL_DETAILS.age} Yrs • Qualification: {PRINCIPAL_DETAILS.qualification}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsPrincipalModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 shadow-md"
        >
          <span>View Principal Profile &amp; Directives</span>
        </button>
      </div>

      {/* Principal Profile Modal */}
      <PrincipalProfileModal
        isOpen={isPrincipalModalOpen}
        onClose={() => setIsPrincipalModalOpen(false)}
      />
    </div>
  );
};
