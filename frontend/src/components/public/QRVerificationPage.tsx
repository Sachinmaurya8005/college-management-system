import React, { useState } from 'react';
import {
  ShieldCheck,
  QrCode,
  Search,
  CheckCircle2,
  AlertTriangle,
  User,
  GraduationCap,
  Calendar,
  Building,
  FileText,
  Clock,
  Printer
} from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';
import { formatDate } from '../../utils/helpers';
import { PRINCIPAL_DETAILS } from '../../data/mockData';

export const QRVerificationPage: React.FC = () => {
  const { students, teachers, fees, results } = useCollegeData();
  const [query, setQuery] = useState('E224412355001');
  const [docType, setDocType] = useState<'student' | 'teacher' | 'fee' | 'marksheet'>('student');
  const [searched, setSearched] = useState(true);

  // Search logic
  const foundStudent = students.find(
    s => s.enrollmentNo.toLowerCase() === query.toLowerCase() || s.rollNo.toLowerCase() === query.toLowerCase()
  );
  const foundTeacher = teachers.find(
    t => t.empCode.toLowerCase() === query.toLowerCase() || t.name.toLowerCase().includes(query.toLowerCase())
  );
  const foundFee = fees.find(f => f.receiptNo.toLowerCase() === query.toLowerCase() || f.rollNo.toLowerCase() === query.toLowerCase());
  const foundResult = results.find(r => r.rollNo.toLowerCase() === query.toLowerCase() || r.enrollmentNo.toLowerCase() === query.toLowerCase());

  const isVerified = (docType === 'student' && !!foundStudent) ||
                     (docType === 'teacher' && !!foundTeacher) ||
                     (docType === 'fee' && !!foundFee) ||
                     (docType === 'marksheet' && !!foundResult);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-300 dark:border-emerald-800">
          <ShieldCheck className="w-4 h-4" />
          <span>UP BTEUP Official Smart Document Verification Portal</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          डिजिटल दस्तावेज़ एवं QR कोड सत्यापन
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Scan QR code or enter document identifier (Enrollment No, Employee Code, Fee Receipt No) to verify genuine Government Polytechnic records.
        </p>
      </div>

      {/* Verification Search Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
        {/* Document Type Selector */}
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => setDocType('student')}
            className={`px-4 py-2 rounded-xl transition-all ${
              docType === 'student'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            🎓 Student ID &amp; Admit Card
          </button>
          <button
            onClick={() => {
              setDocType('teacher');
              setQuery('FAC-CSE-01');
            }}
            className={`px-4 py-2 rounded-xl transition-all ${
              docType === 'teacher'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            👨‍🏫 Faculty &amp; Staff Credential
          </button>
          <button
            onClick={() => {
              setDocType('fee');
              setQuery('GPB/FEE/2026/00142');
            }}
            className={`px-4 py-2 rounded-xl transition-all ${
              docType === 'fee'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            💰 Official Fee Receipt
          </button>
          <button
            onClick={() => {
              setDocType('marksheet');
              setQuery('E224412355001');
            }}
            className={`px-4 py-2 rounded-xl transition-all ${
              docType === 'marksheet'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            📜 BTEUP Diploma Marksheet
          </button>
        </div>

        {/* Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Enter Enrollment No / Roll No / Employee Code / Receipt No..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none font-mono"
            />
          </div>
          <button
            onClick={() => setSearched(true)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" /> Verify Document
          </button>
        </div>
      </div>

      {/* Verification Result Display */}
      {searched && (
        <div className="space-y-6">
          {isVerified ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500/50 shadow-2xl space-y-6 animate-scale-up">
              {/* Top Verified Seal Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-md flex-shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-black tracking-tight flex items-center gap-2">
                      <span>OFFICIALLY VERIFIED &amp; AUTHENTIC RECORD</span>
                    </h3>
                    <p className="text-xs text-emerald-100">
                      Board of Technical Education, Uttar Pradesh (Inst Code: 4412)
                    </p>
                  </div>
                </div>
                <div className="text-right text-[10px] text-emerald-100 font-mono bg-emerald-800/40 px-3 py-1.5 rounded-xl border border-white/20">
                  <div>Digital Sign: BTEUP-SHA256-OK</div>
                  <div>Timestamp: {new Date().toLocaleString()}</div>
                </div>
              </div>

              {/* Student Verified Record */}
              {docType === 'student' && foundStudent && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  <div className="text-center sm:text-left flex flex-col items-center sm:items-start gap-3">
                    <img
                      src={foundStudent.photoUrl}
                      alt={foundStudent.name}
                      className="w-28 h-28 rounded-2xl object-cover ring-4 ring-emerald-500/30 shadow-md"
                    />
                    <div>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">{foundStudent.name}</h4>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">{foundStudent.branch}</p>
                      <span className="text-slate-400 text-[11px]">Semester {foundStudent.semester}</span>
                    </div>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 divide-y sm:divide-y-0 divide-slate-100 dark:divide-slate-800">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Enrollment Number</span>
                      <p className="font-mono font-bold text-slate-900 dark:text-white">{foundStudent.enrollmentNo}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Roll Number</span>
                      <p className="font-mono font-bold text-slate-900 dark:text-white">{foundStudent.rollNo}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Father's Name</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{foundStudent.fatherName}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Academic Status &amp; Attendance</span>
                      <p className="font-bold text-emerald-600">{foundStudent.status} ({foundStudent.attendancePercentage}% Attendance)</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Date of Birth (DOB)</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{foundStudent.dob}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Institution Name</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Govt. Polytechnic Bansdeeh</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Faculty Verified Record */}
              {docType === 'teacher' && foundTeacher && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  <div className="text-center sm:text-left flex flex-col items-center sm:items-start gap-3">
                    <img
                      src={foundTeacher.photoUrl}
                      alt={foundTeacher.name}
                      className="w-28 h-28 rounded-2xl object-cover ring-4 ring-emerald-500/30 shadow-md"
                    />
                    <div>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">{foundTeacher.name}</h4>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">{foundTeacher.designation}</p>
                      <span className="text-slate-400 text-[11px]">{foundTeacher.department}</span>
                    </div>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Employee Code</span>
                      <p className="font-mono font-bold text-slate-900 dark:text-white">{foundTeacher.empCode}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Qualifications</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{foundTeacher.qualification}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Service Status</span>
                      <p className="font-bold text-emerald-600">{foundTeacher.status} ({foundTeacher.experienceYears}+ Yrs)</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Promotion Status</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{foundTeacher.promotionStatus || 'Regular Confirmed'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Fee Receipt Verified Record */}
              {docType === 'fee' && foundFee && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Receipt Number</span>
                      <p className="font-mono font-bold text-emerald-600">{foundFee.receiptNo}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Student Name &amp; Roll</span>
                      <p className="font-bold text-slate-900 dark:text-white">{foundFee.studentName} ({foundFee.rollNo})</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Fee Amount Paid</span>
                      <p className="font-mono font-black text-emerald-600 text-sm">₹{foundFee.paidAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto" />
              <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200">
                दस्तावेज़ रिकॉर्ड नहीं मिला (Record Not Found)
              </h3>
              <p className="text-xs text-rose-700 dark:text-rose-300 max-w-md mx-auto">
                No verified record matches "{query}". Please check your Enrollment Number or Receipt ID carefully and try again.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
