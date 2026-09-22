import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  GraduationCap,
  Sparkles,
  Download,
  AlertCircle,
  Lock,
  ShieldCheck,
  Building,
  CheckCircle2
} from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types';
import { Pagination } from '../common/Pagination';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { exportToCSV } from '../../utils/helpers';

interface StudentListProps {
  onOpenAddModal: () => void;
  onOpenEditModal: (student: Student) => void;
  onOpenProfileModal: (student: Student) => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  onOpenAddModal,
  onOpenEditModal,
  onOpenProfileModal
}) => {
  const { user } = useAuth();
  const { students, deleteStudent, courses, teachers } = useCollegeData();

  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';

  // Find live assigned branch and semester for the logged-in teacher
  const currentTeacherObj = teachers.find(
    t =>
      (user?.email && t.email?.toLowerCase() === user.email.toLowerCase()) ||
      t.id === user?.id ||
      (user?.empCode && t.empCode?.toLowerCase() === user.empCode.toLowerCase()) ||
      (user?.name && t.name?.toLowerCase().includes(user.name.toLowerCase()))
  );

  const teacherAssignedBranch = currentTeacherObj?.assignedBranch || currentTeacherObj?.department || 'Computer Science & Engineering';
  const teacherAssignedSemester = currentTeacherObj?.assignedSemester || 4;

  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

  // Normalize string for fuzzy branch matching
  const normalize = (str: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  // Filtering: If Teacher, strictly lock to assigned branch & semester
  const filteredStudents = students.filter(student => {
    if (isTeacher) {
      const sNorm = normalize(student.branch);
      const assignedNorm = normalize(teacherAssignedBranch);
      const branchMatch =
        sNorm.includes(assignedNorm) ||
        assignedNorm.includes(sNorm) ||
        (assignedNorm.includes('computer') && sNorm.includes('computer')) ||
        (assignedNorm.includes('mechanical') && sNorm.includes('mechanical')) ||
        (assignedNorm.includes('civil') && sNorm.includes('civil')) ||
        (assignedNorm.includes('electrical') && sNorm.includes('electrical')) ||
        (assignedNorm.includes('electronics') && sNorm.includes('electronics')) ||
        (assignedNorm.includes('information') && sNorm.includes('information'));

      const semesterMatch = student.semester === teacherAssignedSemester;
      if (!branchMatch || !semesterMatch) return false;
    } else {
      const matchesBranch = branchFilter === 'All' || student.branch.includes(branchFilter);
      const matchesSemester = semesterFilter === 'All' || student.semester.toString() === semesterFilter;
      if (!matchesBranch || !matchesSemester) return false;
    }

    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.mobile.includes(searchTerm);

    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleExportCSV = () => {
    const exportData = filteredStudents.map(s => ({
      'Roll Number': s.rollNo,
      'Enrollment Number': s.enrollmentNo,
      'Full Name': s.name,
      'Father Name': s.fatherName,
      'Gender': s.gender,
      'Branch': s.branch,
      'Semester': s.semester,
      'Mobile': s.mobile,
      'Email': s.email,
      'Category': s.category,
      'Attendance %': s.attendancePercentage,
      'Fee Status': s.feeStatus,
      'Status': s.status
    }));
    const fileName = isTeacher 
      ? `GP__Students_${teacherAssignedBranch}_Sem${teacherAssignedSemester}`
      : 'GP__Students_Master_List';
    exportToCSV(fileName, exportData);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              {isTeacher ? 'Class Student Directory & Dossiers (कक्षा छात्र सूची)' : 'Student Directory & Records (Admin Master)'}
            </h1>
            {isTeacher && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300">
                Class Teacher Mode
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {isTeacher ? (
              <span>
                🏛️ Assigned Class: <strong>{teacherAssignedBranch}</strong> • <strong>Semester {teacherAssignedSemester}</strong> • Total <strong>{filteredStudents.length} Students</strong> in your class
              </span>
            ) : (
              <span>
                Government Polytechnic • Total Enrolled: <strong>{students.length} Candidates</strong> (All Branches & Semesters)
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSV
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
          >
            <UserPlus className="w-4 h-4" /> {isTeacher ? 'Add Class Student' : 'Add Student'}
          </button>
        </div>
      </div>

      {/* Teacher Isolation Banner */}
      {isTeacher && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent border border-blue-200 dark:border-blue-900/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                🔒 Class Teacher Privacy & Isolation Active
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Principal ke nirdesh anusar aapko <strong>{teacherAssignedBranch} (Semester {teacherAssignedSemester})</strong> assign kiya gaya hai. Yahan keval aapki class ke bache dikhayi de rahe hain.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified Class Teacher
          </span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={isTeacher ? "Search students in your class by name, roll no, mobile..." : "Search by name, roll no, enrollment no..."}
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        {/* Branch Control: Locked for Teacher, Selectable for Admin */}
        {isTeacher ? (
          <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span className="truncate max-w-[200px]">{teacherAssignedBranch}</span>
          </div>
        ) : (
          <select
            value={branchFilter}
            onChange={e => {
              setBranchFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
          >
            <option value="All">All Branches</option>
            <option value="Computer">Computer Science &amp; Engg</option>
            <option value="Mechanical">Mechanical Engg</option>
            <option value="Civil">Civil Engg</option>
            <option value="Electrical">Electrical Engg</option>
            <option value="Electronics">Electronics Engg</option>
            <option value="Information">Information Technology</option>
          </select>
        )}

        {/* Semester Control: Locked for Teacher, Selectable for Admin */}
        {isTeacher ? (
          <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Semester {teacherAssignedSemester}</span>
          </div>
        ) : (
          <select
            value={semesterFilter}
            onChange={e => {
              setSemesterFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
          >
            <option value="All">All Semesters</option>
            <option value="1">1st Semester</option>
            <option value="2">2nd Semester</option>
            <option value="3">3rd Semester</option>
            <option value="4">4th Semester</option>
            <option value="5">5th Semester</option>
            <option value="6">6th Semester</option>
          </select>
        )}

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={e => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
          <option value="Alumni">Alumni</option>
        </select>
      </div>

      {/* Table Data */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50/75 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Student Details</th>
                <th className="px-4 py-3.5">BTEUP Roll No</th>
                <th className="px-4 py-3.5">Branch &amp; Sem</th>
                <th className="px-4 py-3.5">Contact</th>
                <th className="px-4 py-3.5 text-center">Attendance</th>
                <th className="px-4 py-3.5 text-center">Fee Status</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    {isTeacher 
                      ? `No active students found in ${teacherAssignedBranch} (Semester ${teacherAssignedSemester}). Click "+ Add Class Student" to enroll.`
                      : "No students match the selected filters."
                    }
                  </td>
                </tr>
              ) : (
                paginatedStudents.map(student => {
                  const att = student.attendancePercentage;
                  const attColor =
                    att >= 75
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : att >= 65
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300';

                  const feeColor =
                    student.feeStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : student.feeStatus === 'Partial'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Photo & Name */}
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => onOpenProfileModal(student)}
                          className="flex items-center gap-3 text-left group"
                          title="Click to view 360° dossier and edit student details"
                        >
                          <img
                            src={student.photoUrl}
                            alt={student.name}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0 group-hover:ring-2 group-hover:ring-blue-500"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:underline underline-offset-2 flex items-center gap-1">
                              <span>{student.name}</span>
                              <span className="text-[10px] text-blue-500 font-normal opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {student.category} • {student.gender} • DOB: {student.dob || '2004-05-14'}
                            </div>
                          </div>
                        </button>
                      </td>

                      {/* Roll No */}
                      <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {student.rollNo}
                        <div className="text-[10px] text-slate-400 font-normal">
                          Enr: {student.enrollmentNo}
                        </div>
                      </td>

                      {/* Branch & Sem */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {student.branch}
                        </div>
                        <div className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                          Semester {student.semester}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                          <Phone className="w-3 h-3 text-slate-400" /> {student.mobile}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 truncate max-w-[150px]">
                          <Mail className="w-3 h-3 text-slate-400" /> {student.email}
                        </div>
                      </td>

                      {/* Attendance % */}
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black ${attColor}`}>
                          {att}%
                        </span>
                      </td>

                      {/* Fee Status */}
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${feeColor}`}>
                          {student.feeStatus}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {student.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenProfileModal(student)}
                            title="View Full Profile & ID Card"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOpenEditModal(student)}
                            title="Edit Student"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => setDeleteTarget(student)}
                              title="Delete Record (Admin Only)"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredStudents.length}
          pageSize={pageSize}
          onPageChange={page => setCurrentPage(page)}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteStudent(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        title="Delete Student Record"
        message={`Are you sure you want to delete the student record for "${deleteTarget?.name}" (${deleteTarget?.rollNo})? This action cannot be undone.`}
        danger={true}
      />
    </div>
  );
};
