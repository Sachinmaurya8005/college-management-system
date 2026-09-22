import React, { useState, useEffect, useMemo } from 'react';
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
  AlertCircle,
  BookOpen,
  Filter,
  GraduationCap,
  UserPlus
} from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';
import { useAuth } from '../../context/AuthContext';
import { AttendanceRecord, AttendanceSession } from '../../types';
import confetti from 'canvas-confetti';

const ALL_BRANCHES = [
  { id: 'all', name: 'All Branches (सभी शाखाएं)' },
  { id: 'cse', name: 'Computer Science & Engineering', short: 'CSE' },
  { id: 'me', name: 'Mechanical Engineering (Production)', short: 'ME' },
  { id: 'ce', name: 'Civil Engineering', short: 'CE' },
  { id: 'ee', name: 'Electrical Engineering', short: 'EE' },
  { id: 'ece', name: 'Electronics Engineering', short: 'ECE' },
  { id: 'it', name: 'Information Technology', short: 'IT' }
];

const BRANCH_SUBJECTS_MAP: Record<string, string[]> = {
  cse: [
    'CS-401 Data Structures & Algorithms',
    'CS-402 Database Management Systems',
    'CS-403 Operating Systems',
    'CS-404 Web Development & Python Lab',
    'Daily Class Roll-Call (दैनिक हाजिरी)'
  ],
  me: [
    'ME-401 Thermal Engineering',
    'ME-402 Manufacturing Processes & Workshop',
    'ME-403 Theory of Machines',
    'ME-404 Hydraulics & Pneumatics',
    'Daily Class Roll-Call (दैनिक हाजिरी)'
  ],
  ce: [
    'CE-401 Surveying & Leveling',
    'CE-402 Building Construction & Materials',
    'CE-403 Concrete Technology',
    'CE-404 Structural Mechanics',
    'Daily Class Roll-Call (दैनिक हाजिरी)'
  ],
  ee: [
    'EE-401 Electrical Machines & Transformers',
    'EE-402 Power Systems & Transmission',
    'EE-403 Control Systems',
    'EE-404 Electrical Circuits & Networks',
    'Daily Class Roll-Call (दैनिक हाजिरी)'
  ],
  ece: [
    'EC-401 Digital Electronics & Logic Design',
    'EC-402 Analog Circuits & Semiconductor Devices',
    'EC-403 Signals & Systems',
    'EC-404 Communication Engineering',
    'Daily Class Roll-Call (दैनिक हाजिरी)'
  ],
  it: [
    'IT-401 Web Programming & Scripting',
    'IT-402 Software Engineering & Agile Methods',
    'IT-403 Computer Networks & Security',
    'IT-404 Cloud Computing Basics',
    'Daily Class Roll-Call (दैनिक हाजिरी)'
  ],
  all: [
    'Daily Class Roll-Call (दैनिक हाजिरी)',
    'Common Applied Engineering Sciences',
    'Professional Communication & Soft Skills'
  ]
};

export const ClassTeacherDailyAttendanceCard: React.FC = () => {
  const { user } = useAuth();
  const { students, teachers, saveAttendance } = useCollegeData();

  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';

  // Find logged-in teacher from teachers collection to get live assigned branch & semester
  const currentTeacherObj = teachers.find(
    t =>
      (user?.email && t.email?.toLowerCase() === user.email.toLowerCase()) ||
      t.id === user?.id ||
      (user?.empCode && t.empCode?.toLowerCase() === user.empCode.toLowerCase()) ||
      (user?.name && t.name?.toLowerCase().includes(user.name.toLowerCase()))
  );

  const teacherAssignedBranch = currentTeacherObj?.assignedBranch || currentTeacherObj?.department || 'Computer Science & Engineering';
  const teacherAssignedSemester = currentTeacherObj?.assignedSemester || 4;

  const [selectedBranchName, setSelectedBranchName] = useState<string>(() =>
    isTeacher ? teacherAssignedBranch : 'Computer Science & Engineering'
  );
  const [selectedSemester, setSelectedSemester] = useState<number>(() =>
    isTeacher ? teacherAssignedSemester : 4
  );

  // Real-time synchronization: If Admin reassigns this teacher to another class, update immediately
  useEffect(() => {
    if (isTeacher && currentTeacherObj) {
      if (currentTeacherObj.assignedBranch) {
        setSelectedBranchName(currentTeacherObj.assignedBranch);
      }
      if (currentTeacherObj.assignedSemester) {
        setSelectedSemester(currentTeacherObj.assignedSemester);
      }
    }
  }, [isTeacher, currentTeacherObj?.assignedBranch, currentTeacherObj?.assignedSemester]);
  const [selectedSubject, setSelectedSubject] = useState('CS-401 Data Structures & Algorithms');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Normalize branch name helper
  const normalize = (str: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  // Filter students dynamically for the selected branch & semester
  const classStudents = useMemo(() => {
    return students.filter(s => {
      // Branch matching
      let branchMatches = false;
      if (selectedBranchName === 'All Branches (सभी शाखाएं)' || selectedBranchName === 'all') {
        branchMatches = true;
      } else {
        const sNorm = normalize(s.branch);
        const selNorm = normalize(selectedBranchName);
        branchMatches =
          sNorm.includes(selNorm) ||
          selNorm.includes(sNorm) ||
          (selNorm.includes('computer') && sNorm.includes('computer')) ||
          (selNorm.includes('mechanical') && sNorm.includes('mechanical')) ||
          (selNorm.includes('civil') && sNorm.includes('civil')) ||
          (selNorm.includes('electrical') && sNorm.includes('electrical')) ||
          (selNorm.includes('electronics') && sNorm.includes('electronics')) ||
          (selNorm.includes('information') && sNorm.includes('information'));
      }

      // Semester matching
      const semesterMatches = selectedSemester === 0 || s.semester === selectedSemester;
      const activeMatches = s.status === 'Active';

      return branchMatches && semesterMatches && activeMatches;
    });
  }, [students, selectedBranchName, selectedSemester]);

  // Attendance status mapping: studentId -> 'present' | 'absent' | 'late'
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'absent' | 'late'>>({});

  // Sync attendance map whenever class students change
  useEffect(() => {
    setAttendanceMap(prev => {
      const nextMap = { ...prev };
      classStudents.forEach(s => {
        if (!nextMap[s.id]) {
          nextMap[s.id] = 'present';
        }
      });
      return nextMap;
    });
  }, [classStudents]);

  // When branch changes, update subjects list
  const handleBranchChange = (newBranchName: string) => {
    setSelectedBranchName(newBranchName);
    const branchKey = ALL_BRANCHES.find(b => b.name === newBranchName)?.id || 'cse';
    const subList = BRANCH_SUBJECTS_MAP[branchKey] || BRANCH_SUBJECTS_MAP.cse;
    setSelectedSubject(subList[0]);
  };

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
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return classStudents;
    const q = searchQuery.toLowerCase().trim();
    return classStudents.filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        (s.enrollmentNo && s.enrollmentNo.toLowerCase().includes(q)) ||
        (s.fatherName && s.fatherName.toLowerCase().includes(q))
    );
  }, [classStudents, searchQuery]);

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
        branch: selectedBranchName,
        semester: selectedSemester,
        subject: selectedSubject,
        records,
        presentCount,
        absentCount,
        percentage,
        markedBy: user?.name || 'Class Teacher'
      };

      saveAttendance(session);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      setSuccessBanner(
        `✅ ${selectedBranchName} (सेमेस्टर ${selectedSemester === 0 ? 'सभी' : selectedSemester}) की हाजिरी सफलतापूर्वक सुरक्षित और लॉक कर दी गई है! कुल छात्र: ${totalStudents}, उपस्थित: ${presentCount}, अनुपस्थित: ${absentCount}`
      );

      setTimeout(() => {
        setSuccessBanner(null);
      }, 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentBranchKey = ALL_BRANCHES.find(b => b.name === selectedBranchName)?.id || 'cse';
  const availableSubjects = BRANCH_SUBJECTS_MAP[currentBranchKey] || BRANCH_SUBJECTS_MAP.cse;

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 animate-fade-in text-xs text-slate-800 dark:text-slate-100">
      {/* Header with Title & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 text-[11px] mb-1.5">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Class Teacher Roll-Call • कक्षा अध्यापक हाजिरी रजिस्टर</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Take Class Attendance (मेरी कक्षा के बच्चों की हाजिरी)
          </h3>
          <p className="text-xs text-slate-500">
            Selected Class: <strong className="text-blue-600 dark:text-blue-400">{selectedBranchName} • {selectedSemester === 0 ? 'All Semesters' : `Semester ${selectedSemester}`}</strong> (In-Charge: {user?.name || 'Faculty'})
          </p>
        </div>

        {/* Quick Batch Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setAllStatus('present')}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Check className="w-3.5 h-3.5" /> All Present (सभी उपस्थित)
          </button>
          <button
            type="button"
            onClick={() => setAllStatus('absent')}
            className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all flex items-center gap-1.5 shadow-xs"
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

      {/* Selection Filter Bar with Full Branch & Semester Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs">
        {/* Filter 1: Branch */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
            <span>{isTeacher ? 'Assigned Branch (नियुक्त शाखा)' : 'Select Branch (शाखा)'}</span>
            {isTeacher && <span className="text-[10px] text-amber-500 font-bold">🔒 Locked</span>}
          </label>
          {isTeacher ? (
            <div className="w-full px-3 py-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/60 dark:bg-blue-950/40 font-black text-blue-900 dark:text-blue-200 truncate">
              {selectedBranchName}
            </div>
          ) : (
            <select
              value={selectedBranchName}
              onChange={e => handleBranchChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold outline-none text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
            >
              {ALL_BRANCHES.map(b => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Filter 2: Semester */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>{isTeacher ? 'Assigned Class (नियुक्त कक्षा)' : 'Class / Semester (सेमेस्टर)'}</span>
            {isTeacher && <span className="text-[10px] text-amber-500 font-bold">🔒 Locked</span>}
          </label>
          {isTeacher ? (
            <div className="w-full px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 font-black text-indigo-900 dark:text-indigo-200">
              Semester {selectedSemester} (Class In-Charge)
            </div>
          ) : (
            <select
              value={selectedSemester}
              onChange={e => setSelectedSemester(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold outline-none text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1st Semester (1st Year)</option>
              <option value={2}>2nd Semester (1st Year)</option>
              <option value={3}>3rd Semester (2nd Year)</option>
              <option value={4}>4th Semester (2nd Year)</option>
              <option value={5}>5th Semester (Final Year)</option>
              <option value={6}>6th Semester (Final Year)</option>
              <option value={0}>All Semesters (सभी सेमेस्टर)</option>
            </select>
          )}
        </div>

        {/* Filter 3: Subject / Period */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
            <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
            <span>Subject / Period (विषय)</span>
          </label>
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold outline-none text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
          >
            {availableSubjects.map((sub, idx) => (
              <option key={idx} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Filter 4: Date */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>Select Date (तारीख)</span>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold outline-none text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter 5: Search Student */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search Student (छात्र खोजें)</span>
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, roll no..."
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Live Statistics Meter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-center shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">Total Students (कुल छात्र)</span>
          <span className="text-2xl font-black text-blue-900 dark:text-blue-100">{totalStudents}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 text-center shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">Present (उपस्थित)</span>
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{presentCount}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900 text-center shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">Absent (अनुपस्थित)</span>
          <span className="text-2xl font-black text-rose-700 dark:text-rose-300">{absentCount}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-center shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">Attendance Rate</span>
          <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300">{percentage}%</span>
        </div>
      </div>

      {/* Students Roll Call List */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-2">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-bold text-slate-700 dark:text-slate-300">
              No students enrolled in {selectedBranchName} • Semester {selectedSemester === 0 ? 'All' : selectedSemester}
            </p>
            <p className="text-[11px] text-slate-400">
              जब भी किसी छात्र का इस शाखा/सेमेस्टर में एडमिशन होगा, वह यहाँ स्वतः हाजिरी रजिस्टर में दिखने लगेगा।
            </p>
          </div>
        ) : (
          filteredStudents.map((student, index) => {
            const currentStatus = attendanceMap[student.id] || 'present';
            const isPresent = currentStatus === 'present';
            const isAbsent = currentStatus === 'absent';
            const isLate = currentStatus === 'late';

            return (
              <div
                key={student.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isPresent
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                    : isAbsent
                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                    : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                }`}
              >
                {/* Student Info */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={student.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=faces'}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-xs"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-800 text-[9px] font-black text-white flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 dark:text-white text-xs font-black">
                        {student.name}
                      </strong>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                        {student.rollNo}
                      </span>
                      {student.admissionYear === 2026 && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-black">
                          New Admission
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>{student.branch} • Sem {student.semester}</span>
                      {student.fatherName && (
                        <>
                          <span>•</span>
                          <span>Father: {student.fatherName}</span>
                        </>
                      )}
                      <span>•</span>
                      <span className={`font-bold ${(student.attendancePercentage || 85) >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        Total Att: {student.attendancePercentage || 85}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setStatusForStudent(student.id, 'present')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all active:scale-95 ${
                      isPresent
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-white/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Present (P)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusForStudent(student.id, 'absent')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all active:scale-95 ${
                      isAbsent
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-1 ring-white/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Absent (A)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusForStudent(student.id, 'late')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all active:scale-95 ${
                      isLate
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-1 ring-white/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Late (L)</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Submit Button */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[11px] text-slate-500">
          Marked attendance will automatically update students' live semester eligibility records &amp; BTEUP exam compliance.
        </p>

        <button
          type="button"
          disabled={isSubmitting || totalStudents === 0}
          onClick={handleSubmitAttendance}
          className={`px-6 py-3 rounded-2xl font-black text-xs text-white shadow-lg transition-all flex items-center gap-2 active:scale-95 ${
            totalStudents === 0
              ? 'bg-slate-400 cursor-not-allowed opacity-60'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30'
          }`}
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'Saving Attendance...' : "Submit & Lock Today's Class Attendance (हाजिरी सुरक्षित करें)"}</span>
        </button>
      </div>
    </div>
  );
};
