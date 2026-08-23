import React, { useState } from 'react';
import {
  BellRing,
  Search,
  PlusCircle,
  Eye,
  Edit2,
  Trash2,
  Clock,
  Tag,
  Download,
  AlertCircle,
  FileText,
  Pin
} from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';
import { NoticeItem } from '../../types';
import { formatDate } from '../../utils/helpers';
import { AddEditNoticeModal } from './AddEditNoticeModal';
import { NoticeDetailModal } from './NoticeDetailModal';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface NoticeBoardProps {
  initialNoticeId?: string | null;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({ initialNoticeId }) => {
  const { notices, deleteNotice } = useCollegeData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalNotice, setActiveModalNotice] = useState<{ isOpen: boolean; notice: NoticeItem | null }>({
    isOpen: false,
    notice: null
  });

  const [viewDetailNotice, setViewDetailNotice] = useState<NoticeItem | null>(() => {
    if (initialNoticeId) {
      return notices.find(n => n.id === initialNoticeId) || null;
    }
    return null;
  });

  const [deleteTarget, setDeleteTarget] = useState<NoticeItem | null>(null);

  const categories = ['All', 'Examination', 'Fees', 'Events', 'Academic', 'Holiday', 'General'];

  const filteredNotices = notices.filter(n => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.referenceNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categoryBadges: Record<string, string> = {
    Examination: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200',
    Fees: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200',
    Events: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200',
    Academic: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200',
    Holiday: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200',
    General: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BellRing className="w-6 h-6 text-blue-600" />
            Official Notice Board &amp; Circulars
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Government Polytechnic Bansdeeh • Academic, Administrative &amp; Examination Bulletins
          </p>
        </div>

        <button
          onClick={() => setActiveModalNotice({ isOpen: true, notice: null })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all self-start sm:self-center"
        >
          <PlusCircle className="w-4 h-4" /> Publish New Notice
        </button>
      </div>

      {/* Filter & Category Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search circulars by subject, keyword, reference..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notices Grid Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredNotices.length === 0 ? (
          <div className="col-span-2 py-16 text-center text-slate-400 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            No notices match your search criteria.
          </div>
        ) : (
          filteredNotices.map(notice => (
            <div
              key={notice.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Category & Date Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md border ${
                        categoryBadges[notice.category] || categoryBadges.General
                      }`}
                    >
                      {notice.category}
                    </span>
                    {notice.priority === 'High' && (
                      <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 text-[10px] font-black uppercase">
                        Urgent
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" /> {formatDate(notice.publishDate)}
                  </span>
                </div>

                {/* Title */}
                <h3
                  onClick={() => setViewDetailNotice(notice)}
                  className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer transition-colors line-clamp-2 leading-snug mb-2"
                >
                  {notice.title}
                </h3>

                {/* Content snippet */}
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                  {notice.content}
                </p>

                {/* Metadata */}
                <div className="space-y-1 text-[11px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800 font-mono">
                  <div>Ref: {notice.referenceNo}</div>
                  <div>Issued by: {notice.issuedBy}</div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setViewDetailNotice(notice)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Read Full Circular
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveModalNotice({ isOpen: true, notice })}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                    title="Edit Notice"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(notice)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                    title="Delete Notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      <AddEditNoticeModal
        isOpen={activeModalNotice.isOpen}
        onClose={() => setActiveModalNotice({ isOpen: false, notice: null })}
        notice={activeModalNotice.notice}
      />

      {/* Detail Modal */}
      <NoticeDetailModal
        isOpen={!!viewDetailNotice}
        onClose={() => setViewDetailNotice(null)}
        notice={viewDetailNotice}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteNotice(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        title="Delete Official Notice"
        message={`Are you sure you want to remove the circular "${deleteTarget?.title}"?`}
        danger={true}
      />
    </div>
  );
};
