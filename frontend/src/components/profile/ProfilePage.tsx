import React, { useState, useRef } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Clock,
  CheckCircle2,
  Calendar,
  Building,
  Save,
  Activity,
  Edit2,
  Camera,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Award,
  MapPin,
  Heart,
  FileBadge,
  Printer
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCollegeData } from '../../context/CollegeDataContext';
import { websiteContentService } from '../../services/websiteContentService';
import { formatDate } from '../../utils/helpers';
import { Globe, ArrowLeft } from 'lucide-react';

interface ProfilePageProps {
  onNavigate?: (view: string) => void;
  onGoToPublicWebsite?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate, onGoToPublicWebsite }) => {
  const { user, updateUser } = useAuth();
  const { settings, updateSettings, students } = useCollegeData();

  // Find linked student record if user is student
  const studentRecord = students.find(
    s => (user?.rollNo && s.rollNo.toLowerCase() === user.rollNo.toLowerCase()) ||
         (user?.email && s.email.toLowerCase() === user.email.toLowerCase())
  );

  const studentDob = user?.dob || studentRecord?.dob || '2004-05-14';
  const studentEnrollment = user?.enrollmentNo || studentRecord?.enrollmentNo || user?.rollNo || '224412001';
  const studentFather = user?.fatherName || studentRecord?.fatherName || 'Shri Ramakant Verma';
  const studentMother = user?.motherName || studentRecord?.motherName || 'Smt. Shanti Devi';
  const studentCategory = user?.category || studentRecord?.category || 'OBC';
  const studentBlood = user?.bloodGroup || studentRecord?.bloodGroup || 'B+';
  const studentAddress = user?.address || studentRecord?.address || 'Uttar Pradesh (U.P.) - 277202';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+91 94150 24510',
    designation: user?.designation || (user?.role === 'admin' ? 'Principal & Administrator' : user?.role === 'teacher' ? 'Lecturer' : 'Diploma Student'),
    department: user?.department || (user?.role === 'student' ? user?.branch || 'Computer Science' : 'Administration'),
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Suggested high quality profile photo presets
  const AVATAR_PRESETS = [
    { label: 'Principal (Academician Male 1)', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces' },
    { label: 'Principal (Academician Male 2)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces' },
    { label: 'Principal (Academician Male 3)', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces' },
    { label: 'Professor Female', url: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=200&h=200&fit=crop&crop=faces' },
    { label: 'Student Male', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces' },
    { label: 'Student Female', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        setFormData(prev => ({ ...prev, avatar: base64Url }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter your full name.');
      return;
    }

    updateUser(formData);

    // If admin/principal updates name or photo, sync with official College Settings and Website Content
    if (user?.role === 'admin') {
      updateSettings({ principalName: formData.name });
      websiteContentService.updateAboutCollege({
        principal_name: formData.name,
        principal_photo: formData.avatar
      });
    }

    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const activityLogs = [
    { time: 'Today at 10:45 AM', action: 'Accessed Academic Dossier & BTEUP Examination Record', type: 'academic' },
    { time: 'Today at 09:30 AM', action: 'Biometric Attendance Checked for Lecture Session', type: 'attendance' },
    { time: 'Yesterday at 04:15 PM', action: 'Verified Semester Fee Receipt & Scholarship Status', type: 'fee' },
    { time: '18 Aug 2026', action: 'Downloaded Semester Marksheet PDF', type: 'marksheet' }
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-polytechnic-900 via-blue-900 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        {/* Profile Photo with Camera Trigger */}
        <div className="relative group flex-shrink-0">
          <img
            src={formData.avatar || user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop'}
            alt={user?.name}
            className="w-28 h-28 rounded-2xl object-cover ring-4 ring-white/30 shadow-2xl transition-all group-hover:brightness-90"
          />
          <button
            type="button"
            onClick={() => {
              setIsEditing(true);
              fileInputRef.current?.click();
            }}
            title="Upload new profile picture"
            aria-label="Upload new profile picture"
            className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg ring-2 ring-white/50 transition-transform active:scale-95"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* User Role & Identity */}
        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{user?.name}</h1>
            <span className={`px-3 py-0.5 rounded-full text-xs font-black uppercase shadow-sm ${
              user?.role === 'admin'
                ? 'bg-amber-400 text-slate-950'
                : user?.role === 'teacher'
                ? 'bg-emerald-400 text-slate-950'
                : 'bg-blue-300 text-slate-950'
            }`}>
              {user?.role === 'admin' ? 'Principal / Admin' : user?.role === 'teacher' ? 'Faculty' : 'Diploma Student'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-blue-200 font-medium">
            {user?.role === 'student'
              ? `${user?.branch || 'Computer Science & Engineering'} • Semester ${user?.semester || 4}`
              : user?.designation}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-blue-300">
            {user?.role === 'student' && (
              <>
                <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-amber-300" />
                  DOB: <strong className="text-white font-mono">{studentDob}</strong>
                </span>
                <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                  <FileBadge className="w-3.5 h-3.5 text-blue-200" />
                  Enrollment: <strong className="text-white font-mono">{studentEnrollment}</strong>
                </span>
                <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                  <Award className="w-3.5 h-3.5 text-emerald-300" />
                  Roll: <strong className="text-white font-mono">{user?.rollNo || 'E224412355001'}</strong>
                </span>
              </>
            )}
            {user?.role !== 'student' && (
              <>
                <span>Department: <strong className="text-white">{user?.department}</strong></span>
                <span>•</span>
                <span>Last Access: <strong className="text-white">{user?.lastLogin || 'Today'}</strong></span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons: Print for Student, Edit & View Public Web for Staff/Admin */}
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0 self-center">
          {user?.role === 'admin' && (
            <button
              onClick={() => {
                if (onGoToPublicWebsite) onGoToPublicWebsite();
                else if (onNavigate) onNavigate('view-public-web');
              }}
              className="px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-lg shadow-amber-400/20 transition-all flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" /> View Public Web ↗
            </button>
          )}

          {user?.role === 'student' ? (
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print Official Student ID &amp; Dossier
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5 border border-white/20"
            >
              <Edit2 className="w-3.5 h-3.5" /> {isEditing ? 'Close Editor' : 'Edit Photo / Info'}
            </button>
          )}
        </div>
      </div>

      {user?.role === 'student' && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200 shadow-sm">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold">Official BTEUP Student Record (Read-Only &amp; Protected):</strong>
            <p>
              Your academic profile, enrollment number, date of birth, and identity are locked as per Board of Technical Education, Uttar Pradesh regulations. If you need any corrections (such as name spelling, DOB, or branch updates), please submit an official application from the <strong>Online Applications</strong> session directly to the Principal or your Class Teacher.
            </p>
          </div>
        </div>
      )}

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold border border-emerald-200 flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Profile photo and information updated successfully!</span>
        </div>
      )}

      {/* Main Grid: Details or Edit Form & Activity Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Account Details or Edit Form */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-600" />
              {isEditing ? 'Edit Profile & Photo' : user?.role === 'student' ? 'Official Student Profile & Personal Dossier' : 'Institutional Profile Dossier'}
            </h2>
            {isEditing && (
              <span className="text-[11px] text-slate-400 font-medium">All changes sync live across your portal</span>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Photo Change Section */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Update Profile Photo (Upload File or Choose Avatar)
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload from Computer
                  </button>

                  <div className="text-xs text-slate-400">or enter image URL below:</div>
                </div>

                <input
                  type="url"
                  placeholder="Paste direct photo image URL (https://...)"
                  value={formData.avatar}
                  onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                />

                {/* Preset Avatar Chips */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Quick Profile Avatars:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatar: preset.url })}
                        className="px-3 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-medium text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition-all flex items-center gap-1.5"
                      >
                        <img src={preset.url} alt={preset.label} className="w-4 h-4 rounded-full object-cover" />
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Contact Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department / Branch
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
                >
                  <Save className="w-4 h-4" /> Save Profile &amp; Photo
                </button>
              </div>
            </form>
          ) : user?.role === 'student' ? (
            /* Student Detailed Profile Cards */
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date of Birth Card */}
                <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-1">
                  <span className="text-amber-800 dark:text-amber-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Date of Birth (DOB) / Login Password
                  </span>
                  <strong className="text-slate-900 dark:text-white text-base block font-mono font-black">
                    {studentDob}
                  </strong>
                  <span className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                    Verified Matriculation / High School Record
                  </span>
                </div>

                {/* Enrollment Number Card */}
                <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-1">
                  <span className="text-blue-800 dark:text-blue-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                    <FileBadge className="w-3.5 h-3.5" /> BTEUP Enrollment Number
                  </span>
                  <strong className="text-slate-900 dark:text-white text-base block font-mono font-black">
                    {studentEnrollment}
                  </strong>
                  <span className="text-[11px] text-blue-700 dark:text-blue-300 font-medium">
                    Board Permanent Registration
                  </span>
                </div>

                {/* Roll Number & Branch */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Board Roll Number &amp; Semester</span>
                  <strong className="text-slate-900 dark:text-white text-sm block font-mono">
                    {user?.rollNo || 'E224412355001'} (Semester {user?.semester || 4})
                  </strong>
                  <span className="text-slate-500">{user?.branch || 'Computer Science & Engineering'}</span>
                </div>

                {/* Parents Info */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Father &amp; Mother Name</span>
                  <strong className="text-slate-900 dark:text-white text-xs block">
                    Father: {studentFather}
                  </strong>
                  <span className="text-slate-500 text-xs block">
                    Mother: {studentMother}
                  </span>
                </div>

                {/* Category & Blood Group */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Reservation Category &amp; Blood Group</span>
                  <strong className="text-slate-900 dark:text-white text-sm block">
                    Category: {studentCategory} • Blood: {studentBlood}
                  </strong>
                  <span className="text-emerald-600 font-semibold">Scholarship Eligible</span>
                </div>

                {/* Residential Address */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Permanent Residential Address
                  </span>
                  <strong className="text-slate-900 dark:text-white text-xs block leading-relaxed">
                    {studentAddress}
                  </strong>
                  <span className="text-slate-500">Uttar Pradesh - 277202</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Account Holder</span>
                <strong className="text-slate-900 dark:text-white text-sm block">{user?.name}</strong>
                <span className="text-slate-500">{user?.designation}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Official Email</span>
                <strong className="text-slate-900 dark:text-white text-sm block truncate">{user?.email}</strong>
                <span className="text-slate-500">Verified institutional domain</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Authorized Role</span>
                <strong className="text-blue-600 dark:text-blue-400 text-sm block capitalize">{user?.role}</strong>
                <span className="text-slate-500">{user?.role === 'admin' ? 'Administrative Access' : 'Faculty Access'}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Institution</span>
                <strong className="text-slate-900 dark:text-white text-xs block">{settings.collegeName}</strong>
                <span className="text-slate-500">BTEUP Code: {settings.bteupCode} • Uttar Pradesh (U.P.)</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Activity History Timeline */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-emerald-500" />
              Recent Activity Audit
            </h2>

            <div className="space-y-3.5 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {activityLogs.map((log, idx) => (
                <div key={idx} className="relative pl-7 text-xs">
                  <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900" />
                  <p className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">{log.action}</p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{log.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>SSL / 256-bit Encrypted Session</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
