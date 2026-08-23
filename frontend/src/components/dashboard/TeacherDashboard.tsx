import React, { useState } from 'react';
import {
  Users,
  CheckSquare,
  Award,
  Calendar,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Eye,
  FileText,
  ShieldCheck,
  MapPin,
  IndianRupee
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCollegeData } from '../../context/CollegeDataContext';
import { StatCard } from '../common/StatCard';
import { formatDate, formatCurrencyINR } from '../../utils/helpers';
import { StudentProfileModal } from '../students/StudentProfileModal';
import { PrincipalProfileModal } from '../common/PrincipalProfileModal';
import { PRINCIPAL_DETAILS } from '../../data/mockData';
import { Student } from '../../types';
import { GeoFencedSelfAttendanceModal } from '../attendance/GeoFencedSelfAttendanceModal';
import { ClassTeacherDailyAttendanceCard } from './ClassTeacherDailyAttendanceCard';

interface TeacherDashboardProps {
  onNavigate: (view: string, metadata?: any) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { students, notices, timetable, teachers } = useCollegeData();
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);
  const [isPrincipalModalOpen, setIsPrincipalModalOpen] = useState(false);
  const [isGeoModalOpen, setIsGeoModalOpen] = useState(false);

  const cseStudents = students.filter(s => s.branch.includes('Computer') || s.branch.includes('CSE'));
  const todayClasses = timetable.filter(
    t => t.day === 'Monday' && (t.teacherName.includes('Alok') || t.teacherName.includes('Rai'))
  );

  return (
    <div className="space-y-6">
      {/* Teacher Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-polytechnic-900 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Faculty Academic Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name} 👨‍🏫
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {user?.designation} • Department of {user?.department || 'Computer Science & Engineering'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsGeoModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 animate-pulse"
          >
            <MapPin className="w-4 h-4" /> Punch 50m In-Campus Attendance
          </button>
          <button
            onClick={() => onNavigate('attendance')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md transition-all"
          >
            <CheckSquare className="w-4 h-4" /> Open Register
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Students"
          value={cseStudents.length.toString()}
          description="Department of CSE"
          icon={Users}
          trend={{ value: '100%', isPositive: true, label: 'Enrolled' }}
          color="blue"
        />
        <StatCard
          title="Today's Lectures"
          value={todayClasses.length.toString()}
          description="Scheduled Monday"
          icon={Calendar}
          color="emerald"
        />
        <StatCard
          title="Avg Class Attendance"
          value="88.2%"
          description="Semester 4 Regular"
          icon={CheckSquare}
          color="indigo"
        />
        <StatCard
          title="Pending Applications"
          value="2"
          description="Student Leave / Queries"
          icon={FileText}
          color="amber"
          onClick={() => onNavigate('applications')}
        />
      </div>

      {/* Class Teacher Daily Attendance Register Widget */}
      <ClassTeacherDailyAttendanceCard />

      {/* Class Students 360 Quick Roster */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Department Students Roster (Click Any Name for 360° Dossier &amp; Edit)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Click on any student's name to view their complete profile, attendance breakdown, fees, marksheets, or edit personal details.
            </p>
          </div>
          <button
            onClick={() => onNavigate('students')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            All Students <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cseStudents.map(student => (
            <div
              key={student.id}
              onClick={() => setSelectedStudentForModal(student)}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-all flex items-center justify-between group shadow-sm"
              title="Click to view full dossier & edit details"
            >
              <div className="flex items-center gap-3">
                <img
                  src={student.photoUrl}
                  alt={student.name}
                  className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 group-hover:ring-2 ring-blue-500"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                    <span>{student.name}</span>
                    <span className="text-[10px] opacity-0 group-hover:opacity-100">↗</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">Roll: {student.rollNo}</p>
                  <p className="text-[10px] text-slate-500">DOB: <span className="font-mono text-amber-600">{student.dob || '2004-05-14'}</span></p>
                </div>
              </div>

              <div className="text-right text-[11px]">
                <span className="font-bold text-blue-600 dark:text-blue-400 block">{student.attendancePercentage}% Att.</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {student.feeStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Today's Schedule & Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Classes */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Today's Lecture Schedule
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monday Class Routine • BTEUP 2026 Academic Session
              </p>
            </div>
            <button
              onClick={() => onNavigate('timetable')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Master Timetable <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  09:30 AM
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Data Structures &amp; Algorithms (CS-401)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Diploma CSE • 4th Semester • Room 101 (Theory)
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('attendance')}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 self-start sm:self-center"
              >
                Mark Attendance
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  11:30 AM
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    DBMS &amp; SQL Practical Lab (CS-402P)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Diploma CSE • 4th Semester • Computer Lab 1 (Practical)
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('attendance')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 self-start sm:self-center"
              >
                Mark Attendance
              </button>
            </div>
          </div>
        </div>

        {/* Notices & Alerts */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Faculty Notice Board
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Institutional circulars &amp; academic instructions
            </p>

            <div className="space-y-3">
              {notices.slice(0, 3).map(n => (
                <div
                  key={n.id}
                  onClick={() => onNavigate('notices', { noticeId: n.id })}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-blue-300 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                      {n.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{formatDate(n.publishDate)}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {n.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('applications')}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4" /> Official Staff Circulars &amp; Letters
          </button>
        </div>
      </div>

      {/* Principal & Chief Executive Leadership Spotlight for Faculty */}
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
              Age: {PRINCIPAL_DETAILS.age} Yrs • Qualification: {PRINCIPAL_DETAILS.qualification} • Exp: {PRINCIPAL_DETAILS.experienceYears}+ Years
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsPrincipalModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 shadow-md"
        >
          <Eye className="w-4 h-4" />
          <span>View Principal Profile &amp; Qualifications</span>
        </button>
      </div>

      {/* Principal Profile Modal */}
      <PrincipalProfileModal
        isOpen={isPrincipalModalOpen}
        onClose={() => setIsPrincipalModalOpen(false)}
      />

      {/* Student 360 Dossier & Quick Edit Modal */}
      <StudentProfileModal
        isOpen={!!selectedStudentForModal}
        onClose={() => setSelectedStudentForModal(null)}
        student={selectedStudentForModal}
      />

      {/* Faculty 50m Geo-Fenced Campus Attendance Modal */}
      <GeoFencedSelfAttendanceModal
        isOpen={isGeoModalOpen}
        onClose={() => setIsGeoModalOpen(false)}
      />
    </div>
  );
};
