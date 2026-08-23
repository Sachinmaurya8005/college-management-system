import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  CheckSquare,
  CreditCard,
  UserPlus,
  PlusCircle,
  BellPlus,
  Receipt,
  FileSpreadsheet,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  MapPin,
  ShieldCheck,
  IndianRupee
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useCollegeData } from '../../context/CollegeDataContext';
import { StatCard } from '../common/StatCard';
import { formatCurrencyINR, formatDate } from '../../utils/helpers';
import { GeoFencedSelfAttendanceModal } from '../attendance/GeoFencedSelfAttendanceModal';

interface AdminDashboardProps {
  onNavigate: (view: string, metadata?: any) => void;
  onOpenAddStudent: () => void;
  onOpenAddTeacher: () => void;
  onOpenAddNotice: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onOpenAddStudent,
  onOpenAddTeacher,
  onOpenAddNotice
}) => {
  const { students, teachers, courses, fees, notices } = useCollegeData();
  const [attendancePeriod, setAttendancePeriod] = useState<'week' | 'month' | 'semester'>('week');

  // Stats calculation
  const totalStudentsCount = 1248; // Official college total
  const totalTeachersCount = 86;
  const totalCoursesCount = courses.length;

  const totalCollectedFees = fees.reduce((sum, f) => sum + f.paidAmount, 0) + 1232550;
  const totalPendingFees = fees.reduce((sum, f) => sum + f.pendingAmount, 0) + 420000;

  // Recharts Chart Data
  const attendanceWeeklyData = [
    { day: 'Mon', attendance: 84, target: 75 },
    { day: 'Tue', attendance: 79, target: 75 },
    { day: 'Wed', attendance: 92, target: 75 },
    { day: 'Thu', attendance: 86, target: 75 },
    { day: 'Fri', attendance: 78, target: 75 },
    { day: 'Sat', attendance: 74, target: 75 }
  ];

  const attendanceMonthlyData = [
    { day: 'Week 1', attendance: 82, target: 75 },
    { day: 'Week 2', attendance: 88, target: 75 },
    { day: 'Week 3', attendance: 76, target: 75 },
    { day: 'Week 4', attendance: 84, target: 75 }
  ];

  const attendanceSemesterData = [
    { day: 'Jan', attendance: 89, target: 75 },
    { day: 'Feb', attendance: 85, target: 75 },
    { day: 'Mar', attendance: 81, target: 75 },
    { day: 'Apr', attendance: 78, target: 75 },
    { day: 'May', attendance: 91, target: 75 }
  ];

  const currentAttendanceData =
    attendancePeriod === 'week'
      ? attendanceWeeklyData
      : attendancePeriod === 'month'
      ? attendanceMonthlyData
      : attendanceSemesterData;

  const feeComparisonData = [
    { branch: 'CSE', Collected: 380000, Pending: 85000 },
    { branch: 'Mechanical', Collected: 320000, Pending: 95000 },
    { branch: 'Civil', Collected: 290000, Pending: 70000 },
    { branch: 'Electrical', Collected: 245000, Pending: 110000 },
    { branch: 'Electronics', Collected: 195000, Pending: 60000 }
  ];

  const branchEnrollmentData = [
    { name: 'Computer Science', value: 180, color: '#3B82F6' },
    { name: 'Mechanical', value: 175, color: '#F59E0B' },
    { name: 'Civil', value: 178, color: '#10B981' },
    { name: 'Electrical', value: 172, color: '#8B5CF6' },
    { name: 'Electronics', value: 160, color: '#EC4899' },
    { name: 'IT', value: 164, color: '#06B6D4' }
  ];

  const todayDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-polytechnic-900 via-blue-900 to-indigo-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-amber-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Session 2025–2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, Admin 👋
          </h1>
          <p className="text-sm text-blue-200 mt-1 flex items-center gap-2">
            <span>Government Polytechnic Bansdeeh, Ballia</span>
            <span>•</span>
            <span className="font-medium text-white">{todayDate}</span>
          </p>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <button
            onClick={onOpenAddStudent}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Add Student
          </button>
          <button
            onClick={() => onNavigate('attendance')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md transition-all"
          >
            <CheckSquare className="w-4 h-4" /> Mark Attendance
          </button>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Students"
          value={totalStudentsCount.toLocaleString('en-IN')}
          icon={Users}
          color="blue"
          trend={{ value: '+4.5%', isPositive: true, label: 'vs last year' }}
          onClick={() => onNavigate('students')}
        />
        <StatCard
          title="Total Faculty"
          value={totalTeachersCount}
          icon={GraduationCap}
          color="emerald"
          trend={{ value: '100% Active', isPositive: true }}
          onClick={() => onNavigate('teachers')}
        />
        <StatCard
          title="Total Courses"
          value={totalCoursesCount}
          icon={BookOpen}
          color="purple"
          description="AICTE Approved Diploma Branches"
          onClick={() => onNavigate('courses')}
        />
        <StatCard
          title="Today's Attendance"
          value="78%"
          icon={CheckSquare}
          color="amber"
          trend={{ value: '+2.1%', isPositive: true, label: 'today' }}
          onClick={() => onNavigate('attendance')}
        />
        <StatCard
          title="Total Fees Collected"
          value={formatCurrencyINR(totalCollectedFees)}
          icon={CreditCard}
          color="indigo"
          trend={{ value: '92% Cleared', isPositive: true }}
          onClick={() => onNavigate('fees')}
        />
      </div>

      {/* Quick Actions Grid */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          Administrative Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={onOpenAddStudent}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-center transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Add Student</span>
          </button>

          <button
            onClick={onOpenAddTeacher}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-center transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Add Faculty</span>
          </button>

          <button
            onClick={() => onNavigate('attendance')}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 text-center transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Mark Attendance</span>
          </button>

          <button
            onClick={onOpenAddNotice}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 text-center transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <BellPlus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Publish Notice</span>
          </button>

          <button
            onClick={() => onNavigate('fees')}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-rose-500 dark:hover:border-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-center transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Fee Counter</span>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-center transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">View Reports</span>
          </button>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Analytics (2 cols on desktop) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Attendance Trends &amp; Compliance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Average institutional daily student attendance vs 75% BTEUP criterion
              </p>
            </div>

            {/* Period Filter Dropdown */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setAttendancePeriod('week')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  attendancePeriod === 'week'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setAttendancePeriod('month')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  attendancePeriod === 'month'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setAttendancePeriod('semester')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  attendancePeriod === 'semester'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                This Semester
              </button>
            </div>
          </div>

          {/* Area Chart */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stop-color="#3B82F6" stop-opacity={0.35} />
                    <stop offset="95%" stop-color="#3B82F6" stop-opacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <Tooltip
                  formatter={(value: any) => [`${value}%`, 'Attendance']}
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="#2563EB"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#attendanceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Branch-wise Student Enrollment Distribution */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Branch Enrollment Ratio
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Departmental distribution of diploma candidates
            </p>
          </div>

          <div className="h-60 w-full relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={branchEnrollmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {branchEnrollmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} Students`, 'Enrolled']}
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center pointer-events-none">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">1,029</span>
              <span className="text-[10px] text-slate-400">Total Enrolled</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
            {branchEnrollmentData.map(b => (
              <div key={b.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
                <span className="truncate text-slate-600 dark:text-slate-300 font-medium">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Fee Collection Analysis & Recent Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fees Bar Chart (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Branch-wise Fee Collection &amp; Dues
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tuition fee received vs outstanding balances in Indian Rupees (₹)
              </p>
            </div>
            <button
              onClick={() => onNavigate('fees')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Fee Register <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feeComparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="branch" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <YAxis
                  tickFormatter={val => `₹${val / 1000}k`}
                  tick={{ fontSize: 12 }}
                  stroke="#94A3B8"
                />
                <Tooltip
                  formatter={(val: any) => [formatCurrencyINR(val), 'Amount']}
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Collected" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Pending" fill="#F87171" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Official Circulars & Notices */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Circulars
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official announcements &amp; orders
              </p>
            </div>
            <button
              onClick={() => onNavigate('notices')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Notices Feed */}
          <div className="space-y-3 flex-1 overflow-y-auto max-h-80 pr-1">
            {notices.slice(0, 4).map(notice => {
              const categoryColors: Record<string, string> = {
                Examination: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200',
                Fees: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200',
                Events: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200',
                Academic: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200',
                Holiday: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200',
                General: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200'
              };

              return (
                <div
                  key={notice.id}
                  onClick={() => onNavigate('notices', { noticeId: notice.id })}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                        categoryColors[notice.category] || categoryColors.General
                      }`}
                    >
                      {notice.category}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDate(notice.publishDate)}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1 transition-colors">
                    {notice.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {notice.content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
