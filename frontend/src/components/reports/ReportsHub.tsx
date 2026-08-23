import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Printer,
  Search,
  Filter,
  Users,
  CheckSquare,
  CreditCard,
  Award,
  GraduationCap,
  Calendar,
  Layers
} from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';
import { exportToCSV, formatCurrencyINR, formatDate } from '../../utils/helpers';
import { CollegeLogo } from '../common/CollegeLogo';

type ReportType = 'students' | 'attendance' | 'fees' | 'exams' | 'teachers';

export const ReportsHub: React.FC = () => {
  const { students, teachers, fees, exams, results, settings } = useCollegeData();

  const [selectedReport, setSelectedReport] = useState<ReportType>('students');
  const [branchFilter, setBranchFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const reportTabs = [
    { id: 'students', label: 'Student Enrollment Register', icon: Users },
    { id: 'attendance', label: 'Attendance & Compliance Report', icon: CheckSquare },
    { id: 'fees', label: 'Fees Collection & Dues Report', icon: CreditCard },
    { id: 'exams', label: 'Examination & Marksheet Summary', icon: Award },
    { id: 'teachers', label: 'Faculty & Departmental Directory', icon: GraduationCap }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    switch (selectedReport) {
      case 'students': {
        const data = students.map(s => ({
          'Roll No': s.rollNo,
          'Enrollment No': s.enrollmentNo,
          'Name': s.name,
          'Father Name': s.fatherName,
          'Branch': s.branch,
          'Semester': s.semester,
          'Category': s.category,
          'Mobile': s.mobile,
          'Attendance %': s.attendancePercentage,
          'Fee Status': s.feeStatus
        }));
        exportToCSV('GP_Bansdeeh_Students_Report', data);
        break;
      }
      case 'attendance': {
        const data = students.map(s => ({
          'Roll No': s.rollNo,
          'Name': s.name,
          'Branch': s.branch,
          'Semester': s.semester,
          'Attendance %': s.attendancePercentage,
          'Status': s.attendancePercentage >= 75 ? 'Compliant' : 'Shortage'
        }));
        exportToCSV('GP_Bansdeeh_Attendance_Report', data);
        break;
      }
      case 'fees': {
        const data = fees.map(f => ({
          'Receipt No': f.receiptNo,
          'Roll No': f.rollNo,
          'Student Name': f.studentName,
          'Branch': f.branch,
          'Total Fee': f.totalFee,
          'Paid Amount': f.paidAmount,
          'Pending Amount': f.pendingAmount,
          'Status': f.paymentStatus
        }));
        exportToCSV('GP_Bansdeeh_Fee_Collection_Report', data);
        break;
      }
      case 'exams': {
        const data = results.map(r => ({
          'Roll No': r.rollNo,
          'Student Name': r.studentName,
          'Branch': r.branch,
          'Semester': r.semester,
          'Marks Obtained': `${r.grandTotalObtained}/${r.grandTotalMax}`,
          'Percentage': `${r.percentage}%`,
          'SGPA': r.cgpa,
          'Division': r.division,
          'Status': r.status
        }));
        exportToCSV('GP_Bansdeeh_Exam_Results_Report', data);
        break;
      }
      case 'teachers': {
        const data = teachers.map(t => ({
          'Employee Code': t.empCode,
          'Name': t.name,
          'Department': t.department,
          'Designation': t.designation,
          'Qualification': t.qualification,
          'Email': t.email,
          'Mobile': t.mobile,
          'Subjects': t.subjects.join('; ')
        }));
        exportToCSV('GP_Bansdeeh_Faculty_Report', data);
        break;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-blue-600" />
            Institutional Reports &amp; Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Government Polytechnic • Official PDF Print &amp; CSV Export Hub
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSV File
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 no-print">
        {reportTabs.map(tab => {
          const Icon = tab.icon;
          const isSelected = selectedReport === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setSelectedReport(tab.id as ReportType)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
              <span className="text-xs font-bold leading-snug">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Row */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col sm:flex-row gap-3 no-print">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search report entries..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        <select
          value={branchFilter}
          onChange={e => setBranchFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
        >
          <option value="All">All Engineering Branches</option>
          <option value="Computer">Computer Science &amp; Engg</option>
          <option value="Mechanical">Mechanical Engg</option>
          <option value="Civil">Civil Engg</option>
          <option value="Electrical">Electrical Engg</option>
          <option value="Electronics">Electronics Engg</option>
        </select>
      </div>

      {/* Printable Report Document Container */}
      <div className="printable-area bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card text-slate-800 dark:text-slate-100">
        {/* Official Letterhead */}
        <div className="text-center pb-5 border-b-2 border-polytechnic-900 dark:border-blue-500 mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CollegeLogo size="sm" subtitle={false} />
          </div>
          <h2 className="font-serif text-lg font-black uppercase text-polytechnic-900 dark:text-white">
            {settings.collegeName}
          </h2>
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
            {settings.hindiName} (BTEUP CODE: {settings.bteupCode})
          </p>
          <p className="text-[10px] text-slate-400">
            {settings.address}, {settings.district} (U.P.) • Official Statistical Statement
          </p>
          <div className="mt-2 inline-block px-4 py-1 bg-polytechnic-900 dark:bg-blue-600 text-white text-xs font-black uppercase rounded-md">
            {reportTabs.find(t => t.id === selectedReport)?.label}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Generated on: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          {selectedReport === 'students' && (
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Roll Number</th>
                  <th className="p-2.5">Student Name</th>
                  <th className="p-2.5">Branch</th>
                  <th className="p-2.5 text-center">Semester</th>
                  <th className="p-2.5">Mobile</th>
                  <th className="p-2.5 text-center">Attendance</th>
                  <th className="p-2.5 text-center">Fee Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {students
                  .filter(
                    s =>
                      (branchFilter === 'All' || s.branch.includes(branchFilter)) &&
                      (s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.rollNo.includes(searchTerm))
                  )
                  .map(s => (
                    <tr key={s.id}>
                      <td className="p-2.5 font-mono font-bold">{s.rollNo}</td>
                      <td className="p-2.5 font-semibold">{s.name}</td>
                      <td className="p-2.5">{s.branch}</td>
                      <td className="p-2.5 text-center font-bold">Sem {s.semester}</td>
                      <td className="p-2.5">{s.mobile}</td>
                      <td className="p-2.5 text-center font-bold text-blue-600">{s.attendancePercentage}%</td>
                      <td className="p-2.5 text-center">{s.feeStatus}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'attendance' && (
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Roll Number</th>
                  <th className="p-2.5">Candidate Name</th>
                  <th className="p-2.5">Branch</th>
                  <th className="p-2.5 text-center">Semester</th>
                  <th className="p-2.5 text-center">Current Attendance</th>
                  <th className="p-2.5 text-center">BTEUP Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {students
                  .filter(s => branchFilter === 'All' || s.branch.includes(branchFilter))
                  .map(s => (
                    <tr key={s.id}>
                      <td className="p-2.5 font-mono font-bold">{s.rollNo}</td>
                      <td className="p-2.5 font-semibold">{s.name}</td>
                      <td className="p-2.5">{s.branch}</td>
                      <td className="p-2.5 text-center">Sem {s.semester}</td>
                      <td className="p-2.5 text-center font-black text-blue-600">{s.attendancePercentage}%</td>
                      <td className="p-2.5 text-center font-bold">
                        {s.attendancePercentage >= 75 ? (
                          <span className="text-emerald-600">Eligible (≥75%)</span>
                        ) : (
                          <span className="text-rose-600">Shortage (&lt;75%)</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'fees' && (
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Receipt #</th>
                  <th className="p-2.5">Roll Number</th>
                  <th className="p-2.5">Candidate Name</th>
                  <th className="p-2.5 text-right">Total Fee</th>
                  <th className="p-2.5 text-right">Paid Amount</th>
                  <th className="p-2.5 text-right">Balance Due</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {fees.map(f => (
                  <tr key={f.id}>
                    <td className="p-2.5 font-mono font-bold">{f.receiptNo}</td>
                    <td className="p-2.5 font-mono">{f.rollNo}</td>
                    <td className="p-2.5 font-semibold">{f.studentName}</td>
                    <td className="p-2.5 text-right">{formatCurrencyINR(f.totalFee)}</td>
                    <td className="p-2.5 text-right font-bold text-emerald-600">{formatCurrencyINR(f.paidAmount)}</td>
                    <td className="p-2.5 text-right font-bold text-red-600">
                      {f.pendingAmount === 0 ? '₹0' : formatCurrencyINR(f.pendingAmount)}
                    </td>
                    <td className="p-2.5 text-center font-bold">{f.paymentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'exams' && (
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Roll Number</th>
                  <th className="p-2.5">Candidate Name</th>
                  <th className="p-2.5">Branch</th>
                  <th className="p-2.5 text-center">Total Marks</th>
                  <th className="p-2.5 text-center">Percentage</th>
                  <th className="p-2.5 text-center">SGPA</th>
                  <th className="p-2.5 text-center">Division</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {results.map(r => (
                  <tr key={r.id}>
                    <td className="p-2.5 font-mono font-bold">{r.rollNo}</td>
                    <td className="p-2.5 font-semibold">{r.studentName}</td>
                    <td className="p-2.5">{r.branch}</td>
                    <td className="p-2.5 text-center font-bold">{r.grandTotalObtained} / {r.grandTotalMax}</td>
                    <td className="p-2.5 text-center font-bold">{r.percentage}%</td>
                    <td className="p-2.5 text-center font-black text-blue-600">{r.cgpa}</td>
                    <td className="p-2.5 text-center">{r.division}</td>
                    <td className="p-2.5 text-center font-bold text-emerald-600">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'teachers' && (
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Emp ID</th>
                  <th className="p-2.5">Faculty Name</th>
                  <th className="p-2.5">Department</th>
                  <th className="p-2.5">Designation</th>
                  <th className="p-2.5">Qualifications</th>
                  <th className="p-2.5">Mobile</th>
                  <th className="p-2.5">Subjects</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {teachers.map(t => (
                  <tr key={t.id}>
                    <td className="p-2.5 font-mono font-bold">{t.empCode}</td>
                    <td className="p-2.5 font-semibold">{t.name}</td>
                    <td className="p-2.5">{t.department}</td>
                    <td className="p-2.5">{t.designation}</td>
                    <td className="p-2.5">{t.qualification}</td>
                    <td className="p-2.5">{t.mobile}</td>
                    <td className="p-2.5">{t.subjects.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Verification Signatures in Print */}
        <div className="pt-8 mt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-500 text-[10px]">
            Statistical Records Section • Government Polytechnic Ballia
          </div>
          <div className="text-center">
            <div className="font-serif italic font-bold text-slate-800 dark:text-slate-200 text-sm">
              Principal
            </div>
            <div className="text-[10px] text-slate-400">Government Polytechnic</div>
          </div>
        </div>
      </div>
    </div>
  );
};
