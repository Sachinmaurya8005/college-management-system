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
  Search,
  MapPin,
  Compass,
  ShieldCheck,
  Sparkles,
  Navigation
} from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';
import { useAuth } from '../../context/AuthContext';
import { Student, AttendanceRecord, AttendanceSession } from '../../types';
import { formatDate, exportToCSV } from '../../utils/helpers';
import confetti from 'canvas-confetti';
import { StudentProfileModal } from '../students/StudentProfileModal';
import { HotelCalendarMatrixRegister } from './HotelCalendarMatrixRegister';
import { GeoFencedSelfAttendanceModal } from './GeoFencedSelfAttendanceModal';

export const AttendanceModule: React.FC = () => {
  const { user } = useAuth();
  const { students, saveAttendance, attendanceSessions, principalTodayAttendance, teacherAttendance, teachers } = useCollegeData();
  const isTeacher = user?.role === 'teacher';

  const currentTeacherObj = teachers.find(
    t =>
      (user?.email && t.email?.toLowerCase() === user.email.toLowerCase()) ||
      t.id === user?.id ||
      (user?.empCode && t.empCode?.toLowerCase() === user.empCode.toLowerCase()) ||
      (user?.name && t.name?.toLowerCase().includes(user.name.toLowerCase()))
  );

  const teacherAssignedBranch = currentTeacherObj?.assignedBranch || currentTeacherObj?.department || 'Computer Science & Engineering';
  const teacherAssignedSemester = currentTeacherObj?.assignedSemester || 4;

  const [activeTab, setActiveTab] = useState<'register' | 'geofence' | 'mark' | 'history' | 'report'>('register');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);
  const [isGeoModalOpen, setIsGeoModalOpen] = useState(false);

  // Form selections
  const [selectedBranch, setSelectedBranch] = useState(() => isTeacher ? teacherAssignedBranch : 'Computer Science & Engineering');
  const [selectedSemester, setSelectedSemester] = useState(() => isTeacher ? teacherAssignedSemester : 4);
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
    exportToCSV('GP__Attendance_Report', reportData);
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
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Electronics Engineering">Electronics Engineering</option>
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

          {/* Quick Actions & Stats Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Quick Mark:
              </span>
              <button
                type="button"
                onClick={() => setAllStatus('present')}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={() => setAllStatus('absent')}
                className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold hover:bg-rose-100 transition-colors"
              >
                Mark All Absent
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="text-emerald-600">Present: {presentCount}</span>
              <span className="text-rose-600">Absent: {absentCount}</span>
              <span className="text-amber-600">Late: {lateCount}</span>
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold">
                {percentage}% Today
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by student name or roll number in this class..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* Students Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {branchStudents
              .filter(s =>
                s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                s.rollNo.toLowerCase().includes(searchFilter.toLowerCase())
              )
              .map(student => {
                const status = attendanceMap[student.id] || 'present';
                return (
                  <div
                    key={student.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      status === 'present'
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                        : status === 'absent'
                        ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60'
                        : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={student.photoUrl}
                        alt={student.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div>
                        <button
                          type="button"
                          onClick={() => setSelectedStudentForModal(student)}
                          className="text-xs font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 text-left line-clamp-1 group"
                        >
                          {student.name} <span className="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100">↗</span>
                        </button>
                        <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          {student.rollNo}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleStudentStatus(student.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                        status === 'present'
                          ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/20'
                          : status === 'absent'
                          ? 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-600/20'
                          : 'bg-amber-600 text-white hover:bg-amber-500 shadow-amber-600/20'
                      }`}
                    >
                      {status === 'present' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {status === 'absent' && <XCircle className="w-3.5 h-3.5" />}
                      {status === 'late' && <Clock className="w-3.5 h-3.5" />}
                      <span className="capitalize">{status}</span>
                    </button>
                  </div>
                );
              })}
          </div>

          {/* Submit Attendance Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveAttendance}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Submit &amp; Sync Class Attendance</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Lecture Attendance History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50/75 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Branch &amp; Semester</th>
                  <th className="px-4 py-3.5">Subject</th>
                  <th className="px-4 py-3.5 text-center">Present</th>
                  <th className="px-4 py-3.5 text-center">Absent</th>
                  <th className="px-4 py-3.5 text-center">Attendance %</th>
                  <th className="px-4 py-3.5 text-right">Faculty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {attendanceSessions.map((session, idx) => (
                  <tr key={session.id || idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-medium">{formatDate(session.date)}</td>
                    <td className="px-4 py-3 font-medium">{session.branch} (Sem {session.semester})</td>
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-semibold">{session.subject}</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">{session.presentCount}</td>
                    <td className="px-4 py-3 text-center text-rose-600 font-bold">{session.absentCount}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {session.percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{session.markedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Student Attendance Report */}
      {activeTab === 'report' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleExportAttendanceReport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all"
            >
              <Download className="w-4 h-4" /> Export Report CSV
            </button>
          </div>
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50/75 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Student Details</th>
                  <th className="px-4 py-3.5">Branch</th>
                  <th className="px-4 py-3.5 text-center">Semester</th>
                  <th className="px-4 py-3.5 text-center">Attendance %</th>
                  <th className="px-4 py-3.5 text-center">BTEUP Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.map(s => {
                  const isEligible = s.attendancePercentage >= 75;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 dark:text-white">{s.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{s.rollNo}</div>
                      </td>
                      <td className="px-4 py-3">{s.branch}</td>
                      <td className="px-4 py-3 text-center font-bold">{s.semester}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                            isEligible
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {s.attendancePercentage}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isEligible
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {isEligible ? 'Eligible (>=75%)' : 'Shortage Alert (<75%)'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Dossier Modal */}
      {selectedStudentForModal && (
        <StudentProfileModal
          isOpen={!!selectedStudentForModal}
          onClose={() => setSelectedStudentForModal(null)}
          student={selectedStudentForModal}
        />
      )}

      {/* Geofence Modal */}
      <GeoFencedSelfAttendanceModal
        isOpen={isGeoModalOpen}
        onClose={() => setIsGeoModalOpen(false)}
      />
    </div>
  );
};
