import React, { useState, useEffect } from 'react';
import { NoticeItem } from '../../types';
import { Modal } from '../common/Modal';
import { useCollegeData } from '../../context/CollegeDataContext';

interface AddEditNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice?: NoticeItem | null;
}

export const AddEditNoticeModal: React.FC<AddEditNoticeModalProps> = ({
  isOpen,
  onClose,
  notice
}) => {
  const { addNotice, updateNotice } = useCollegeData();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Examination' as 'Examination' | 'Fees' | 'Events' | 'Academic' | 'Holiday' | 'General',
    publishDate: new Date().toISOString().split('T')[0],
    priority: 'High' as 'High' | 'Medium' | 'Low',
    targetAudience: 'All' as 'All' | 'Students' | 'Teachers',
    issuedBy: 'Office of the Principal',
    referenceNo: `GPB/ADMIN/2026/${Math.floor(100 + Math.random() * 900)}`,
    attachmentName: ''
  });

  useEffect(() => {
    if (notice) {
      setFormData({
        title: notice.title,
        content: notice.content,
        category: notice.category,
        publishDate: notice.publishDate,
        priority: notice.priority,
        targetAudience: notice.targetAudience,
        issuedBy: notice.issuedBy,
        referenceNo: notice.referenceNo,
        attachmentName: notice.attachmentName || ''
      });
    } else {
      setFormData({
        title: '',
        content: '',
        category: 'Examination',
        publishDate: new Date().toISOString().split('T')[0],
        priority: 'High',
        targetAudience: 'All',
        issuedBy: 'Office of the Principal',
        referenceNo: `GPB/ADMIN/2026/${Math.floor(100 + Math.random() * 900)}`,
        attachmentName: ''
      });
    }
  }, [notice, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert('Please fill notice title and message content.');
      return;
    }

    if (notice) {
      updateNotice(notice.id, formData);
    } else {
      addNotice(formData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={notice ? 'Edit Official Circular' : 'Publish New College Circular / Notice'}
      subtitle="Government Polytechnic Bansdeeh, Ballia • Administrative Notice Board"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Notice / Circular Subject *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Mid-Semester Examination Schedule for Even Semester 2026"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="Examination">Examination</option>
              <option value="Fees">Fees &amp; Scholarship</option>
              <option value="Events">Events &amp; Workshops</option>
              <option value="Academic">Academic / Placement</option>
              <option value="Holiday">Gazetted Holiday</option>
              <option value="General">General Notice</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="High">Urgent / High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Standard / Low</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Audience
            </label>
            <select
              value={formData.targetAudience}
              onChange={e => setFormData({ ...formData, targetAudience: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="All">All (Students &amp; Faculty)</option>
              <option value="Students">Students Only</option>
              <option value="Teachers">Faculty / Staff Only</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Notice Body / Official Circular Details *
          </label>
          <textarea
            rows={5}
            required
            value={formData.content}
            onChange={e => setFormData({ ...formData, content: e.target.value })}
            placeholder="Enter full text of the circular, guidelines, dates, and instructions..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Issuing Authority / Cell
            </label>
            <input
              type="text"
              value={formData.issuedBy}
              onChange={e => setFormData({ ...formData, issuedBy: e.target.value })}
              placeholder="e.g. Office of the Principal / Exam Supdt."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Official Reference No.
            </label>
            <input
              type="text"
              value={formData.referenceNo}
              onChange={e => setFormData({ ...formData, referenceNo: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Optional Attachment Document Name
          </label>
          <input
            type="text"
            value={formData.attachmentName}
            onChange={e => setFormData({ ...formData, attachmentName: e.target.value })}
            placeholder="e.g. Exam_Guidelines_2026.pdf"
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
          />
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
            {notice ? 'Update Notice' : 'Publish Notice'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
