import React, { useState } from 'react';
import {
  IndianRupee,
  CheckCircle2,
  Calendar,
  CreditCard,
  Printer,
  Download,
  Building,
  ShieldCheck,
  Landmark,
  Clock,
  Sparkles,
  Eye,
  X,
  QrCode,
  FileSpreadsheet,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCollegeData } from '../../context/CollegeDataContext';
import { formatCurrencyINR, formatDate } from '../../utils/helpers';
import { SalaryDisbursementRecord } from '../../types';

export const TeacherMySalaryView: React.FC = () => {
  const { user } = useAuth();
  const { teachers, salaryDisbursements, calculateTeacherMonthlySalary } = useCollegeData();

  const currentTeacher = teachers.find(t => t.email === user?.email) || teachers[0];
  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const [viewingSlip, setViewingSlip] = useState<SalaryDisbursementRecord | null>(null);

  const currentMonthSummary = calculateTeacherMonthlySalary(currentTeacher?.id || 'fac-01', selectedMonth);

  // Filter ONLY this teacher's disbursed slips
  const myDisbursedSlips = salaryDisbursements.filter(
    r => r.teacherId === currentTeacher?.id
  );

  const teacherBank = currentTeacher?.bankAccount || {
    bankName: 'State Bank of India',
    accountNumber: '30481920491',
    ifscCode: 'SBIN0004412',
    accountHolderName: currentTeacher?.name || 'Staff Member',
    branchName: 'Bansdeeh Main Branch'
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-polytechnic-900 text-white shadow-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Confidential Faculty Payroll Hub (गोपनीय वेतन पोर्टल)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Salary &amp; Payslips (मेरी सैलरी एवं वेतन पर्ची)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {currentTeacher?.name} ({currentTeacher?.empCode}) • {currentTeacher?.designation} • {currentTeacher?.department}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="px-3.5 py-2 rounded-2xl bg-white/10 text-white border border-white/20 text-xs font-bold outline-none"
          >
            <option value="2026-08" className="text-slate-900">August 2026 (Current)</option>
            <option value="2026-07" className="text-slate-900">July 2026</option>
            <option value="2026-06" className="text-slate-900">June 2026</option>
            <option value="2026-05" className="text-slate-900">May 2026</option>
          </select>
        </div>
      </div>

      {/* 4 Core Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Base Salary</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
            {formatCurrencyINR(currentMonthSummary.monthlyBaseSalary)}
          </div>
          <span className="text-[11px] text-slate-500 block">7th CPC Level Pay Band</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Month Attendance Status</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {currentMonthSummary.presentDays} <span className="text-xs font-semibold text-slate-400">/ {currentMonthSummary.totalDaysInMonth} Days Present</span>
          </div>
          <span className="text-[11px] text-slate-500 block">
            {currentMonthSummary.leaveDays} Leaves • {currentMonthSummary.absentDays} Absents • {currentMonthSummary.holidays} Holidays
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 shadow-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">
            Earned to Date ({selectedMonth})
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {formatCurrencyINR(currentMonthSummary.earnedSalaryToDate)}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">
            Daily Rate: {formatCurrencyINR(currentMonthSummary.dailyRate)}/day
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Credited Bank Account</span>
          <div className="text-sm font-black text-slate-900 dark:text-white truncate">
            {teacherBank.bankName}
          </div>
          <div className="text-xs font-mono font-bold text-blue-600">
            A/C: {teacherBank.accountNumber.slice(-4).padStart(teacherBank.accountNumber.length, '•')}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">IFSC: {teacherBank.ifscCode}</span>
        </div>
      </div>

      {/* Linked Bank Account Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Institutional Direct Salary Credit Account</span>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              {teacherBank.bankName} ({teacherBank.branchName || 'Ballia Main Branch'})
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Account Holder: <strong>{teacherBank.accountHolderName}</strong> • IFSC: <strong>{teacherBank.ifscCode}</strong> • PAN: <strong>{teacherBank.panNumber || 'ABCPR1234F'}</strong>
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-black text-xs border border-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Verified for Treasury Disbursal</span>
        </div>
      </div>

      {/* Disbursed Salary Slips Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span>Official Disbursed Salary History &amp; Monthly Payslips (वेतन पर्ची विवरण)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Complete record of all salaries approved and directly transferred to your bank account by Principal.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-[11px] border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 px-4 font-bold">Month</th>
                <th className="py-3 px-4 font-bold">Payslip Number</th>
                <th className="py-3 px-4 font-bold text-center">Days Present</th>
                <th className="py-3 px-4 font-bold">Gross Base</th>
                <th className="py-3 px-4 font-bold">Deductions</th>
                <th className="py-3 px-4 font-bold text-emerald-600">Net Credited (₹)</th>
                <th className="py-3 px-4 font-bold">Credit Date &amp; Bank Ref</th>
                <th className="py-3 px-4 font-bold text-center">Status</th>
                <th className="py-3 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {myDisbursedSlips.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No disbursed payslips found for previous months.
                  </td>
                </tr>
              ) : (
                myDisbursedSlips.map(slip => (
                  <tr key={slip.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold font-mono text-slate-900 dark:text-white">
                      {slip.month}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {slip.payslipNumber}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600">
                      {slip.presentDays} Days
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {formatCurrencyINR(slip.baseSalary)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-rose-600">
                      {formatCurrencyINR(slip.deductions)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {formatCurrencyINR(slip.disbursedAmount)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      <div>{slip.disbursementDate}</div>
                      <div className="text-[10px] text-blue-600 font-bold">{slip.transactionRef}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3" /> Credited to Bank
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setViewingSlip(slip)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-600/30 flex items-center gap-1.5 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Payslip</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* OFFICIAL SALARY SLIP MODAL */}
      {viewingSlip && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-3xl p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-xs animate-scale-up max-h-[95vh] overflow-y-auto print:p-0 print:border-none print:shadow-none">
            {/* Modal Actions Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 no-print">
              <span className="font-bold text-slate-500 uppercase text-[11px]">Official Payslip Dossier</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintSlip}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black flex items-center gap-1.5 shadow-md"
                >
                  <Printer className="w-4 h-4" /> Print / Save PDF
                </button>
                <button
                  onClick={() => setViewingSlip(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PRINTABLE OFFICIAL PAYSLIP SHEET */}
            <div className="p-6 sm:p-8 border-2 border-slate-800 dark:border-slate-200 rounded-2xl bg-white text-slate-900 space-y-6">
              {/* Header */}
              <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-600">
                  Government of Uttar Pradesh • Department of Technical Education
                </div>
                <h2 className="text-lg sm:text-xl font-black uppercase text-slate-950">
                  राजकीय पॉलिटेक्निक (उ० प्र०)
                </h2>
                <h3 className="text-sm font-extrabold uppercase text-slate-800">
                  GOVERNMENT POLYTECHNIC - 277202
                </h3>
                <p className="text-[11px] text-slate-600 font-semibold">
                  (AICTE Approved &amp; Affiliated to Board of Technical Education, UP • Institute Code: 4412)
                </p>
                <div className="inline-block px-4 py-1 mt-2 bg-slate-900 text-white font-black rounded-md text-xs tracking-wider uppercase">
                  Monthly Salary Slip (वेतन पर्ची) - {viewingSlip.month}
                </div>
              </div>

              {/* Payslip & Employee Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-300 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Payslip Number</span>
                  <strong className="font-mono">{viewingSlip.payslipNumber}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Disbursement Date</span>
                  <strong className="font-mono">{viewingSlip.disbursementDate}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Transaction Ref</span>
                  <strong className="font-mono text-blue-700">{viewingSlip.transactionRef}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Employee Code</span>
                  <strong className="font-mono">{viewingSlip.empCode}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Employee Name</span>
                  <strong>{viewingSlip.teacherName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Designation</span>
                  <strong>{viewingSlip.designation}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Department</span>
                  <strong>{viewingSlip.department}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Credited Bank</span>
                  <strong>{viewingSlip.teacherAccountCredited.bankName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Bank Account No.</span>
                  <strong className="font-mono">{viewingSlip.teacherAccountCredited.accountNumber}</strong>
                </div>
              </div>

              {/* Attendance Breakdown Bar */}
              <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-xl bg-slate-100 border border-slate-300 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Present Days</span>
                  <strong className="text-emerald-700 text-sm font-black">{viewingSlip.presentDays}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Leave Days</span>
                  <strong className="text-amber-700 text-sm font-black">{viewingSlip.leaveDays}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Absent Days</span>
                  <strong className="text-rose-700 text-sm font-black">{viewingSlip.absentDays}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Holidays</span>
                  <strong className="text-blue-700 text-sm font-black">{viewingSlip.holidays}</strong>
                </div>
              </div>

              {/* Earnings & Deductions Double Column Table */}
              <div className="grid grid-cols-2 gap-4 border border-slate-800 rounded-xl overflow-hidden text-xs">
                {/* Earnings */}
                <div className="border-r border-slate-800">
                  <div className="p-2 bg-slate-800 text-white font-black text-center uppercase tracking-wider">
                    Gross Earnings (आय)
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between">
                      <span>Basic Pay (मूल वेतन):</span>
                      <strong className="font-mono">{formatCurrencyINR(Math.round(viewingSlip.baseSalary * 0.6))}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Dearness Allowance (DA 50%):</span>
                      <strong className="font-mono">{formatCurrencyINR(Math.round(viewingSlip.baseSalary * 0.3))}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>House Rent Allowance (HRA):</span>
                      <strong className="font-mono">{formatCurrencyINR(Math.round(viewingSlip.baseSalary * 0.07))}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Transport / Medical Allowance:</span>
                      <strong className="font-mono">{formatCurrencyINR(Math.round(viewingSlip.baseSalary * 0.03))}</strong>
                    </div>
                    <div className="flex justify-between border-t border-slate-300 pt-2 font-black">
                      <span>Total Gross Earnings:</span>
                      <span className="font-mono text-emerald-700">{formatCurrencyINR(viewingSlip.baseSalary)}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <div className="p-2 bg-slate-800 text-white font-black text-center uppercase tracking-wider">
                    Deductions (कटौतियां)
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between">
                      <span>NPS / Govt CPF:</span>
                      <strong className="font-mono">{formatCurrencyINR(0)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Professional Tax (UP Govt):</span>
                      <strong className="font-mono">{formatCurrencyINR(0)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>GIS / Insurance:</span>
                      <strong className="font-mono">{formatCurrencyINR(0)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Absenteeism Deduction:</span>
                      <strong className="font-mono text-rose-700">{formatCurrencyINR(viewingSlip.deductions)}</strong>
                    </div>
                    <div className="flex justify-between border-t border-slate-300 pt-2 font-black">
                      <span>Total Deductions:</span>
                      <span className="font-mono text-rose-700">{formatCurrencyINR(viewingSlip.deductions)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Disbursed Highlight Banner */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                    Net Transferred to Bank Account (शुद्ध देय वेतन)
                  </span>
                  <span className="text-xs text-slate-300">Directly Credited via Institutional Treasury Gateway</span>
                </div>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {formatCurrencyINR(viewingSlip.disbursedAmount)}
                </div>
              </div>

              {/* Official Seal & Signature Section */}
              <div className="flex items-end justify-between pt-6 border-t-2 border-slate-800 text-center">
                <div className="space-y-1">
                  <QrCode className="w-14 h-14 mx-auto text-slate-800" />
                  <span className="text-[9px] text-slate-500 font-mono block">Digitally Verified Document</span>
                </div>

                <div className="space-y-1 text-right">
                  <div className="font-serif italic font-bold text-slate-800 text-sm">
                    R. C. Srivastava
                  </div>
                  <div className="font-black text-xs uppercase text-slate-900">
                    Er. Ramesh Chandra Srivastava
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">
                    Principal, Government Polytechnic
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
