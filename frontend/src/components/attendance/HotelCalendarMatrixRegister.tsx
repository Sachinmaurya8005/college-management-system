import React, { useState } from 'react';
import {
  Calendar,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  IndianRupee,
  ShieldCheck,
  UserCheck,
  Building,
  GraduationCap,
  Sparkles,
  Users,
  Search,
  Printer,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  MapPin,
  CheckSquare,
  Plus,
  Radio
} from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';
import { useAuth } from '../../context/AuthContext';
import {
  formatCurrencyINR,
  getDaysInMonthDetails,
  exportToCSV
} from '../../utils/helpers';
import { AttendanceStatusCode } from '../../types';
import { GeoFencedSelfAttendanceModal } from './GeoFencedSelfAttendanceModal';
import { ClassTeacherDailyAttendanceCard } from '../dashboard/ClassTeacherDailyAttendanceCard';

export const HotelCalendarMatrixRegister: React.FC = () => {
  const { user } = useAuth();
  const {
    teachers,
    students,
    teacherAttendance,
    markTeacherAttendance,
    calculateTeacherMonthlySalary
  } = useCollegeData();

  const isPrincipal = user?.role === 'admin';

  // Navigation State
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(7); // August (0-indexed: 7)
  const [activeRegisterType, setActiveRegisterType] = useState<'faculty' | 'students'>('faculty');
  const [isGeoModalOpen, setIsGeoModalOpen] = useState(false);
  const [isTakeStudentAttendanceOpen, setIsTakeStudentAttendanceOpen] = useState(false);

  // Student Filter State
  const [selectedBranch, setSelectedBranch] = useState('Computer Science & Engineering');
  const [selectedSemester, setSelectedSemester] = useState(4);
  const [searchFilter, setSearchFilter] = useState('');

  // Selected cell for Quick Status Toggle / Principal Override
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthString = `${selectedYear}-${String(selectedMonthIndex + 1).padStart(2, '0')}`;
  const daysInMonth = getDaysInMonthDetails(selectedYear, selectedMonthIndex);

  // Filtered Students
  const filteredStudents = students.filter(s =>
    (s.branch.includes(selectedBranch) || selectedBranch.includes(s.branch)) &&
    (s.semester === selectedSemester || selectedSemester === 0) &&
    (s.name.toLowerCase().includes(searchFilter.toLowerCase()) || s.rollNo.includes(searchFilter))
  );

  // Object-Level Teacher Attendance Privacy Isolation:
  // When logged in as Teacher, find the current teacher matching email or name or ID
  const currentTeacher = teachers.find(
    t => t.email.toLowerCase() === user?.email?.toLowerCase() ||
         t.id === user?.id ||
         user?.name?.toLowerCase().includes(t.name.toLowerCase()) ||
         t.name.toLowerCase().includes(user?.name?.toLowerCase() || '')
  ) || teachers[0];

  // Filtered Faculty: If user is teacher, ONLY return [currentTeacher] (strictly 0 other teachers)!
  const filteredTeachers = !isPrincipal
    ? [currentTeacher]
    : teachers.filter(t =>
        t.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        t.empCode.toLowerCase().includes(searchFilter.toLowerCase()) ||
        t.department.toLowerCase().includes(searchFilter.toLowerCase())
      );

  // Quick cycle attendance status for Principal
  const handleCellClick = (teacherId: string, dateStr: string, currentStatus: AttendanceStatusCode) => {
    if (!isPrincipal) return; // Only Principal can override
    const nextStatus: AttendanceStatusCode =
      currentStatus === 'P' ? 'L' : currentStatus === 'L' ? 'A' : currentStatus === 'A' ? 'P' : 'P';
    markTeacherAttendance(teacherId, dateStr, nextStatus, undefined, 'principal_override');
  };

  // Export Monthly Register
  const handleExportCSV = () => {
    if (activeRegisterType === 'faculty') {
      const exportData = filteredTeachers.map(t => {
        const salarySummary = calculateTeacherMonthlySalary(t.id, monthString);
        const row: Record<string, any> = {
          'Employee Code': t.empCode,
          'Full Name': t.name,
          'Department': t.department,
          'Designation': t.designation
        };

        daysInMonth.forEach(d => {
          const rec = teacherAttendance.find(r => r.teacherId === t.id && r.date === d.dateStr);
          row[`Day ${d.dayNumber}`] = rec ? rec.status : (d.isSunday ? 'H' : 'P');
        });

        row['Present Days'] = salarySummary.presentDays;
        row['Leave Days'] = salarySummary.leaveDays;
        row['Absent Days'] = salarySummary.absentDays;

        if (isPrincipal) {
          row['Monthly Base Salary (₹)'] = salarySummary.monthlyBaseSalary;
          row['Daily Rate (₹)'] = salarySummary.dailyRate;
          row['Earned Salary (₹)'] = salarySummary.earnedSalaryToDate;
          row['Net Payable (₹)'] = salarySummary.netPayableSalary;
        }

        return row;
      });

      exportToCSV(`GP_Bansdeeh_Faculty_Attendance_${monthString}`, exportData);
    } else {
      const exportData = filteredStudents.map(s => {
        const row: Record<string, any> = {
          'Roll Number': s.rollNo,
          'Enrollment No': s.enrollmentNo,
          'Student Name': s.name,
          'Branch': s.branch,
          'Semester': s.semester
        };

        let pCount = 0;
        daysInMonth.forEach(d => {
          const isP = !d.isSunday && (d.dayNumber % 7 !== 0);
          if (isP) pCount++;
          row[`Day ${d.dayNumber}`] = d.isSunday ? 'H' : (isP ? 'P' : 'A');
        });

        row['Total Present'] = pCount;
        row['Attendance %'] = s.attendancePercentage;
        return row;
      });

      exportToCSV(`GP_Bansdeeh_Student_Attendance_${selectedBranch}_Sem${selectedSemester}_${monthString}`, exportData);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Toolbar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              मासिक बायोमेट्रिक व उपस्थिति रजिस्टर (1-31 Calendar Matrix)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise &amp; Hotel style 31-day attendance grid with live salary accrual &amp; branch matrices
          </p>
        </div>

        {/* Month & Year Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => {
                if (selectedMonthIndex === 0) {
                  setSelectedMonthIndex(11);
                  setSelectedYear(y => y - 1);
                } else {
                  setSelectedMonthIndex(m => m - 1);
                }
              }}
              className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-black text-slate-900 dark:text-white px-3 font-mono">
              {monthNames[selectedMonthIndex]} {selectedYear}
            </span>

            <button
              onClick={() => {
                if (selectedMonthIndex === 11) {
                  setSelectedMonthIndex(0);
                  setSelectedYear(y => y + 1);
                } else {
                  setSelectedMonthIndex(m => m + 1);
                }
              }}
              className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!isPrincipal && (
              <button
                type="button"
                onClick={() => setIsGeoModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 animate-pulse"
              >
                <MapPin className="w-4 h-4" />
                <span>Punch 50m In-Campus Attendance (50m हाजिरी)</span>
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold shadow-md transition-all"
            >
              <Download className="w-4 h-4" /> Export CSV / Excel
            </button>
          </div>
        </div>
      </div>

      {/* Teacher Confidential Privacy Banner */}
      {!isPrincipal && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl border border-blue-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-white">
                  🔒 Official Attendance Portal: {currentTeacher.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-slate-950">
                  {currentTeacher.empCode}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  50m Geo-Fence Active
                </span>
              </div>
              <p className="text-[11px] text-blue-200 mt-0.5">
                गोपनीयता नीति: शिक्षक की हाजिरी केवल कॉलेज के <strong>50 मीटर के दायरे</strong> में ही लग सकती है। छात्र हाजिरी कभी भी लाइव ली जा सकती है।
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsGeoModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <MapPin className="w-4 h-4" />
            <span>Punch 50m Attendance Now</span>
          </button>
        </div>
      )}

      {/* Mode Selector & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Register Type Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveRegisterType('faculty')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeRegisterType === 'faculty'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>
              {isPrincipal ? 'Faculty & Staff Register (समस्त स्टाफ)' : `My Attendance Register (मेरी हाजिरी)`}
            </span>
          </button>
          <button
            onClick={() => setActiveRegisterType('students')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeRegisterType === 'students'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Students Branch-wise Register (छात्र हाजिरी)</span>
          </button>
        </div>

        {/* Dynamic Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {activeRegisterType === 'students' && (
            <>
              <select
                value={selectedBranch}
                onChange={e => setSelectedBranch(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
              >
                <option value="Computer Science & Engineering">Computer Science (CSE)</option>
                <option value="Mechanical Engineering">Mechanical Engineering (ME)</option>
                <option value="Civil Engineering">Civil Engineering (CE)</option>
                <option value="Electrical Engineering">Electrical Engineering (EE)</option>
                <option value="Electronics Engineering">Electronics Engineering (ECE)</option>
                <option value="Information Technology">Information Technology (IT)</option>
              </select>

              <select
                value={selectedSemester}
                onChange={e => setSelectedSemester(parseInt(e.target.value))}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
              >
                <option value={1}>Sem 1</option>
                <option value={2}>Sem 2</option>
                <option value={3}>Sem 3</option>
                <option value={4}>Sem 4</option>
                <option value={5}>Sem 5</option>
                <option value={6}>Sem 6</option>
              </select>

              <button
                type="button"
                onClick={() => setIsTakeStudentAttendanceOpen(!isTakeStudentAttendanceOpen)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isTakeStudentAttendanceOpen
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>{isTakeStudentAttendanceOpen ? 'Close Roll-Call' : 'Take Student Attendance (हाजिरी लगाएं)'}</span>
              </button>
            </>
          )}

          {isPrincipal && (
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search staff by name, code..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Live Class Attendance Roll-Call Card when toggled */}
      {activeRegisterType === 'students' && isTakeStudentAttendanceOpen && (
        <div className="animate-fade-in">
          <ClassTeacherDailyAttendanceCard />
        </div>
      )}

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-3 font-semibold">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Matrix Legend:</span>
          <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
            <span className="w-5 h-5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 flex items-center justify-center font-mono font-black text-[10px]">P</span> Present (उपस्थित)
          </span>
          <span className="flex items-center gap-1 text-rose-700 dark:text-rose-300">
            <span className="w-5 h-5 rounded-lg bg-rose-100 dark:bg-rose-950/80 border border-rose-300 flex items-center justify-center font-mono font-black text-[10px]">A</span> Absent (अनुपस्थित)
          </span>
          <span className="flex items-center gap-1 text-amber-700 dark:text-amber-300">
            <span className="w-5 h-5 rounded-lg bg-amber-100 dark:bg-amber-950/80 border border-amber-300 flex items-center justify-center font-mono font-black text-[10px]">L</span> Approved Leave (छुट्टी)
          </span>
          <span className="flex items-center gap-1 text-blue-700 dark:text-blue-300">
            <span className="w-5 h-5 rounded-lg bg-blue-100 dark:bg-blue-950/80 border border-blue-300 flex items-center justify-center font-mono font-black text-[10px]">H</span> Sunday / Holiday (अवकाश)
          </span>
        </div>

        {isPrincipal && (
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>प्रिंसिपल मोड: किसी भी सेल पर क्लिक करके तुरंत हाजिरी बदलें (P ➔ L ➔ A)</span>
          </span>
        )}
      </div>

      {/* MATRIX TABLE CONTAINER */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            {/* Table Header */}
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px]">
                <th className="py-3 px-4 font-bold sticky left-0 z-20 bg-slate-100 dark:bg-slate-800 min-w-[200px]">
                  {activeRegisterType === 'faculty' ? 'Faculty & Staff Name' : 'Student Details'}
                </th>

                {/* 1 to 31 Day Headers */}
                {daysInMonth.map(d => (
                  <th
                    key={d.dayNumber}
                    className={`py-2 px-1 text-center font-mono min-w-[32px] border-l border-slate-200 dark:border-slate-700/60 ${
                      d.isSunday ? 'bg-blue-50/80 dark:bg-blue-950/30 text-blue-600 font-bold' : ''
                    }`}
                  >
                    <div className="text-[9px] uppercase text-slate-400">{d.dayName}</div>
                    <div className="text-xs font-black">{d.dayNumber}</div>
                  </th>
                ))}

                {/* Summary Headers */}
                <th className="py-3 px-3 text-center font-bold border-l border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-emerald-700">
                  Total P
                </th>
                <th className="py-3 px-3 text-center font-bold border-l border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-rose-700">
                  Total A
                </th>

                {/* CONFIDENTIAL SALARY HEADERS (PRINCIPAL ONLY) */}
                {activeRegisterType === 'faculty' && isPrincipal && (
                  <>
                    <th className="py-3 px-4 font-bold border-l border-slate-200 dark:border-slate-700 bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 min-w-[130px]">
                      Monthly Base (मूल)
                    </th>
                    <th className="py-3 px-4 font-bold border-l border-slate-200 dark:border-slate-700 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 min-w-[140px]">
                      Earned to Date (अर्जित ₹)
                    </th>
                    <th className="py-3 px-4 font-bold border-l border-slate-200 dark:border-slate-700 bg-blue-50/60 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 min-w-[130px]">
                      Net Payable (शुद्ध)
                    </th>
                  </>
                )}

                {activeRegisterType === 'students' && (
                  <th className="py-3 px-4 font-bold border-l border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-blue-700 min-w-[90px]">
                    Att. %
                  </th>
                )}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {/* FACULTY ROWS */}
              {activeRegisterType === 'faculty' &&
                filteredTeachers.map(teacher => {
                  const salary = calculateTeacherMonthlySalary(teacher.id, monthString);
                  return (
                    <tr
                      key={teacher.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Teacher Profile Info */}
                      <td className="py-2.5 px-4 sticky left-0 z-10 bg-white dark:bg-slate-900 shadow-xs">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={teacher.photoUrl}
                            alt={teacher.name}
                            className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0"
                          />
                          <div className="truncate max-w-[170px]">
                            <h4 className="font-bold text-slate-900 dark:text-white truncate">
                              {teacher.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 truncate">
                              {teacher.empCode} • {teacher.designation}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 1 to 31 Day Status Cells */}
                      {daysInMonth.map(d => {
                        const rec = teacherAttendance.find(
                          r => r.teacherId === teacher.id && r.date === d.dateStr
                        );
                        const status: AttendanceStatusCode = rec ? rec.status : (d.isSunday ? 'H' : 'P');

                        const badgeColor =
                          status === 'P'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-300'
                            : status === 'A'
                            ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-rose-300'
                            : status === 'L'
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border-amber-300'
                            : 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200 border-blue-300';

                        return (
                          <td
                            key={d.dayNumber}
                            onClick={() => handleCellClick(teacher.id, d.dateStr, status)}
                            className={`py-1.5 px-0.5 text-center border-l border-slate-100 dark:border-slate-800 ${
                              isPrincipal ? 'cursor-pointer hover:scale-110 transition-transform' : ''
                            } ${d.isSunday ? 'bg-blue-50/30 dark:bg-blue-950/10' : ''}`}
                            title={`${d.dateStr}: ${status} ${isPrincipal ? '(Click to change status)' : ''}`}
                          >
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-lg font-mono font-black text-[10px] border shadow-2xs ${badgeColor}`}
                            >
                              {status}
                            </span>
                          </td>
                        );
                      })}

                      {/* Summary Counts */}
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600 border-l border-slate-200 dark:border-slate-800">
                        {salary.presentDays}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-600 border-l border-slate-200 dark:border-slate-800">
                        {salary.absentDays}
                      </td>

                      {/* CONFIDENTIAL SALARY COLUMNS (PRINCIPAL ONLY) */}
                      {isPrincipal && (
                        <>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200 border-l border-slate-200 dark:border-slate-800 bg-amber-50/20 dark:bg-amber-950/10">
                            {formatCurrencyINR(salary.monthlyBaseSalary)}
                          </td>
                          <td className="py-2.5 px-4 font-mono font-black text-emerald-600 dark:text-emerald-400 border-l border-slate-200 dark:border-slate-800 bg-emerald-50/20 dark:bg-emerald-950/10">
                            {formatCurrencyINR(salary.earnedSalaryToDate)}
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 border-l border-slate-200 dark:border-slate-800 bg-blue-50/20 dark:bg-blue-950/10">
                            {formatCurrencyINR(salary.netPayableSalary)}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}

              {/* STUDENT ROWS */}
              {activeRegisterType === 'students' &&
                filteredStudents.map(student => {
                  let pCount = 0;
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Student Profile Info */}
                      <td className="py-2.5 px-4 sticky left-0 z-10 bg-white dark:bg-slate-900 shadow-xs">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student.photoUrl}
                            alt={student.name}
                            className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0"
                          />
                          <div className="truncate max-w-[170px]">
                            <h4 className="font-bold text-slate-900 dark:text-white truncate">
                              {student.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-mono truncate">
                              {student.rollNo} • Sem {student.semester}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 1 to 31 Day Status Cells */}
                      {daysInMonth.map(d => {
                        const isP = !d.isSunday && (d.dayNumber % 8 !== 0);
                        const status: AttendanceStatusCode = d.isSunday ? 'H' : isP ? 'P' : 'A';
                        if (status === 'P') pCount++;

                        const badgeColor =
                          status === 'P'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-300'
                            : status === 'A'
                            ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-rose-300'
                            : 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200 border-blue-300';

                        return (
                          <td
                            key={d.dayNumber}
                            className={`py-1.5 px-0.5 text-center border-l border-slate-100 dark:border-slate-800 ${
                              d.isSunday ? 'bg-blue-50/30 dark:bg-blue-950/10' : ''
                            }`}
                          >
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-lg font-mono font-black text-[10px] border shadow-2xs ${badgeColor}`}
                            >
                              {status}
                            </span>
                          </td>
                        );
                      })}

                      {/* Student Attendance Counts */}
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600 border-l border-slate-200 dark:border-slate-800">
                        {pCount}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-600 border-l border-slate-200 dark:border-slate-800">
                        {daysInMonth.length - pCount - 4}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-black text-blue-600 border-l border-slate-200 dark:border-slate-800">
                        <span className={student.attendancePercentage < 75 ? 'text-rose-600 font-black' : 'text-emerald-600'}>
                          {student.attendancePercentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Footer Summary Banner for Principal */}
        {activeRegisterType === 'faculty' && isPrincipal && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>प्रिंसिपल गोपनीय मासिक सैलरी कुल योग (Official Confidential Payroll)</span>
            </div>

            <div className="flex items-center gap-6 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Total Active Staff</span>
                <strong className="text-slate-900 dark:text-white text-sm">{filteredTeachers.length} Persons</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Total Earned Disbursed</span>
                <strong className="text-emerald-600 text-base font-black">
                  {formatCurrencyINR(
                    filteredTeachers.reduce(
                      (sum, t) => sum + calculateTeacherMonthlySalary(t.id, monthString).earnedSalaryToDate,
                      0
                    )
                  )}
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 50m In-Campus Geo-Fenced Attendance Punch Modal */}
      <GeoFencedSelfAttendanceModal
        isOpen={isGeoModalOpen}
        onClose={() => setIsGeoModalOpen(false)}
      />
    </div>
  );
};
