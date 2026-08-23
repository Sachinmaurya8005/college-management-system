import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { Modal } from '../common/Modal';
import {
  User,
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Award,
  CreditCard,
  CheckCircle2,
  Printer,
  ShieldCheck,
  QrCode,
  Edit2,
  Save,
  CheckSquare,
  Sparkles,
  AlertCircle,
  FileText
} from 'lucide-react';
import { formatCurrencyINR, formatDate } from '../../utils/helpers';
import { useCollegeData } from '../../context/CollegeDataContext';
import { useAuth } from '../../context/AuthContext';
import { approvalService } from '../../services/approvalService';
import { CollegeLogo } from '../common/CollegeLogo';
import confetti from 'canvas-confetti';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onOpenReceipt?: (feeId: string) => void;
  onOpenMarksheet?: (resId: string) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  onOpenReceipt,
  onOpenMarksheet
}) => {
  const { user } = useAuth();
  const { fees, results, settings, updateStudent, addNotification, students } = useCollegeData();
  const [activeTab, setActiveTab] = useState<'profile' | 'attendance' | 'idcard' | 'fees' | 'results'>('profile');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Edit Form State
  const [formData, setFormData] = useState<Partial<Student>>({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        fatherName: student.fatherName || '',
        motherName: student.motherName || '',
        dob: student.dob || '2004-05-14',
        gender: student.gender || 'Male',
        mobile: student.mobile || '',
        email: student.email || '',
        address: student.address || '',
        category: student.category || 'General',
        bloodGroup: student.bloodGroup || 'B+',
        status: student.status || 'Active',
        attendancePercentage: student.attendancePercentage || 85.0,
        feeStatus: student.feeStatus || 'Paid'
      });
      setIsEditing(false);
      setSavedSuccess(false);
    }
  }, [student, isOpen]);

  if (!student) return null;

  const studentFee = fees.find(f => f.studentId === student.id || f.rollNo === student.rollNo);
  const studentResults = results.filter(r => r.studentId === student.id || r.rollNo === student.rollNo);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const original = students.find(s => s.id === student.id) || student;
      const changes: string[] = [];

      if (formData.name && formData.name !== original.name) {
        changes.push(`• Name: "${original.name}" ➔ "${formData.name}"`);
      }
      if (formData.dob && formData.dob !== original.dob) {
        changes.push(`• DOB: "${original.dob || 'N/A'}" ➔ "${formData.dob}"`);
      }
      if (formData.fatherName !== undefined && formData.fatherName !== original.fatherName) {
        changes.push(`• Father's Name: "${original.fatherName || '-'}" ➔ "${formData.fatherName}"`);
      }
      if (formData.motherName !== undefined && formData.motherName !== original.motherName) {
        changes.push(`• Mother's Name: "${original.motherName || '-'}" ➔ "${formData.motherName}"`);
      }
      if (formData.mobile && formData.mobile !== original.mobile) {
        changes.push(`• Mobile: "${original.mobile || '-'}" ➔ "${formData.mobile}"`);
      }
      if (formData.email && formData.email !== original.email) {
        changes.push(`• Email: "${original.email || '-'}" ➔ "${formData.email}"`);
      }
      if (formData.category && formData.category !== original.category) {
        changes.push(`• Category: "${original.category}" ➔ "${formData.category}"`);
      }
      if (formData.bloodGroup && formData.bloodGroup !== original.bloodGroup) {
        changes.push(`• Blood Group: "${original.bloodGroup}" ➔ "${formData.bloodGroup}"`);
      }
      if (formData.attendancePercentage !== undefined && formData.attendancePercentage !== original.attendancePercentage) {
        changes.push(`• Attendance: ${original.attendancePercentage}% ➔ ${formData.attendancePercentage}%`);
      }
      if (formData.feeStatus && formData.feeStatus !== original.feeStatus) {
        changes.push(`• Fee Status: "${original.feeStatus}" ➔ "${formData.feeStatus}"`);
      }
      if (formData.address && formData.address !== original.address) {
        changes.push(`• Address: "${original.address || '-'}" ➔ "${formData.address}"`);
      }

      await updateStudent(student.id, formData);

      // If changes were made, send a detailed notification to Principal with exact before vs after values!
      if (changes.length > 0) {
        const changeSummary = changes.join('\n');
        addNotification({
          title: `📝 Profile Update: ${original.name} (${original.rollNo})`,
          message: `Updated By: ${user?.name || 'Faculty Member'} (${user?.role === 'admin' ? 'Principal' : 'Teacher'})\n\nChanges Summary (पहले क्या था ➔ अब क्या बदला):\n${changeSummary}`,
          type: 'warning',
          linkView: 'students'
        });

        // Audit Trail Entry via backend approval / log service
        try {
          await approvalService.createRequest({
            request_type: 'STUDENT_UPDATE',
            student: student.id as any,
            student_name: original.name,
            roll_number: original.rollNo,
            branch: original.branch,
            semester: original.semester,
            submitted_by_name: `${user?.name || 'Faculty'} (${user?.role === 'admin' ? 'Principal' : 'Teacher'})`,
            submitted_by_email: user?.email || 'teacher@polytechnic.edu',
            payload: {
              diffs: changes,
              old_values: {
                name: original.name,
                dob: original.dob,
                fatherName: original.fatherName,
                motherName: original.motherName,
                attendance: original.attendancePercentage,
                feeStatus: original.feeStatus
              },
              new_values: formData,
              timestamp: new Date().toISOString()
            },
            description: `Student profile modified by ${user?.name || 'Faculty Member'}:\n${changeSummary}`
          });
        } catch (auditErr) {
          console.warn('Audit record logged locally:', auditErr);
        }
      }

      setSavedSuccess(true);
      setIsEditing(false);
      confetti({ particleCount: 50, spread: 60 });
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      alert('Error updating student information.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Student 360° Dossier: {formData.name || student.name}</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
            {student.rollNo}
          </span>
        </div>
      }
      subtitle="Government Polytechnic Bansdeeh, Ballia (Affiliated to BTEUP Lucknow)"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Navigation Tabs & Edit Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 no-print">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => { setActiveTab('profile'); setIsEditing(false); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Full Profile
            </button>

            <button
              onClick={() => { setActiveTab('attendance'); setIsEditing(false); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'attendance'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" /> Lecture Attendance
            </button>

            <button
              onClick={() => { setActiveTab('fees'); setIsEditing(false); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'fees'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" /> Fees &amp; Ledger
            </button>

            <button
              onClick={() => { setActiveTab('results'); setIsEditing(false); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'results'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" /> BTEUP Marksheets
            </button>

            <button
              onClick={() => { setActiveTab('idcard'); setIsEditing(false); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'idcard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Digital ID Card
            </button>
          </div>

          {activeTab === 'profile' && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Details (सुधारें)'}</span>
            </button>
          )}
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold border border-emerald-200 flex items-center gap-2 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Student information updated successfully in database!</span>
          </div>
        )}

        {/* Tab 1: Profile & Edit Form */}
        {activeTab === 'profile' && (
          <div>
            {isEditing ? (
              /* Quick-Edit Mode for Principal / Teachers */
              <form onSubmit={handleSaveEdit} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Edit2 className="w-4 h-4 text-blue-600" />
                    <span>In-Place Student Record Modification (Principal / Teacher Access)</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Roll: {student.rollNo}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Student Full Name (छात्र का पूरा नाम)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Date of Birth (DOB) (जन्मतिथि)
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dob || ''}
                      onChange={e => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-600 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Father's Name (पिता का नाम)
                    </label>
                    <input
                      type="text"
                      value={formData.fatherName || ''}
                      onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Mother's Name (माता का नाम)
                    </label>
                    <input
                      type="text"
                      value={formData.motherName || ''}
                      onChange={e => setFormData({ ...formData, motherName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Number (मोबाइल नंबर)
                    </label>
                    <input
                      type="tel"
                      value={formData.mobile || ''}
                      onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address (ईमेल)
                    </label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Category (जाति श्रेणी)
                    </label>
                    <select
                      value={formData.category || 'General'}
                      onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                    >
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="EWS">EWS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Blood Group (रक्त समूह)
                    </label>
                    <select
                      value={formData.bloodGroup || 'B+'}
                      onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Attendance Percentage (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.attendancePercentage || 85}
                      onChange={e => setFormData({ ...formData, attendancePercentage: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Fee Status (फीस स्थिति)
                    </label>
                    <select
                      value={formData.feeStatus || 'Paid'}
                      onChange={e => setFormData({ ...formData, feeStatus: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                    >
                      <option value="Paid">Paid (पूर्ण जमा)</option>
                      <option value="Partial">Partial (आंशिक जमा)</option>
                      <option value="Pending">Pending (बकाया)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Permanent Address (स्थायी पता)
                    </label>
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl border text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Changes in Database
                  </button>
                </div>
              </form>
            ) : (
              /* View Mode */
              <div className="space-y-6">
                {/* Header Hero Banner */}
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-6">
                  <img
                    src={student.photoUrl}
                    alt={student.name}
                    className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-700 shadow-md flex-shrink-0"
                  />
                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {student.name}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                        {student.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {student.branch} • Semester {student.semester}
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <span>
                        Roll: <strong className="text-slate-700 dark:text-slate-300 font-mono">{student.rollNo}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Enrollment: <strong className="text-slate-700 dark:text-slate-300 font-mono">{student.enrollmentNo}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        DOB: <strong className="text-amber-600 font-mono">{student.dob || '2004-05-14'}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grid of info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Personal Details Card */}
                  <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Personal Information
                    </h4>
                    <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Father's Name</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{student.fatherName || 'Shri Ramakant Verma'}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Mother's Name</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{student.motherName || 'Smt. Shanti Devi'}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Date of Birth (DOB)</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{formatDate(student.dob || '2004-05-14')}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Gender</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{student.gender}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Category &amp; Blood Group</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{student.category} • {student.bloodGroup}</span>
                      </div>
                    </div>
                  </div>

                  {/* Academic & Contact Details */}
                  <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Contact &amp; Admission
                    </h4>
                    <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Mobile Number</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{student.mobile}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Email Address</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{student.email}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Admission Year</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{student.admissionYear}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Attendance Percentage</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{student.attendancePercentage}%</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Permanent Address</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-right max-w-[220px]">{student.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Lecture Attendance & Clearance */}
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Lecture Attendance &amp; Board Clearance
                  </h4>
                  <p className="text-xs text-slate-500">Semester {student.semester} • {student.branch}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  (student.attendancePercentage || 85) >= 75
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {(student.attendancePercentage || 85) >= 75 ? 'Eligible for Board Exam' : 'Attendance Shortage'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                <div>
                  <span className="text-slate-400">Total Lectures Conducted</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white">120 Lectures</p>
                </div>
                <div>
                  <span className="text-slate-400">Lectures Attended</span>
                  <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {Math.round(120 * ((student.attendancePercentage || 85) / 100))} Lectures
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Current Attendance Rate</span>
                  <p className="text-base font-black text-blue-600 dark:text-blue-400">
                    {student.attendancePercentage || 85}%
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Subject-Wise Breakdown:
                </h5>
                <div className="space-y-1.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex justify-between items-center">
                    <span>Data Structures &amp; Algorithms (CS-401)</span>
                    <strong className="text-emerald-600">89.2% (28/31)</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex justify-between items-center">
                    <span>Database Management Systems (CS-402)</span>
                    <strong className="text-emerald-600">87.5% (28/32)</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex justify-between items-center">
                    <span>Operating Systems &amp; Linux (CS-403)</span>
                    <strong className="text-emerald-600">90.0% (27/30)</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex justify-between items-center">
                    <span>Computer Communication Networks (CS-404)</span>
                    <strong className="text-amber-600">82.1% (23/28)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Fees */}
        {activeTab === 'fees' && (
          <div className="space-y-4">
            {studentFee ? (
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Fee Record: {studentFee.academicYear}
                    </h4>
                    <p className="text-xs text-slate-500">Receipt No: {studentFee.receiptNo}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    studentFee.paymentStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {studentFee.paymentStatus}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                  <div>
                    <span className="text-slate-400">Total Fee</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrencyINR(studentFee.totalFee)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Paid Amount</span>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrencyINR(studentFee.paidAmount)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Balance Due</span>
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">{formatCurrencyINR(studentFee.pendingAmount)}</p>
                  </div>
                </div>

                {onOpenReceipt && (
                  <button
                    onClick={() => onOpenReceipt(studentFee.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" /> View Official Printable Fee Receipt
                  </button>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">No fee record registered yet.</div>
            )}
          </div>
        )}

        {/* Tab 4: Results */}
        {activeTab === 'results' && (
          <div className="space-y-4">
            {studentResults.length > 0 ? (
              <div className="space-y-3">
                {studentResults.map((res, rIdx) => (
                  <div
                    key={res.id || rIdx}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          Semester {res.semester} Examination Marksheet
                        </h4>
                        <p className="text-xs text-slate-500">
                          Session: {res.examSession} • SGPA: <strong className="text-blue-600">{res.cgpa}</strong> • Percentage: <strong className="text-emerald-600">{res.percentage}%</strong>
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {res.status} ({res.division})
                      </span>
                    </div>

                    {onOpenMarksheet && (
                      <button
                        onClick={() => onOpenMarksheet(res.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm"
                      >
                        <Award className="w-3.5 h-3.5" /> View &amp; Print Semester {res.semester} Marksheet
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">No examination results published yet.</div>
            )}
          </div>
        )}

        {/* Tab 5: Digital ID Card */}
        {activeTab === 'idcard' && (
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Printable ID Card Container */}
            <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-polytechnic-900 via-polytechnic-950 to-slate-950 text-white p-5 border-2 border-amber-400 shadow-2xl relative overflow-hidden">
              {/* College Header */}
              <div className="text-center pb-3 border-b border-white/20">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CollegeLogo size="xs" textColor="light" subtitle={false} />
                </div>
                <h4 className="text-xs font-serif font-black tracking-wider text-amber-300">
                  GOVERNMENT POLYTECHNIC BANSDEEH, BALLIA
                </h4>
                <p className="text-[9px] text-slate-300">
                  AFFILIATED TO BTEUP LUCKNOW (CODE: {settings.bteupCode})
                </p>
                <div className="mt-1 inline-block px-3 py-0.5 bg-blue-600 text-white font-extrabold text-[10px] uppercase rounded-full">
                  STUDENT IDENTITY CARD
                </div>
              </div>

              {/* Photo & Core Information */}
              <div className="py-4 flex items-center gap-4">
                <img
                  src={student.photoUrl}
                  alt={student.name}
                  className="w-20 h-24 rounded-xl object-cover border-2 border-white shadow-md flex-shrink-0"
                />
                <div className="space-y-1 text-xs">
                  <div className="text-sm font-extrabold text-white">{student.name}</div>
                  <div className="text-[11px] text-amber-300 font-semibold">{student.branch}</div>
                  <div className="text-[10px] text-slate-300">
                    Roll No: <span className="font-mono font-bold text-white">{student.rollNo}</span>
                  </div>
                  <div className="text-[10px] text-slate-300">
                    Sem: <span className="font-bold text-white">{student.semester}</span> | Blood: <span className="font-bold text-white">{student.bloodGroup}</span>
                  </div>
                  <div className="text-[10px] text-slate-300">
                    DOB: <span className="font-mono text-amber-300">{student.dob || '2004-05-14'}</span>
                  </div>
                  <div className="text-[10px] text-slate-300">
                    Ph: <span className="text-white">{student.mobile}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Footer with Barcode / QR Simulation */}
              <div className="pt-3 border-t border-white/20 flex items-center justify-between text-[9px] text-slate-400">
                <div>
                  <div>Valid Till: June {student.admissionYear + 3}</div>
                  <div className="font-mono text-[8px] text-slate-400">{student.enrollmentNo}</div>
                </div>
                <div className="text-center">
                  <div className="font-serif italic font-bold text-white text-[10px]">R. C. Srivastava</div>
                  <div className="text-[8px] text-amber-400 font-semibold">Principal Sign</div>
                </div>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 no-print"
            >
              <Printer className="w-4 h-4" /> Print Student ID Card
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
