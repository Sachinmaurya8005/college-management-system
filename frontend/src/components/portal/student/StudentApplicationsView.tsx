import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  HelpCircle,
  Paperclip,
  Send,
  MessageSquare,
  ChevronRight,
  Filter,
  UserCheck
} from 'lucide-react';
import { studentPortalService } from '../../../services/studentPortalService';
import { apiClient } from '../../../services/api';
import confetti from 'canvas-confetti';

export const StudentApplicationsView: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    subject: '',
    category: 'Personal Information Correction',
    description: '',
    attachment_url: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchApplications = async () => {
    try {
      const res = await apiClient.get('/student-portal/my-applications/');
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to load student applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.description.trim()) {
      setError('Please provide both Application Subject and Detailed Description.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await apiClient.post('/student-portal/my-applications/', formData);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      setFormData({
        subject: '',
        category: 'Personal Information Correction',
        description: '',
        attachment_url: ''
      });
      setIsSubmitModalOpen(false);
      fetchApplications();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const CATEGORIES = [
    'Personal Information Correction',
    'Name Correction Request',
    'Attendance Issue',
    'Fee / Payment Issue',
    'Examination & Result Issue',
    'Document / Certificate Request',
    'Hostel / Mess Request',
    'Other Grievance / Problem'
  ];

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
    <div className="space-y-6 max-w-6xl">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-polytechnic-900 via-blue-900 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-slate-950">
            Student Support &amp; Grievance Redressal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Online Applications &amp; Correction Requests
          </h1>
          <p className="text-xs sm:text-sm text-blue-200">
            Submit applications for profile correction, attendance clarification, fee ledger verification, or document requests.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-lg shadow-blue-600/30 flex items-center gap-2 active:scale-95 transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Submit New Application</span>
        </button>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>My Submitted Applications ({applications.length})</span>
          </h2>
          <span className="text-xs text-slate-400">Track real-time status &amp; staff replies</span>
        </div>

        {applications.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {applications.map(app => (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-lg transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-polytechnic-900 text-amber-400 text-xs font-mono font-bold">
                      {app.application_no}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {app.category}
                    </span>
                  </div>
                  {getStatusBadge(app.status)}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {app.subject}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {app.description}
                </p>

                {app.staff_response && (
                  <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                    <strong className="font-bold flex items-center gap-1 text-[11px] text-emerald-800 dark:text-emerald-300">
                      <MessageSquare className="w-3.5 h-3.5" /> Staff Response ({app.reviewed_by || 'Administration'}):
                    </strong>
                    <p>{app.staff_response}</p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Submitted on: {app.submission_date}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5">
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No Applications Submitted Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              If you have any name corrections, attendance issues, or document requests, click "Submit New Application" above.
            </p>
          </div>
        )}
      </div>

      {/* Submit Application Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Government Polytechnic
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Submit Online Application / Correction Request
                </h2>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Application Category *
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Application Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spelling correction in Father's Name on institutional records"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Description &amp; Explanation *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain your problem or request in detail with any reference numbers..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Supporting Document URL / Reference (Optional)
                </label>
                <input
                  type="url"
                  placeholder="Paste direct URL to supporting document/receipt if available"
                  value={formData.attachment_url}
                  onChange={e => setFormData({ ...formData, attachment_url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-[11px] text-blue-900 dark:text-blue-200">
                ℹ️ Your Student ID, Roll Number, and Name are automatically linked to this application securely.
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-500 font-bold">
                  {selectedApp.application_no}
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedApp.subject}
                </h2>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span>Category: <strong>{selectedApp.category}</strong></span>
                <div>{getStatusBadge(selectedApp.status)}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Application Description:</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedApp.description}
                </p>
              </div>

              {selectedApp.staff_response && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 space-y-1">
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold uppercase block">
                    Official Staff / Principal Response:
                  </span>
                  <p className="text-emerald-950 dark:text-emerald-100 leading-relaxed">
                    {selectedApp.staff_response}
                  </p>
                  <div className="pt-2 text-[10px] text-emerald-700 dark:text-emerald-400">
                    Reviewed By: {selectedApp.reviewed_by || 'Administration'}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
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
