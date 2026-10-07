import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserPlus,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Plus,
  Eye,
  AlertTriangle,
  Sparkles,
  Search,
  Check,
  X,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { approvalService, StaffApprovalRequest } from '../../../services/approvalService';
import confetti from 'canvas-confetti';

export const ApprovalsView: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [requests, setRequests] = useState<StaffApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<StaffApprovalRequest | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // New Student Form
  const [newStudentForm, setNewStudentForm] = useState({
    full_name: '',
    roll_number: '',
    enrollment_number: '',
    branch: 'Computer Science & Engineering',
    semester: 1,
    date_of_birth: '2005-06-15',
    father_name: '',
    mother_name: '',
    mobile: '',
    email: '',
    fee_status: 'Pending',
    description: 'Requesting registration for newly admitted student.'
  });

  // Parse newStudentForm.date_of_birth into Day, Month, Year (DD/MM/YYYY)
  const [newStudentDobYear, newStudentDobMonth, newStudentDobDay] = (() => {
    if (newStudentForm.date_of_birth && newStudentForm.date_of_birth.includes('-')) {
      const parts = newStudentForm.date_of_birth.split('-');
      if (parts.length === 3) {
        return [parts[0], parts[1].padStart(2, '0'), parts[2].padStart(2, '0')];
      }
    }
    return ['2005', '06', '15'];
  })();

  const handleNewStudentDobChange = (d: string, m: string, y: string) => {
    const formattedIso = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    setNewStudentForm(prev => ({ ...prev, date_of_birth: formattedIso }));
  };

  // Fee Update Form
  const [feeUpdateForm, setFeeUpdateForm] = useState({
    roll_number: '',
    student_name: '',
    branch: 'Computer Science & Engineering',
    semester: 4,
    fee_status: 'Paid',
    paid_amount: 12650,
    payment_mode: 'Online UPI / Bank Transfer',
    transaction_ref: '',
    remarks: 'Fee payment verified in department accounts ledger.'
  });

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await approvalService.getRequests({
        status: statusFilter !== 'All' ? statusFilter : undefined,
        request_type: typeFilter !== 'All' ? typeFilter : undefined
      });
      setRequests(data);
    } catch (err) {
      console.error('Failed to load approval requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, typeFilter]);

  // Handle Teacher Submit New Student
  const handleSubmitNewStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await approvalService.createRequest({
        request_type: 'NEW_STUDENT',
        student_name: newStudentForm.full_name,
        roll_number: newStudentForm.roll_number,
        branch: newStudentForm.branch,
        semester: Number(newStudentForm.semester),
        description: newStudentForm.description,
        payload: newStudentForm
      });
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      setIsNewStudentModalOpen(false);
      fetchRequests();
    } catch (err) {
      console.error('Failed to submit new student request', err);
      alert('Failed to submit request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Teacher Submit Fee Update
  const handleSubmitFeeUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await approvalService.createRequest({
        request_type: 'FEE_UPDATE',
        student_name: feeUpdateForm.student_name,
        roll_number: feeUpdateForm.roll_number,
        branch: feeUpdateForm.branch,
        semester: Number(feeUpdateForm.semester),
        description: `Fee payment update of ₹${feeUpdateForm.paid_amount} (${feeUpdateForm.fee_status})`,
        payload: feeUpdateForm
      });
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      setIsFeeModalOpen(false);
      fetchRequests();
    } catch (err) {
      console.error('Failed to submit fee update request', err);
      alert('Failed to submit fee request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Admin Approve
  const handleApprove = async (id: number) => {
    if (!window.confirm('Approve this request and apply changes directly to the college database?')) return;
    setActionLoading(true);
    try {
      await approvalService.approveRequest(id, reviewRemarks || 'Approved by Admin.');
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      setSelectedRequest(null);
      setReviewRemarks('');
      fetchRequests();
    } catch (err) {
      console.error('Failed to approve request', err);
      alert('Failed to approve request.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Admin Reject
  const handleReject = async (id: number) => {
    const reason = reviewRemarks.trim() || prompt('Please provide reason for rejection:');
    if (!reason) return;
    setActionLoading(true);
    try {
      await approvalService.rejectRequest(id, reason);
      setSelectedRequest(null);
      setReviewRemarks('');
      fetchRequests();
    } catch (err) {
      console.error('Failed to reject request', err);
      alert('Failed to reject request.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRequests = requests.filter(r => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.student_name.toLowerCase().includes(q) ||
      r.roll_number.toLowerCase().includes(q) ||
      r.request_no.toLowerCase().includes(q) ||
      r.submitted_by_name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-blue-900 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-400 text-slate-950">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Two-Tier Governance &amp; Change Approval System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isAdmin ? 'Staff Change & Student Approvals Queue' : 'My Student & Fee Approval Requests'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-200">
            {isAdmin
              ? 'Review, verify and approve student additions and fee updates submitted by faculty.'
              : 'Submit new student records and fee collections for Principal / Admin authorization.'}
          </p>
        </div>

        {/* Action Buttons for Teachers/Admin */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setIsNewStudentModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Add Student (Request)
          </button>
          <button
            onClick={() => setIsFeeModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all"
          >
            <CreditCard className="w-4 h-4" /> Update Fees (Request)
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {['All', 'Pending', 'Approved', 'Rejected'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student, roll no, or request #..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
          />
        </div>
      </div>

      {/* Requests Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading approval requests...</div>
      ) : filteredRequests.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          No approval requests found matching current filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map(req => {
            const isPending = req.status === 'Pending';
            const isApproved = req.status === 'Approved';
            const isRejected = req.status === 'Rejected';

            return (
              <div
                key={req.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card flex flex-col justify-between space-y-4 hover:shadow-lg transition-all"
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {req.request_no}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                        isPending
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300'
                          : isApproved
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300'
                      }`}
                    >
                      {isPending && <Clock className="w-3 h-3 animate-spin" />}
                      {isApproved && <CheckCircle className="w-3 h-3" />}
                      {isRejected && <XCircle className="w-3 h-3" />}
                      {req.status}
                    </span>
                  </div>

                  {/* Title & Type */}
                  <div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 mb-1 inline-block">
                      {req.request_type === 'NEW_STUDENT' ? '👤 New Student Registration' : '💳 Student Fee Update'}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {req.student_name}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      Roll No: {req.roll_number || 'Auto-generated'} • {req.branch} (Sem {req.semester})
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                    {req.description}
                  </p>

                  {/* Teacher & Submission Info */}
                  <div className="text-[11px] text-slate-400 space-y-0.5">
                    <p>Submitted by: <strong className="text-slate-700 dark:text-slate-300">{req.submitted_by_name}</strong></p>
                    <p>Date: {new Date(req.created_at).toLocaleDateString()}</p>
                    {req.admin_remarks && (
                      <div className="mt-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 text-xs">
                        <strong>Admin Remarks:</strong> {req.admin_remarks}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-blue-600 text-xs font-bold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </button>

                  {isAdmin && isPending && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(req.id)}
                        disabled={actionLoading}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        disabled={actionLoading}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Student Request Modal */}
      {isNewStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <span>Submit New Student Registration for Admin Approval</span>
              </h2>
              <button onClick={() => setIsNewStudentModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmitNewStudent} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.full_name}
                    onChange={e => setNewStudentForm({ ...newStudentForm, full_name: e.target.value })}
                    placeholder="e.g. Anand Kumar"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.roll_number}
                    onChange={e => setNewStudentForm({ ...newStudentForm, roll_number: e.target.value })}
                    placeholder="e.g. E224412355009"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Enrollment Number</label>
                  <input
                    type="text"
                    value={newStudentForm.enrollment_number}
                    onChange={e => setNewStudentForm({ ...newStudentForm, enrollment_number: e.target.value })}
                    placeholder="e.g. 224412009"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none font-mono"
                  />
                </div>

                {/* Day / Month / Year (DD / MM / YYYY) DOB Selector */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>Date of Birth (DOB) • जन्मतिथि (Day / Month / Year) *</span>
                    </label>
                    <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-lg border border-blue-200 dark:border-blue-800">
                      {newStudentDobDay}/{newStudentDobMonth}/{newStudentDobYear} (DD/MM/YYYY)
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-1 font-semibold">1. Day (दिन - DD)</span>
                      <select
                        value={newStudentDobDay}
                        onChange={e => handleNewStudentDobChange(e.target.value, newStudentDobMonth, newStudentDobYear)}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block mb-1 font-semibold">2. Month (माह - MM)</span>
                      <select
                        value={newStudentDobMonth}
                        onChange={e => handleNewStudentDobChange(newStudentDobDay, e.target.value, newStudentDobYear)}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="01">01 - Jan (जनवरी)</option>
                        <option value="02">02 - Feb (फ़रवरी)</option>
                        <option value="03">03 - Mar (मार्च)</option>
                        <option value="04">04 - Apr (अप्रैल)</option>
                        <option value="05">05 - May (मई)</option>
                        <option value="06">06 - Jun (जून)</option>
                        <option value="07">07 - Jul (जुलाई)</option>
                        <option value="08">08 - Aug (अगस्त)</option>
                        <option value="09">09 - Sep (सितंबर)</option>
                        <option value="10">10 - Oct (अक्टूबर)</option>
                        <option value="11">11 - Nov (नवंबर)</option>
                        <option value="12">12 - Dec (दिसंबर)</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block mb-1 font-semibold">3. Year (वर्ष - YYYY)</span>
                      <select
                        value={newStudentDobYear}
                        onChange={e => handleNewStudentDobChange(newStudentDobDay, newStudentDobMonth, e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                      >
                        {Array.from({ length: 25 }, (_, i) => String(1995 + i)).map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Branch / Discipline *</label>
                  <select
                    value={newStudentForm.branch}
                    onChange={e => setNewStudentForm({ ...newStudentForm, branch: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Electronics Engineering">Electronics Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newStudentForm.semester}
                    onChange={e => setNewStudentForm({ ...newStudentForm, semester: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={newStudentForm.father_name}
                    onChange={e => setNewStudentForm({ ...newStudentForm, father_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Student Mobile</label>
                  <input
                    type="tel"
                    value={newStudentForm.mobile}
                    onChange={e => setNewStudentForm({ ...newStudentForm, mobile: e.target.value })}
                    placeholder="+91 98380 00000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Notes / Rationale for Admin</label>
                <textarea
                  rows={2}
                  value={newStudentForm.description}
                  onChange={e => setNewStudentForm({ ...newStudentForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewStudentModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700"
                >
                  {actionLoading ? 'Submitting...' : 'Submit to Admin for Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fee Update Request Modal */}
      {isFeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>Submit Student Fee Collection for Admin Approval</span>
              </h2>
              <button onClick={() => setIsFeeModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmitFeeUpdate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Student Roll Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. E224412355001"
                  value={feeUpdateForm.roll_number}
                  onChange={e => setFeeUpdateForm({ ...feeUpdateForm, roll_number: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  value={feeUpdateForm.student_name}
                  onChange={e => setFeeUpdateForm({ ...feeUpdateForm, student_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Fee Status</label>
                  <select
                    value={feeUpdateForm.fee_status}
                    onChange={e => setFeeUpdateForm({ ...feeUpdateForm, fee_status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Amount Collected (₹) *</label>
                  <input
                    type="number"
                    required
                    value={feeUpdateForm.paid_amount}
                    onChange={e => setFeeUpdateForm({ ...feeUpdateForm, paid_amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Payment Mode</label>
                <input
                  type="text"
                  value={feeUpdateForm.payment_mode}
                  onChange={e => setFeeUpdateForm({ ...feeUpdateForm, payment_mode: e.target.value })}
                  placeholder="Online UPI / Bank Challan"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Remarks / Bank Transaction Ref</label>
                <input
                  type="text"
                  value={feeUpdateForm.transaction_ref}
                  onChange={e => setFeeUpdateForm({ ...feeUpdateForm, transaction_ref: e.target.value })}
                  placeholder="e.g. UPI Ref: 4218829102"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFeeModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700"
                >
                  {actionLoading ? 'Submitting...' : 'Submit Fee for Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details View / Admin Action Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Request #{selectedRequest.request_no}
                </h2>
                <span className="text-xs text-slate-400">{selectedRequest.request_type}</span>
              </div>
              <button onClick={() => setSelectedRequest(null)}>✕</button>
            </div>

            <div className="p-6 space-y-4 text-xs overflow-y-auto max-h-[70vh]">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-2">
                <p><strong>Student Name:</strong> {selectedRequest.student_name}</p>
                <p><strong>Roll Number:</strong> {selectedRequest.roll_number || 'N/A'}</p>
                <p><strong>Branch / Semester:</strong> {selectedRequest.branch} (Sem {selectedRequest.semester})</p>
                <p><strong>Submitted by:</strong> {selectedRequest.submitted_by_name} ({selectedRequest.submitted_by_email || 'Staff'})</p>
                <p><strong>Description:</strong> {selectedRequest.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Payload Data:</h4>
                <pre className="p-3 rounded-xl bg-slate-900 text-amber-300 font-mono text-[11px] overflow-x-auto">
                  {JSON.stringify(selectedRequest.payload, null, 2)}
                </pre>
              </div>

              {isAdmin && selectedRequest.status === 'Pending' && (
                <div>
                  <label className="block font-semibold mb-1">Admin Remarks / Approval Notes</label>
                  <textarea
                    rows={2}
                    value={reviewRemarks}
                    onChange={e => setReviewRemarks(e.target.value)}
                    placeholder="Enter approval note or rejection reason..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none resize-none"
                  />
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 rounded-xl border text-xs font-bold"
              >
                Close
              </button>
              {isAdmin && selectedRequest.status === 'Pending' && (
                <>
                  <button
                    onClick={() => handleReject(selectedRequest.id)}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                  >
                    Approve &amp; Apply Live
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
