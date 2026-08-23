import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Download,
  Filter,
  PlusCircle,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer
} from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';
import { FeeRecord, Student } from '../../types';
import { formatCurrencyINR, formatDate, exportToCSV } from '../../utils/helpers';
import { CollectFeeModal } from './CollectFeeModal';
import { FeeReceiptModal } from './FeeReceiptModal';
import { StudentProfileModal } from '../students/StudentProfileModal';

export const FeesManagement: React.FC = () => {
  const { fees, students } = useCollegeData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');

  const [activeFeeForPayment, setActiveFeeForPayment] = useState<FeeRecord | null>(null);
  const [activeFeeForReceipt, setActiveFeeForReceipt] = useState<FeeRecord | null>(null);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);

  // Financial aggregates
  const totalReceivable = fees.reduce((sum, f) => sum + f.totalFee, 0);
  const totalCollected = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalPending = fees.reduce((sum, f) => sum + f.pendingAmount, 0);

  const filteredFees = fees.filter(fee => {
    const matchesSearch =
      fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.branch.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || fee.paymentStatus === statusFilter;
    const matchesSemester = semesterFilter === 'All' || fee.semester.toString() === semesterFilter;

    return matchesSearch && matchesStatus && matchesSemester;
  });

  const handleExportCSV = () => {
    const data = filteredFees.map(f => ({
      'Receipt No': f.receiptNo,
      'Roll Number': f.rollNo,
      'Student Name': f.studentName,
      'Branch': f.branch,
      'Semester': f.semester,
      'Academic Year': f.academicYear,
      'Total Fee (INR)': f.totalFee,
      'Paid Amount (INR)': f.paidAmount,
      'Pending Amount (INR)': f.pendingAmount,
      'Due Date': f.dueDate,
      'Status': f.paymentStatus
    }));
    exportToCSV('GP_Bansdeeh_Fee_Ledger', data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-600" />
            Fees &amp; Revenue Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Government Polytechnic • Academic Session 2025–26 Accounts
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all shadow-sm self-start sm:self-center"
        >
          <Download className="w-4 h-4 text-slate-500" /> Export Fee Ledger (CSV)
        </button>
      </div>

      {/* Financial Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Expected Revenue</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {formatCurrencyINR(totalReceivable)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Annual Academic &amp; Exam Dues</p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 shadow-card">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Total Collected (Received)
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">
            {formatCurrencyINR(totalCollected)}
          </div>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1">Settled into College Account</p>
        </div>

        <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 shadow-card">
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            Outstanding Balances
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 dark:text-rose-300 mt-1">
            {formatCurrencyINR(totalPending)}
          </div>
          <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-1">Pending Semester Installments</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search fee records by candidate name, roll no, receipt no..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
        >
          <option value="All">All Payment Statuses</option>
          <option value="Paid">Fully Paid</option>
          <option value="Partial">Partial Payment</option>
          <option value="Pending">Pending / Unpaid</option>
        </select>

        <select
          value={semesterFilter}
          onChange={e => setSemesterFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
        >
          <option value="All">All Semesters</option>
          <option value="1">1st Semester</option>
          <option value="2">2nd Semester</option>
          <option value="3">3rd Semester</option>
          <option value="4">4th Semester</option>
          <option value="5">5th Semester</option>
          <option value="6">6th Semester</option>
        </select>
      </div>

      {/* Fee Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Receipt #</th>
                <th className="px-4 py-3.5">Student Details</th>
                <th className="px-4 py-3.5">Branch &amp; Sem</th>
                <th className="px-4 py-3.5 text-right">Total Fee</th>
                <th className="px-4 py-3.5 text-right">Paid (₹)</th>
                <th className="px-4 py-3.5 text-right">Balance Due</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No fee records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredFees.map(fee => {
                  const statusClass =
                    fee.paymentStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : fee.paymentStatus === 'Partial'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';

                  return (
                    <tr
                      key={fee.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {fee.receiptNo}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => {
                            const matchedStudent = students.find(s => s.id === fee.studentId || s.rollNo === fee.rollNo);
                            if (matchedStudent) {
                              setSelectedStudentForModal(matchedStudent);
                            }
                          }}
                          className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline underline-offset-2 text-left group"
                          title="Click to view 360° dossier & edit student details"
                        >
                          <span>{fee.studentName}</span>
                          <span className="text-[10px] text-blue-500 font-normal opacity-0 group-hover:opacity-100 transition-opacity ml-1">↗</span>
                        </button>
                        <div className="text-[10px] text-slate-400 font-mono">{fee.rollNo}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-800 dark:text-slate-200">{fee.branch}</div>
                        <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                          Semester {fee.semester}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-800 dark:text-slate-200">
                        {formatCurrencyINR(fee.totalFee)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrencyINR(fee.paidAmount)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-red-600 dark:text-red-400">
                        {fee.pendingAmount === 0 ? '₹0' : formatCurrencyINR(fee.pendingAmount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${statusClass}`}>
                          {fee.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {fee.pendingAmount > 0 && (
                            <button
                              onClick={() => setActiveFeeForPayment(fee)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors shadow-sm"
                            >
                              Collect Fee
                            </button>
                          )}
                          <button
                            onClick={() => setActiveFeeForReceipt(fee)}
                            title="Generate Official Printable Receipt"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Fee Modal */}
      <CollectFeeModal
        isOpen={!!activeFeeForPayment}
        onClose={() => setActiveFeeForPayment(null)}
        feeRecord={activeFeeForPayment}
        onPaymentSuccess={receiptNo => {
          // Open receipt directly
          const updated = fees.find(f => f.id === activeFeeForPayment?.id);
          if (updated) setActiveFeeForReceipt(updated);
        }}
      />

      {/* Fee Receipt Modal */}
      <FeeReceiptModal
        isOpen={!!activeFeeForReceipt}
        onClose={() => setActiveFeeForReceipt(null)}
        feeRecord={activeFeeForReceipt}
      />

      {/* Student 360 Dossier & Quick Edit Modal */}
      <StudentProfileModal
        isOpen={!!selectedStudentForModal}
        onClose={() => setSelectedStudentForModal(null)}
        student={selectedStudentForModal}
      />
    </div>
  );
};
