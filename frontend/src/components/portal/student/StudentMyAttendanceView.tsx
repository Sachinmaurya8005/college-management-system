import React, { useState } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Sparkles,
  BookOpen,
  Award,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useCollegeData } from '../../../context/CollegeDataContext';

export const StudentMyAttendanceView: React.FC = () => {
  const { user } = useAuth();
  const { students } = useCollegeData();

  const [selectedSemester, setSelectedSemester] = useState<number>(4);

  // Find logged-in student
  const currentStudent = students.find(
    s => (user?.rollNo && s.rollNo.toLowerCase() === user.rollNo.toLowerCase()) ||
         (user?.email && s.email.toLowerCase() === user.email.toLowerCase())
  );

  const SEMESTER_ATTENDANCE_DATA: Record<number, { overall: number; subjects: Array<{ code: string; name: string; totalLectures: number; attended: number; percentage: number }> }> = {
    1: {
      overall: 89.2,
      subjects: [
        { code: 'BAS-101', name: 'Applied Mathematics-I', totalLectures: 45, attended: 41, percentage: 91.1 },
        { code: 'BAS-102', name: 'Applied Physics-I', totalLectures: 42, attended: 37, percentage: 88.1 },
        { code: 'BAS-103', name: 'Applied Chemistry', totalLectures: 40, attended: 36, percentage: 90.0 },
        { code: 'ENG-104', name: 'Engineering Drawing-I', totalLectures: 36, attended: 32, percentage: 88.9 },
        { code: 'CS-105', name: 'Basics of Information Technology', totalLectures: 44, attended: 39, percentage: 88.6 }
      ]
    },
    2: {
      overall: 90.4,
      subjects: [
        { code: 'BAS-201', name: 'Applied Mathematics-II', totalLectures: 44, attended: 40, percentage: 90.9 },
        { code: 'BAS-202', name: 'Applied Physics-II', totalLectures: 40, attended: 36, percentage: 90.0 },
        { code: 'EE-203', name: 'Basics of Electrical & Electronics Engg', totalLectures: 38, attended: 35, percentage: 92.1 },
        { code: 'ENV-204', name: 'Environmental Studies', totalLectures: 36, attended: 32, percentage: 88.9 },
        { code: 'CS-205', name: 'Programming in C & Problem Solving', totalLectures: 46, attended: 42, percentage: 91.3 }
      ]
    },
    3: {
      overall: 87.8,
      subjects: [
        { code: 'BAS-301', name: 'Applied Mathematics-III', totalLectures: 44, attended: 39, percentage: 88.6 },
        { code: 'CS-302', name: 'Internet & Web Technology', totalLectures: 42, attended: 38, percentage: 90.5 },
        { code: 'EC-303', name: 'Digital Electronics', totalLectures: 38, attended: 33, percentage: 86.8 },
        { code: 'CS-304', name: 'Object Oriented Programming with C++', totalLectures: 45, attended: 39, percentage: 86.7 },
        { code: 'CS-305', name: 'Computer Architecture', totalLectures: 36, attended: 31, percentage: 86.1 }
      ]
    },
    4: {
      overall: currentStudent?.attendancePercentage || 88.5,
      subjects: [
        { code: 'CS-401', name: 'Data Structures & Algorithms Using Python', totalLectures: 42, attended: 38, percentage: 90.5 },
        { code: 'CS-402', name: 'Database Management Systems', totalLectures: 40, attended: 36, percentage: 90.0 },
        { code: 'CS-403', name: 'Computer Communication & Networks', totalLectures: 38, attended: 33, percentage: 86.8 },
        { code: 'CS-404', name: 'Web Technology & Frameworks', totalLectures: 44, attended: 40, percentage: 90.9 },
        { code: 'CS-405', name: 'Operating Systems & Linux Lab', totalLectures: 36, attended: 30, percentage: 83.3 }
      ]
    }
  };

  const activeSemData = SEMESTER_ATTENDANCE_DATA[selectedSemester] || SEMESTER_ATTENDANCE_DATA[4];
  const overallPercentage = activeSemData.overall;
  const isEligible = overallPercentage >= 75;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-blue-900 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 text-center sm:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Biometric Academic Attendance • Semester {selectedSemester}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Lecture Attendance &amp; Board Eligibility
          </h1>
          <p className="text-xs sm:text-sm text-blue-200">
            Student: <strong className="text-white">{user?.name}</strong> • Roll: <strong className="font-mono text-amber-300">{user?.rollNo || 'E224412355001'}</strong> • DOB: <strong className="font-mono text-amber-300">{user?.dob || currentStudent?.dob || '2004-05-14'}</strong> • Branch: {user?.branch || 'CSE'}
          </p>
        </div>

        <div className="px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-center backdrop-blur-md z-10">
          <span className="text-xs text-blue-200 uppercase font-bold block">Semester {selectedSemester} Attendance</span>
          <span className="text-3xl font-black text-amber-400 font-mono">
            {overallPercentage}%
          </span>
          <span className="text-[10px] text-blue-200 block">Min. 75% Required for Exams</span>
        </div>
      </div>

      {/* Semester Switcher Pills */}
      <div className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Semester:</span>
        </div>
        {[1, 2, 3, 4].map(sem => {
          const isCurrent = sem === 4;
          const isSelected = selectedSemester === sem;
          return (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>Semester {sem}</span>
              {isCurrent && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-400 text-slate-950">
                  Current
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Exam Eligibility Card */}
      <div className={`p-6 rounded-3xl border flex items-start gap-4 ${
        isEligible
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
          : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200'
      }`}>
        {isEligible ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
        )}
        <div className="space-y-1 text-xs">
          <h3 className="text-sm font-bold">
            {isEligible ? `Semester ${selectedSemester} BTEUP Board Examination Status: ELIGIBLE` : `Semester ${selectedSemester} BTEUP Status: SHORT ATTENDANCE WARNING`}
          </h3>
          <p className="leading-relaxed">
            {isEligible
              ? `Your attendance in Semester ${selectedSemester} meets the mandatory 75% criteria set by the Board of Technical Education, Uttar Pradesh (BTEUP).`
              : `Your attendance in Semester ${selectedSemester} was below the mandatory 75% threshold.`}
          </p>
        </div>
      </div>

      {/* Subject-Wise Attendance Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Semester {selectedSemester} Subject-Wise Theory &amp; Practical Attendance</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Academic Year BTEUP</span>
        </div>

        <div className="space-y-4">
          {activeSemData.subjects.map((sub, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono">
                    {sub.code}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    {sub.name}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black font-mono text-slate-900 dark:text-white">
                    {sub.percentage}%
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {sub.attended} / {sub.totalLectures} Lectures Attended
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    sub.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${sub.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
