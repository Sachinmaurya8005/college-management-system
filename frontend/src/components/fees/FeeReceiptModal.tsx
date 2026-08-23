import React from 'react';
import { FeeRecord } from '../../types';
import { Modal } from '../common/Modal';
import { Printer, Download, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import { formatCurrencyINR, formatDate } from '../../utils/helpers';
import { useCollegeData } from '../../context/CollegeDataContext';
import { CollegeLogo } from '../common/CollegeLogo';

interface FeeReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  feeRecord: FeeRecord | null;
}

export const FeeReceiptModal: React.FC<FeeReceiptModalProps> = ({
  isOpen,
  onClose,
  feeRecord
}) => {
  const { settings, students } = useCollegeData();

  if (!feeRecord) return null;

  const student = students.find(s => s.id === feeRecord.studentId);
  const latestTx = feeRecord.transactions[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official College Fee Receipt"
      subtitle={`Receipt No: ${feeRecord.receiptNo}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Printable Receipt Paper Container */}
        <div className="printable-area bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-xl text-slate-800 dark:text-slate-100 font-sans relative">
          {/* Official Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b-2 border-polytechnic-900 dark:border-blue-500">
            <div className="flex items-center gap-3">
              <CollegeLogo size="md" subtitle={false} />
              <div>
                <h2 className="font-serif text-base sm:text-lg font-black tracking-tight text-polytechnic-900 dark:text-white uppercase leading-tight">
                  {settings.collegeName}
                </h2>
                <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  {settings.hindiName}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {settings.address}, {settings.district} (U.P.) • BTEUP Code: {settings.bteupCode}
                </p>
              </div>
            </div>

            <div className="text-right flex flex-col items-center sm:items-end">
              <span className="px-3 py-1 bg-polytechnic-900 text-white dark:bg-blue-600 font-black text-[10px] uppercase tracking-wider rounded-md">
                E-FEE RECEIPT
              </span>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mt-1">
                {feeRecord.receiptNo}
              </span>
              <span className="text-[10px] text-slate-400">
                Date: {formatDate(latestTx?.paymentDate || feeRecord.dueDate)}
              </span>
            </div>
          </div>

          {/* Student & Session Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Candidate Name</span>
              <strong className="text-slate-900 dark:text-white">{feeRecord.studentName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">BTEUP Roll No</span>
              <strong className="font-mono text-slate-900 dark:text-white">{feeRecord.rollNo}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Branch &amp; Semester</span>
              <strong className="text-slate-900 dark:text-white">
                {feeRecord.branch} (Sem-{feeRecord.semester})
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Academic Session</span>
              <strong className="text-slate-900 dark:text-white">{feeRecord.academicYear}</strong>
            </div>
          </div>

          {/* Itemized Fee Breakdown Table */}
          <div className="py-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">S.No.</th>
                  <th className="p-2.5">Fee Head / Description</th>
                  <th className="p-2.5 text-right">Applicable Amount (₹)</th>
                  <th className="p-2.5 text-right">Paid (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr>
                  <td className="p-2.5">1</td>
                  <td className="p-2.5">Government Tuition &amp; Academic Fee</td>
                  <td className="p-2.5 text-right">₹ 8,000</td>
                  <td className="p-2.5 text-right font-semibold">₹ 8,000</td>
                </tr>
                <tr>
                  <td className="p-2.5">2</td>
                  <td className="p-2.5">BTEUP Examination &amp; Registration Fee</td>
                  <td className="p-2.5 text-right">₹ 2,250</td>
                  <td className="p-2.5 text-right font-semibold">₹ 2,250</td>
                </tr>
                <tr>
                  <td className="p-2.5">3</td>
                  <td className="p-2.5">Engineering Workshop &amp; Computer Lab Fund</td>
                  <td className="p-2.5 text-right">₹ 1,200</td>
                  <td className="p-2.5 text-right font-semibold">₹ 1,200</td>
                </tr>
                <tr>
                  <td className="p-2.5">4</td>
                  <td className="p-2.5">Student Activity (SCA), Sports &amp; Cultural Fund</td>
                  <td className="p-2.5 text-right">₹ 600</td>
                  <td className="p-2.5 text-right font-semibold">₹ 600</td>
                </tr>
                <tr>
                  <td className="p-2.5">5</td>
                  <td className="p-2.5">Digital Library &amp; Identity Card Charge</td>
                  <td className="p-2.5 text-right">₹ 400</td>
                  <td className="p-2.5 text-right font-semibold">₹ 400</td>
                </tr>
              </tbody>
              <tfoot className="border-t-2 border-slate-300 dark:border-slate-700 font-bold bg-slate-50 dark:bg-slate-800/40">
                <tr>
                  <td colSpan={2} className="p-2.5 text-right uppercase text-[11px]">
                    Total Institutional Fee:
                  </td>
                  <td className="p-2.5 text-right text-slate-700 dark:text-slate-300">
                    {formatCurrencyINR(feeRecord.totalFee)}
                  </td>
                  <td className="p-2.5 text-right text-emerald-600 dark:text-emerald-400 text-sm font-black">
                    {formatCurrencyINR(feeRecord.paidAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Mode & Outstanding Balance Footer */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Mode &amp; Reference</span>
              <strong className="text-slate-800 dark:text-slate-200">
                {latestTx?.paymentMode || 'Online UPI'} (Ref: {latestTx?.transactionRef || 'N/A'})
              </strong>
            </div>

            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Outstanding Balance</span>
              <strong className={feeRecord.pendingAmount > 0 ? 'text-red-600 font-black' : 'text-emerald-600 font-black'}>
                {feeRecord.pendingAmount === 0 ? '₹0.00 (Fully Settled)' : formatCurrencyINR(feeRecord.pendingAmount)}
              </strong>
            </div>
          </div>

          {/* Signatures & Stamp */}
          <div className="pt-8 mt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 border-2 border-dashed border-polytechnic-900/40 dark:border-blue-400/40 rounded-full flex flex-col items-center justify-center text-center p-1 text-[8px] font-bold text-polytechnic-900 dark:text-blue-400 rotate-[-12deg]">
                <span>GOVT POLYTECHNIC</span>
                <span>BANSDEEH</span>
                <span>BALLIA (U.P.)</span>
              </div>
              <div className="text-[10px] text-slate-400">
                <div>Digitally Verified Receipt</div>
                <div>Accounts &amp; Fee Division</div>
              </div>
            </div>

            <div className="text-center">
              <div className="font-serif italic font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">
                Accounts Officer
              </div>
              <div className="text-[10px] text-slate-400">Government Polytechnic Bansdeeh, Ballia</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
          >
            <Printer className="w-4 h-4" /> Print Official Receipt
          </button>
        </div>
      </div>
    </Modal>
  );
};
