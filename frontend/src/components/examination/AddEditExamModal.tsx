import React, { useState, useEffect } from 'react';
import { ExamSchedule } from '../../types';
import { Modal } from '../common/Modal';
import { useCollegeData } from '../../context/CollegeDataContext';

interface AddEditExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam?: ExamSchedule | null;
}

export const AddEditExamModal: React.FC<AddEditExamModalProps> = ({
  isOpen,
  onClose,
  exam
}) => {
  const { addExam, updateExam } = useCollegeData();

  const [formData, setFormData] = useState({
    examName: 'BTEUP Even Semester Examination 2026',
    branch: 'Computer Science & Engineering',
    semester: 4,
    subject: '',
    subjectCode: '',
    examDate: '2026-05-20',
    startTime: '09:30 AM',
    endTime: '12:00 PM',
    roomNo: 'Room 102 (Main Academic Block)',
    maxMarks: 50,
    examType: 'Final BTEUP' as 'Mid Semester' | 'Final BTEUP' | 'Practical / Viva'
  });

  useEffect(() => {
    if (exam) {
      setFormData({
        examName: exam.examName,
        branch: exam.branch,
        semester: exam.semester,
        subject: exam.subject,
        subjectCode: exam.subjectCode,
        examDate: exam.examDate,
        startTime: exam.startTime,
        endTime: exam.endTime,
        roomNo: exam.roomNo,
        maxMarks: exam.maxMarks,
        examType: exam.examType
      });
    } else {
      setFormData({
        examName: 'BTEUP Even Semester Examination 2026',
        branch: 'Computer Science & Engineering',
        semester: 4,
        subject: '',
        subjectCode: '',
        examDate: '2026-05-20',
        startTime: '09:30 AM',
        endTime: '12:00 PM',
        roomNo: 'Room 102 (Main Academic Block)',
        maxMarks: 50,
        examType: 'Final BTEUP'
      });
    }
  }, [exam, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.subjectCode) {
      alert('Please provide Subject Name and Subject Code.');
      return;
    }

    if (exam) {
      updateExam(exam.id, formData);
    } else {
      addExam(formData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={exam ? 'Edit Examination Schedule' : 'Schedule New Semester Examination'}
      subtitle="Board of Technical Education U.P. (BTEUP) &amp; Institutional Exams"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Examination Title *
          </label>
          <input
            type="text"
            required
            value={formData.examName}
            onChange={e => setFormData({ ...formData, examName: e.target.value })}
            placeholder="e.g. BTEUP Even Semester Examination 2026"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Diploma Branch *
            </label>
            <select
              value={formData.branch}
              onChange={e => setFormData({ ...formData, branch: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
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
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Semester
            </label>
            <select
              value={formData.semester}
              onChange={e => setFormData({ ...formData, semester: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map(s => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subject Name *
            </label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g. Operating Systems"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subject Code *
            </label>
            <input
              type="text"
              required
              value={formData.subjectCode}
              onChange={e => setFormData({ ...formData, subjectCode: e.target.value })}
              placeholder="e.g. CS-404"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Exam Date
            </label>
            <input
              type="date"
              value={formData.examDate}
              onChange={e => setFormData({ ...formData, examDate: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Exam Category
            </label>
            <select
              value={formData.examType}
              onChange={e => setFormData({ ...formData, examType: e.target.value as any })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="Final BTEUP">Final BTEUP Board Theory</option>
              <option value="Mid Semester">Mid-Semester Assessment</option>
              <option value="Practical / Viva">Practical / Viva Voce</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Time Duration
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                placeholder="09:30 AM"
                className="w-1/2 px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
              <input
                type="text"
                value={formData.endTime}
                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                placeholder="12:00 PM"
                className="w-1/2 px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Allotted Room / Hall
            </label>
            <input
              type="text"
              value={formData.roomNo}
              onChange={e => setFormData({ ...formData, roomNo: e.target.value })}
              placeholder="e.g. Room 102 / Workshop Hall"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
          >
            {exam ? 'Update Schedule' : 'Schedule Exam'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
