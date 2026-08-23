import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  GraduationCap,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Layers,
  FlaskConical,
  Award
} from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';
import { Course } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const CoursesList: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useCollegeData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    shortCode: '',
    durationYears: 3,
    totalSeats: 60,
    activeStudents: 58,
    facultyCount: 6,
    hodName: '',
    labsCount: 4,
    description: '',
    status: 'Active' as 'Active' | 'Under Review'
  });

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormData({
      code: 'DIP-ME',
      name: '',
      shortCode: '',
      durationYears: 3,
      totalSeats: 60,
      activeStudents: 55,
      facultyCount: 5,
      hodName: 'Er. Senior Faculty',
      labsCount: 4,
      description: 'Comprehensive curriculum following BTEUP diploma guidelines.',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Course) => {
    setEditingCourse(c);
    setFormData({
      code: c.code,
      name: c.name,
      shortCode: c.shortCode,
      durationYears: c.durationYears,
      totalSeats: c.totalSeats,
      activeStudents: c.activeStudents,
      facultyCount: c.facultyCount,
      hodName: c.hodName,
      labsCount: c.labsCount,
      description: c.description,
      status: c.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      alert('Please fill Branch Name and Branch Code.');
      return;
    }

    if (editingCourse) {
      updateCourse(editingCourse.id, formData);
    } else {
      addCourse(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Diploma Engineering Branches &amp; Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Government Polytechnic Bansdeeh • AICTE Approved 3-Year Diploma Programmes
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all self-start sm:self-center"
        >
          <PlusCircle className="w-4 h-4" /> Add Diploma Branch
        </button>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div
            key={course.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md">
                    {course.code} ({course.shortCode})
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1.5 leading-snug group-hover:text-blue-600 transition-colors">
                    {course.name}
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {course.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
                {course.description}
              </p>

              {/* Department Statistics Grid */}
              <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Duration</span>
                    <strong className="text-slate-800 dark:text-slate-200">{course.durationYears} Years (6 Sem)</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Approved Intake</span>
                    <strong className="text-slate-800 dark:text-slate-200">{course.totalSeats} Seats</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Faculty Members</span>
                    <strong className="text-slate-800 dark:text-slate-200">{course.facultyCount} Lecturers</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <FlaskConical className="w-3.5 h-3.5 text-amber-500" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Specialized Labs</span>
                    <strong className="text-slate-800 dark:text-slate-200">{course.labsCount} Laboratories</strong>
                  </div>
                </div>
              </div>

              {/* HOD info */}
              <div className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Head of Department:</span>
                <strong className="text-slate-900 dark:text-white">{course.hodName}</strong>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-1.5">
              <button
                onClick={() => handleOpenEdit(course)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                title="Edit Course"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteTarget(course)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                title="Delete Course"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? 'Edit Diploma Branch' : 'Add New Diploma Engineering Branch'}
        subtitle="Government Polytechnic Bansdeeh, Ballia"
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Branch Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Diploma in Computer Science & Engineering"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Branch Code *
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. DIP-CSE"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Short Acronym
              </label>
              <input
                type="text"
                value={formData.shortCode}
                onChange={e => setFormData({ ...formData, shortCode: e.target.value })}
                placeholder="e.g. CSE"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sanctioned Intake (Seats)
              </label>
              <input
                type="number"
                value={formData.totalSeats}
                onChange={e => setFormData({ ...formData, totalSeats: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Head of Department (HOD)
              </label>
              <input
                type="text"
                value={formData.hodName}
                onChange={e => setFormData({ ...formData, hodName: e.target.value })}
                placeholder="e.g. Dr. Alok Kumar Rai"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Faculty Count
              </label>
              <input
                type="number"
                value={formData.facultyCount}
                onChange={e => setFormData({ ...formData, facultyCount: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Specialized Laboratories
              </label>
              <input
                type="number"
                value={formData.labsCount}
                onChange={e => setFormData({ ...formData, labsCount: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Programme Description &amp; Scope
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Overview of syllabus, labs, and career scope..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
            >
              {editingCourse ? 'Save Changes' : 'Add Branch'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteCourse(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        title="Delete Diploma Course"
        message={`Are you sure you want to remove ${deleteTarget?.name}?`}
        danger={true}
      />
    </div>
  );
};
