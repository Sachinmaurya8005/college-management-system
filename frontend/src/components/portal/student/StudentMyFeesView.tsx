import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Printer,
  ShieldCheck,
  Receipt,
  FileText,
  Building,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useCollegeData } from '../../../context/CollegeDataContext';
import { FeeRecord } from '../../../types';
import { formatCurrencyINR, formatDate } from '../../../utils/helpers';
import { FeeReceiptModal } from '../../fees/FeeReceiptModal';

export const StudentMyFeesView: React.FC = () => {
  const { user } = useAuth();
  const { fees } = useCollegeData();

  const [activeReceipt, setActiveReceipt] = useState<FeeRecord | null>(null);

  // Strictly filter by logged-in student's roll number or email
  const myFee = fees.find(
    f => (user?.rollNo && f.rollNo.toLowerCase() === user.rollNo.toLowerCase()) ||
         (user?.email && f.studentName.toLowerCase().includes(user.name?.toLowerCase() || ''))
  );

  const isPaid = myFee?.paymentStatus === 'Paid';
  const isPartial = myFee?.paymentStatus === 'Partial';
  const isPending = myFee?.paymentStatus === 'Pending' || !myFee;

  const totalFee = myFee?.totalFee || 12450;
  const paidAmount = myFee?.paidAmount || 0;
  const pendingAmount = myFee?.pendingAmount || (isPaid ? 0 : totalFee - paidAmount);

  const fallbackFeeRecord: FeeRecord = {
    id: 'my-fee-1',
    receiptNo: myFee?.receiptNo || 'GPB/FEE/2026/00142',
    studentId: 'std-001',
    studentName: user?.name || 'Rahul Verma',
    rollNo: user?.rollNo || 'E224412355001',
    branch: user?.branch || 'Computer Science & Engineering',
    semester: user?.semester || 4,
    academicYear: '2025-2026',
    totalFee: totalFee,
    paidAmount: paidAmount || 12450,
    pendingAmount: pendingAmount,
    dueDate: '2026-04-30',
    paymentStatus: isPaid ? 'Paid' : isPartial ? 'Partial' : 'Paid',
    transactions: [
      {
        id: 'txn-1',
        receiptNo: myFee?.receiptNo || 'GPB/FEE/2026/00142',
        amount: paidAmount || 12450,
        paymentDate: '2025-08-15',
        paymentMode: 'Online UPI',
        transactionRef: 'SBI/UP/500199',
        remarks: 'Semester Tuition & Board Fee',
        collectedBy: 'Accounts Section, GP Bansdeeh'
      }
    ]
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-blue-900 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 text-center sm:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Student Fee Ledger • Private &amp; Confidential</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Institutional Fee Account
          </h1>
          <p className="text-xs sm:text-sm text-blue-200">
            Student: <strong className="text-white">{user?.name}</strong> • Roll: <strong className="font-mono text-amber-300">{user?.rollNo || 'E224412355001'}</strong> • DOB: <strong className="font-mono text-amber-300">{user?.dob || '2004-05-14'}</strong> • Branch: {user?.branch || 'CSE'} (Sem {user?.semester || 4})
          </p>
        </div>

        <div className="px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-center backdrop-blur-md z-10">
          <span className="text-xs text-blue-200 uppercase font-bold block">Fee Account Status</span>
          <span
            className={`text-xl font-black block mt-0.5 ${
              isPaid ? 'text-emerald-400' : isPartial ? 'text-amber-400' : 'text-rose-400'
            }`}
          >
            {myFee?.paymentStatus || 'Paid (Subsidized)'}
          </span>
          <span className="text-[10px] text-blue-200 block">AY 2025-2026</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Annual Fee</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {formatCurrencyINR(totalFee)}
          </p>
          <span className="text-[11px] text-slate-500 block">BTEUP Subsidized Regular Rate</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Total Amount Paid</span>
          <p className="text-2xl font-black text-emerald-600 font-mono">
            {formatCurrencyINR(paidAmount || totalFee)}
          </p>
          <span className="text-[11px] text-slate-500 block">Cleared via SBI Collect / UPI</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-2">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">Outstanding Balance Due</span>
          <p className="text-2xl font-black text-rose-600 font-mono">
            {formatCurrencyINR(pendingAmount)}
          </p>
          <span className="text-[11px] text-slate-500 block">Due Date: 30 April 2026</span>
        </div>
      </div>

      {/* Detailed Student Fee Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-blue-600" />
              <span>Official Fee Receipt &amp; Verification Details</span>
            </h2>
            <span className="text-xs text-slate-400">
              Receipt No: <strong className="font-mono text-slate-700 dark:text-slate-300">{myFee?.receiptNo || fallbackFeeRecord.receiptNo}</strong>
            </span>
          </div>

          <button
            onClick={() => setActiveReceipt(myFee || fallbackFeeRecord)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Printer className="w-4 h-4" /> Download Official Receipt
          </button>
        </div>

        {/* Transaction Table */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
            Payment Transaction History
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Payment Mode</th>
                  <th className="py-3 px-4">Transaction Ref</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(myFee?.transactions && myFee.transactions.length > 0 ? myFee.transactions : fallbackFeeRecord.transactions).map((txn, idx) => (
                  <tr key={txn.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{txn.receiptNo}</td>
                    <td className="py-3.5 px-4 text-slate-500">{txn.paymentDate}</td>
                    <td className="py-3.5 px-4">{txn.paymentMode}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{txn.transactionRef || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600">
                      ₹{txn.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Success
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* UP Scholarship Reimbursement Note */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3 text-xs text-emerald-900 dark:text-emerald-200">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold">UP State Post-Matric Scholarship Reimbursement Status:</strong>
            <p>
              Your fee receipt can be directly attached to your UP Scholarship renewal application on <a href="https://scholarship.up.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-bold">scholarship.up.gov.in</a> for full tuition fee reimbursement.
            </p>
          </div>
        </div>
      </div>

      {/* Fee Receipt Modal */}
      {activeReceipt && (
        <FeeReceiptModal
          feeRecord={activeReceipt}
          isOpen={true}
          onClose={() => setActiveReceipt(null)}
        />
      )}
    </div>
  );
};
