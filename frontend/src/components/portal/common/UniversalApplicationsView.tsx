import React, { useState, useEffect } from 'react';
import {
  FileText,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Shield,
  GraduationCap,
  MessageSquare,
  Search,
  Filter,
  PlusCircle,
  Download,
  Building,
  Bell,
  Eye,
  CheckSquare,
  Sparkles,
  ChevronRight,
  Mail,
  Printer,
  X,
  Lock,
  ThumbsUp
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useCollegeData } from '../../../context/CollegeDataContext';
import { Student } from '../../../types';
import { formatDate } from '../../../utils/helpers';
import confetti from 'canvas-confetti';
import { StudentProfileModal } from '../../students/StudentProfileModal';

interface ApplicationItem {
  id: string;
  applicationNo: string;
  senderName: string;
  senderRole: 'student' | 'teacher' | 'admin';
  senderEmail: string;
  rollNo?: string;
  branch?: string;
  semester?: number;
  recipientRole: 'principal' | 'teacher' | 'admin';
  recipientName: string;
  recipientEmail: string;
  subject: string;
  category: string;
  description: string;
  attachmentUrl?: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Resolved';
  staffResponse?: string;
  reviewedBy?: string;
  submissionDate: string;
}

interface StaffNotice {
  id: string;
  title: string;
  content: string;
  category: string;
  publishDate: string;
  priority: 'High' | 'Medium' | 'Low';
  issuedBy: string;
  referenceNo: string;
  comments: Array<{
    id: string;
    authorName: string;
    authorRole: string;
    text: string;
    createdAt: string;
  }>;
}

const FACULTY_MEMBERS = [
  { name: 'Er. Sachin Maurya (Principal & Exam Controller)', email: 'principal.Government Polytechnic@gmail.com', role: 'principal', department: 'Administration' },
  { name: 'Dr. Alok Kumar Rai (HOD & Lecturer - CSE)', email: 'alok.rai@polytechnic.edu', role: 'teacher', department: 'Computer Science & Engineering' },
  { name: 'Er. Priya Sharma (Lecturer - CSE)', email: 'priya.sharma@polytechnic.edu', role: 'teacher', department: 'Computer Science & Engineering' },
  { name: 'Er. Amit Kumar Gupta (Lecturer - Mechanical)', email: 'amit.gupta@polytechnic.edu', role: 'teacher', department: 'Mechanical Engineering' },
  { name: 'Er. Rajeshwar Singh (Lecturer - Electrical)', email: 'rajeshwar.singh@polytechnic.edu', role: 'teacher', department: 'Electrical Engineering' },
  { name: 'Er. Sunita Devi (Lecturer - Civil)', email: 'sunita.devi@polytechnic.edu', role: 'teacher', department: 'Civil Engineering' }
];

export const UniversalApplicationsView: React.FC = () => {
  const { user } = useAuth();
  const { students } = useCollegeData();

  const userRole = user?.role || 'student';

  // Active Tab:
  // For Student: 'my-applications' | 'new-application'
  // For Teacher: 'received' | 'write-to-principal' | 'my-sent' | 'staff-notices'
  // For Admin: 'inbox' | 'all-registry' | 'staff-notices'
  const [activeTab, setActiveTab] = useState<string>(
    userRole === 'student' ? 'my-applications' : userRole === 'teacher' ? 'received' : 'inbox'
  );
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);

  // Applications dataset state
  const [applications, setApplications] = useState<ApplicationItem[]>([
    {
      id: 'app-1',
      applicationNo: 'APP-2026-001',
      senderName: 'Rahul Verma',
      senderRole: 'student',
      senderEmail: 'rahul.verma@student.polytechnic.edu',
      rollNo: 'E224412355001',
      branch: 'Computer Science & Engineering',
      semester: 4,
      recipientRole: 'principal',
      recipientName: 'Er. Sachin Maurya (Principal & Exam Controller)',
      recipientEmail: 'principal.Government Polytechnic@gmail.com',
      subject: 'Request for Name Spelling Correction on BTEUP Portal',
      category: 'Personal Information Correction',
      description: 'Respected Sir, My father name spelling in the matriculation marksheet is Shri Ramakant Verma. Please update the same on BTEUP college database record.',
      status: 'Approved',
      staffResponse: 'Verified with High School Board Certificate and approved. Updated in database.',
      reviewedBy: 'Er. Sachin Maurya (Principal)',
      submissionDate: '2026-04-18'
    },
    {
      id: 'app-2',
      applicationNo: 'APP-2026-002',
      senderName: 'Rahul Verma',
      senderRole: 'student',
      senderEmail: 'rahul.verma@student.polytechnic.edu',
      rollNo: 'E224412355001',
      branch: 'Computer Science & Engineering',
      semester: 4,
      recipientRole: 'teacher',
      recipientName: 'Er. Priya Sharma (Lecturer - CSE)',
      recipientEmail: 'priya.sharma@polytechnic.edu',
      subject: 'Application for 2 Days Medical Leave for DBMS Lab Session',
      category: 'Leave Application',
      description: 'Respected Madam, Due to viral fever, I was unable to attend the practical database lab on 16th and 17th August. Kindly grant me leave and permit lab make-up test.',
      status: 'Approved',
      staffResponse: 'Medical leave sanctioned. Please complete Experiment #4 in the make-up lab this Friday.',
      reviewedBy: 'Er. Priya Sharma (Lecturer CSE)',
      submissionDate: '2026-04-19'
    },
    {
      id: 'app-3',
      applicationNo: 'APP-2026-003',
      senderName: 'Dr. Alok Kumar Rai (HOD CSE)',
      senderRole: 'teacher',
      senderEmail: 'alok.rai@polytechnic.edu',
      recipientRole: 'principal',
      recipientName: 'Er. Sachin Maurya (Principal & Exam Controller)',
      recipientEmail: 'principal.Government Polytechnic@gmail.com',
      subject: 'Requisition for 10 New Core i7 Workstations for CSE Python Lab',
      category: 'Academic / Lab Equipment Request',
      description: 'Respected Principal Sir, For the upcoming BTEUP practical examinations and AI Python workshop, the CSE computer lab requires 10 additional workstations and RAM upgrade.',
      status: 'Under Review',
      staffResponse: 'Forwarded to District Technical Education Procurement Committee for budget clearance.',
      reviewedBy: 'Office of the Principal',
      submissionDate: '2026-04-20'
    }
  ]);

  // Confidential Staff Notices state
  const [staffNotices, setStaffNotices] = useState<StaffNotice[]>([
    {
      id: 'sn-1',
      title: 'Confidential: AICTE Mandatory Faculty Workload & Lab Audit Formats',
      content: 'All HODs and Faculty members are requested to review the updated AICTE & BTEUP workload norms for Session 2025-2026. Please verify theory teaching hours (16 hrs/week) and practical laboratory sessions before the upcoming committee visit.',
      category: 'Academic Audit',
      publishDate: '2026-04-12',
      priority: 'High',
      issuedBy: 'Office of the Principal (Er. Sachin Maurya)',
      referenceNo: 'GPB/STAFF/CONF/2026/01',
      comments: [
        {
          id: 'cmt-1',
          authorName: 'Dr. Alok Kumar Rai (HOD CSE)',
          authorRole: 'teacher',
          text: 'CSE Department laboratory schedules and machine logs are compiled for audit verification.',
          createdAt: '18 Aug 2026, 11:30 AM'
        },
        {
          id: 'cmt-2',
          authorName: 'Er. Priya Sharma (Lecturer CSE)',
          authorRole: 'teacher',
          text: 'Student tutorial groups have been finalized as per new AICTE ratio.',
          createdAt: '19 Aug 2026, 03:15 PM'
        }
      ]
    },
    {
      id: 'sn-2',
      title: 'Internal Order: Daily Online Attendance & Bio-Verification Protocols',
      content: 'All faculty members must mark student attendance within 15 minutes of lecture commencement via the portal. Attendance sheets will be reviewed weekly by the Principal.',
      category: 'Administration',
      publishDate: '2026-04-15',
      priority: 'High',
      issuedBy: 'Office of the Principal',
      referenceNo: 'GPB/STAFF/CONF/2026/02',
      comments: []
    }
  ]);

  // Form State for Composing Application (Minimal & Easy)
  const [selectedRecipient, setSelectedRecipient] = useState(FACULTY_MEMBERS[0]);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('General Official Application');
  const [description, setDescription] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Review Modal State (For Teachers & Principal to Approve/Reject/Reply)
  const [selectedAppForReview, setSelectedAppForReview] = useState<ApplicationItem | null>(null);
  const [reviewStatus, setReviewStatus] = useState<'Approved' | 'Under Review' | 'Rejected' | 'Resolved'>('Approved');
  const [staffRemarks, setStaffRemarks] = useState('');

  // Comment input state for staff notices
  const [activeNoticeCommentId, setActiveNoticeCommentId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Handle Application Submit - Only recipient and message body are mandatory
  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('कृपया अपनी एप्लीकेशन या संदेश लिखें (Please write your message).');
      return;
    }

    const cleanSubject = subject.trim() || `Application to ${selectedRecipient.name.split('(')[0].trim()}`;

    const newApp: ApplicationItem = {
      id: `app-${Date.now()}`,
      applicationNo: `APP-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      senderName: user?.name || 'Rahul Verma',
      senderRole: userRole,
      senderEmail: user?.email || 'student@polytechnic.edu',
      rollNo: user?.rollNo || 'E224412355001',
      branch: user?.branch || 'Computer Science & Engineering',
      semester: user?.semester || 4,
      recipientRole: selectedRecipient.role as any,
      recipientName: selectedRecipient.name,
      recipientEmail: selectedRecipient.email,
      subject: cleanSubject,
      category: category || 'General Official Application',
      description: description.trim(),
      status: 'Submitted',
      submissionDate: new Date().toISOString().split('T')[0]
    };

    setApplications(prev => [newApp, ...prev]);
    setFormSuccess(true);
    confetti({ particleCount: 50, spread: 60 });
    setSubject('');
    setDescription('');
    setTimeout(() => setFormSuccess(false), 4000);
    setActiveTab(userRole === 'student' ? 'my-applications' : 'my-sent');
  };

  // Handle Staff Review / Approval Submit
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForReview) return;

    setApplications(prev =>
      prev.map(app =>
        app.id === selectedAppForReview.id
          ? {
              ...app,
              status: reviewStatus,
              staffResponse: staffRemarks.trim() || `Sanctioned and ${reviewStatus} by ${user?.name || 'Class Teacher'}.`,
              reviewedBy: `${user?.name || 'Faculty'} (${userRole === 'admin' ? 'Principal' : 'Lecturer'})`
            }
          : app
      )
    );

    confetti({ particleCount: 60, spread: 70 });
    setSelectedAppForReview(null);
    setStaffRemarks('');
  };

  // Handle Staff Comment on Notice
  const handleAddNoticeComment = (noticeId: string) => {
    if (!newCommentText.trim()) return;

    setStaffNotices(prev =>
      prev.map(notice =>
        notice.id === noticeId
          ? {
              ...notice,
              comments: [
                ...notice.comments,
                {
                  id: `cmt-${Date.now()}`,
                  authorName: user?.name || 'Faculty Member',
                  authorRole: userRole,
                  text: newCommentText.trim(),
                  createdAt: 'Just now'
                }
              ]
            }
          : notice
      )
    );

    setNewCommentText('');
    setActiveNoticeCommentId(null);
  };

  // Filter applications for current role
  const studentMyApplications = applications.filter(
    app => app.senderEmail === user?.email || (user?.rollNo && app.rollNo === user?.rollNo)
  );

  const teacherReceivedApplications = applications.filter(
    app => app.recipientEmail === user?.email || (user?.department && app.branch === user?.department)
  );

  const teacherMySentApplications = applications.filter(
    app => app.senderEmail === user?.email
  );

  const adminAllApplications = applications;

  // Check for any newly approved notification for current student
  const approvedNotifications = studentMyApplications.filter(
    app => app.status === 'Approved' || app.status === 'Resolved'
  );

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-blue-900 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 text-center sm:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Institutional Correspondence • Two-Tier Communication</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {userRole === 'student'
              ? 'Student Applications, Leave & Grievance Portal'
              : userRole === 'teacher'
              ? 'Faculty Official Letters & Student Application Review'
              : 'Principal & Administrative Communication Command'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-200">
            Authenticated User: <strong className="text-white">{user?.name}</strong> • Role: <strong className="uppercase text-amber-300">{userRole}</strong> • Official BTEUP Channel
          </p>
        </div>

        <div className="px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-center backdrop-blur-md z-10">
          <span className="text-xs text-blue-200 uppercase font-bold block">Active Session</span>
          <span className="text-2xl font-black text-amber-400 font-mono">
            {userRole === 'student' ? studentMyApplications.length : applications.length}
          </span>
          <span className="text-[10px] text-blue-200 block">Total Letters Processed</span>
        </div>
      </div>

      {/* Student Approval Live Notification Banner */}
      {userRole === 'student' && approvedNotifications.length > 0 && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-start gap-3 text-xs text-emerald-900 dark:text-emerald-200 shadow-md animate-fade-in">
          <Bell className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5 animate-bounce" />
          <div className="space-y-1">
            <strong className="font-bold text-sm block">
              Official Approval Notification from College Administration / Class Teacher:
            </strong>
            <p>
              Your application <strong className="font-mono text-emerald-700 dark:text-emerald-300">{approvedNotifications[0].applicationNo}</strong> ({approvedNotifications[0].subject}) has been <strong>APPROVED</strong> by <strong>{approvedNotifications[0].reviewedBy}</strong>.
            </p>
            {approvedNotifications[0].staffResponse && (
              <p className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-900/60 font-medium">
                💬 <strong>Official Remarks:</strong> "{approvedNotifications[0].staffResponse}"
              </p>
            )}
          </div>
        </div>
      )}

      {/* Navigation Switcher Tabs */}
      <div className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center gap-2">
        {userRole === 'student' && (
          <>
            <button
              onClick={() => setActiveTab('my-applications')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'my-applications'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>1. My Submitted Applications ({studentMyApplications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('new-application')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'new-application'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>2. Write Application to Principal / Teacher</span>
            </button>
          </>
        )}

        {userRole === 'teacher' && (
          <>
            <button
              onClick={() => setActiveTab('received')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'received'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>1. Received Student Applications ({teacherReceivedApplications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('write-to-principal')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'write-to-principal'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>2. Write Application to Principal</span>
            </button>

            <button
              onClick={() => setActiveTab('my-sent')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'my-sent'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>3. My Outgoing Letters ({teacherMySentApplications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('staff-notices')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'staff-notices'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>4. Confidential Staff Circulars &amp; Discussions</span>
            </button>
          </>
        )}

        {userRole === 'admin' && (
          <>
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'inbox'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>1. Principal's Inbox ({adminAllApplications.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length} Pending)</span>
            </button>

            <button
              onClick={() => setActiveTab('all-registry')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'all-registry'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>2. Master Applications Registry ({adminAllApplications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('staff-notices')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'staff-notices'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>3. Confidential Faculty Circulars &amp; Discussions</span>
            </button>
          </>
        )}
      </div>

      {/* Tab Content: Compose Application Form (For Student or Teacher) */}
      {(activeTab === 'new-application' || activeTab === 'write-to-principal') && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-600" />
              <span>Draft &amp; Submit Official Institutional Application</span>
            </h2>
            <span className="text-xs text-slate-400">
              The application will be transmitted directly to the selected faculty member or Principal's desk.
            </span>
          </div>

          <form onSubmit={handleApplicationSubmit} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>
                <strong>आसान नियम:</strong> केवल किसको भेजना है और क्या लिखना चाहते हैं यह जरूरी है। बाक़ी विषय (Subject) व श्रेणी वैकल्पिक (Optional) है।
              </span>
            </div>

            {/* 1. Recipient Selection (Mandatory) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                1. किसको एप्लीकेशन भेज रहे हैं? (Select Recipient) <span className="text-rose-500">*</span>:
              </label>
              <select
                value={selectedRecipient.email}
                onChange={e => {
                  const target = FACULTY_MEMBERS.find(f => f.email === e.target.value) || FACULTY_MEMBERS[0];
                  setSelectedRecipient(target);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
              >
                {FACULTY_MEMBERS.map((f, idx) => (
                  <option key={idx} value={f.email}>
                    {f.role === 'principal' ? '🏛️ ' : '👨‍🏫 '} {f.name} ({f.department}) • {f.email}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                ईमेल: <strong className="text-blue-600 font-mono">{selectedRecipient.email}</strong>
              </span>
            </div>

            {/* 2. Message Body (Mandatory) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                2. अपना संदेश / एप्लीकेशन लिखें (Message / Letter Content) <span className="text-rose-500">*</span>:
              </label>
              <textarea
                rows={5}
                required
                placeholder="यहाँ अपना संदेश या एप्लीकेशन लिखें (e.g. आदरणीय सर / मैडम, मुझे आवश्यक कार्य / बीमारी हेतु 2 दिन का अवकाश प्रदान करने की कृपा करें...)"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none leading-relaxed font-medium"
              />
            </div>

            {/* Optional Fields: Subject & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  विषय / Subject (वैकल्पिक / Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. अवकाश हेतु / नाम सुधार हेतु (Optional)"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  श्रेणी / Category (वैकल्पिक / Optional)
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  <option value="General Official Application">सामान्य प्रार्थना पत्र (General Application)</option>
                  <option value="Leave Application">अवकाश प्रार्थना पत्र (Leave Application)</option>
                  <option value="Personal Information Correction">नाम / जन्मतिथि / डेटा सुधार (Correction)</option>
                  <option value="Fee / Payment Issue">फीस / छात्रवृत्ति सम्बन्धी (Fees &amp; Scholarship)</option>
                  <option value="Examination & Result Issue">परीक्षा / अंकतालिका सम्बन्धी (Exam / Result)</option>
                  <option value="Document / Certificate Request">प्रमाण पत्र / चरित्र प्रमाण पत्र (Certificate)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> भेजें / Send Application
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Content: Applications List View (Student, Teacher, or Admin) */}
      {(activeTab === 'my-applications' || activeTab === 'received' || activeTab === 'my-sent' || activeTab === 'inbox' || activeTab === 'all-registry') && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>
                  {activeTab === 'my-applications'
                    ? 'My Submitted Applications & Status Tracker'
                    : activeTab === 'received'
                    ? 'Applications Addressed to You for Review'
                    : activeTab === 'my-sent'
                    ? 'My Outgoing Letters to Principal'
                    : activeTab === 'inbox'
                    ? 'Principal\'s Action Inbox'
                    : 'Master Institutional Applications Registry'}
                </span>
              </h2>
              <span className="text-xs text-slate-400">Live record tracking with official review signatures</span>
            </div>

            {userRole === 'student' && (
              <button
                onClick={() => setActiveTab('new-application')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20"
              >
                <PlusCircle className="w-4 h-4" /> New Application
              </button>
            )}
          </div>

          {/* Applications Table / Cards */}
          {((activeTab === 'my-applications' ? studentMyApplications : activeTab === 'received' ? teacherReceivedApplications : activeTab === 'my-sent' ? teacherMySentApplications : adminAllApplications).length === 0) ? (
            <div className="p-10 text-center text-slate-400 text-xs">
              No applications found in this section.
            </div>
          ) : (
            <div className="space-y-4">
              {(activeTab === 'my-applications' ? studentMyApplications : activeTab === 'received' ? teacherReceivedApplications : activeTab === 'my-sent' ? teacherMySentApplications : adminAllApplications).map((app, idx) => {
                const isApproved = app.status === 'Approved' || app.status === 'Resolved';
                const isRejected = app.status === 'Rejected';
                const isPending = app.status === 'Submitted' || app.status === 'Under Review';

                return (
                  <div
                    key={app.id || idx}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
                          {app.applicationNo}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {app.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-0.5 rounded-full text-xs font-black uppercase ${
                            isApproved
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : isRejected
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {app.status}
                        </span>
                        <span className="text-[11px] text-slate-400">{app.submissionDate}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {app.subject}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {app.description}
                      </p>
                    </div>

                    {/* Sender & Recipient Dossier */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                      <div>
                        <span className="text-slate-400 font-medium">From (आवेदक): </span>
                        {(() => {
                          const matchedStudent = students.find(
                            s => s.email === app.senderEmail || (app.rollNo && s.rollNo === app.rollNo) || s.name === app.senderName
                          );
                          if (matchedStudent && (userRole === 'admin' || userRole === 'teacher')) {
                            return (
                              <button
                                type="button"
                                onClick={() => setSelectedStudentForModal(matchedStudent)}
                                className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 group text-left"
                                title="Click to view full 360° student dossier & edit details"
                              >
                                <span>{app.senderName}</span>
                                <span className="text-[10px] text-blue-500 opacity-70 group-hover:opacity-100">↗</span>
                              </button>
                            );
                          }
                          return <strong className="text-slate-800 dark:text-slate-200">{app.senderName}</strong>;
                        })()}
                        {app.rollNo && <span className="font-mono text-slate-500"> ({app.rollNo})</span>}
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">To (अधिकारी/शिक्षक): </span>
                        <strong className="text-blue-600 dark:text-blue-400">{app.recipientName}</strong>
                      </div>
                    </div>

                    {/* Official Review / Remarks Box */}
                    {app.staffResponse && (
                      <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Official Review by {app.reviewedBy || 'Authorized Officer'}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 italic">
                          "{app.staffResponse}"
                        </p>
                      </div>
                    )}

                    {/* Action Button for Teacher / Admin to Review */}
                    {(userRole === 'admin' || (userRole === 'teacher' && activeTab === 'received')) && (
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => {
                            setSelectedAppForReview(app);
                            setReviewStatus(app.status === 'Submitted' ? 'Approved' : app.status as any);
                            setStaffRemarks(app.staffResponse || '');
                          }}
                          className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Review &amp; Respond
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Confidential Staff Circulars & Discussions (Visible to Teachers & Principal) */}
      {activeTab === 'staff-notices' && (userRole === 'teacher' || userRole === 'admin') && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase mb-1">
                <Lock className="w-3 h-3" /> Confidential • Faculty &amp; Administration Only
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Official Faculty Circulars &amp; Staff Discussion Threads</span>
              </h2>
              <span className="text-xs text-slate-400">
                Principal publishes official notices. Faculty members can read and post constructive suggestions.
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {staffNotices.map((notice, idx) => (
              <div
                key={notice.id || idx}
                className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 text-blue-700">
                      {notice.referenceNo}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {notice.title}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">{notice.publishDate}</span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                  {notice.content}
                </p>

                <div className="text-xs text-slate-500 font-medium">
                  Issued By: <strong className="text-slate-900 dark:text-white">{notice.issuedBy}</strong>
                </div>

                {/* Faculty Suggestions & Discussion Section */}
                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span>Faculty Suggestions &amp; Discussion Comments ({notice.comments.length}):</span>
                  </h4>

                  <div className="space-y-2">
                    {notice.comments.map((cmt, cIdx) => (
                      <div
                        key={cmt.id || cIdx}
                        className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-blue-600 dark:text-blue-400 font-bold">
                            {cmt.authorName}
                          </strong>
                          <span className="text-[10px] text-slate-400">{cmt.createdAt}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{cmt.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Suggestion Box */}
                  <div className="pt-2">
                    {activeNoticeCommentId === notice.id ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          placeholder="Write your suggestion or feedback for the Principal..."
                          value={newCommentText}
                          onChange={e => setNewCommentText(e.target.value)}
                          className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveNoticeCommentId(null);
                              setNewCommentText('');
                            }}
                            className="px-3 py-1.5 rounded-lg border text-xs text-slate-600"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddNoticeComment(notice.id)}
                            className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm"
                          >
                            Post Suggestion
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveNoticeCommentId(notice.id);
                          setNewCommentText('');
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>Add Faculty Suggestion / Feedback</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Modal for Teachers / Principal */}
      {selectedAppForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-500 uppercase">
                  Official Application Review
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedAppForReview.applicationNo} • {selectedAppForReview.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppForReview(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Application Content:</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedAppForReview.description}
                </p>
                <div className="pt-2 text-[11px] text-slate-500">
                  Applicant: <strong>{selectedAppForReview.senderName}</strong> • Roll: {selectedAppForReview.rollNo || 'N/A'}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Update Decision Status
                </label>
                <select
                  value={reviewStatus}
                  onChange={e => setReviewStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  <option value="Approved">✅ Approve Application</option>
                  <option value="Under Review">⏳ Mark Under Review / Pending Investigation</option>
                  <option value="Resolved">🎉 Resolved &amp; Completed</option>
                  <option value="Rejected">❌ Reject Application</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Official Reply / Remarks for Applicant (जवाब / निर्देश)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Verified with matriculation record and sanctioned."
                  value={staffRemarks}
                  onChange={e => setStaffRemarks(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAppForReview(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30"
                >
                  Save &amp; Notify Applicant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student 360 Dossier & Quick Edit Modal */}
      <StudentProfileModal
        isOpen={!!selectedStudentForModal}
        onClose={() => setSelectedStudentForModal(null)}
        student={selectedStudentForModal}
      />
    </div>
  );
};
