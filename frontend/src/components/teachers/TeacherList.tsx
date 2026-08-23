import React, { useState } from 'react';
import {
  Search,
  PlusCircle,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  GraduationCap,
  Download,
  BookOpen,
  Briefcase,
  IndianRupee,
  Calendar,
  Award,
  Sparkles,
  ShieldCheck,
  Users,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';
import { Teacher } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { exportToCSV, formatDate, formatCurrencyINR } from '../../utils/helpers';
import { PRINCIPAL_DETAILS } from '../../data/mockData';
import { PrincipalProfileModal } from '../common/PrincipalProfileModal';

interface TeacherListProps {
  onOpenAddModal: () => void;
  onOpenEditModal: (teacher: Teacher) => void;
  onOpenProfileModal: (teacher: Teacher) => void;
}

export const TeacherList: React.FC<TeacherListProps> = ({
  onOpenAddModal,
  onOpenEditModal,
  onOpenProfileModal
}) => {
  const { teachers, deleteTeacher } = useCollegeData();

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [staffTypeFilter, setStaffTypeFilter] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null);
  const [isPrincipalModalOpen, setIsPrincipalModalOpen] = useState(false);

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.qualification && t.qualification.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.workDescription && t.workDescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.subjects.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept = deptFilter === 'All' || t.department.includes(deptFilter);
    const matchesType = staffTypeFilter === 'All' || (t.staffType || 'Teaching Faculty') === staffTypeFilter;
    return matchesSearch && matchesDept && matchesType;
  });

  const teachingCount = teachers.filter(t => (t.staffType || 'Teaching Faculty') === 'Teaching Faculty').length;
  const nonTeachingCount = teachers.length - teachingCount;

  const handleExportCSV = () => {
    const data = filteredTeachers.map(t => ({
      'Employee Code': t.empCode,
      'Full Name': t.name,
      'Staff Category': t.staffType || 'Teaching Faculty',
      'Department': t.department,
      'Designation': t.designation,
      'Age': t.age || 40,
      'Monthly Salary (INR)': t.salary || 78500,
      'Promotion Status': t.promotionStatus || 'Regular',
      'Qualifications': t.qualification,
      'Work Mandate': t.workDescription || '-',
      'Email': t.email,
      'Mobile': t.mobile,
      'Joining Date': t.joiningDate,
      'Status': t.status
    }));
    exportToCSV('GP__Staff_Directory', data);
  };

  return (
    <div className="space-y-6">
      {/* Principal & Chief Executive Leadership Spotlight Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-slate-900 to-polytechnic-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-polytechnic-800">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <img
            src={PRINCIPAL_DETAILS.photoUrl}
            alt={PRINCIPAL_DETAILS.name}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-amber-400/80 shadow-lg flex-shrink-0"
          />
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Head of Institution &amp; Principal Dossier</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              {PRINCIPAL_DETAILS.name}
            </h2>
            <p className="text-xs text-amber-400 font-semibold">
              {PRINCIPAL_DETAILS.designation}
            </p>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Age: <span className="font-mono text-white">{PRINCIPAL_DETAILS.age} Yrs</span> • Qualification: <span className="text-white font-medium">{PRINCIPAL_DETAILS.qualification}</span> • Exp: <span className="text-white font-bold">{PRINCIPAL_DETAILS.experienceYears}+ Years</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsPrincipalModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-lg shadow-amber-400/20 transition-all flex items-center gap-1.5 flex-shrink-0"
        >
          <Eye className="w-4 h-4" /> View Principal Profile &amp; Qualifications
        </button>
      </div>

      {/* Header & KPI Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <span>Faculty &amp; Staff Service Directory (शिक्षक एवं स्टाफ सूची)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Complete institutional roster of Teaching Faculty, Workshop Superintendents, Lab Technicians &amp; Administrative Officers
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export Directory
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Register New Staff / Faculty
          </button>
        </div>
      </div>

      {/* Staff Category Tabs & Filters */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 text-xs">
          <button
            onClick={() => setStaffTypeFilter('All')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              staffTypeFilter === 'All'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All Staff &amp; Faculty ({teachers.length})
          </button>
          <button
            onClick={() => setStaffTypeFilter('Teaching Faculty')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              staffTypeFilter === 'Teaching Faculty'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
            }`}
          >
            Teaching Faculty ({teachingCount})
          </button>
          <button
            onClick={() => setStaffTypeFilter('Technical Staff')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              staffTypeFilter === 'Technical Staff'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
            }`}
          >
            Technical &amp; Workshop Staff
          </button>
          <button
            onClick={() => setStaffTypeFilter('Administrative Staff')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              staffTypeFilter === 'Administrative Staff'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100'
            }`}
          >
            Administration &amp; Registry
          </button>
          <button
            onClick={() => setStaffTypeFilter('Support Staff')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              staffTypeFilter === 'Support Staff'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
            }`}
          >
            Library, Peon, Bus Driver &amp; Support ({teachers.filter(t => t.staffType === 'Support Staff').length})
          </button>
        </div>

        {/* Search & Department Selector */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, employee code, role (Librarian, Peon, Driver, Lecturer)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>

          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-600 outline-none font-medium"
          >
            <option value="All">All Departments &amp; Wings (सभी विभाग)</option>
            <option value="Computer">Computer Science &amp; Engg</option>
            <option value="Mechanical">Mechanical Engineering</option>
            <option value="Civil">Civil Engineering</option>
            <option value="Electrical">Electrical Engineering</option>
            <option value="Electronics">Electronics Engineering</option>
            <option value="Information">Information Technology</option>
            <option value="Library">Central Library (पुस्तकालय)</option>
            <option value="Administrative">Administration &amp; Peon (प्यून व कार्यालय)</option>
            <option value="Transport">Transport &amp; Bus Fleet (बस चालक / परिवहन)</option>
            <option value="Workshop">Central Workshop &amp; Labs</option>
            <option value="Accounts">Accounts &amp; Treasury (लेखाकार)</option>
            <option value="Hostel">Hostel &amp; Security (छात्रावास व सुरक्षा)</option>
          </select>
        </div>
      </div>

      {/* Staff & Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.map(teacher => (
          <div
            key={teacher.id}
            onClick={() => onOpenProfileModal(teacher)}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-elevated hover:border-emerald-400 dark:hover:border-emerald-500 cursor-pointer transition-all flex flex-col justify-between group"
            title="Click to view full 360° service dossier & edit details"
          >
            <div>
              {/* Header: Photo, Name, Post */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={teacher.photoUrl}
                    alt={teacher.name}
                    className="w-13 h-13 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-sm flex-shrink-0 group-hover:ring-emerald-500"
                  />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors flex items-center gap-1">
                      <span>{teacher.name}</span>
                      <span className="text-[10px] text-emerald-500 opacity-0 group-hover:opacity-100">↗</span>
                    </h3>
                    <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 line-clamp-1">
                      {teacher.designation}
                    </p>
                    <span className="text-[10px] text-slate-400">{teacher.department}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {teacher.empCode}
                </span>
              </div>

              {/* Service & Salary Highlight Badges */}
              <div className="grid grid-cols-2 gap-2 my-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-400 text-[10px] block">Monthly Salary (वेतन):</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                    {formatCurrencyINR(teacher.salary || 78500)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Age &amp; Experience:</span>
                  <strong className="text-slate-800 dark:text-slate-200">
                    {teacher.age || 40} Yrs ({teacher.experienceYears}+ Yrs Svc)
                  </strong>
                </div>
              </div>

              {/* Work Mandate: कौन स्टाफ क्या काम करता है */}
              <div className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/60 dark:border-blue-900/40 mb-3 text-[11px]">
                <span className="text-[9px] font-bold uppercase text-blue-600 dark:text-blue-400 block mb-0.5">
                  Work Mandate (कार्य विवरण):
                </span>
                <p className="text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {teacher.workDescription || teacher.qualification}
                </p>
              </div>

              {/* Promotion & Qualifications snippet */}
              <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <Award className="w-3 h-3 text-amber-500 flex-shrink-0" />
                  <span className="truncate">{teacher.qualification}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                  <span className="truncate text-emerald-700 dark:text-emerald-400 font-medium">
                    {teacher.promotionStatus || 'Regular Confirmed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenProfileModal(teacher);
                }}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> Full 360° Dossier
              </button>

              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => onOpenEditModal(teacher)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                  title="Edit Staff / Faculty"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(teacher)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title="Remove Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Principal Profile Modal */}
      <PrincipalProfileModal
        isOpen={isPrincipalModalOpen}
        onClose={() => setIsPrincipalModalOpen(false)}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteTeacher(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        title="Remove Staff / Faculty Member"
        message={`Are you sure you want to remove ${deleteTarget?.name} (${deleteTarget?.empCode}) from institutional records?`}
        danger={true}
      />
    </div>
  );
};
