import React, { useState } from 'react';
import {
  CheckSquare,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Calendar,
  Sparkles,
  Search,
  Check,
  X,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';
import { useAuth } from '../../context/AuthContext';
import { AttendanceRecord, AttendanceSession } from '../../types';
import confetti from 'canvas-confetti';

export const ClassTeacherDailyAttendanceCard: React.FC = () => {
  const { user } = useAuth();
  const { students, saveAttendance } = useCollegeData();

  // Class teacher's assigned branch & semester
  const [selectedBranch, setSelectedBranch] = useState('Computer Science & Engineering');
  const [selectedSemester, setSelectedSemester] = useState(4);
  const [selectedSubject, setSelectedSubject] = useState('CS-401 Data Structures & Algorithms');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter students for this class
  const classStudents = students.filter(
    s =>
      (s.branch.includes(selectedBranch) || selectedBranch.includes(s.branch)) &&
      (s.semester === selectedSemester || !selectedSemester)
  );

  // Attendance status mapping: studentId -> 'present' | 'absent' | 'late'
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'absent' | 'late'>>(() => {
    const map: Record<string, 'present' | 'absent' | 'late'> = {};
    classStudents.forEach(s => {
      map[s.id] = 'present';
    });
    return map;
  });

  const setStatusForStudent = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const setAllStatus = (status: 'present' | 'absent') => {
    const updated: Record<string, 'present' | 'absent' | 'late'> = {};
    classStudents.forEach(s => {
      updated[s.id] = status;
    });
    setAttendanceMap(updated);
  };

  // Live Statistics
  const totalStudents = classStudents.length;
  const presentCount = classStudents.filter(s => (attendanceMap[s.id] || 'present') === 'present').length;
  const absentCount = classStudents.filter(s => attendanceMap[s.id] === 'absent').length;
  const lateCount = classStudents.filter(s => attendanceMap[s.id] === 'late').length;
  const percentage = totalStudents > 0 ? Math.round(((presentCount + lateCount * 0.5) / totalStudents) * 100) : 0;

  // Filtered by search query
  const filteredStudents = classStudents.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q);
  });

  const handleSubmitAttendance = async () => {
    if (totalStudents === 0) return;
    setIsSubmitting(true);

    try {
      const records: AttendanceRecord[] = classStudents.map(s => ({
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
        markedBy: `${user?.name || 'Class Teacher'} (Class Teacher In-Charge)`
      };

      await saveAttendance(session);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });

      setSuccessBanner(
        `कक्षा ${selectedBranch} (सेमेस्टर ${selectedSemester}) की हाजिरी सफलतापूर्वक दर्ज कर दी गई! (Total: ${totalStudents} • Present: ${presentCount} • Attendance Rate: ${percentage}%)`
      );
      setTimeout(() => setSuccessBanner(null), 6000);
    } catch (err) {
      console.error('Failed to submit class attendance', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Class Teacher Roll-Call • कक्षा अध्यापक हाजिरी रजिस्टर</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Take Class Attendance (मेरी कक्षा के बच्चों की हाजिरी)
          </h2>
          <p className="text-xs text-slate-500">
            Assigned Class: <strong className="text-blue-600 dark:text-blue-400">{selectedBranch} • Semester {selectedSemester}</strong> (In-Charge: {user?.name})
          </p>
        </div>

        {/* Quick Batch Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setAllStatus('present')}
            className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-all flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" /> All Present (सभी उपस्थित)
          </button>
          <button
            type="button"
            onClick={() => setAllStatus('absent')}
            className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold hover:bg-rose-100 transition-all flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" /> All Absent (सभी अनुपस्थित)
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-3 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Selection Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Date (तारीख)</label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Class / Semester (सेमेस्टर)</label>
          <select
            value={selectedSemester}
            onChange={e => setSelectedSemester(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold outline-none"
          >
            <option value={1}>1st Semester</option>
            <option value={2}>2nd Semester</option>
            <option value={3}>3rd Semester</option>
            <option value={4}>4th Semester (Regular)</option>
            <option value={5}>5th Semester</option>
            <option value={6}>6th Semester</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject / Period (विषय)</label>
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold outline-none"
          >
            <option value="CS-401 Data Structures & Algorithms">CS-401 Data Structures &amp; Algorithms</option>
            <option value="CS-402 Database Management Systems">CS-402 Database Management Systems</option>
            <option value="CS-403 Operating Systems">CS-403 Operating Systems</option>
            <option value="CS-404 Web Development & Python Lab">CS-404 Web Development &amp; Python Lab</option>
            <option value="Daily Class Roll-Call (दैनिक हाजिरी)">Daily Class Roll-Call (दैनिक हाजिरी)</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Search Student (छात्र खोजें)</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name or roll..."
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Live Statistics Meter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">Total Students</span>
          <span className="text-xl font-black text-blue-900 dark:text-blue-100">{totalStudents}</span>
        </div>
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">Present (उपस्थित)</span>
          <span className="text-xl font-black text-emerald-700 dark:text-emerald-300">{presentCount}</span>
        </div>
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">Absent (अनुपस्थित)</span>
          <span className="text-xl font-black text-rose-700 dark:text-rose-300">{absentCount}</span>
        </div>
        <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">Attendance Rate</span>
          <span className="text-xl font-black text-indigo-700 dark:text-indigo-300">{percentage}%</span>
        </div>
      </div>

      {/* Students Roll Call List */}
      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            No students found matching current class filter.
          </div>
        ) : (
          filteredStudents.map(student => {
            const currentStatus = attendanceMap[student.id] || 'present';
            const isPresent = currentStatus === 'present';
            const isAbsent = currentStatus === 'absent';
            const isLate = currentStatus === 'late';

            return (
              <div
                key={student.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isPresent
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                    : isAbsent
                    ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60'
                    : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
                }`}
              >
                {/* Student Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={student.photoUrl}
                    alt={student.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-white dark:ring-slate-800 flex-shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{student.name}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {student.rollNo}
                      </span>
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Father: {student.fatherName} • Total Att: <strong className="text-blue-600">{student.attendancePercentage}%</strong>
                    </p>
                  </div>
                </div>

                {/* 3-State Quick Attendance Buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setStatusForStudent(student.id, 'present')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      isPresent
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" /> Present (P)
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusForStudent(student.id, 'absent')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      isAbsent
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-50'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" /> Absent (A)
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusForStudent(student.id, 'late')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      isLate
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-50'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" /> Late (L)
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Final Submit & Lock Action */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          Marked attendance will automatically update students' live semester eligibility records.
        </div>

        <button
          type="button"
          disabled={isSubmitting || totalStudents === 0}
          onClick={handleSubmitAttendance}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'Saving...' : 'Submit & Lock Today\'s Class Attendance (हाजिरी सुरक्षित करें)'}</span>
        </button>
      </div>
    </div>
  );
};
