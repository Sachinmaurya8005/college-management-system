import React, { useState } from 'react';
import {
  CheckSquare,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Calendar,
  Filter,
  Download,
  AlertTriangle,
  History,
  FileSpreadsheet,
  Search
} from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';
import { useAuth } from '../../context/AuthContext';
import { Student, AttendanceRecord, AttendanceSession } from '../../types';
import { formatDate, exportToCSV } from '../../utils/helpers';
import confetti from 'canvas-confetti';
import { StudentProfileModal } from '../students/StudentProfileModal';
import { HotelCalendarMatrixRegister } from './HotelCalendarMatrixRegister';
import { GeoFencedSelfAttendanceModal } from './GeoFencedSelfAttendanceModal';
import { MapPin, Compass, ShieldCheck, Sparkles, Navigation } from 'lucide-react';

export const AttendanceModule: React.FC = () => {
  const { students, saveAttendance, attendanceSessions, principalTodayAttendance, teacherAttendance } = useCollegeData();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'register' | 'geofence' | 'mark' | 'history' | 'report'>('register');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);
  const [isGeoModalOpen, setIsGeoModalOpen] = useState(false);

  // Form selections
  const [selectedBranch, setSelectedBranch] = useState('Computer Science & Engineering');
  const [selectedSemester, setSelectedSemester] = useState(4);
  const [selectedSubject, setSelectedSubject] = useState('Database Management Systems (CS-402)');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Active student list for selected branch + semester
  const branchStudents = students.filter(
    s => s.branch.includes(selectedBranch) || selectedBranch.includes(s.branch)
  );

  // Local attendance state mapping: studentId -> 'present' | 'absent' | 'late'
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'absent' | 'late'>>(() => {
    const map: Record<string, 'present' | 'absent' | 'late'> = {};
    branchStudents.forEach(s => {
      map[s.id] = 'present';
    });
    return map;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Handle toggle
  const toggleStudentStatus = (studentId: string) => {
    setAttendanceMap(prev => {
      const current = prev[studentId] || 'present';
      const next = current === 'present' ? 'absent' : current === 'absent' ? 'late' : 'present';
      return { ...prev, [studentId]: next };
    });
  };

  const setAllStatus = (status: 'present' | 'absent') => {
    const updated: Record<string, 'present' | 'absent' | 'late'> = {};
    branchStudents.forEach(s => {
      updated[s.id] = status;
    });
    setAttendanceMap(updated);
  };

  // Compute live counts
  const totalInClass = branchStudents.length;
  const presentCount = branchStudents.filter(s => (attendanceMap[s.id] || 'present') === 'present').length;
  const absentCount = branchStudents.filter(s => attendanceMap[s.id] === 'absent').length;
  const lateCount = branchStudents.filter(s => attendanceMap[s.id] === 'late').length;
  const percentage = totalInClass > 0 ? Math.round(((presentCount + lateCount * 0.5) / totalInClass) * 100) : 0;

  const handleSaveAttendance = () => {
    const records: AttendanceRecord[] = branchStudents.map(s => ({
      studentId: s.id,
      studentName: s.name,
      rollNo: s.rollNo,
      status: attendanceMap[s.id] || 'present'
    }));

    const session: Omit<AttendanceSession, 'id'> = {
      date: selectedDate,
      branch: selectedBranch,
      semester: selectedSemester,
      subject: selectedSubject,
      records,
      presentCount,
      absentCount,
      percentage,
      markedBy: user?.name || 'Faculty'
    };

    saveAttendance(session);
    setSavedSuccess(true);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleExportAttendanceReport = () => {
    const reportData = students.map(s => ({
      'Roll Number': s.rollNo,
      'Name': s.name,
      'Branch': s.branch,
      'Semester': s.semester,
      'Attendance %': `${s.attendancePercentage}%`,
      'Compliance Status': s.attendancePercentage >= 75 ? 'Eligible (>=75%)' : 'Shortage (<75%)'
    }));
    exportToCSV('GP_Bansdeeh_Attendance_Report', reportData);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-blue-600" />
              <span>Attendance &amp; Biometric Management</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300">
              50m GPS Geofence Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Government Polytechnic • 31-Day Hotel/Enterprise Calendar Matrix &amp; Geo-Fenced Campus Punch
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Geo-Fenced Attendance Punch Button */}
          <button
            onClick={() => setIsGeoModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 animate-pulse"
          >
            <MapPin className="w-4 h-4" />
            <span>Punch 50m In-Campus Attendance (कॉलेज में हाजिरी लगाएं)</span>
          </button>
        </div>
      </div>

      {/* Main Tab Switcher Bar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('register')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'register'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>31-Day Monthly Register (होटल/उद्योग कैलेंडर मैट्रिक्स)</span>
        </button>

        <button
          onClick={() => setActiveTab('mark')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'mark'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Mark Class Lecture (कक्षा हाजिरी)</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Lecture History ({attendanceSessions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'report'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Student BTEUP Compliance (&gt;=75%)</span>
        </button>
      </div>

      {/* Tab 1: 31-Day Hotel/Enterprise Calendar Matrix Register */}
      {activeTab === 'register' && <HotelCalendarMatrixRegister />}

      {/* Tab 2: Mark Class Lecture Attendance */}
      {activeTab === 'mark' && (
        <div className="space-y-6">
          {/* Controls Filter Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Diploma Branch
              </label>
              <select
                value={selectedBranch}
                onChange={e => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="Computer Science & Engineering">Computer Science &amp; Engg</option>
                <option value="Mechanical Engineering (Production)">Mechanical Engg</option>
                <option value="Civil Engineering">Civil Engg</option>
                <option value="Electrical Engineering">Electrical Engg</option>
                <option value="Electronics Engineering">Electronics Engg</option>
                <option value="Information Technology">Information Technology</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester
              </label>
              <select
                value={selectedSemester}
                onChange={e => setSelectedSemester(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              >
                {[1, 2, 3, 4, 5, 6].map(sem => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject / Lab
              </label>
              <input
                type="text"
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Attendance Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          {/* Real-time Summary Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total In Class</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalInClass}</div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 shadow-card">
              <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Present</span>
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">{presentCount}</div>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 shadow-card">
              <span className="text-[10px] font-bold uppercase text-rose-600 dark:text-rose-400">Absent</span>
              <div className="text-2xl font-black text-rose-700 dark:text-rose-300 mt-1">{absentCount}</div>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 shadow-card">
              <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">Attendance %</span>
              <div className="text-2xl font-black text-blue-700 dark:text-blue-300 mt-1">{percentage}%</div>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAllStatus('present')}
                className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold transition-all"
              >
                Mark All Present
              </button>
              <button
                onClick={() => setAllStatus('absent')}
                className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-xs font-bold transition-all"
              >
                Mark All Absent
              </button>
            </div>

            <button
              onClick={handleSaveAttendance}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
            >
              <Save className="w-4 h-4" /> Save Attendance Session
            </button>
          </div>

          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Attendance saved successfully for {selectedBranch} (Sem-{selectedSemester})!</span>
            </div>
          )}

          {/* Student Roster Table */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Roll No</th>
                  <th className="px-4 py-3.5">Student Name</th>
                  <th className="px-4 py-3.5 text-center">Avg Attendance</th>
                  <th className="px-4 py-3.5 text-center">Status for Today</th>
                  <th className="px-4 py-3.5 text-right">Quick Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {branchStudents.map(student => {
                  const status = attendanceMap[student.id] || 'present';

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {student.rollNo}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedStudentForModal(student)}
                          className="flex items-center gap-2.5 hover:text-blue-600 dark:hover:text-blue-400 group text-left transition-colors"
                          title="Click to view full student 360° dossier and edit details"
                        >
                          <img
                            src={student.photoUrl}
                            alt={student.name}
                            className="w-8 h-8 rounded-lg object-cover group-hover:ring-2 ring-blue-500"
                          />
                          <span className="font-bold text-slate-900 dark:text-white group-hover:underline underline-offset-2 flex items-center gap-1">
                            {student.name}
                            <span className="text-[10px] text-blue-500 font-normal opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {student.attendancePercentage}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold capitalize ${
                            status === 'present'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : status === 'absent'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setAttendanceMap(prev => ({ ...prev, [student.id]: 'present' }))
                            }
                            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                              status === 'present'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
                            }`}
                            title="Mark Present"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setAttendanceMap(prev => ({ ...prev, [student.id]: 'absent' }))
                            }
                            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                              status === 'absent'
                                ? 'bg-rose-600 text-white shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-rose-50 hover:text-rose-600'
                            }`}
                            title="Mark Absent"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Attendance History Log */}
      {activeTab === 'history' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              Recorded Attendance Register
            </h3>
            <span className="text-xs text-slate-400">Total sessions: {attendanceSessions.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Branch &amp; Sem</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3 text-center">Present / Absent</th>
                  <th className="px-4 py-3 text-center">Attendance %</th>
                  <th className="px-4 py-3 text-right">Recorded By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {attendanceSessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No attendance sessions saved yet in this session. Use "Mark Daily Attendance" to record.
                    </td>
                  </tr>
                ) : (
                  attendanceSessions.map(sess => (
                    <tr key={sess.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {formatDate(sess.date)}
                      </td>
                      <td className="px-4 py-3">
                        {sess.branch} (Sem-{sess.semester})
                      </td>
                      <td className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">
                        {sess.subject}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-emerald-600 font-bold">{sess.presentCount} P</span> /{' '}
                        <span className="text-red-500 font-bold">{sess.absentCount} A</span>
                      </td>
                      <td className="px-4 py-3 text-center font-extrabold text-slate-900 dark:text-white">
                        {sess.percentage}%
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500">{sess.markedBy}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Student Attendance Report */}
      {activeTab === 'report' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Filter by student name or roll..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <button
              onClick={handleExportAttendanceReport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
            >
              <Download className="w-4 h-4" /> Export Report (CSV)
            </button>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Roll No</th>
                  <th className="px-4 py-3.5">Student Name</th>
                  <th className="px-4 py-3.5">Branch</th>
                  <th className="px-4 py-3.5 text-center">Semester</th>
                  <th className="px-4 py-3.5 text-center">Attendance %</th>
                  <th className="px-4 py-3.5 text-center">BTEUP Criterion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students
                  .filter(
                    s =>
                      s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                      s.rollNo.toLowerCase().includes(searchFilter.toLowerCase())
                  )
                  .map(s => {
                    const isGood = s.attendancePercentage >= 75;
                    const isWarning = s.attendancePercentage >= 65 && s.attendancePercentage < 75;

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {s.rollNo}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => setSelectedStudentForModal(s)}
                            className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline underline-offset-2 text-left"
                            title="Click to view full dossier"
                          >
                            {s.name}
                          </button>
                        </td>
                        <td className="px-4 py-3">{s.branch}</td>
                        <td className="px-4 py-3 text-center">Sem {s.semester}</td>
                        <td className="px-4 py-3 text-center font-black text-sm">
                          <span
                            className={
                              isGood
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : isWarning
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }
                          >
                            {s.attendancePercentage}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isGood ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                              <CheckCircle2 className="w-3 h-3" /> Eligible
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                              <AlertTriangle className="w-3 h-3" /> Shortage Warning
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student 360 Dossier & Quick Edit Modal */}
      <StudentProfileModal
        isOpen={!!selectedStudentForModal}
        onClose={() => setSelectedStudentForModal(null)}
        student={selectedStudentForModal}
      />

      {/* 50-Meter Campus Geo-Fenced Attendance Modal */}
      <GeoFencedSelfAttendanceModal
        isOpen={isGeoModalOpen}
        onClose={() => setIsGeoModalOpen(false)}
      />
    </div>
  );
};
