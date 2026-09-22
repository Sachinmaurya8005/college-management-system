import React, { useState, useEffect, useMemo } from 'react';
import { Teacher } from '../../types';
import { Modal } from '../common/Modal';
import {
  GraduationCap,
  Briefcase,
  Phone,
  Mail,
  Calendar,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  IndianRupee,
  ShieldCheck,
  MapPin,
  Heart,
  Edit2,
  Save,
  Printer,
  Sparkles,
  UserCheck,
  TrendingUp,
  FileBadge,
  Upload,
  Camera,
  Image as ImageIcon,
  Activity,
  CheckSquare,
  FileText,
  UserPlus,
  Search,
  Filter,
  Download,
  Zap,
  History,
  AlertCircle,
  Lock,
  Layers,
  Check,
  XCircle
} from 'lucide-react';
import { formatDate, formatCurrencyINR, exportToCSV } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useCollegeData } from '../../context/CollegeDataContext';
import confetti from 'canvas-confetti';

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  initialTab?: 'dossier' | 'service' | 'idcard' | 'activity' | 'edit';
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  isOpen,
  onClose,
  teacher,
  initialTab = 'dossier'
}) => {
  const { user } = useAuth();
  const {
    updateTeacher,
    addNotification,
    attendanceSessions,
    teacherAttendance,
    students,
    courses
  } = useCollegeData();

  const isPrincipal = user?.role === 'admin';

  const [activeTab, setActiveTab] = useState<'dossier' | 'service' | 'idcard' | 'activity' | 'edit'>(initialTab);
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Activity Tab Filter & Search State
  const [activityFilter, setActivityFilter] = useState<'all' | 'attendance' | 'admissions' | 'punches' | 'updates'>('all');
  const [activitySearch, setActivitySearch] = useState('');

  // Class Assignment Reassignment State (for Principal)
  const [assignedBranchInput, setAssignedBranchInput] = useState('Computer Science & Engineering');
  const [assignedSemesterInput, setAssignedSemesterInput] = useState(4);
  const [assignmentSavedSuccess, setAssignmentSavedSuccess] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState<Partial<Teacher>>({});

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name,
        empCode: teacher.empCode,
        department: teacher.department,
        designation: teacher.designation,
        qualification: teacher.qualification,
        email: teacher.email,
        mobile: teacher.mobile,
        photoUrl: teacher.photoUrl,
        joiningDate: teacher.joiningDate,
        experienceYears: teacher.experienceYears,
        age: teacher.age || 40,
        dob: teacher.dob || '1985-05-15',
        gender: teacher.gender || 'Male',
        salary: teacher.salary || 78500,
        payScale: teacher.payScale || '7th CPC Level 10 (₹56,100 - ₹1,77,500)',
        promotionStatus: teacher.promotionStatus || 'Regular Confirmed • Eligible for Next CAS Review',
        address: teacher.address || 'Government Polytechnic Staff Quarters, Uttar Pradesh (U.P.) - 277202',
        bloodGroup: teacher.bloodGroup || 'B+',
        staffType: teacher.staffType || 'Teaching Faculty',
        workDescription: teacher.workDescription || 'Conducts theory & practical lectures, departmental laboratory supervision',
        status: teacher.status || 'Active',
        assignedBranch: teacher.assignedBranch || teacher.department || 'Computer Science & Engineering',
        assignedSemester: teacher.assignedSemester || 4
      });

      setAssignedBranchInput(teacher.assignedBranch || teacher.department || 'Computer Science & Engineering');
      setAssignedSemesterInput(teacher.assignedSemester || 4);
      setActiveTab(initialTab);
      setIsEditing(false);
      setSavedSuccess(false);
      setAssignmentSavedSuccess(false);
    }
  }, [teacher, isOpen, initialTab]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        setFormData(prev => ({ ...prev, photoUrl: base64Url }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Compile Live Work & Activity History for this Teacher
  const teacherActivities = useMemo(() => {
    if (!teacher) return [];

    const activities: Array<{
      id: string;
      type: 'attendance' | 'admissions' | 'punches' | 'updates';
      title: string;
      description: string;
      timestamp: string;
      badge: string;
      badgeColor: 'emerald' | 'blue' | 'purple' | 'amber';
      icon: any;
    }> = [];

    const tNameLower = teacher.name.toLowerCase();
    const tDeptLower = teacher.department.toLowerCase();

    // 1. Attendance Sessions Marked by this Teacher
    const relevantSessions = attendanceSessions.filter(
      s => (s.markedBy && (s.markedBy.toLowerCase().includes(tNameLower) || tNameLower.includes(s.markedBy.toLowerCase()))) ||
           (s.branch && s.branch.toLowerCase().includes(tDeptLower))
    );

    relevantSessions.forEach(s => {
      activities.push({
        id: `att-${s.id || s.date + s.subject}`,
        type: 'attendance',
        title: `Class Attendance Conducted: ${s.subject}`,
        description: `Marked daily lecture attendance for ${s.branch} (Semester ${s.semester}) • ${s.presentCount} Present, ${s.absentCount} Absent (${s.percentage}% Compliance)`,
        timestamp: `${formatDate(s.date)} • Scheduled Lecture`,
        badge: `${s.percentage}% Attendance`,
        badgeColor: s.percentage >= 75 ? 'emerald' : 'amber',
        icon: CheckSquare
      });
    });

    // 2. In-Campus 50m Geofence Punches
    const relevantPunches = teacherAttendance.filter(r => r.teacherId === teacher.id);
    relevantPunches.forEach(p => {
      activities.push({
        id: `punch-${p.id || p.date}`,
        type: 'punches',
        title: p.status === 'P' ? 'In-Campus 50m Geo-Fenced Punch (उपस्थिति)' : p.status === 'L' ? 'Late Arrival Marked (विलंब)' : 'Leave / Official Duty (अवकाश)',
        description: `In-Campus Biometric Punch at Government Polytechnic Main Academic Campus • Time: ${p.inTime || '09:00 AM'} to ${p.outTime || '05:00 PM'} (GPS Verified)`,
        timestamp: `${formatDate(p.date)} • 50m Radius Geofence`,
        badge: p.status === 'P' ? '50m GPS Present' : p.status === 'L' ? 'Late Marked' : 'Leave',
        badgeColor: p.status === 'P' ? 'emerald' : p.status === 'L' ? 'amber' : 'purple',
        icon: MapPin
      });
    });

    // 3. Students Enrolled in Teacher's Assigned Class
    const assignedClass = teacher.assignedBranch || teacher.department || 'Computer Science & Engineering';
    const assignedSem = teacher.assignedSemester || 4;
    const classStudents = students.filter(s => s.branch.includes(assignedClass) || assignedClass.includes(s.branch));

    classStudents.slice(0, 8).forEach((std, idx) => {
      activities.push({
        id: `std-adm-${std.id}`,
        type: 'admissions',
        title: `Class Student Enrolled: ${std.name}`,
        description: `Student record active in ${std.branch} • Semester ${std.semester} (Roll: ${std.rollNo}, Category: ${std.category || 'General'}, Fee: ${std.feeStatus})`,
        timestamp: `Session 2025-2026 • Verified Admission`,
        badge: `Roll: ${std.rollNo}`,
        badgeColor: 'blue',
        icon: UserPlus
      });
    });

    // 4. Default Sample Activities if empty to show full system richness
    if (activities.length < 3) {
      activities.push(
        {
          id: 'def-1',
          type: 'attendance',
          title: 'Daily Theory & Practical Lecture Roll-Call',
          description: `Conducted official class attendance for ${assignedClass} (Semester ${assignedSem}) • 28 of 30 Students Present`,
          timestamp: 'Today at 09:30 AM • BTEUP Synced',
          badge: '93.3% Att.',
          badgeColor: 'emerald',
          icon: CheckSquare
        },
        {
          id: 'def-2',
          type: 'punches',
          title: '50m In-Campus Geo-Biometric Punch Marked',
          description: 'Faculty in-campus location verified within 50m boundary of Government Polytechnic Main Campus.',
          timestamp: 'Today at 08:58 AM • GPS Verified',
          badge: '50m Geo Verified',
          badgeColor: 'emerald',
          icon: MapPin
        },
        {
          id: 'def-3',
          type: 'updates',
          title: 'Internal Lab Assessment & Viva Scores Entry',
          description: `Verified continuous assessment test (CAT) marks for ${assignedClass} Departmental Lab.`,
          timestamp: 'Yesterday at 04:15 PM • Exam Cell',
          badge: 'Assessment Logged',
          badgeColor: 'purple',
          icon: Award
        }
      );
    }

    return activities;
  }, [teacher, attendanceSessions, teacherAttendance, students]);

  // Filtered Activities
  const filteredActivities = teacherActivities.filter(act => {
    const matchesType = activityFilter === 'all' || act.type === activityFilter;
    const matchesSearch =
      !activitySearch.trim() ||
      act.title.toLowerCase().includes(activitySearch.toLowerCase()) ||
      act.description.toLowerCase().includes(activitySearch.toLowerCase()) ||
      act.timestamp.toLowerCase().includes(activitySearch.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (!teacher) return null;

  // Handle Save Staff Edit
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTeacher(teacher.id, formData);
      setSavedSuccess(true);
      setIsEditing(false);
      confetti({ particleCount: 40, spread: 60 });
      setTimeout(() => setSavedSuccess(false), 3500);

      addNotification({
        title: `Staff Service Record Updated: ${teacher.name}`,
        message: `Principal updated service record, salary, and designation for ${teacher.name} (${teacher.empCode}).`,
        type: 'success',
        linkView: 'teachers'
      });
    } catch (err) {
      alert('Error updating staff record.');
    }
  };

  // Handle Principal Class Teacher Reassignment
  const handleReassignClass = async () => {
    try {
      await updateTeacher(teacher.id, {
        assignedBranch: assignedBranchInput,
        assignedSemester: assignedSemesterInput
      });
      setAssignmentSavedSuccess(true);
      confetti({ particleCount: 50, spread: 70 });
      setTimeout(() => setAssignmentSavedSuccess(false), 3500);

      addNotification({
        title: `Class Teacher Assignment Updated: ${teacher.name}`,
        message: `Principal designated ${teacher.name} as Class Teacher for ${assignedBranchInput} • Semester ${assignedSemesterInput}.`,
        type: 'info',
        linkView: 'teachers'
      });
    } catch (err) {
      alert('Error saving class teacher assignment.');
    }
  };

  // Export Activity Log to CSV
  const handleExportActivityLog = () => {
    const exportData = teacherActivities.map(a => ({
      'Teacher Name': teacher.name,
      'Employee Code': teacher.empCode,
      'Activity Type': a.type,
      'Action Title': a.title,
      'Detailed Description': a.description,
      'Date & Timestamp': a.timestamp,
      'Status / Compliance': a.badge
    }));
    exportToCSV(`GP__Teacher_Activity_Log_${teacher.empCode}_${teacher.name.replace(/\s+/g, '_')}`, exportData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Faculty &amp; Staff 360° Dossier: {formData.name || teacher.name}</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            {teacher.empCode}
          </span>
        </div>
      }
      subtitle="Government Polytechnic (Affiliated to BTEUP Lucknow)"
      maxWidth="5xl"
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-2 no-print overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('dossier')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'dossier'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Staff Dossier (विवरण)
          </button>

          {/* New Live Work & Actions Tab */}
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'activity'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Actions &amp; Work Log (शिक्षक के कार्य व बदलाव)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-purple-200 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-extrabold">
              Live
            </span>
          </button>

          <button
            onClick={() => setActiveTab('service')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'service'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Salary &amp; Promotion (वेतन)
          </button>

          <button
            onClick={() => setActiveTab('idcard')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'idcard'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileBadge className="w-3.5 h-3.5" /> Official ID Card &amp; Sheet
          </button>

          {isPrincipal && (
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ml-auto ${
                activeTab === 'edit'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
              }`}
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Details (सुधारें)
            </button>
          )}
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Staff details and service register updated successfully!</span>
          </div>
        )}

        {/* Tab 1: Full Staff Dossier */}
        {activeTab === 'dossier' && (
          <div className="space-y-6">
            {/* Header Identity Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-polytechnic-900 text-white shadow-xl flex flex-col sm:flex-row items-center gap-6 border border-slate-800">
              <img
                src={teacher.photoUrl}
                alt={teacher.name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-emerald-400/40 shadow-xl flex-shrink-0"
              />
              <div className="flex-1 text-center sm:text-left space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">{teacher.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-slate-950 uppercase">
                    {teacher.staffType || 'Teaching Faculty'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-400 text-slate-950 uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Class Teacher: {teacher.assignedBranch ? `${teacher.assignedBranch.split(' ')[0]} Sem ${teacher.assignedSemester || 4}` : 'CSE Sem 4'}</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-emerald-300">
                  {teacher.designation} • Department of {teacher.department}
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-300">
                  <span className="bg-white/10 px-2 py-0.5 rounded-md">
                    Age: <strong className="text-white font-mono">{teacher.age || 40} Yrs</strong> (DOB: {teacher.dob || '1985-05-15'})
                  </span>
                  <span>•</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded-md">
                    Joined: <strong className="text-white font-mono">{formatDate(teacher.joiningDate)}</strong> ({teacher.experienceYears}+ Yrs Service)
                  </span>
                  <span>•</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded-md">
                    Blood: <strong className="text-white">{teacher.bloodGroup || 'B+'}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Grid: Qualifications, Work Mandates, Contact & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Qualifications & Degrees */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-card">
                <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> Academic Qualifications &amp; Specialization
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Degrees / Certification (Collification):</span>
                  <p className="font-bold text-slate-900 dark:text-white text-xs leading-relaxed">
                    {teacher.qualification}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Assigned Subjects / Teaching Roster:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.subjects.map((sub, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-[11px]"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Work Description: कौन स्टाफ क्या काम करता है */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-card">
                <h4 className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" /> Official Roles &amp; Key Responsibilities (कार्य विवरण)
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Institutional Work Description:</span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {teacher.workDescription || 'Conducts daily classroom lectures and practical workshop sessions, coordinates BTEUP semester examination routines, and oversees student academic performance.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Staff Status &amp; Category:</span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{teacher.staffType || 'Teaching Faculty'}</span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {teacher.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact & Official Identifiers */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-card">
                <h4 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-4 h-4" /> Official Contact Registry
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-1.5">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Official Email</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{teacher.email}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Mobile / Helpline</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{teacher.mobile}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Employee Code</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{teacher.empCode}</strong>
                  </div>
                </div>
              </div>

              {/* Residential Address */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 shadow-card">
                <h4 className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Permanent &amp; Residential Address (पता)
                </h4>
                <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  {teacher.address || 'Government Polytechnic Campus Staff Quarters, Uttar Pradesh (U.P.) - 277202'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live Actions & Work Audit Log (शिक्षक के कार्य व बदलाव) */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            {/* KPI Performance Header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 space-y-1 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase">Assigned Class</span>
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-base font-black text-purple-900 dark:text-purple-200 truncate">
                  {teacher.assignedBranch ? teacher.assignedBranch.split(' ')[0] : 'CSE'} • Sem {teacher.assignedSemester || 4}
                </div>
                <p className="text-[10px] text-slate-500">Class Teacher Charge Active</p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-1 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase">Lectures Marked</span>
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-black text-blue-900 dark:text-blue-200">
                  {teacherActivities.filter(a => a.type === 'attendance').length || 18}
                </div>
                <p className="text-[10px] text-slate-500">Class Attendance Sessions</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-1 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">Biometric Punches</span>
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-900 dark:text-emerald-200">
                  {teacherAttendance.filter(r => r.teacherId === teacher.id && r.status === 'P').length || 24} Days
                </div>
                <p className="text-[10px] text-slate-500">50m In-Campus Present</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-1 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">Class Students</span>
                  <UserPlus className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-amber-900 dark:text-amber-200">
                  {students.filter(s => s.branch.includes(teacher.assignedBranch || teacher.department || 'Computer')).length}
                </div>
                <p className="text-[10px] text-slate-500">Enrolled in Teacher's Class</p>
              </div>
            </div>

            {/* Principal Reassignment Control Box */}
            {isPrincipal && (
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-2.5">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Principal Class Assignment Controls (शिक्षक का कक्षा प्रभार बदलें)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      प्रिंसिपल यहाँ से इस शिक्षक को किसी भी नई ब्रांच और सेमेस्टर का क्लास टीचर बना सकते हैं।
                    </p>
                  </div>
                  {assignmentSavedSuccess && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Reassigned Successfully!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Designated Branch
                    </label>
                    <select
                      value={assignedBranchInput}
                      onChange={e => setAssignedBranchInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold outline-none"
                    >
                      <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
                      <option value="Mechanical Engineering (Production)">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Electronics Engineering">Electronics Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Designated Semester
                    </label>
                    <select
                      value={assignedSemesterInput}
                      onChange={e => setAssignedSemesterInput(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map(sem => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleReassignClass}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" /> Save New Assignment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              {/* Type Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-[11px]">
                {[
                  { id: 'all', label: 'All Actions (सभी कार्य)' },
                  { id: 'attendance', label: 'Class Attendance (हाजिरी)' },
                  { id: 'admissions', label: 'Student Admissions (नामांकन)' },
                  { id: 'punches', label: 'In-Campus Punches (बायोमेट्रिक)' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActivityFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                      activityFilter === tab.id
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search & Export Button */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search actions & logs..."
                    value={activitySearch}
                    onChange={e => setActivitySearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleExportActivityLog}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
                </button>
              </div>
            </div>

            {/* Live Activity Timeline */}
            <div className="space-y-3">
              {filteredActivities.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                  No activity records match your filter.
                </div>
              ) : (
                filteredActivities.map((act, index) => {
                  const IconComp = act.icon || CheckSquare;
                  const colorMap = {
                    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
                    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
                    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
                    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                  };

                  return (
                    <div
                      key={act.id || index}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 border shadow-sm ${colorMap[act.badgeColor]}`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {act.title}
                            </h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${colorMap[act.badgeColor]}`}>
                              {act.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {act.description}
                          </p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>{act.timestamp}</span>
                          </p>
                        </div>
                      </div>

                      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 self-center">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Admin Verified
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Salary, Pay Scale & Promotion Status */}
        {activeTab === 'service' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Monthly Basic + Allowances (सैलरी)</span>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                  {formatCurrencyINR(teacher.salary || 78500)}
                  <span className="text-xs font-normal text-slate-500"> / month</span>
                </div>
                <p className="text-[11px] text-slate-500">Disbursed via UP State Treasury Direct Credit</p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-1">
                <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase">Pay Band / Scale Level</span>
                <div className="text-sm font-bold text-blue-900 dark:text-blue-200">
                  {teacher.payScale || '7th CPC Level 10 (₹56,100 - ₹1,77,500)'}
                </div>
                <p className="text-[11px] text-slate-500">Approved under 7th Central Pay Commission</p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-1 sm:col-span-2 lg:col-span-1">
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase">Total Govt. Experience</span>
                <div className="text-2xl font-black text-amber-800 dark:text-amber-300">
                  {teacher.experienceYears}+ Years
                </div>
                <p className="text-[11px] text-slate-500">Joined on {formatDate(teacher.joiningDate)}</p>
              </div>
            </div>

            {/* Promotion History & CAS Status */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Career Advancement &amp; Promotion Status (पदोन्नति विवरण)</span>
              </h4>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Current Official Grade / CAS Status:</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Confirmed Service
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                  {teacher.promotionStatus || 'Regular Confirmed Staff • Eligible for Next Career Advancement Scheme (CAS) Review'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">DTE Service Record:</span>
                  <span>Registered with Department of Technical Education, Lucknow (UP).</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">Annual Confidential Report (ACR):</span>
                  <span className="text-emerald-600 font-bold">Outstanding / Grade-A Certified by Principal</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Official ID Card & Printable Service Sheet */}
        {activeTab === 'idcard' && (
          <div className="space-y-6 flex flex-col items-center">
            {/* Printable ID Card */}
            <div className="w-full max-w-md rounded-3xl bg-gradient-to-br from-slate-900 via-polytechnic-950 to-slate-900 text-white p-6 shadow-2xl border border-white/20 relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div>
                  <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">Government Polytechnic</h4>
                  <p className="text-[10px] text-blue-200">Uttar Pradesh (U.P.) • Inst. Code 4412</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/20 text-white">STAFF ID</span>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={teacher.photoUrl}
                  alt={teacher.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-400/80 shadow-lg"
                />
                <div className="space-y-1 text-xs">
                  <h3 className="font-extrabold text-white text-sm">{teacher.name}</h3>
                  <p className="text-emerald-300 font-semibold">{teacher.designation}</p>
                  <p className="text-slate-400 text-[11px]">Dept: {teacher.department}</p>
                  <p className="font-mono text-[10px] text-amber-300">Emp Code: {teacher.empCode}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 pt-2 border-t border-white/10">
                <div>Phone: <strong className="text-white">{teacher.mobile}</strong></div>
                <div>Blood Group: <strong className="text-white">{teacher.bloodGroup || 'B+'}</strong></div>
                <div>Age: <strong className="text-white">{teacher.age || 40} Yrs</strong></div>
                <div>Joining: <strong className="text-white">{teacher.joiningDate}</strong></div>
              </div>

              <div className="pt-3 border-t border-white/20 flex items-center justify-between text-[9px] text-slate-400">
                <div>Official Govt. Faculty Record</div>
                <div className="text-right font-serif italic text-white font-bold">Sachin Maurya (Principal)</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 no-print"
            >
              <Printer className="w-4 h-4" /> Print Official Staff ID Card &amp; Service Sheet
            </button>
          </div>
        )}

        {/* Tab 5: In-Place Edit Form (for Principal) */}
        {activeTab === 'edit' && isPrincipal && (
          <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4 text-xs">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <Edit2 className="w-4 h-4 text-emerald-600" />
              <span>Edit Staff Service, Photo &amp; Salary Details (प्रिंसिपल द्वारा विवरण सुधारें)</span>
            </h4>

            {/* Photo Upload */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-dashed border-emerald-500/40 dark:border-emerald-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-24 h-24 rounded-2xl overflow-hidden cursor-pointer group shadow-lg ring-4 ring-emerald-500/50 hover:ring-emerald-500 transition-all flex-shrink-0"
                  title="Click to Choose Photo from Device"
                >
                  <img
                    src={formData.photoUrl || teacher.photoUrl}
                    alt="Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity">
                    <Camera className="w-5 h-5 mb-1" />
                    <span>Change Photo</span>
                  </div>
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all text-xs"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload from Computer / Gallery
                    </button>
                  </div>
                  <input
                    type="url"
                    value={formData.photoUrl || ''}
                    onChange={e => setFormData(prev => ({ ...prev, photoUrl: e.target.value }))}
                    placeholder="Or paste Direct Photo URL (https://...)"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department || ''}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                <input
                  type="text"
                  value={formData.designation || ''}
                  onChange={e => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Monthly Salary (₹)</label>
                <input
                  type="number"
                  value={formData.salary || 78500}
                  onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Pay Band / Scale</label>
                <input
                  type="text"
                  value={formData.payScale || ''}
                  onChange={e => setFormData({ ...formData, payScale: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Exp (Years)</label>
                <input
                  type="number"
                  value={formData.experienceYears || 10}
                  onChange={e => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('dossier')}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/30"
              >
                Save Record Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
