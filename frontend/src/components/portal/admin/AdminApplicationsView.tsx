import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  MessageSquare,
  User,
  Filter,
  Save,
  Search,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { apiClient } from '../../../services/api';
import confetti from 'canvas-confetti';

export const AdminApplicationsView: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeApp, setActiveApp] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [reviewForm, setReviewForm] = useState({
    status: 'Under Review',
    staff_response: '',
    reviewed_by: 'Er. Sachin Maurya (Principal)',
    corrected_name: ''
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchApplications = async () => {
    try {
      const res = await apiClient.get('/students/applications/');
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSelectApp = (app: any) => {
    setActiveApp(app);
    setReviewForm({
      status: app.status || 'Under Review',
      staff_response: app.staff_response || '',
      reviewed_by: app.reviewed_by || 'Er. Sachin Maurya (Principal)',
      corrected_name: app.student_name || ''
    });
    setSaveSuccess(false);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApp) return;

    setSaving(true);
    try {
      const res = await apiClient.post(`/students/applications/${activeApp.id}/update_status/`, reviewForm);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setActiveApp(res.data);
      setSaveSuccess(true);
      fetchApplications();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update application review', err);
    } finally {
      setSaving(false);
    }
  };

  const STATUSES = ['All', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Resolved'];

  const filteredApps = applications.filter(app => {
    const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus;
    const matchesSearch =
      app.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.roll_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.application_no?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Resolved':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> {status}
          </span>
        );
      case 'Under Review':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Under Review
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
            <Send className="w-3.5 h-3.5" /> Submitted
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-blue-900 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-slate-950">
            Institutional Redressal Suite
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Student Applications &amp; Correction Grievances
          </h1>
          <p className="text-xs sm:text-sm text-blue-200">
            Review student correction applications, provide official institutional responses, and update academic records.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs bg-white/10 px-4 py-2 rounded-2xl border border-white/20">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>Total: {applications.length} Applications</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedStatus === s
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, roll number, ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>
      </div>

      {/* Main Grid: Applications List & Review Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Applications List (5 cols) */}
        <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto pr-1">
          {filteredApps.length > 0 ? (
            filteredApps.map(app => (
              <div
                key={app.id}
                onClick={() => handleSelectApp(app)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  activeApp?.id === app.id
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 shadow-md ring-2 ring-blue-600/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-amber-500">
                    {app.application_no}
                  </span>
                  <div>{getStatusBadge(app.status)}</div>
                </div>

                <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {app.subject}
                </h3>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Student: <strong className="text-slate-800 dark:text-slate-200">{app.student_name}</strong></span>
                  <span className="font-mono">{app.roll_number}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
              No applications match the filter.
            </div>
          )}
        </div>

        {/* Right Column: Review & Action Panel (7 cols) */}
        <div className="lg:col-span-7">
          {activeApp ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-500">
                    {activeApp.application_no} • {activeApp.category}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {activeApp.subject}
                  </h2>
                </div>
                <div>{getStatusBadge(activeApp.status)}</div>
              </div>

              {/* Student Details Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-slate-400 block">Student Name:</span>
                  <strong className="text-slate-900 dark:text-white">{activeApp.student_name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Roll Number:</span>
                  <strong className="text-slate-900 dark:text-white font-mono">{activeApp.roll_number}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Branch:</span>
                  <strong className="text-slate-900 dark:text-white">{activeApp.branch}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Semester:</span>
                  <strong className="text-slate-900 dark:text-white">Semester {activeApp.semester}</strong>
                </div>
              </div>

              {/* Application Description */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Student's Explanation &amp; Request:
                </span>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-200">
                  {activeApp.description}
                </div>
              </div>

              {/* Staff Action & Review Form */}
              <form onSubmit={handleSaveReview} className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Official Review &amp; Resolution
                </h3>

                {saveSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Application review and status updated successfully!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Update Application Status *
                    </label>
                    <select
                      value={reviewForm.status}
                      onChange={e => setReviewForm({ ...reviewForm, status: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Reviewing Officer Name
                    </label>
                    <input
                      type="text"
                      value={reviewForm.reviewed_by}
                      onChange={e => setReviewForm({ ...reviewForm, reviewed_by: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                </div>

                {activeApp.category.includes('Correction') && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Correct Student Full Name in Database (If Approved)
                    </label>
                    <input
                      type="text"
                      value={reviewForm.corrected_name}
                      onChange={e => setReviewForm({ ...reviewForm, corrected_name: e.target.value })}
                      placeholder="e.g. Rahul Verma"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-blue-600 dark:text-blue-400"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Official Staff Response to Student *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter official remarks or explanation for the student..."
                    value={reviewForm.staff_response}
                    onChange={e => setReviewForm({ ...reviewForm, staff_response: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save & Update Application'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 text-slate-400 text-xs">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-600 dark:text-slate-300">
                Select an application from the list to review and respond
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
