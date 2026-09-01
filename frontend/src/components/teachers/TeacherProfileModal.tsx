import React, { useState, useEffect } from 'react';
import { Teacher } from '../../types';
import { Modal } from '../common/Modal';
import {
  GraduationCap,
  Briefcase,
  Phone,
  Mail,
  Calendar,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  IndianRupee,
  ShieldCheck,
  MapPin,
  Heart,
  Edit2,
  Save,
  Printer,
  Sparkles,
  UserCheck,
  TrendingUp,
  FileBadge,
  Upload,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { formatDate, formatCurrencyINR } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useCollegeData } from '../../context/CollegeDataContext';
import confetti from 'canvas-confetti';

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  isOpen,
  onClose,
  teacher
}) => {
  const { user } = useAuth();
  const { updateTeacher, addNotification } = useCollegeData();
  const isPrincipal = user?.role === 'admin';

  const [activeTab, setActiveTab] = useState<'dossier' | 'service' | 'idcard' | 'edit'>('dossier');
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Suggested high quality profile photo presets
  const STAFF_PHOTO_PRESETS = [
    { label: 'Professor 1 (Male)', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces' },
    { label: 'Professor 2 (Male)', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces' },
    { label: 'Lecturer (Female)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces' },
    { label: 'Lecturer 2 (Female)', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces' },
    { label: 'Technical Staff', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces' },
    { label: 'Admin Officer', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces' },
  ];

  // Edit form state
  const [formData, setFormData] = useState<Partial<Teacher>>({});

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name,
        empCode: teacher.empCode,
        department: teacher.department,
        designation: teacher.designation,
        qualification: teacher.qualification,
        email: teacher.email,
        mobile: teacher.mobile,
        photoUrl: teacher.photoUrl,
        joiningDate: teacher.joiningDate,
        experienceYears: teacher.experienceYears,
        age: teacher.age || 40,
        dob: teacher.dob || '1985-05-15',
        gender: teacher.gender || 'Male',
        salary: teacher.salary || 78500,
        payScale: teacher.payScale || '7th CPC Level 10 (₹56,100 - ₹1,77,500)',
        promotionStatus: teacher.promotionStatus || 'Regular Confirmed • Eligible for Next CAS Review',
        address: teacher.address || 'Government Polytechnic Staff Quarters, Uttar Pradesh (U.P.) - 277202',
        bloodGroup: teacher.bloodGroup || 'B+',
        staffType: teacher.staffType || 'Teaching Faculty',
        workDescription: teacher.workDescription || 'Conducts theory & practical lectures, departmental laboratory supervision',
        status: teacher.status || 'Active'
      });
      setIsEditing(false);
      setSavedSuccess(false);
    }
  }, [teacher, isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        setFormData(prev => ({ ...prev, photoUrl: base64Url }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!teacher) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTeacher(teacher.id, formData);
      setSavedSuccess(true);
      setIsEditing(false);
      confetti({ particleCount: 40, spread: 60 });
      setTimeout(() => setSavedSuccess(false), 3500);

      addNotification({
        title: `Staff Service Record Updated: ${teacher.name}`,
        message: `Principal updated service record, salary, and designation for ${teacher.name} (${teacher.empCode}).`,
        type: 'success',
        linkView: 'teachers'
      });
    } catch (err) {
      alert('Error updating staff record.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Faculty &amp; Staff 360° Dossier: {formData.name || teacher.name}</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            {teacher.empCode}
          </span>
        </div>
      }
      subtitle="Government Polytechnic (Affiliated to BTEUP Lucknow)"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-2 no-print overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('dossier')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'dossier'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Full Staff Dossier (व्यक्तिगत एवं सेवा विवरण)
          </button>
          <button
            onClick={() => setActiveTab('service')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'service'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Salary &amp; Promotion (वेतन एवं पदोन्नति)
          </button>
          <button
            onClick={() => setActiveTab('idcard')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'idcard'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileBadge className="w-3.5 h-3.5" /> Official ID Card &amp; Service Sheet
          </button>
          {isPrincipal && (
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ml-auto ${
                activeTab === 'edit'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
              }`}
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Details (सुधारें)
            </button>
          )}
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Staff details and service register updated successfully!</span>
          </div>
        )}

        {/* Tab 1: Full Staff Dossier */}
        {activeTab === 'dossier' && (
          <div className="space-y-6">
            {/* Header Identity Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-polytechnic-900 text-white shadow-xl flex flex-col sm:flex-row items-center gap-6 border border-slate-800">
              <img
                src={teacher.photoUrl}
                alt={teacher.name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-emerald-400/40 shadow-xl flex-shrink-0"
              />
              <div className="flex-1 text-center sm:text-left space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">{teacher.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-slate-950 uppercase">
                    {teacher.staffType || 'Teaching Faculty'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-emerald-300">
                  {teacher.designation} • Department of {teacher.department}
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-300">
                  <span className="bg-white/10 px-2 py-0.5 rounded-md">
                    Age: <strong className="text-white font-mono">{teacher.age || 40} Yrs</strong> (DOB: {teacher.dob || '1985-05-15'})
                  </span>
                  <span>•</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded-md">
                    Joined: <strong className="text-white font-mono">{formatDate(teacher.joiningDate)}</strong> ({teacher.experienceYears}+ Yrs Service)
                  </span>
                  <span>•</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded-md">
                    Blood: <strong className="text-white">{teacher.bloodGroup || 'B+'}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Grid: Qualifications, Work Mandates, Contact & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Qualifications & Degrees */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-card">
                <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> Academic Qualifications &amp; Specialization
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Degrees / Certification (Collification):</span>
                  <p className="font-bold text-slate-900 dark:text-white text-xs leading-relaxed">
                    {teacher.qualification}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Assigned Subjects / Teaching Roster:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.subjects.map((sub, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-[11px]"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Work Description: कौन स्टाफ क्या काम करता है */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-card">
                <h4 className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" /> Official Roles &amp; Key Responsibilities (कार्य विवरण)
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Institutional Work Description:</span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {teacher.workDescription || 'Conducts daily classroom lectures and practical workshop sessions, coordinates BTEUP semester examination routines, and oversees student academic performance.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Staff Status &amp; Category:</span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{teacher.staffType || 'Teaching Faculty'}</span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {teacher.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact & Official Identifiers */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-card">
                <h4 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-4 h-4" /> Official Contact Registry
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-1.5">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Official Email</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{teacher.email}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Mobile / Helpline</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{teacher.mobile}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Employee Code</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{teacher.empCode}</strong>
                  </div>
                </div>
              </div>

              {/* Residential Address */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 shadow-card">
                <h4 className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Permanent &amp; Residential Address (पता)
                </h4>
                <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  {teacher.address || 'Government Polytechnic Campus Staff Quarters, Uttar Pradesh (U.P.) - 277202'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Salary, Pay Scale & Promotion Status */}
        {activeTab === 'service' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Monthly Basic + Allowances (सैलरी)</span>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                  {formatCurrencyINR(teacher.salary || 78500)}
                  <span className="text-xs font-normal text-slate-500"> / month</span>
                </div>
                <p className="text-[11px] text-slate-500">Disbursed via UP State Treasury Direct Credit</p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-1">
                <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase">Pay Band / Scale Level</span>
                <div className="text-sm font-bold text-blue-900 dark:text-blue-200">
                  {teacher.payScale || '7th CPC Level 10 (₹56,100 - ₹1,77,500)'}
                </div>
                <p className="text-[11px] text-slate-500">Approved under 7th Central Pay Commission</p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-1 sm:col-span-2 lg:col-span-1">
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase">Total Govt. Experience</span>
                <div className="text-2xl font-black text-amber-800 dark:text-amber-300">
                  {teacher.experienceYears}+ Years
                </div>
                <p className="text-[11px] text-slate-500">Joined on {formatDate(teacher.joiningDate)}</p>
              </div>
            </div>

            {/* Promotion History & CAS Status */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Career Advancement &amp; Promotion Status (पदोन्नति विवरण)</span>
              </h4>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Current Official Grade / CAS Status:</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Confirmed Service
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                  {teacher.promotionStatus || 'Regular Confirmed Staff • Eligible for Next Career Advancement Scheme (CAS) Review'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">DTE Service Record:</span>
                  <span>Registered with Department of Technical Education, Lucknow (UP).</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">Annual Confidential Report (ACR):</span>
                  <span className="text-emerald-600 font-bold">Outstanding / Grade-A Certified by Principal</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Official ID Card & Printable Service Sheet */}
        {activeTab === 'idcard' && (
          <div className="space-y-6 flex flex-col items-center">
            {/* Printable ID Card */}
            <div className="w-full max-w-md rounded-3xl bg-gradient-to-br from-slate-900 via-polytechnic-950 to-slate-900 text-white p-6 shadow-2xl border border-white/20 relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div>
                  <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">Government Polytechnic</h4>
                  <p className="text-[10px] text-blue-200">Uttar Pradesh (U.P.) • Inst. Code 4412</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/20 text-white">STAFF ID</span>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={teacher.photoUrl}
                  alt={teacher.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-400/80 shadow-lg"
                />
                <div className="space-y-1 text-xs">
                  <h3 className="font-extrabold text-white text-sm">{teacher.name}</h3>
                  <p className="text-emerald-300 font-semibold">{teacher.designation}</p>
                  <p className="text-slate-400 text-[11px]">Dept: {teacher.department}</p>
                  <p className="font-mono text-[10px] text-amber-300">Emp Code: {teacher.empCode}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 pt-2 border-t border-white/10">
                <div>Phone: <strong className="text-white">{teacher.mobile}</strong></div>
                <div>Blood Group: <strong className="text-white">{teacher.bloodGroup || 'B+'}</strong></div>
                <div>Age: <strong className="text-white">{teacher.age || 40} Yrs</strong></div>
                <div>Joining: <strong className="text-white">{teacher.joiningDate}</strong></div>
              </div>

              <div className="pt-3 border-t border-white/20 flex items-center justify-between text-[9px] text-slate-400">
                <div>Official Govt. Faculty Record</div>
                <div className="text-right font-serif italic text-white font-bold">Sachin Maurya (Principal)</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 no-print"
            >
              <Printer className="w-4 h-4" /> Print Official Staff ID Card &amp; Service Sheet
            </button>
          </div>
        )}

        {/* Tab 4: In-Place Edit Form (for Principal) */}
        {activeTab === 'edit' && isPrincipal && (
          <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4 text-xs">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <Edit2 className="w-4 h-4 text-emerald-600" />
              <span>Edit Staff Service, Photo &amp; Salary Details (प्रिंसिपल द्वारा विवरण सुधारें)</span>
            </h4>

            {/* Interactive Photo Upload & Avatar Picker */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-dashed border-emerald-500/40 dark:border-emerald-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* Clickable Large Photo Avatar */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-24 h-24 rounded-2xl overflow-hidden cursor-pointer group shadow-lg ring-4 ring-emerald-500/50 hover:ring-emerald-500 transition-all flex-shrink-0"
                  title="Click to Choose Photo from Device"
                >
                  <img
                    src={formData.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces'}
                    alt="Staff Photo Preview"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                    <Camera className="w-6 h-6 mb-1 text-emerald-300" />
                    <span className="text-[9px] font-bold text-center leading-tight">बदलें / Change</span>
                  </div>
                </div>

                {/* Upload Action Buttons */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex items-center gap-2">
                    <h5 className="font-extrabold text-slate-900 dark:text-white text-xs">
                      Staff Profile Photo (स्टाफ प्रोफ़ाइल फोटो लगाएं)
                    </h5>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                      Live Preview
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    कंप्यूटर, मोबाइल गैलरी से अपनी फोटो चुनें या नीचे दिए गए अवतारों में से कोई एक चुनें।
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all hover:scale-105"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload from Device / Gallery (गैलरी से फोटो लगाएं)</span>
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                          const video = document.createElement('video');
                          video.srcObject = stream;
                          video.play();
                          setTimeout(() => {
                            const canvas = document.createElement('canvas');
                            canvas.width = 300;
                            canvas.height = 300;
                            const ctx = canvas.getContext('2d');
                            ctx?.drawImage(video, 0, 0, 300, 300);
                            const snap = canvas.toDataURL('image/jpeg');
                            setFormData(prev => ({ ...prev, photoUrl: snap }));
                            stream.getTracks().forEach(track => track.stop());
                            alert('Live photo captured from camera successfully!');
                          }, 1500);
                        } catch (e) {
                          fileInputRef.current?.click();
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Take Live Photo (कैमरा)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Photo URL Input */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <input
                  type="url"
                  placeholder="Or paste direct image URL (https://...)"
                  value={formData.photoUrl || ''}
                  onChange={e => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                />
              </div>

              {/* Quick Avatars Grid */}
              <div>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Profile Avatars (तैयार अवतार चुनें):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {[
                    { label: 'Professor 1 (Male)', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces' },
                    { label: 'Professor 2 (Male)', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces' },
                    { label: 'Lecturer (Female)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces' },
                    { label: 'Lecturer 2 (Female)', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces' },
                    { label: 'Lab Instructor', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces' },
                    { label: 'Admin Officer', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces' }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, photoUrl: preset.url })}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        formData.photoUrl === preset.url
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-emerald-400'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-300" />
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-full">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name (पूरा नाम)</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Designation / Post (पद)</label>
                <input
                  type="text"
                  required
                  value={formData.designation || ''}
                  onChange={e => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department (विभाग) *</label>
                <select
                  value={formData.department || ''}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-xs"
                >
                  <optgroup label="🎓 Academic Branches (शैक्षणिक शाखाएं)">
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Mechanical Engineering (Production)">Mechanical Engineering (Production)</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Electronics Engineering">Electronics Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Applied Sciences & Humanities (Physics, Chem, Math)">Applied Sciences & Humanities (Physics, Chem, Math)</option>
                  </optgroup>

                  <optgroup label="📚 Central Library Wing (पुस्तकालय विभाग)">
                    <option value="Central Library & Digital Resource Wing (पुस्तकालय / लाइब्रेरियन)">Central Library & Digital Resource Wing (पुस्तकालय / लाइब्रेरियन)</option>
                  </optgroup>

                  <optgroup label="🏢 Administration & Registry (कार्यालय / प्यून, अनुसेवक व क्लर्क)">
                    <option value="Administrative Registry & Peon Staff (कार्यालय / प्यून, अनुसेवक व क्लर्क)">Administrative Registry & Peon Staff (कार्यालय / प्यून, अनुसेवक व क्लर्क)</option>
                  </optgroup>

                  <optgroup label="🚌 Transport & Campus Bus Fleet (परिवहन विभाग / बस चालक व स्टाफ)">
                    <option value="Transport & Campus Bus Fleet (परिवहन / बस चालक व स्टाफ)">Transport & Campus Bus Fleet (परिवहन / बस चालक व स्टाफ)</option>
                  </optgroup>

                  <optgroup label="🛠️ Central Workshop & Technical Labs (केंद्रीय वर्कशॉप व लैब)">
                    <option value="Central Workshop & Technical Labs (केंद्रीय वर्कशॉप व लैब)">Central Workshop & Technical Labs (केंद्रीय वर्कशॉप व लैब)</option>
                  </optgroup>

                  <optgroup label="💰 Finance, Accounts & Treasury (लेखा एवं वित्त विभाग)">
                    <option value="Accounts, Audit & Treasury (लेखा एवं वित्त विभाग)">Accounts, Audit & Treasury (लेखा एवं वित्त विभाग)</option>
                  </optgroup>

                  <optgroup label="🏨 Hostel, Mess & Campus Security (छात्रावास, मेस व सुरक्षा)">
                    <option value="Hostel, Mess & Campus Security (छात्रावास, मेस व सुरक्षा)">Hostel, Mess & Campus Security (छात्रावास, मेस व सुरक्षा)</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Monthly Salary in ₹ (मासिक वेतन)</label>
                <input
                  type="number"
                  required
                  value={formData.salary || 78500}
                  onChange={e => setFormData({ ...formData, salary: parseFloat(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Age (आयु)</label>
                <input
                  type="number"
                  value={formData.age || 40}
                  onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date of Birth (DOB)</label>
                <input
                  type="date"
                  value={formData.dob || '1985-05-15'}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Staff Category (स्टाफ प्रकार)</label>
                <select
                  value={formData.staffType || 'Teaching Faculty'}
                  onChange={e => setFormData({ ...formData, staffType: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Teaching Faculty">Teaching Faculty (प्राध्यापक)</option>
                  <option value="Technical Staff">Technical Staff (तकनीकी स्टाफ / लैब)</option>
                  <option value="Administrative Staff">Administrative Staff (प्रशासनिक / लेखा)</option>
                  <option value="Support Staff">Support Staff (पुस्तकालय / अन्य)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Promotion Status (पदोन्नति स्थिति)</label>
                <input
                  type="text"
                  value={formData.promotionStatus || ''}
                  onChange={e => setFormData({ ...formData, promotionStatus: e.target.value })}
                  placeholder="e.g. Promoted to Senior Lecturer Level-11 in Jan 2024"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Qualifications (शैक्षणिक योग्यताएं / Collification)</label>
                <input
                  type="text"
                  value={formData.qualification || ''}
                  onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="e.g. Ph.D, M.Tech, B.Tech"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Work Description (कौन स्टाफ क्या काम करता है)</label>
                <textarea
                  rows={2}
                  value={formData.workDescription || ''}
                  onChange={e => setFormData({ ...formData, workDescription: e.target.value })}
                  placeholder="Describe daily roles, teaching routine, lab supervision, etc."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Residential Address (पता)</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('dossier')}
                className="px-4 py-2 rounded-xl border text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Service Records
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
