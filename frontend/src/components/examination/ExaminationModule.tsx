import React, { useState } from 'react';
import {
  Award,
  Calendar,
  Search,
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  Download,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';
import { ExamSchedule, StudentResult, Student } from '../../types';
import { formatDate, exportToCSV } from '../../utils/helpers';
import { AddEditExamModal } from './AddEditExamModal';
import { MarksheetModal } from './MarksheetModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { StudentProfileModal } from '../students/StudentProfileModal';

export const ExaminationModule: React.FC = () => {
  const { exams, results, deleteExam, students } = useCollegeData();

  const [activeTab, setActiveTab] = useState<'schedule' | 'results'>('schedule');
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');

  const [activeModalExam, setActiveModalExam] = useState<{ isOpen: boolean; exam: ExamSchedule | null }>({
    isOpen: false,
    exam: null
  });

  const [activeMarksheet, setActiveMarksheet] = useState<StudentResult | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ExamSchedule | null>(null);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);

  const filteredExams = exams.filter(e => {
    const matchesSearch =
      e.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.branch.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch = branchFilter === 'All' || e.branch.includes(branchFilter);
    const matchesSemester = semesterFilter === 'All' || e.semester.toString() === semesterFilter;

    return matchesSearch && matchesBranch && matchesSemester;
  });

  const filteredResults = results.filter(r => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.branch.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch = branchFilter === 'All' || r.branch.includes(branchFilter);
    return matchesSearch && matchesBranch;
  });

  const handleExportExamsCSV = () => {
    const data = filteredExams.map(e => ({
      'Exam Title': e.examName,
      'Branch': e.branch,
      'Semester': e.semester,
      'Subject Code': e.subjectCode,
      'Subject Name': e.subject,
      'Date': e.examDate,
      'Time': `${e.startTime} - ${e.endTime}`,
      'Room Allotment': e.roomNo,
      'Category': e.examType
    }));
    exportToCSV('GP_Bansdeeh_Exam_Schedule', data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-600" />
            Examination &amp; Marksheets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Board of Technical Education U.P. (BTEUP) Semester Schedules &amp; Diploma Marksheets
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'schedule'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Exam Schedules ({exams.length})
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'results'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Published Marksheets ({results.length})
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by subject, code, exam title..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <select
            value={branchFilter}
            onChange={e => setBranchFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
          >
            <option value="All">All Branches</option>
            <option value="Computer">Computer Science &amp; Engg</option>
            <option value="Mechanical">Mechanical Engg</option>
            <option value="Civil">Civil Engg</option>
            <option value="Electrical">Electrical Engg</option>
            <option value="Electronics">Electronics Engg</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleExportExamsCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSV
          </button>
          {activeTab === 'schedule' && (
            <button
              onClick={() => setActiveModalExam({ isOpen: true, exam: null })}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Schedule Exam
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Schedules Table */}
      {activeTab === 'schedule' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Subject &amp; Code</th>
                  <th className="px-4 py-3.5">Branch &amp; Sem</th>
                  <th className="px-4 py-3.5">Exam Date &amp; Timing</th>
                  <th className="px-4 py-3.5">Hall / Room Allotment</th>
                  <th className="px-4 py-3.5 text-center">Category</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredExams.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No examinations scheduled matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredExams.map(ex => (
                    <tr
                      key={ex.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 dark:text-white">{ex.subject}</div>
                        <div className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                          {ex.subjectCode} • Max: {ex.maxMarks} Marks
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-800 dark:text-slate-200">{ex.branch}</div>
                        <div className="text-[10px] text-slate-400">Semester {ex.semester}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {formatDate(ex.examDate)}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {ex.startTime} - {ex.endTime}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                        {ex.roomNo}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            ex.examType === 'Final BTEUP'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : ex.examType === 'Mid Semester'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {ex.examType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveModalExam({ isOpen: true, exam: ex })}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                            title="Edit Schedule"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(ex)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                            title="Delete Schedule"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Results & Marksheet Previews */}
      {activeTab === 'results' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Roll Number</th>
                  <th className="px-4 py-3.5">Candidate Name</th>
                  <th className="px-4 py-3.5">Branch &amp; Sem</th>
                  <th className="px-4 py-3.5 text-center">Marks Obtained</th>
                  <th className="px-4 py-3.5 text-center">SGPA</th>
                  <th className="px-4 py-3.5 text-center">Division</th>
                  <th className="px-4 py-3.5 text-right">Official Marksheet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredResults.map(res => (
                  <tr
                    key={res.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {res.rollNo}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => {
                          const matched = students.find(s => s.id === res.studentId || s.rollNo === res.rollNo);
                          if (matched) setSelectedStudentForModal(matched);
                        }}
                        className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline underline-offset-2 text-left group"
                        title="Click to view full 360° student dossier & edit details"
                      >
                        <span>{res.studentName}</span>
                        <span className="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 ml-1">↗</span>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {res.branch} (Sem-{res.semester})
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">
                      {res.grandTotalObtained} / {res.grandTotalMax} ({res.percentage}%)
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                        {res.cgpa}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {res.division}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setActiveMarksheet(res)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5" /> View / Print Marksheet
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Exam Modal */}
      <AddEditExamModal
        isOpen={activeModalExam.isOpen}
        onClose={() => setActiveModalExam({ isOpen: false, exam: null })}
        exam={activeModalExam.exam}
      />

      {/* Marksheet Modal */}
      <MarksheetModal
        isOpen={!!activeMarksheet}
        onClose={() => setActiveMarksheet(null)}
        result={activeMarksheet}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteExam(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        title="Cancel Scheduled Exam"
        message={`Are you sure you want to cancel the scheduled exam for "${deleteTarget?.subject}" (${deleteTarget?.subjectCode})?`}
        danger={true}
      />

      {/* Student 360 Dossier & Quick Edit Modal */}
      <StudentProfileModal
        isOpen={!!selectedStudentForModal}
        onClose={() => setSelectedStudentForModal(null)}
        student={selectedStudentForModal}
        onOpenMarksheet={resId => {
          const matchedRes = results.find(r => r.id === resId);
          if (matchedRes) setActiveMarksheet(matchedRes);
        }}
      />
    </div>
  );
};
