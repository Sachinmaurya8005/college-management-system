import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { Modal } from '../common/Modal';
import { useCollegeData } from '../../context/CollegeDataContext';
import { useAuth } from '../../context/AuthContext';
import { Upload, Lock, ShieldCheck, GraduationCap, CheckCircle2 } from 'lucide-react';

interface AddEditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student | null;
}

export const AddEditStudentModal: React.FC<AddEditStudentModalProps> = ({
  isOpen,
  onClose,
  student
}) => {
  const { addStudent, updateStudent, courses, teachers } = useCollegeData();
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';

  // Find live assigned branch and semester for the logged-in teacher
  const currentTeacherObj = teachers.find(
    t =>
      (user?.email && t.email?.toLowerCase() === user.email.toLowerCase()) ||
      t.id === user?.id ||
      (user?.empCode && t.empCode?.toLowerCase() === user.empCode.toLowerCase()) ||
      (user?.name && t.name?.toLowerCase().includes(user.name.toLowerCase()))
  );

  const teacherAssignedBranch = currentTeacherObj?.assignedBranch || currentTeacherObj?.department || 'Computer Science & Engineering';
  const teacherAssignedSemester = currentTeacherObj?.assignedSemester || 4;

  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    dob: '2004-01-01',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    branch: isTeacher ? teacherAssignedBranch : 'Computer Science & Engineering',
    semester: isTeacher ? teacherAssignedSemester : 1,
    rollNo: '',
    enrollmentNo: '',
    mobile: '',
    email: '',
    address: 'Uttar Pradesh',
    category: 'General' as 'General' | 'OBC' | 'SC' | 'ST' | 'EWS',
    bloodGroup: 'B+',
    admissionYear: 2023,
    status: 'Active' as 'Active' | 'Suspended' | 'Alumni',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces',
    attendancePercentage: 85,
    feeStatus: 'Pending' as 'Paid' | 'Partial' | 'Pending'
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        fatherName: student.fatherName || '',
        motherName: student.motherName || '',
        dob: student.dob || '2004-01-01',
        gender: student.gender || 'Male',
        branch: isTeacher ? teacherAssignedBranch : student.branch,
        semester: isTeacher ? teacherAssignedSemester : student.semester,
        rollNo: student.rollNo,
        enrollmentNo: student.enrollmentNo,
        mobile: student.mobile,
        email: student.email,
        address: student.address,
        category: student.category || 'General',
        bloodGroup: student.bloodGroup || 'B+',
        admissionYear: student.admissionYear || 2023,
        status: student.status,
        photoUrl: student.photoUrl,
        attendancePercentage: student.attendancePercentage,
        feeStatus: student.feeStatus
      });
    } else {
      // Auto-generate realistic Roll No
      const rand = Math.floor(1000 + Math.random() * 9000);
      setFormData({
        name: '',
        fatherName: '',
        motherName: '',
        dob: '2004-06-15',
        gender: 'Male',
        branch: isTeacher ? teacherAssignedBranch : 'Computer Science & Engineering',
        semester: isTeacher ? teacherAssignedSemester : 1,
        rollNo: `E234412355${rand}`,
        enrollmentNo: `E234412${rand}`,
        mobile: '+91 94150 00000',
        email: '',
        address: 'Uttar Pradesh - 277202',
        category: 'OBC',
        bloodGroup: 'B+',
        admissionYear: 2023,
        status: 'Active',
        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces',
        attendancePercentage: 85,
        feeStatus: 'Pending'
      });
    }
  }, [student, isOpen, isTeacher, teacherAssignedBranch, teacherAssignedSemester]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNo) {
      alert('Please fill required fields (Name and Roll Number)');
      return;
    }

    // Strict Enforcement: If user is teacher, always lock branch and semester to their assigned class
    const finalSubmissionData = isTeacher
      ? {
          ...formData,
          branch: teacherAssignedBranch,
          semester: teacherAssignedSemester
        }
      : formData;

    if (student) {
      updateStudent(student.id, finalSubmissionData);
    } else {
      addStudent(finalSubmissionData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        student
          ? (isTeacher ? `Edit Class Student (${teacherAssignedBranch} • Sem ${teacherAssignedSemester})` : 'Edit Student Details')
          : (isTeacher ? `New Student Admission (${teacherAssignedBranch} • Sem ${teacherAssignedSemester})` : 'New Student Admission Entry')
      }
      subtitle={
        isTeacher
          ? `Class Teacher Admission Gate • ${teacherAssignedBranch} (Semester ${teacherAssignedSemester})`
          : 'Government Polytechnic • Master Student Registry (Admin View)'
      }
      maxWidth="4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Class Teacher Policy Notification Banner */}
        {isTeacher && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-transparent border border-blue-200 dark:border-blue-900/70 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>🔒 Class Teacher Admission Authority</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold border border-blue-200">
                    Locked to Your Class
                  </span>
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                  प्रिंसिपल के नियम अनुसार आप केवल अपनी कक्षा <strong>{teacherAssignedBranch} (Semester {teacherAssignedSemester})</strong> में ही नए छात्र को जोड़ सकते हैं।
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" /> Class Verified
            </span>
          </div>
        )}

        {/* Student Photo & Identity Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img
              src={formData.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces'}
              alt="Student Preview"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/40 shadow-md flex-shrink-0"
            />
            <div className="flex-1 w-full space-y-2 text-center sm:text-left">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span>Student Profile Photo (छात्र फ़ोटो लगाएं)</span>
                <span className="text-[10px] text-blue-600 font-normal">PNG, JPG, WebP</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-all shadow-sm flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload from Device / Gallery (गैलरी)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
                <input
                  type="url"
                  placeholder="Or paste direct image URL (https://...)"
                  value={formData.photoUrl}
                  onChange={e => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="flex-1 min-w-[200px] px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Quick Student Avatar Choices */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 block mb-1.5">Quick Student Avatars (तैयार छात्र अवतार):</span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Student Boy 1', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces' },
                { label: 'Student Boy 2', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces' },
                { label: 'Student Girl 1', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces' },
                { label: 'Student Girl 2', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces' },
                { label: 'Scholar', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces' }
              ].map((av, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, photoUrl: av.url }))}
                  className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                    formData.photoUrl === av.url
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                  }`}
                >
                  <img src={av.url} alt={av.label} className="w-4 h-4 rounded-full object-cover" />
                  <span>{av.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Personal Details Section */}
        <div>
          <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
            1. Personal &amp; Identity Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rahul Verma"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Father's Name
              </label>
              <input
                type="text"
                value={formData.fatherName}
                onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                placeholder="e.g. Shri Santosh Verma"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mother's Name
              </label>
              <input
                type="text"
                value={formData.motherName}
                onChange={e => setFormData({ ...formData, motherName: e.target.value })}
                placeholder="e.g. Smt. Sunita Verma"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date of Birth (DOB) *
              </label>
              <input
                type="date"
                required
                value={formData.dob}
                onChange={e => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Blood Group
              </label>
              <input
                type="text"
                value={formData.bloodGroup}
                onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                placeholder="e.g. B+, O+, AB+"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Photo URL
              </label>
              <input
                type="url"
                value={formData.photoUrl}
                onChange={e => setFormData({ ...formData, photoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Academic Details Section */}
        <div>
          <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
            2. Academic &amp; Enrollment Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Diploma Branch */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Diploma Branch *</span>
                {isTeacher && (
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                )}
              </label>
              {isTeacher ? (
                <div className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/60 dark:bg-blue-950/40 text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center justify-between shadow-sm">
                  <span>{teacherAssignedBranch}</span>
                  <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                </div>
              ) : (
                <select
                  value={formData.branch}
                  onChange={e => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
                  <option value="Mechanical Engineering (Production)">Mechanical Engineering (Production)</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Electronics Engineering">Electronics Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                </select>
              )}
            </div>

            {/* Current Semester */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Current Semester (1-6) *</span>
                {isTeacher && (
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Assigned Sem
                  </span>
                )}
              </label>
              {isTeacher ? (
                <div className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center justify-between shadow-sm">
                  <span>Semester {teacherAssignedSemester}</span>
                  <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                </div>
              ) : (
                <select
                  value={formData.semester}
                  onChange={e => setFormData({ ...formData, semester: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  {[1, 2, 3, 4, 5, 6].map(sem => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Roll Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                BTEUP Roll Number *
              </label>
              <input
                type="text"
                required
                value={formData.rollNo}
                onChange={e => setFormData({ ...formData, rollNo: e.target.value })}
                placeholder="e.g. E224412355001"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none font-mono font-bold"
              />
            </div>

            {/* Enrollment Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enrollment Number
              </label>
              <input
                type="text"
                value={formData.enrollmentNo}
                onChange={e => setFormData({ ...formData, enrollmentNo: e.target.value })}
                placeholder="e.g. E224412001"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none font-mono"
              />
            </div>

            {/* Admission Year */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Admission Year
              </label>
              <input
                type="number"
                value={formData.admissionYear}
                onChange={e => setFormData({ ...formData, admissionYear: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            {/* Academic Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Status
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Details Section */}
        <div>
          <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
            3. Contact &amp; Residential Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                value={formData.mobile}
                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="+91 94150 12345"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="student.name@Government Polytechnic.ac.in"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Permanent Address
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                placeholder="Village / Town, Post, District (Uttar Pradesh), State, Pincode"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
          >
            {student ? 'Save Changes' : (isTeacher ? `Enroll to ${teacherAssignedBranch.split(' ')[0]} Sem ${teacherAssignedSemester}` : 'Register Student')}
          </button>
        </div>
      </form>
    </Modal>
  );
};
