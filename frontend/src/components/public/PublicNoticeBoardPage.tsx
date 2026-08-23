import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Calendar,
  Download,
  FileText,
  Printer,
  ChevronRight,
  X,
  Shield,
  Tag
} from 'lucide-react';
import { publicService } from '../../services/publicService';
import { NoticeItem } from '../../types';
import { CollegeLogo } from '../common/CollegeLogo';

export const PublicNoticeBoardPage: React.FC = () => {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNoticeModal, setActiveNoticeModal] = useState<NoticeItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await publicService.getPublicNotices(selectedCategory);
        setNotices(res);
      } catch (err) {
        console.error('Failed to load public notices', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, [selectedCategory]);

  const CATEGORIES = ['All', 'Academic', 'Examination', 'Fees', 'Events', 'General'];

  const filteredNotices = notices.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.referenceNo?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-blue-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase">
            Official College Gazette
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Institutional Notice Board &amp; Circulars
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 max-w-2xl">
            Official administrative notices, academic circulars, fee deadlines, and board notifications for Government Polytechnic.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-white/10 px-4 py-2 rounded-2xl border border-white/20">
          <Bell className="w-5 h-5 text-amber-400" />
          <span>Real-Time Bulletins</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search circulars, ref numbers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((n, idx) => (
          <div
            key={n.id || idx}
            onClick={() => setActiveNoticeModal(n)}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-lg transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  n.category === 'Examination'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    : n.category === 'Fees'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {n.category}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Ref: {n.referenceNo || 'GPB/OFFICIAL/2026'}
                </span>
                <span className="text-[11px] text-slate-400">•</span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {n.publishDate}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {n.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {n.content}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Read Notice <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Official Notice Modal / Gazette View */}
      {activeNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CollegeLogo size="sm" />
                <div>
                  <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    GOVERNMENT POLYTECHNIC
                  </h2>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Ref No: {activeNoticeModal.referenceNo}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveNoticeModal(null)}
                aria-label="Close modal"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Official Gazette Layout */}
            <div className="p-8 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
              <div className="text-center space-y-1 pb-4 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs uppercase font-bold text-amber-600 dark:text-amber-400 tracking-widest block">
                  Office of the Principal / Administration
                </span>
                <h1 className="text-lg font-black text-slate-900 dark:text-white">
                  {activeNoticeModal.title}
                </h1>
                <div className="text-xs text-slate-500 flex items-center justify-center gap-3 pt-1">
                  <span>Category: <strong>{activeNoticeModal.category}</strong></span>
                  <span>•</span>
                  <span>Date: <strong>{activeNoticeModal.publishDate}</strong></span>
                </div>
              </div>

              <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-4">
                <p>{activeNoticeModal.content}</p>
              </div>

              <div className="pt-8 flex items-end justify-between border-t border-slate-200 dark:border-slate-800 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Official Seal:</span>
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-polytechnic-700/50 flex items-center justify-center text-[9px] font-bold text-polytechnic-700 text-center p-1">
                    GOVT. POLYTECHNIC BANSDEEH
                  </div>
                </div>
                <div className="text-right space-y-0.5">
                  <strong className="text-slate-900 dark:text-white block font-bold">
                    {activeNoticeModal.issuedBy || 'Principal / Officer-in-Charge'}
                  </strong>
                  <span className="text-slate-500 text-[11px] block">
                    Government Polytechnic
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Notice
              </button>
              <button
                onClick={() => setActiveNoticeModal(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
